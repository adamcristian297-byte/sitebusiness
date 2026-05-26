# API Routes

All routes prefixed with `/api`.

## Public

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/` | Health check |
| `GET` | `/api/gallery` | List published gallery images |
| `GET` | `/api/gallery/image/{image_id}` | Single image |
| `GET` | `/api/reviews` | List approved reviews |
| `POST` | `/api/contact` | Submit contact message |

## Auth

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Returns httpOnly JWT cookies |
| `POST` | `/api/auth/logout` | Clears cookies |
| `GET` | `/api/auth/me` | Current user |
| `POST` | `/api/auth/refresh` | Refresh access token |

## Admin (requires auth)

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/admin/gallery` | Upload image |
| `GET` | `/api/admin/gallery` | List all images (including unpublished) |
| `DELETE` | `/api/admin/gallery/{image_id}` | Delete image |
| `GET` | `/api/admin/reviews` | List all reviews |
| `POST` | `/api/admin/reviews` | Create review |
| `PATCH` | `/api/admin/reviews/{review_id}` | Update review |
| `DELETE` | `/api/admin/reviews/{review_id}` | Delete review |
| `GET` | `/api/admin/messages` | List messages |
| `PATCH` | `/api/admin/messages/{message_id}` | Update message status |
| `DELETE` | `/api/admin/messages/{message_id}` | Delete message |
| `GET` | `/api/admin/stats` | Dashboard stats |

## Auth Details

- JWT tokens set as httpOnly cookies
- `access_token`: 12h expiry
- `refresh_token`: 7d expiry
- `withCredentials: true` on all Axios requests

## Related
- [[Backend]]
- [[Authentication]]
