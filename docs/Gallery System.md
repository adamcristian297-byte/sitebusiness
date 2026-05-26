# Gallery System

## Architecture

Gallery images are stored in **Emergent Object Storage** (S3-like external service), not on the local filesystem.

## Storage Flow

### Upload (`POST /api/admin/gallery`)
1. Read file into memory (`await file.read()`)
2. Enforce 10 MB limit
3. Generate UUID path: `gallery/{uuid}.{ext}`
4. Upload via `put_object()` to Emergent storage
5. Save metadata to MongoDB `gallery` collection

### Retrieval (`GET /api/gallery/image/{image_id}`)
1. Look up image record in MongoDB
2. Fetch bytes from Emergent storage via `get_object()`
3. Return as response with correct content type

### Delete (`DELETE /api/admin/gallery/{image_id}`)
1. Remove from MongoDB
2. (Storage cleanup not implemented)

## External Storage API

- **Init:** `POST https://integrations.emergentagent.com/objstore/api/v1/storage/init`
- **Upload:** `PUT` with storage key
- **Download:** `GET` with storage key
- **Key:** Cached in `_storage_key` global, initialized lazily

## Frontend Display

- Public gallery fetches from `GET /api/gallery`
- Admin gallery fetches from `GET /api/admin/gallery` (includes unpublished)
- Images displayed with `galleryImageUrl(id)` helper
- Fallback: empty array (stock photos removed)

## Related
- [[Backend]]
- [[API Routes]]
- [[Admin Panel]]
