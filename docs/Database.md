# Database

## Engine

MongoDB via Motor (async driver) with pymongo.

## Connection

```python
import ssl as _ssl
import certifi as _certifi

_ssl_ctx = _ssl.SSLContext(_ssl.PROTOCOL_TLS_CLIENT)
_ssl_ctx.minimum_version = _ssl.TLSVersion.TLSv1_2
_ssl_ctx.load_verify_locations(_certifi.where())

client = AsyncIOMotorClient(mongo_url, tls=True, tlsContext=_ssl_ctx)
db = client[db_name]
```

## Collections

### `users`
| Field | Type | Notes |
|---|---|---|
| `id` | string (UUID) | Primary key |
| `email` | string | Unique index |
| `password_hash` | string | bcrypt hash |
| `name` | string | Display name |
| `role` | string | `admin` |
| `created_at` | string (ISO) | UTC timestamp |

### `gallery`
| Field | Type | Notes |
|---|---|---|
| `id` | string (UUID) | Primary key |
| `title` | string | Image title |
| `storage_path` | string | Path in Emergent Object Storage |
| `content_type` | string | MIME type |
| `published` | boolean | Visibility on public site |
| `created_at` | string (ISO) | Index |

### `reviews`
| Field | Type | Notes |
|---|---|---|
| `id` | string (UUID) | Primary key |
| `author_name` | string | Reviewer name |
| `location` | string | Reviewer location |
| `rating` | number | 1-5 stars |
| `text` | string | Review content |
| `approved` | boolean | Visibility on public site |
| `created_at` | string (ISO) | Index |

### `messages`
| Field | Type | Notes |
|---|---|---|
| `id` | string (UUID) | Primary key |
| `name` | string | Sender name |
| `phone` | string | Phone number |
| `email` | string | Email address |
| `message` | string | Message content |
| `read` | boolean | Read status |
| `created_at` | string (ISO) | Index |

## Indexes

Created on startup:
- `users.email` (unique)
- `gallery.created_at`
- `reviews.created_at`
- `messages.created_at`

## Admin Seeding

On startup, if no user with `ADMIN_EMAIL` exists, one is created with `ADMIN_PASSWORD`. If the password doesn't match, it's updated.

## Related
- [[Backend]]
- [[Environment Variables]]
