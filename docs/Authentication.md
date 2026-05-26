# Authentication

## JWT Cookie Auth

- **Access token:** 12h expiry, httpOnly cookie
- **Refresh token:** 7d expiry, httpOnly cookie
- **Algorithm:** HS256
- **Password hashing:** bcrypt

## Flow

1. User submits credentials to `POST /api/auth/login`
2. Server validates with bcrypt, returns JWT tokens as httpOnly cookies
3. All subsequent requests include cookies automatically (`withCredentials: true`)
4. Admin routes check JWT via dependency injection
5. `POST /api/auth/refresh` extends the session
6. `POST /api/auth/logout` clears cookies

## Protected Routes

All `/api/admin/*` routes require a valid JWT. The auth middleware:
1. Reads `access_token` from cookies
2. Decodes with `JWT_SECRET`
3. Injects user into request state

## Frontend Auth Context

`context/AuthContext.jsx` manages:
- Current user state
- Login/logout functions
- Token refresh
- Protected route component (`ProtectedRoute`)

## Related
- [[API Routes]]
- [[Environment Variables]]
- [[Admin Panel]]
