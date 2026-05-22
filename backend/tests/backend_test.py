"""Backend regression tests for RRS Team IMP."""
import os
import io
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://concrete-lifting-ro.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@rrsteam.ro"
ADMIN_PASSWORD = "admin123"


@pytest.fixture(scope="session")
def auth_session():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
    assert r.status_code == 200, f"Login failed: {r.status_code} {r.text}"
    return s


@pytest.fixture(scope="session")
def public_session():
    return requests.Session()


# ----- Health -----
def test_root(public_session):
    r = public_session.get(f"{API}/", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert data.get("status") == "ok"


# ----- Auth -----
def test_login_sets_cookies_and_returns_user(public_session):
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=20)
    assert r.status_code == 200
    body = r.json()
    assert body["email"] == ADMIN_EMAIL
    assert "id" in body
    # cookies set
    cookies = {c.name for c in s.cookies}
    assert "access_token" in cookies
    assert "refresh_token" in cookies


def test_login_wrong_password():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"}, timeout=15)
    assert r.status_code == 401


def test_me_with_cookie(auth_session):
    r = auth_session.get(f"{API}/auth/me", timeout=15)
    assert r.status_code == 200
    assert r.json()["email"] == ADMIN_EMAIL


def test_me_without_auth():
    r = requests.get(f"{API}/auth/me", timeout=15)
    assert r.status_code == 401


def test_logout_then_me_unauth():
    s = requests.Session()
    s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    r = s.post(f"{API}/auth/logout", timeout=15)
    assert r.status_code == 200
    # After logout the session shouldn't be valid
    r2 = requests.get(f"{API}/auth/me", cookies={}, timeout=15)
    assert r2.status_code == 401


# ----- Public routes -----
def test_public_gallery(public_session):
    r = public_session.get(f"{API}/gallery", timeout=15)
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_public_reviews_approved_only(public_session):
    r = public_session.get(f"{API}/reviews", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    for item in data:
        assert item.get("approved") is True


def test_contact_create(public_session):
    payload = {
        "name": "TEST Ion Popescu",
        "email": "test_contact@example.com",
        "phone": "+40712345678",
        "message": "TEST mesaj contact din pytest"
    }
    r = public_session.post(f"{API}/contact", json=payload, timeout=15)
    assert r.status_code == 200
    body = r.json()
    assert body.get("ok") is True
    assert "id" in body


# ----- Admin auth gate -----
@pytest.mark.parametrize("path,method", [
    ("/admin/gallery", "GET"),
    ("/admin/reviews", "GET"),
    ("/admin/messages", "GET"),
    ("/admin/stats", "GET"),
])
def test_admin_routes_require_auth(path, method):
    r = requests.request(method, f"{API}{path}", timeout=15)
    assert r.status_code == 401, f"Expected 401, got {r.status_code} for {path}"


# ----- Admin Stats -----
def test_admin_stats(auth_session):
    r = auth_session.get(f"{API}/admin/stats", timeout=15)
    assert r.status_code == 200
    data = r.json()
    for k in ("gallery_count", "reviews_count", "reviews_approved", "messages_count", "messages_unread"):
        assert k in data
        assert isinstance(data[k], int)


# ----- Admin Reviews CRUD -----
def test_review_full_crud(auth_session):
    payload = {"author_name": "TEST Reviewer", "location": "Bucuresti", "rating": 5,
               "text": "TEST recenzie completa", "approved": False}
    r = auth_session.post(f"{API}/admin/reviews", json=payload, timeout=15)
    assert r.status_code == 200
    review = r.json()
    rid = review["id"]
    assert review["approved"] is False

    # Public reviews should NOT include this one (unapproved)
    pub = requests.get(f"{API}/reviews", timeout=15).json()
    assert all(item["id"] != rid for item in pub)

    # Toggle approve
    r2 = auth_session.patch(f"{API}/admin/reviews/{rid}", json={"approved": True}, timeout=15)
    assert r2.status_code == 200
    assert r2.json()["approved"] is True

    # Now should appear in public approved list
    pub2 = requests.get(f"{API}/reviews", timeout=15).json()
    assert any(item["id"] == rid for item in pub2)

    # Delete
    r3 = auth_session.delete(f"{API}/admin/reviews/{rid}", timeout=15)
    assert r3.status_code == 200

    # Verify removed
    r4 = auth_session.patch(f"{API}/admin/reviews/{rid}", json={"approved": True}, timeout=15)
    assert r4.status_code == 404


# ----- Admin Messages -----
def test_messages_lifecycle(auth_session, public_session):
    # Create a message via public endpoint
    payload = {"name": "TEST Msg User", "email": "test_msg@example.com",
               "phone": "0712000000", "message": "TEST mesaj pentru ciclu"}
    rc = public_session.post(f"{API}/contact", json=payload, timeout=15)
    assert rc.status_code == 200
    mid = rc.json()["id"]

    # List
    r = auth_session.get(f"{API}/admin/messages", timeout=15)
    assert r.status_code == 200
    msgs = r.json()
    found = next((m for m in msgs if m["id"] == mid), None)
    assert found is not None
    assert found["read"] is False

    # Mark as read
    r2 = auth_session.patch(f"{API}/admin/messages/{mid}", timeout=15)
    assert r2.status_code == 200

    # Verify read
    msgs2 = auth_session.get(f"{API}/admin/messages", timeout=15).json()
    found2 = next((m for m in msgs2 if m["id"] == mid), None)
    assert found2["read"] is True

    # Delete
    r3 = auth_session.delete(f"{API}/admin/messages/{mid}", timeout=15)
    assert r3.status_code == 200


# ----- Admin Gallery (upload + image fetch + delete) -----
def _make_png_bytes():
    # 1x1 PNG
    import base64
    return base64.b64decode(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
    )


def test_gallery_upload_get_delete(auth_session, public_session):
    png = _make_png_bytes()
    files = {"file": ("test.png", io.BytesIO(png), "image/png")}
    data = {"title": "TEST upload"}
    r = auth_session.post(f"{API}/admin/gallery", files=files, data=data, timeout=60)
    assert r.status_code == 200, f"Upload failed: {r.status_code} {r.text}"
    item = r.json()
    iid = item["id"]

    # Public list contains it
    pub = public_session.get(f"{API}/gallery", timeout=15).json()
    assert any(it["id"] == iid for it in pub)

    # Fetch image bytes
    rimg = public_session.get(f"{API}/gallery/image/{iid}", timeout=30)
    assert rimg.status_code == 200
    assert rimg.headers.get("content-type", "").startswith("image/")
    assert len(rimg.content) > 0

    # Delete
    rdel = auth_session.delete(f"{API}/admin/gallery/{iid}", timeout=15)
    assert rdel.status_code == 200

    # Removed from public listing
    pub2 = public_session.get(f"{API}/gallery", timeout=15).json()
    assert all(it["id"] != iid for it in pub2)
