# Deployment

## Architecture

| Layer | Platform | URL |
|---|---|---|
| Frontend | Vercel | `sitebusiness.vercel.app` |
| Database | Supabase | `PROJECT_ID.supabase.co` |
| Auth | Supabase | Built-in |
| Storage | Supabase | `gallery` bucket |

**No backend server needed.** Frontend talks directly to Supabase via JS client.

## Vercel (Frontend)

### Config: `vercel.json`
```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/build",
  "rewrites": [
    { "source": "/((?!static/|favicon.ico|manifest.json|robots.txt|logo).*)", "destination": "/index.html" }
  ]
}
```

### Environment Variables (Vercel Dashboard)
- `REACT_APP_SUPABASE_URL` — e.g., `https://xxxx.supabase.co`
- `REACT_APP_SUPABASE_ANON_KEY` — the anon/public key from Supabase

### Key Points
- Uses `buildCommand`/`outputDirectory` format
- SPA rewrites exclude static assets
- Root `package.json` (`{"private": true}`) prevents Vercel from auto-detecting subdirectories
- `.vercelignore` excludes dev artifacts

## Supabase (Database + Auth + Storage)

### Setup Steps
1. Create project at [supabase.com](https://supabase.com)
2. Run SQL migration in SQL Editor
3. Create `gallery` storage bucket (public)
4. Create admin user in Authentication > Users
5. Copy Project URL and anon key

See [[Supabase Setup]] for full details.

## Deployment History

### What Was Tried

1. **Vercel full-stack** — Failed: auto-detects Python services
2. **Vercel frontend + Render backend** — Failed: Render has broken SSL with MongoDB Atlas
3. **Vercel frontend + Railway backend** — Worked but complex
4. **Vercel frontend + Supabase** — Current: simplest, no backend needed

## Related
- [[Supabase Setup]]
- [[Environment Variables]]
- [[Known Issues]]
