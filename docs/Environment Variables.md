# Environment Variables

## Frontend (Vercel Dashboard)

| Variable | Required | Description |
|---|---|---|
| `REACT_APP_SUPABASE_URL` | Yes | Supabase project URL (e.g., `https://xxxx.supabase.co`) |
| `REACT_APP_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |

### Notes
- Both are read at build time by CRA (`process.env.REACT_APP_*`)
- Changing requires a redeploy on Vercel
- `.env` is gitignored; values are set in Vercel dashboard only

## Supabase (Supabase Dashboard)

No env vars needed — Supabase manages its own configuration.

### Auth Admin User
Created manually in Supabase dashboard:
- **Authentication** > **Users** > **Add user**
- Email + password used to log in at `/admin/login`

## Local Development

### Frontend `.env` (gitignored)
```
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

## Old Environment Variables (Removed)
These were used with the MongoDB/FastAPI backend and are no longer needed:
- ~~MONGO_URL~~
- ~~DB_NAME~~
- ~~JWT_SECRET~~
- ~~ADMIN_EMAIL~~
- ~~ADMIN_PASSWORD~~
- ~~CORS_ORIGINS~~
- ~~EMERGENT_LLM_KEY~~
- ~~REACT_APP_BACKEND_URL~~

## Related
- [[Supabase Setup]]
- [[Deployment]]
