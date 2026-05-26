# RRS Team IMP - Project Documentation

Romanian concrete business website for **RRS Team IMP** (owner: Ionut Encea).

## Architecture

- [[Backend]] - FastAPI + MongoDB
- [[Frontend]] - React 19 + Tailwind + shadcn/ui
- [[Deployment]] - Vercel (frontend) + Railway (backend)
- [[Environment Variables]] - All required env vars
- [[API Routes]] - Backend endpoints
- [[Frontend Routes]] - Client-side routing
- [[Design System]] - Colors, typography, layout
- [[Database]] - MongoDB collections & schema
- [[Authentication]] - JWT cookie auth
- [[Gallery System]] - Image upload & storage
- [[Admin Panel]] - Admin dashboard pages
- [[Deployment History]] - What was tried, what worked
- [[Known Issues]] - Current bugs and workarounds
- [[Backlog]] - Planned features

## Quick Start

```bash
# Frontend
cd frontend && yarn install && yarn start

# Backend
cd backend && pip install -r requirements.txt && uvicorn server:app --reload

# Tests
cd backend && pytest
```

## Repository Structure

```
backend/
  server.py              # All routes, auth, storage, admin seeding
  requirements.txt       # Python dependencies
  runtime.txt            # Python version pin for Render/Railway
  .env                   # Local env vars (gitignored)

frontend/
  craco.config.js        # CRA config with @ path alias
  tailwind.config.js     # shadcn theme tokens
  components.json        # shadcn component config
  .npmrc                 # legacy-peer-deps=true
  .env                   # Local frontend env (gitignored)
  src/
    App.js               # Router
    index.css            # Tailwind + Google Fonts
    context/AuthContext.jsx
    lib/api.js           # Axios instance
    lib/utils.js         # cn() helper
    components/
      site/              # Public sections
      admin/             # Admin panel
      ui/                # shadcn/ui components
    pages/
      HomePage.jsx
      LoginPage.jsx
      admin/

docs/                    # This documentation (Obsidian vault)
vercel.json              # Vercel deployment config
railway.json             # Railway deployment config
Procfile                 # Railway start command
package.json             # Root (prevents Vercel auto-detection)
```
