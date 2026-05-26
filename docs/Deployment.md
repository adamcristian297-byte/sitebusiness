# Deployment

## Architecture

| Layer | Platform | URL |
|---|---|---|
| Frontend | Vercel | `sitebusiness.vercel.app` |
| Backend | Railway | `web-production-1cc0.up.railway.app` |
| Database | MongoDB Atlas | Cloud cluster |

## Vercel (Frontend)

### Config: `vercel.json`

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/build",
  "rewrites": [
    { "source": "/((?!api/|static/|favicon.ico|manifest.json|robots.txt|logo).*)", "destination": "/index.html" }
  ]
}
```

### Key Points
- Uses `buildCommand`/`outputDirectory` format (not `builds` array)
- SPA rewrites exclude `/api/` and static assets
- Root `package.json` (`{"private": true}`) prevents Vercel from auto-detecting `backend/` as a Python service
- `.vercelignore` excludes: `node_modules`, `.git`, `.openclaude`, `.emergent`, `memory`, `test_reports`, `tests`, `*.md`

### Environment Variables (Vercel Dashboard)
- `REACT_APP_BACKEND_URL` = Railway backend URL (e.g., `https://web-production-1cc0.up.railway.app`)

## Railway (Backend)

### Config: `railway.json`

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pip install -r requirements.txt"
  },
  "deploy": {
    "startCommand": "uvicorn server:app --host 0.0.0.0 --port $PORT",
    "healthcheckPath": "/api/",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### Key Points
- Root directory must be set to `backend` in Railway dashboard
- Uses Python 3.11 (Nixpacks auto-detects from `runtime.txt`)
- `Procfile` also present as fallback

### Environment Variables (Railway Dashboard)
See [[Environment Variables]]

## MongoDB Atlas

- Free M0 cluster
- User: `adamcristian297_db_user`
- Network: `0.0.0.0/0` (allow all IPs)
- Connection string uses `mongodb+srv://` protocol

## Deployment History

### What Was Tried

1. **Vercel full-stack** (experimentalServices format) - Failed: Vercel auto-detects `backend/` as Python service, requires framework config
2. **Vercel full-stack** (builds/routes with api/index.py) - Failed: Same auto-detection issue
3. **Vercel frontend + Render backend** - Failed: Render has broken OpenSSL with MongoDB Atlas TLS (SSL handshake error)
4. **Vercel frontend + Railway backend** - Working with explicit SSLContext + certifi fix

### Key Lessons
- Vercel auto-detects framework services by scanning for `requirements.txt`, `package.json`, etc.
- Root `package.json` prevents Vercel from treating subdirectories as separate services
- Render's Python 3.12 build has broken OpenSSL for MongoDB Atlas TLS
- Railway uses Python 3.11 which works, but still needs explicit SSLContext for Atlas

## Related
- [[Environment Variables]]
- [[Known Issues]]
