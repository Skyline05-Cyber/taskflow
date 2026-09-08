# Deploying TaskFlow live

This gets you two real URLs: a live API on Render and a live site on Vercel,
backed by a Supabase project that's hosted in the cloud from the moment
you create it (Supabase has no "local" mode you need to graduate from).

## 1. Create the Supabase project

1. Go to https://supabase.com → New project.
2. Once it's created, open **SQL Editor** → New query, paste the contents
   of `supabase/schema.sql`, and run it. This creates the `tasks` table
   and the Row Level Security policies.
3. Go to **Project Settings → API**. You'll need three values:
   - `Project URL` → this is `SUPABASE_URL` / `VITE_SUPABASE_URL`
   - `anon` `public` key → this is `VITE_SUPABASE_ANON_KEY`
   - `service_role` key → this is `SUPABASE_SERVICE_ROLE_KEY` (backend only — never put this in the frontend)
4. Go to **Authentication → URL Configuration** and, once you know your
   Vercel URL (step 4 below), add it to "Site URL" and "Redirect URLs" so
   confirmation emails link back to the live site instead of localhost.

## 2. Push the code to GitHub

```bash
git init
git add .
git commit -m "Initial commit: TaskFlow"
git branch -M main
git remote add origin https://github.com/<you>/taskflow.git
git push -u origin main
```

## 3. Deploy the backend to Render

1. https://render.com → New → Web Service → connect your GitHub repo.
2. Set **Root Directory** to `backend`.
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variables (Render dashboard → Environment):
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `FRONTEND_URL` — you'll come back and set this to your real Vercel URL after step 4
6. Deploy. Render gives you a URL like `https://taskflow-backend.onrender.com`.
   Visit `<that-url>/health` — you should see `{"status":"ok"}`.

Note: Render's free tier spins the service down after inactivity, so the
first request after idle time can take ~30–50 seconds. This is normal and
worth mentioning if a reviewer notices it.

## 4. Deploy the frontend to Vercel

1. https://vercel.com → New Project → import the same GitHub repo.
2. Set **Root Directory** to `frontend`.
3. Framework preset: Vite (auto-detected).
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` → your Render URL from step 3
5. Deploy. Vercel gives you a URL like `https://taskflow.vercel.app` — this
   is your live site.

## 5. Close the loop

Go back to Render and set `FRONTEND_URL` to your real Vercel URL (this is
what the backend's CORS policy allows). Redeploy the backend so the change
takes effect. Then go back to Supabase's Auth URL Configuration and confirm
the Vercel URL is set there too.

## 6. Verify

- Visit your Vercel URL, sign up with a real email, confirm it, log in.
- Add a task, mark it complete, delete it.
- Open the Supabase dashboard → Table Editor → `tasks` and watch rows
  appear/change in real time as you use the live site.

From here, every `git push` to `main` auto-redeploys both Render and
Vercel, and GitHub Actions runs lint/tests/build checks on every push —
so a broken change gets caught in CI before (or alongside) the redeploy.
