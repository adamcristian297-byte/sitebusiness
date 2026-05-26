# Admin Panel

## Access

- URL: `/admin/login`
- Default credentials: set via `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars
- Auth: JWT cookie-based ([[Authentication]])

## Pages

### Overview (`/admin`)
- Dashboard stats from `GET /api/admin/stats`
- Summary cards: total gallery images, reviews, messages

### Gallery (`/admin/galerie`)
- Upload images via `POST /api/admin/gallery`
- List all images (including unpublished)
- Delete images
- Toggle publish status

### Reviews (`/admin/recenzii`)
- Create reviews via `POST /api/admin/reviews`
- Edit/delete reviews
- Toggle approve status

### Messages (`/admin/mesaje`)
- View contact form submissions
- Mark as read
- Delete messages

## Layout

Sidebar navigation with sections:
- Overview
- Gallery
- Reviews
- Messages

Uses `AdminLayout` component with `ProtectedRoute` wrapper.

## Related
- [[Authentication]]
- [[Frontend Routes]]
- [[API Routes]]
