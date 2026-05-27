# Backend (Deprecated)

The Python FastAPI backend has been **removed** in favor of Supabase.

## What Was Replaced

| Old (MongoDB/FastAPI) | New (Supabase) |
|---|---|
| `backend/server.py` | Supabase JS client in `frontend/src/lib/api.js` |
| MongoDB Atlas | Supabase PostgreSQL |
| Motor async driver | `@supabase/supabase-js` |
| JWT + bcrypt auth | Supabase Auth |
| Emergent Object Storage | Supabase Storage |
| Railway/Vercel backend hosting | No backend needed |

## Files Removed
- `backend/` — entire directory
- `Procfile` — Railway config
- `railway.json` — Railway config

## Current Architecture
The frontend talks directly to Supabase via the JS client. No server to host.

See [[Supabase Setup]] for configuration details.

## Related
- [[Supabase Setup]]
- [[Deployment]]
- [[Environment Variables]]
