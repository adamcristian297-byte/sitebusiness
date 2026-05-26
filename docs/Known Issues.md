# Known Issues

## Active

### MongoDB Atlas SSL on Cloud Platforms
- **Status:** Workaround in place
- **Issue:** MongoDB Atlas TLS handshakes fail with default OpenSSL on Render and Railway
- **Fix:** Explicit `ssl.SSLContext` with `certifi` CA bundle + TLSv1.2 minimum
- **Platforms affected:** Render (completely broken), Railway (works with fix)

### Gallery Images Removed
- **Status:** Intentional
- **Issue:** Stock fallback photos removed from gallery
- **Action:** User needs to upload real photos via admin panel

### Contact Info Updated
- **Status:** Done
- **Changed:** Phone to `0770865497`, Email to `adamcristian606@gmail.com`
- **Note:** SEO structured data in `index.html` still has old phone/email

## Resolved

### Vercel Blank Page
- **Was:** Vercel serving "ClientFlow Pro" (wrong project)
- **Fix:** Root `package.json` prevents multi-service auto-detection

### Vercel JS Returning HTML
- **Was:** SPA fallback catching `/static/js/` requests
- **Fix:** Rewrites exclude `/static/` and other asset paths

### Peer Dependency Conflict
- **Was:** `react-day-picker@8.10.1` conflicts with `date-fns@^4`
- **Fix:** `.npmrc` with `legacy-peer-deps=true`

### Render Python 3.14
- **Was:** Render ignoring `runtime.txt`, using Python 3.14
- **Fix:** Switched to Railway (uses Python 3.11 from Nixpacks)

## Related
- [[Deployment]]
- [[Backlog]]
