# CLAUDE.md

## Project Overview

Romanian concrete business website for **RRS Team IMP** (owner: Ionut Encea). All user-facing text is in Romanian. The site advertises three core services: stamped concrete (beton amprentat), helicopter-finished concrete (elicopterizat), and vertical concrete (verticalizat).

## Tech Stack

| Layer     | Technology                                                        |
|-----------|-------------------------------------------------------------------|
| Backend   | Python FastAPI, single file at `backend/server.py` (~440 lines)  |
| Database  | MongoDB via Motor (async driver)                                  |
| Frontend  | React 19, React Router 7, Tailwind CSS 3, shadcn/ui (Radix UI)  |
| Build     | Create React App via CRACO, Yarn 1.22                             |
| Auth      | JWT with httpOnly cookies (12h access + 7d refresh), bcrypt       |
| Storage   | Emergent Object Storage for gallery images                        |
| Toasts    | Sonner                                                            |
| Icons     | lucide-react                                                      |
| HTTP      | Axios (with `withCredentials: true`)                              |

## Repository Structure

```
backend/
  server.py              # All routes, auth, storage init, admin seeding (single file)
  requirements.txt
  tests/backend_test.py

frontend/
  craco.config.js        # CRA config with @ path alias to src/
  tailwind.config.js     # shadcn theme tokens via CSS variables
  components.json        # shadcn component config
  src/
    App.js               # Router: /, /admin/login, /admin/*
    index.css            # Tailwind directives, Google Fonts imports
    context/AuthContext.jsx
    lib/api.js           # Axios instance
    lib/utils.js         # cn() helper
    components/
      site/              # Public sections: Header, Hero, Services, About, Gallery, Reviews, Contact, Footer
      admin/             # AdminLayout, ProtectedRoute
      ui/                # shadcn/ui components
    pages/
      HomePage.jsx
      LoginPage.jsx
      admin/
        Overview.jsx
        GalleryAdmin.jsx
        ReviewsAdmin.jsx
        MessagesAdmin.jsx
```

## Commands

```bash
# Frontend
cd frontend && yarn install
cd frontend && yarn start          # dev server
cd frontend && yarn build          # production build

# Backend
cd backend && pip install -r requirements.txt
cd backend && uvicorn server:app --reload

# Tests
cd backend && pytest
```

## Environment Variables

Required in `backend/.env`:

- `MONGO_URL` -- MongoDB connection string
- `DB_NAME` -- database name
- `JWT_SECRET` -- secret for JWT signing
- `ADMIN_EMAIL` -- seeded admin email
- `ADMIN_PASSWORD` -- seeded admin password

Optional:

- `EMERGENT_LLM_KEY` -- enables Emergent Object Storage for image uploads
- `CORS_ORIGINS` -- allowed CORS origins

## API Routes (all prefixed /api)

**Public:**
- `GET /` -- health check
- `GET /gallery` -- list published gallery images
- `GET /gallery/image/{image_id}` -- single image
- `GET /reviews` -- list approved reviews
- `POST /contact` -- submit contact message

**Auth:**
- `POST /auth/login` -- returns httpOnly JWT cookies
- `POST /auth/logout` -- clears cookies
- `GET /auth/me` -- current user
- `POST /auth/refresh` -- refresh access token

**Admin (requires auth):**
- `POST /admin/gallery` -- upload image
- `GET /admin/gallery` -- list all images (including unpublished)
- `DELETE /admin/gallery/{image_id}` -- delete image
- `GET /admin/reviews` -- list all reviews
- `POST /admin/reviews` -- create review
- `PATCH /admin/reviews/{review_id}` -- update review
- `DELETE /admin/reviews/{review_id}` -- delete review
- `GET /admin/messages` -- list messages
- `PATCH /admin/messages/{message_id}` -- update message status
- `DELETE /admin/messages/{message_id}` -- delete message
- `GET /admin/stats` -- dashboard stats

## Frontend Routes

| Path               | Page            | Auth Required |
|--------------------|-----------------|---------------|
| `/`                | HomePage        | No            |
| `/admin/login`     | LoginPage       | No            |
| `/admin`           | Overview        | Yes           |
| `/admin/galerie`   | GalleryAdmin    | Yes           |
| `/admin/recenzii`  | ReviewsAdmin    | Yes           |
| `/admin/mesaje`    | MessagesAdmin   | Yes           |

## Design System

**Theme:** Organic & Earthy. Solid, premium, trustworthy. No glassmorphism, no SaaS vibes.

**Colors (hardcoded hex, not Tailwind utility names):**
- Background: `#F9F7F3` (bone white)
- Text: `#1C1A17` (charcoal)
- Primary/Accent: `#A44A3F` (terracotta), hover `#8E3F35`
- Secondary: `#E8E4D9`
- Muted text: `#5C5852`
- Border: `#D6D0C4`

**Typography:**
- Headings: **Cormorant Garamond** (serif), weights 400/600, tracking-tight
- Body: **Manrope** (sans-serif), weights 400/500
- Loaded via Google Fonts in `index.css`
- **Never use Inter or Roboto**

**Layout:**
- Container: `max-w-7xl mx-auto px-6`
- Spacing: generous (`p-8`, `p-16`, `p-24`)
- Border radius: `rounded-none` or `rounded-sm` max (0-4px)
- Surfaces: solid flat colors, subtle ambient shadows, no glassmorphism

**shadcn/ui Overrides:**
- All card borders: `1px solid #D6D0C4`
- Max border radius: `rounded-sm`
- Buttons: `translate-y-1` hover with darkened color

**Icons:** lucide-react, stroke-width 1.5

## Key Conventions

1. **All user-facing text must be in Romanian.** This includes form labels, placeholders, error messages, button text, and admin UI.
2. **`data-testid` on all interactive elements** (buttons, links, inputs, form submissions).
3. **Axios instance** in `frontend/src/lib/api.js` is configured with `withCredentials: true` for JWT cookie auth.
4. **Sonner** is used for toast notifications (not the shadcn toast component).
5. **Path alias:** `@/` maps to `frontend/src/` (configured in craco.config.js).
6. **Semantic HTML** for the public landing page.
7. **Framer Motion** for scroll-triggered staggered animations on service items.

## Architecture Notes

- The backend is a **single monolithic `server.py`** -- all models, routes, auth middleware, storage logic, and admin seeding live in this one file.
- On startup, the backend seeds an admin user from `ADMIN_EMAIL`/`ADMIN_PASSWORD` env vars if one does not exist.
- Gallery images are stored via Emergent Object Storage (requires `EMERGENT_LLM_KEY`). The storage key is initialized lazily on first upload.
- JWT tokens are set as httpOnly cookies: `access_token` (12h) and `refresh_token` (7d).
- The admin panel uses a sidebar layout with sections: Overview, Gallery, Reviews, Messages.

## Backlog

**P1 (high priority):**
- Email notifications for contact form submissions
- Drag-and-drop reorder for gallery images
- WhatsApp CTA button

**P2 (lower priority):**
- Multi-image upload
- Gallery categories/filtering
- SEO meta tags and Open Graph images
- Sitemap generation
- Contact form photo upload
