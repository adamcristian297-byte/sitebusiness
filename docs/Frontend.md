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
- **Database/Storage/Auth:** Supabase JS client (`@supabase/supabase-js`)

## Path Alias

`@/` maps to `frontend/src/` (configured in `craco.config.js`).

## Key Files

| File | Purpose |
|---|---|
| `App.js` | Router: `/`, `/admin/login`, `/admin/*` |
| `index.css` | Tailwind directives, Google Fonts |
| `context/AuthContext.jsx` | Supabase Auth state management |
| `lib/supabase.js` | Supabase client initialization |
| `lib/api.js` | Supabase database + storage operations |
| `lib/utils.js` | `cn()` helper for classnames |

## Supabase Client

```javascript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);
```

## API Communication

All database operations go through `lib/api.js` which uses the Supabase client directly. No HTTP requests to a backend server.

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
- [[Supabase Setup]]
