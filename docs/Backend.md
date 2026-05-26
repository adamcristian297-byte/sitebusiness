# Backend

Single monolithic `server.py` (~470 lines) handling all server logic.

## Tech Stack
- **Framework:** FastAPI
- **Database:** MongoDB via Motor (async driver)
- **Auth:** JWT with httpOnly cookies (12h access + 7d refresh), bcrypt
- **Storage:** Emergent Object Storage for gallery images
- **Server:** Uvicorn

## Key Architecture Points

- All models, routes, auth middleware, storage logic, and admin seeding live in one file
- `APIRouter` with prefix `/api` included into the FastAPI app
- On startup: seeds admin user from `ADMIN_EMAIL`/`ADMIN_PASSWORD` env vars
- Gallery images stored via Emergent Object Storage (requires `EMERGENT_LLM_KEY`)
- JWT tokens set as httpOnly cookies

## Module-Level Globals

| Variable | Purpose |
|---|---|
| `ROOT_DIR` | Parent directory of `server.py` |
| `mongo_url` | From `MONGO_URL` env var |
| `client` | `AsyncIOMotorClient` instance |
| `db` | Database handle |
| `JWT_SECRET` | From env |
| `app` | The FastAPI application |
| `api_router` | Router with prefix `/api` |
| `_storage_key` | Cached external storage key (lazy-init) |

## SSL/TLS Fix

The MongoDB connection uses an explicit SSLContext with certifi CA bundle to work around OpenSSL issues on cloud platforms (Render, Railway):

```python
import ssl as _ssl
import certifi as _certifi

_ssl_ctx = _ssl.SSLContext(_ssl.PROTOCOL_TLS_CLIENT)
_ssl_ctx.minimum_version = _ssl.TLSVersion.TLSv1_2
_ssl_ctx.load_verify_locations(_certifi.where())

client = AsyncIOMotorClient(mongo_url, tls=True, tlsContext=_ssl_ctx)
```

## Resilient Startup

The startup event is wrapped in try/except so the server starts even if MongoDB is temporarily unreachable. Routes will error individually but the container stays alive.

## Related
- [[API Routes]]
- [[Database]]
- [[Authentication]]
- [[Environment Variables]]
