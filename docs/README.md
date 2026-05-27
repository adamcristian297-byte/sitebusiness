# RRS Team IMP - Project Documentation

Romanian concrete business website for **RRS Team IMP** (owner: Ionut Encea).

## Architecture

- [[Frontend]] - React 19 + Tailwind + shadcn/ui
- [[Supabase Setup]] - Database + Auth + Storage
- [[Deployment]] - Vercel (frontend) + Supabase (everything else)
- [[Environment Variables]] - All required env vars
- [[API Routes]] - Supabase database operations
- [[Frontend Routes]] - Client-side routing
- [[Design System]] - Colors, typography, layout
- [[Database]] - PostgreSQL tables & schema
- [[Authentication]] - Supabase Auth
- [[Gallery System]] - Image upload via Supabase Storage
- [[Admin Panel]] - Admin dashboard pages
- [[Known Issues]] - Current bugs and workarounds
- [[Backlog]] - Planned features
- [[Backend]] - Deprecated (removed in favor of Supabase)

## Quick Start

```bash
# Frontend
cd frontend && yarn install && yarn start

# Set env vars in frontend/.env:
# REACT_APP_SUPABASE_URL=https://your-project.supabase.co
# REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

No backend server needed.

## Repository Structure

```
frontend/
  craco.config.js        # CRA config with @ path alias
  tailwind.config.js     # shadcn theme tokens
  components.json        # shadcn component config
  .npmrc                 # legacy-peer-deps=true
  src/
    App.js               # Router
    index.css            # Tailwind + Google Fonts
    context/AuthContext.jsx
    lib/supabase.js      # Supabase client
    lib/api.js           # Supabase database/storage operations
    lib/utils.js         # cn() helper
    components/
      site/              # Public sections
      admin/             # Admin panel
      ui/                # shadcn/ui components
    pages/
      HomePage.jsx
      LoginPage.jsx
      admin/

supabase/
  migrations/
    001_initial_schema.sql  # Database schema + RLS policies

docs/                    # This documentation (Obsidian vault)
vercel.json              # Vercel deployment config
package.json             # Root (prevents Vercel auto-detection)
```
