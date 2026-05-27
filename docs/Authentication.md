# Authentication

## Supabase Auth

Uses Supabase's built-in email/password authentication. No custom JWT or bcrypt.

## Flow

1. User submits credentials to `/admin/login`
2. Frontend calls `supabase.auth.signInWithPassword({ email, password })`
3. Supabase returns a session with user info
4. `AuthContext` listens to `onAuthStateChange` and updates state
5. `ProtectedRoute` checks if user is authenticated before rendering admin pages
6. Logout calls `supabase.auth.signOut()`

## Implementation

### AuthContext (`context/AuthContext.jsx`)
- `user` — Supabase user object or `false` (unauthenticated) or `null` (checking)
- `checked` — whether initial session check is complete
- `login(email, password)` — calls Supabase Auth
- `logout()` — signs out
- `refresh()` — re-checks session

### ProtectedRoute (`components/admin/ProtectedRoute.jsx`)
- Shows loading spinner while `checked` is false
- Redirects to `/admin/login` if `user` is falsy
- Renders children if authenticated

## Admin User Setup
Created manually in Supabase dashboard:
1. Go to **Authentication** > **Users**
2. Click **Add user** > **Create new user**
3. Enter email and password
4. Use these credentials to log in at `/admin/login`

## RLS (Row Level Security)
Admin operations require an authenticated Supabase session. RLS policies check `auth.role() = 'authenticated'` for full CRUD access.

## Related
- [[Supabase Setup]]
- [[Admin Panel]]
