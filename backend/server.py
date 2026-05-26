from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import uuid
import logging
import bcrypt
import jwt
import requests
from datetime import datetime, timezone, timedelta
from typing import Optional, List

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, UploadFile, File, Form, Depends
from fastapi.responses import Response as FastResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr


# ----- Config -----
mongo_url = os.environ["MONGO_URL"].strip().strip('"').strip("'")
db_name = os.environ["DB_NAME"].strip().strip('"').strip("'")
if not mongo_url.startswith("mongodb"):
    raise ValueError(f"MONGO_URL must start with mongodb:// or mongodb+srv://, got: {mongo_url[:20]}...")
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

JWT_SECRET = os.environ["JWT_SECRET"].strip()
JWT_ALGORITHM = "HS256"
ADMIN_EMAIL = os.environ["ADMIN_EMAIL"].strip()
ADMIN_PASSWORD = os.environ["ADMIN_PASSWORD"].strip()
APP_NAME = os.environ.get("APP_NAME", "rrsteam")
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")
STORAGE_URL = "https://integrations.emergentagent.com/objstore/api/v1/storage"

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("rrs")

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ----- Storage -----
_storage_key: Optional[str] = None

def init_storage() -> Optional[str]:
    global _storage_key
    if _storage_key:
        return _storage_key
    if not EMERGENT_KEY:
        logger.warning("EMERGENT_LLM_KEY not set; storage disabled")
        return None
    try:
        resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
        resp.raise_for_status()
        _storage_key = resp.json()["storage_key"]
        logger.info("Object storage initialized")
        return _storage_key
    except Exception as e:
        logger.error(f"Storage init failed: {e}")
        return None


def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    if not key:
        raise HTTPException(status_code=500, detail="Storage unavailable")
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data,
        timeout=120,
    )
    resp.raise_for_status()
    return resp.json()


def get_object(path: str):
    key = init_storage()
    if not key:
        raise HTTPException(status_code=500, detail="Storage unavailable")
    resp = requests.get(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key},
        timeout=60,
    )
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")


# ----- Auth helpers -----
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=12),
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "refresh",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def set_auth_cookies(response: Response, access: str, refresh: str):
    response.set_cookie("access_token", access, httponly=True, secure=True, samesite="none", max_age=43200, path="/")
    response.set_cookie("refresh_token", refresh, httponly=True, secure=True, samesite="none", max_age=604800, path="/")


def clear_auth_cookies(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Neautentificat")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Token invalid")
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
        if not user:
            raise HTTPException(status_code=401, detail="Utilizator inexistent")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Sesiune expirată")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalid")


# ----- Models -----
class LoginRequest(BaseModel):
    email: str
    password: str


