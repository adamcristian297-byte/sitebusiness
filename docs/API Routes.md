# API Routes

All operations go through the Supabase JS client. No REST API server.

## Public Operations

### Gallery
- `fetchGallery()` — SELECT from `gallery` where `is_deleted = false`, ordered by `created_at` DESC

### Reviews
- `fetchReviews()` — SELECT from `reviews` where `approved = true`, ordered by `created_at` DESC
- `submitReview(form)` — INSERT into `reviews` with `approved = false`

### Contact
- `submitMessage(form)` — INSERT into `messages`

## Admin Operations (requires Supabase Auth session)

### Gallery
- `fetchGalleryAdmin()` — SELECT from `gallery` where `is_deleted = false`
- `uploadGalleryImage(file, title)` — Upload to Supabase Storage + INSERT into `gallery`
- `deleteGalleryImage(id)` — UPDATE `gallery` set `is_deleted = true`

### Reviews
- `fetchReviewsAdmin()` — SELECT from `reviews` (all, including unapproved)
- `createReviewAdmin(form)` — INSERT into `reviews`
- `updateReviewAdmin(id, updates)` — UPDATE `reviews` with partial fields
- `deleteReviewAdmin(id)` — DELETE from `reviews`

### Messages
- `fetchMessages()` — SELECT from `messages` (all)
- `markMessageRead(id)` — UPDATE `messages` set `read = true`
- `deleteMessage(id)` — DELETE from `messages`

### Stats
- `fetchStats()` — COUNT queries across all tables (gallery, reviews, messages)

## Storage
- `galleryImageUrl(storagePath)` — Gets public URL from Supabase Storage bucket `gallery`

## Implementation
All operations are in `frontend/src/lib/api.js`.

## Related
- [[Supabase Setup]]
- [[Database]]
- [[Gallery System]]
