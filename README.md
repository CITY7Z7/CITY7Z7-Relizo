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
- **Notable libraries:** shadcn-ui / Radix + Tailwind CSS for UI, @tanstack/react-query for data fetching/caching, better-sqlite3 (local DB), recharts for charts

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

How it fits together: App.tsx mounts a BrowserRouter and protects the main routes behind a RequireAuth component. Pages (Dashboard, Tracks, Albums, Releases, etc.) use hooks from src/hooks and TanStack Query to fetch and mutate data through the local SQLite API. UI is built with shadcn-ui + Radix primitives and Tailwind; charts on the dashboard are rendered with recharts.

## How to run it
From a fresh clone, install deps and run the dev server using the package.json scripts:

```
npm install
or ( npm install --legacy-peer-deps )
npm run dev
```

---
admin@relizo.app
admin123

Other useful scripts:
- npm run build        # production build
- npm run preview      # preview built site
- npm test             # run tests (vitest)

Data is stored locally in `data/relizo.sqlite`. The Vite development server provides the local API and file storage on `localhost:8080`; no environment variables or external services are required.

## Try asking
- Where is the data access code (the implementation of useDatabase) and how is local persistence handled?
- I see PL/pgSQL in the repo stats — where are the DB schema / migration files and how are they applied?
- How is RequireAuth implemented (which provider/flow does it use) and where is the auth configuration stored?
