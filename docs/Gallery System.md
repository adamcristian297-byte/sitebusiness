# Gallery System

## Architecture

Gallery images are stored in **Supabase Storage** (bucket: `gallery`), not on a custom server.

## Storage Flow

### Upload (Admin)
1. Admin selects file in `/admin/galerie`
2. `uploadGalleryImage(file, title)` in `api.js`:
   - Generates UUID-based path: `gallery/{uuid}.{ext}`
   - Uploads to Supabase Storage: `supabase.storage.from('gallery').upload(path, file)`
   - Inserts metadata into `gallery` table
3. Image appears in admin and public gallery

### Display (Public)
1. `fetchGallery()` queries `gallery` table (where `is_deleted = false`)
2. `galleryImageUrl(storagePath)` gets public URL from Supabase Storage
3. URL format: `https://PROJECT_ID.supabase.co/storage/v1/object/public/gallery/{path}`

### Delete (Admin)
1. Soft-delete: updates `is_deleted = true` in database
2. Image no longer appears in queries
3. (Storage file not explicitly deleted — can be cleaned up later)

## Supabase Storage
- **Bucket:** `gallery`
- **Public:** yes (anyone can read, no auth needed for viewing)
- **Upload:** requires authenticated session (RLS policy)

## File Size Limit
No explicit limit in the frontend code. Supabase free tier allows up to 50MB per file.

## Related
- [[Supabase Setup]]
- [[API Routes]]
- [[Admin Panel]]
