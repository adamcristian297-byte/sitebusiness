# Frontend

React 19 SPA with Tailwind CSS and shadcn/ui components.

## Tech Stack
- **Framework:** React 19
- **Routing:** React Router 7
- **Styling:** Tailwind CSS 3
- **Components:** shadcn/ui (Radix UI)
- **Build:** Create React App via CRACO
- **Package Manager:** Yarn 1.22
- **Toasts:** Sonner
- **Icons:** lucide-react (stroke-width 1.5)
- **HTTP:** Axios (with `withCredentials: true`)

## Path Alias

`@/` maps to `frontend/src/` (configured in `craco.config.js`).

## Key Files

| File | Purpose |
|---|---|
| `App.js` | Router: `/`, `/admin/login`, `/admin/*` |
| `index.css` | Tailwind directives, Google Fonts |
| `context/AuthContext.jsx` | Auth state management |
| `lib/api.js` | Axios instance with `REACT_APP_BACKEND_URL` |
| `lib/utils.js` | `cn()` helper for classnames |

## API Communication

The Axios instance in `lib/api.js` uses `REACT_APP_BACKEND_URL` env var. If empty, it uses relative URLs (same-origin `/api/*`).

```javascript
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true,
});
```

## Peer Dependency Fix

`react-day-picker@8.10.1` has a peer dependency conflict with `date-fns@^4`. Fixed via `.npmrc`:

```
legacy-peer-deps=true
```

## Build Command

```bash
craco build  # Uses CRACO for path aliases and Tailwind config
```

## Related
- [[Frontend Routes]]
- [[Design System]]
- [[Deployment]]
