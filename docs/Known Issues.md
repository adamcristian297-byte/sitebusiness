# Known Issues

## Active

### Gallery Images Empty
- **Status:** Waiting for user action
- **Issue:** No images uploaded yet
- **Action:** Upload via admin panel at `/admin/galerie`

### SEO Structured Data
- **Status:** Needs update
- **Issue:** `index.html` still has old phone/email in structured data
- **Action:** Update JSON-LD schema

## Resolved

### MongoDB SSL on Cloud Platforms
- **Was:** Persistent TLS handshake failures on Render and Railway
- **Fix:** Migrated to Supabase — no self-hosted backend needed

### Vercel Blank Page
- **Was:** Vercel serving wrong project ("ClientFlow Pro")
- **Fix:** Root `package.json` prevents multi-service auto-detection

### Vercel JS Returning HTML
- **Was:** SPA fallback catching JS bundle requests
- **Fix:** Rewrites exclude `/static/` and other asset paths

### Peer Dependency Conflict
- **Was:** `react-day-picker@8.10.1` conflicts with `date-fns@^4`
- **Fix:** `.npmrc` with `legacy-peer-deps=true`

### Render Python 3.14
- **Was:** Render ignoring `runtime.txt`, using Python 3.14
- **Fix:** Migrated to Supabase (no Python needed)

### Railway SSL
- **Was:** Same SSL issue as Render with MongoDB Atlas
- **Fix:** Migrated to Supabase

## Related
- [[Deployment]]
- [[Backlog]]