class ContactRequest(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: str = Field(min_length=4, max_length=40)
    message: str = Field(min_length=5, max_length=2000)


class ReviewCreate(BaseModel):
    author_name: str = Field(min_length=2, max_length=120)
    location: Optional[str] = Field(default=None, max_length=120)
    rating: int = Field(ge=1, le=5)
    text: str = Field(min_length=5, max_length=2000)
    approved: bool = True


class PublicReviewCreate(BaseModel):
    author_name: str = Field(min_length=2, max_length=120)
    location: Optional[str] = Field(default=None, max_length=120)
    rating: int = Field(ge=1, le=5)
    text: str = Field(min_length=5, max_length=2000)


class ReviewUpdate(BaseModel):
    author_name: Optional[str] = None
    location: Optional[str] = None
    rating: Optional[int] = None
    text: Optional[str] = None
    approved: Optional[bool] = None


# ----- Public routes -----
@api_router.get("/")
async def root():
    return {"status": "ok", "name": "RRS Team IMP API"}


@api_router.get("/gallery")
async def list_gallery():
    items = await db.gallery.find({"is_deleted": False}, {"_id": 0, "storage_path": 0}).sort("created_at", -1).to_list(500)
    return items


@api_router.get("/gallery/image/{image_id}")
async def get_gallery_image(image_id: str):
    record = await db.gallery.find_one({"id": image_id, "is_deleted": False}, {"_id": 0})
    if not record:
        raise HTTPException(status_code=404, detail="Imagine inexistentă")
    data, ct = get_object(record["storage_path"])
    return FastResponse(content=data, media_type=record.get("content_type") or ct)


@api_router.get("/reviews")
async def list_reviews_public():
    items = await db.reviews.find({"approved": True}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return items


@api_router.post("/reviews")
async def submit_review(payload: PublicReviewCreate):
    doc = {
        "id": str(uuid.uuid4()),
        "author_name": payload.author_name,
        "location": payload.location,
        "rating": payload.rating,
        "text": payload.text,
        "approved": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.reviews.insert_one(doc)
    return {"ok": True, "message": "Recenzia a fost trimisă și va fi publicată după aprobare."}


@api_router.post("/contact")
async def submit_contact(payload: ContactRequest):
    doc = {
        "id": str(uuid.uuid4()),
        "name": payload.name,
        "email": payload.email,
        "phone": payload.phone,
        "message": payload.message,
        "read": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.messages.insert_one(doc)
    return {"ok": True, "id": doc["id"]}


# ----- Auth routes -----
@api_router.post("/auth/login")
async def login(payload: LoginRequest, response: Response):
    email = payload.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Email sau parolă incorectă")
    access = create_access_token(user["id"], email)
    refresh = create_refresh_token(user["id"])
    set_auth_cookies(response, access, refresh)
    return {"id": user["id"], "email": user["email"], "name": user.get("name", "Admin"), "role": user.get("role", "admin")}


@api_router.post("/auth/logout")
async def logout(response: Response, current=Depends(get_current_user)):
    clear_auth_cookies(response)
    return {"ok": True}


@api_router.get("/auth/me")
async def me(current=Depends(get_current_user)):
    return current


@api_router.post("/auth/refresh")
async def refresh_token(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="Lipsește refresh token")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Token invalid")
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="Utilizator inexistent")
        access = create_access_token(user["id"], user["email"])
        response.set_cookie("access_token", access, httponly=True, secure=True, samesite="none", max_age=43200, path="/")
        return {"ok": True}
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Token invalid")


# ----- Admin: Gallery -----
@api_router.post("/admin/gallery")
async def upload_gallery_image(
    file: UploadFile = File(...),
    title: Optional[str] = Form(default=None),
    current=Depends(get_current_user),
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Doar fișiere imagine sunt acceptate")
    ext = (file.filename or "img").split(".")[-1].lower() if "." in (file.filename or "") else "jpg"
    image_id = str(uuid.uuid4())
    path = f"{APP_NAME}/gallery/{image_id}.{ext}"
    data = await file.read()
    if len(data) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Imaginea depășește 10MB")
    result = put_object(path, data, file.content_type)
    doc = {
        "id": image_id,
        "title": title or "",
        "storage_path": result["path"],
        "content_type": file.content_type,
        "size": result.get("size", len(data)),
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.gallery.insert_one(doc)
    return {"id": image_id, "title": doc["title"], "created_at": doc["created_at"]}


@api_router.get("/admin/gallery")
async def admin_list_gallery(current=Depends(get_current_user)):
    items = await db.gallery.find({"is_deleted": False}, {"_id": 0, "storage_path": 0}).sort("created_at", -1).to_list(500)
    return items


@api_router.delete("/admin/gallery/{image_id}")
async def delete_gallery_image(image_id: str, current=Depends(get_current_user)):
    res = await db.gallery.update_one({"id": image_id}, {"$set": {"is_deleted": True}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Imagine inexistentă")
    return {"ok": True}


# ----- Admin: Reviews -----
@api_router.get("/admin/reviews")
async def admin_list_reviews(current=Depends(get_current_user)):
    items = await db.reviews.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return items


@api_router.post("/admin/reviews")
async def admin_create_review(payload: ReviewCreate, current=Depends(get_current_user)):
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.reviews.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.patch("/admin/reviews/{review_id}")
async def admin_update_review(review_id: str, payload: ReviewUpdate, current=Depends(get_current_user)):
    update = {k: v for k, v in payload.model_dump(exclude_none=True).items()}
    if not update:
        raise HTTPException(status_code=400, detail="Nicio modificare")
    res = await db.reviews.update_one({"id": review_id}, {"$set": update})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Recenzie inexistentă")
    updated = await db.reviews.find_one({"id": review_id}, {"_id": 0})
    return updated


@api_router.delete("/admin/reviews/{review_id}")
async def admin_delete_review(review_id: str, current=Depends(get_current_user)):
    res = await db.reviews.delete_one({"id": review_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Recenzie inexistentă")
    return {"ok": True}


# ----- Admin: Messages -----
@api_router.get("/admin/messages")
async def admin_list_messages(current=Depends(get_current_user)):
    items = await db.messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return items


@api_router.patch("/admin/messages/{message_id}")
async def admin_update_message(message_id: str, current=Depends(get_current_user)):
    res = await db.messages.update_one({"id": message_id}, {"$set": {"read": True}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Mesaj inexistent")
    return {"ok": True}


@api_router.delete("/admin/messages/{message_id}")
async def admin_delete_message(message_id: str, current=Depends(get_current_user)):
    res = await db.messages.delete_one({"id": message_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Mesaj inexistent")
    return {"ok": True}


# ----- Stats -----
@api_router.get("/admin/stats")
async def admin_stats(current=Depends(get_current_user)):
    gallery_count = await db.gallery.count_documents({"is_deleted": False})
    reviews_count = await db.reviews.count_documents({})
    reviews_approved = await db.reviews.count_documents({"approved": True})
    messages_count = await db.messages.count_documents({})
    messages_unread = await db.messages.count_documents({"read": False})
    return {
        "gallery_count": gallery_count,
        "reviews_count": reviews_count,
        "reviews_approved": reviews_approved,
        "messages_count": messages_count,
        "messages_unread": messages_unread,
    }


# ----- Include router & CORS -----
app.include_router(api_router)

cors_origins_env = os.environ.get("CORS_ORIGINS", "*")
cors_origins = [o.strip() for o in cors_origins_env.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origin_regex=".*" if "*" in cors_origins else None,
    allow_origins=[] if "*" in cors_origins else cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----- Startup -----
@app.on_event("startup")
async def startup_event():
    # indexes
    try:
        await db.users.create_index("email", unique=True)
        await db.gallery.create_index("created_at")
        await db.reviews.create_index("created_at")
        await db.messages.create_index("created_at")
    except Exception as e:
        logger.warning(f"Index creation issue: {e}")

    # seed admin
    existing = await db.users.find_one({"email": ADMIN_EMAIL.lower()})
    if not existing:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": ADMIN_EMAIL.lower(),
            "password_hash": hash_password(ADMIN_PASSWORD),
            "name": "Ionut Encea",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info(f"Admin seeded: {ADMIN_EMAIL}")
    elif not verify_password(ADMIN_PASSWORD, existing.get("password_hash", "")):
        await db.users.update_one(
            {"email": ADMIN_EMAIL.lower()},
            {"$set": {"password_hash": hash_password(ADMIN_PASSWORD)}},
        )
        logger.info("Admin password updated to match .env")

    # storage
    init_storage()


@app.on_event("shutdown")
async def shutdown_event():
    client.close()
