# Environment Variables

## Backend (Railway Dashboard)

| Variable | Required | Description |
|---|---|---|
| `MONGO_URL` | Yes | MongoDB Atlas connection string |
| `DB_NAME` | Yes | Database name (e.g., `rrsteam`) |
| `JWT_SECRET` | Yes | Secret for JWT signing |
| `ADMIN_EMAIL` | Yes | Seeded admin email |
| `ADMIN_PASSWORD` | Yes | Seeded admin password |
| `CORS_ORIGINS` | Yes | Allowed CORS origins (e.g., `https://sitebusiness.vercel.app`) |
| `EMERGENT_LLM_KEY` | No | Enables Emergent Object Storage for image uploads |
| `APP_NAME` | No | App name (default: `rrsteam`) |

### Notes
- All env vars are `.strip()`'d in code to handle trailing whitespace
- Quotes are also stripped: `.strip().strip('"').strip("'")`
- `MONGO_URL` must start with `mongodb://` or `mongodb+srv://`
- `DB_NAME` cannot contain spaces (MongoDB restriction)

## Frontend (Vercel Dashboard)

| Variable | Required | Description |
|---|---|---|
| `REACT_APP_BACKEND_URL` | Yes | Backend URL (e.g., `https://web-production-1cc0.up.railway.app`) |

### Notes
- If empty, frontend uses relative URLs (same-origin `/api/*`)
- CRA reads `.env` at build time, so changing requires a redeploy
- `.env` is gitignored; `.env.production` is also gitignored

## Local Development

### Backend `.env` (gitignored)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=rrsteam
JWT_SECRET=local-dev-secret-key-change-in-production
ADMIN_EMAIL=user123
ADMIN_PASSWORD=admin123
CORS_ORIGINS=http://localhost:3000
```

### Frontend `.env` (gitignored)
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

## Related
- [[Backend]]
- [[Frontend]]
- [[Deployment]]
