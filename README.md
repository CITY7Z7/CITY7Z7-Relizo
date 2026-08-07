# Welcome to Relizo project

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS


## What this is
A single-page web app (Vite + React + TypeScript) for cataloging music, tracking releases/distribution and managing promotional tasks — essentially a music cataloger / release tracker with a card-index style UI for items like tracks, albums and releases.

### Stack
- **Language(s):** TypeScript (primary); small PL/pgSQL presence for database-side code
- **Framework / runtime:** Vite + React 18 (SPA)
- **Notable libraries:** shadcn-ui / Radix + Tailwind CSS for UI, @tanstack/react-query for data fetching/caching, @supabase/supabase-js (client DB), recharts for charts

## How it's organized
```
README.md               project description, tech list
package.json            scripts & dependencies (vite, vitest, tailwind, react-query, supabase, etc.)
src/                    front-end app (React components, pages, hooks)
  components/           UI pieces (AppLayout, RequireAuth, ui/*)
  pages/                route pages (AuthPage, DashboardPage, TracksPage, AlbumsPage, etc.)
  hooks/                data hooks (e.g. useDatabase — data access / mutations)
  App.tsx               app entry: router, auth wrapper, layout, route list
  ...                   other UI and utility modules
```

How it fits together: App.tsx mounts a BrowserRouter and protects the main routes behind a RequireAuth component. Pages (Dashboard, Tracks, Albums, Releases, etc.) use hooks from src/hooks (backed by Supabase client in dependencies) and TanStack Query to fetch and mutate data. UI is built with shadcn-ui + Radix primitives and Tailwind; charts on the dashboard are rendered with recharts.

## How to run it
From a fresh clone, install deps and run the dev server using the package.json scripts:

```
npm install
npm run dev
```

Other useful scripts:
- npm run build        # production build
- npm run preview      # preview built site
- npm test             # run tests (vitest)

Notes on environment: the code depends on a database/auth backend (supabase and a cloud-auth package appear in package.json). Expect to provide the usual backend environment variables (e.g., Supabase URL / anon/service keys or other auth credentials) before signing in and loading real data.

## Try asking
- Where is the data access code (the implementation of useDatabase) and how does it authenticate to Supabase or the backend?
- I see PL/pgSQL in the repo stats — where are the DB schema / migration files and how are they applied?
- How is RequireAuth implemented (which provider/flow does it use) and where is the auth configuration stored?
