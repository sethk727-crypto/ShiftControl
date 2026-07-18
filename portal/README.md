# SK ShiftControl — Client Portal (RBAC)

Role-based auth system with distinct **Admin** and **Client** portals.
Flow: a client pays via the external workflow → the admin provisions their
account + services here → the client signs in to a personal dashboard.

## Stack
- Next.js 15 (App Router) · React 19 · Tailwind CSS 4 · Lucide icons
- Prisma ORM — SQLite in dev, Postgres in production (swap `provider` +
  `DATABASE_URL` in `prisma/schema.prisma`)
- Auth: bcrypt(12) password hashing · jose-signed HS256 JWT sessions in
  `httpOnly` / `secure` / `SameSite=Lax` cookies (8h) · edge middleware
  route guards · per-IP login rate limiting · zod validation on every input

## Security model
- `middleware.ts` guards pages: `/admin/*` → ADMIN only, `/dashboard/*` →
  any session, authenticated `/login` → bounced to role home
- **Every API route re-verifies the session server-side** (middleware is
  not trusted alone); `role` is never caller-controlled; admin accounts
  cannot be edited/deleted via the client endpoints; `/api/client/me`
  derives the user id exclusively from the verified token
- Login failures are constant-shape (same message + bcrypt always runs)
  to prevent account enumeration; 429 after 10 attempts/10 min/IP
- `passwordHash` is never selected into any API response

## Setup
```bash
cd portal
npm install
cp .env.example .env        # fill in AUTH_SECRET (openssl rand -hex 32) + admin creds
npx prisma db push
npm run db:seed             # creates the ADMIN account from .env
npm run dev                 # http://localhost:3100
```

## Deploying
- Set `DATABASE_URL` to Postgres and change the datasource provider; run
  `prisma migrate deploy`
- Set a strong `AUTH_SECRET`; never reuse the dev value
- The in-memory rate limiter is per-process — on serverless/multi-instance,
  back `src/lib/rate-limit.ts` with Redis (call-site contract unchanged)
- Runs standalone on port 3100; keep it on its own subdomain (e.g.
  `portal.yourdomain.com`) separate from the static marketing site
