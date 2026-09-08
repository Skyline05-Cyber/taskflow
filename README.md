# TaskFlow

A personal task manager with real authentication and per-user data isolation
enforced at the database level, not just in application code.

**Live demo:** _add your Vercel URL here after deploying (see `DEPLOYMENT.md`)_

## Stack

- **Frontend:** React 18 (Vite), React Router
- **Backend:** Node.js + Express (REST API)
- **Database & Auth:** Supabase (Postgres + Row Level Security)
- **Infra:** Docker + docker-compose for local dev, GitHub Actions for CI

## Why this architecture

The frontend and backend are separate services on purpose, rather than one
Next.js app doing both. This mirrors how most real production systems are
actually split (a backend team owns the API, a frontend team owns the UI),
and it means the API has a clean boundary that's testable and deployable
independent of the UI.

**Two layers of authorization, not one:**
1. Every backend route runs `requireAuth` middleware, which sends the
   caller's bearer token to Supabase to verify it's a real, unexpired
   session — the backend never trusts a user ID the client claims to be.
2. Every database write is additionally scoped with `.eq('user_id', req.user.id)`
   in the controller, and Postgres Row Level Security policies (see
   `supabase/schema.sql`) enforce the same boundary again at the database
   level. If a future code change ever forgot the `.eq()` guard, RLS still
   stops a cross-user read or write from ever reaching the client.

**Validation lives in the backend**, not just the frontend form — so the
API is safe to call directly (from a script, a future mobile app, curl)
without relying on the UI to have been polite about what it sent.

## Running locally

You need a free Supabase project first (see `DEPLOYMENT.md` step 1 — it
only takes a couple of minutes and there's no local Postgres to install).

```bash
# Backend
cd backend
cp .env.example .env   # fill in your Supabase URL + service role key
npm install
npm run dev             # http://localhost:4000

# Frontend (new terminal)
cd frontend
cp .env.example .env   # fill in your Supabase URL + anon key
npm install
npm run dev             # http://localhost:5173
```

Or with Docker:

```bash
docker compose up --build
```

## Deploying it live

See `DEPLOYMENT.md` for the full walkthrough: Supabase (already hosted) →
Render (backend) → Vercel (frontend), with CI running on every push.

## Tests

```bash
cd backend
npm test
```

Covers input validation for task creation/updates (empty titles, invalid
priorities, malformed dates, partial-update semantics).

## What I'd improve with more time

- Rate limiting on the API (e.g. `express-rate-limit`) to blunt abuse
- Optimistic UI already exists for toggle/delete; extending it to task
  creation would remove the last bit of perceived latency
- Pagination once a user's task list grows large
- E2E tests (Playwright) covering the signup → task CRUD flow end to end
