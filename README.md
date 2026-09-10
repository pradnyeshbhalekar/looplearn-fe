# LoopLearn — Frontend

LoopLearn's web client — a React/TypeScript single-page app that consumes the ([LoopLearn Flask backend](https://github.com/pradnyeshbhalekar/looplearn-be))'s daily AI-generated engineering articles. It handles Google Sign-In, renders the day's article (Mermaid architecture diagrams, code artifacts, trade-off comparisons, flashcards, narrated audio playback), lets users subscribe to a domain (or a team workspace) via Razorpay, and provides an inline "select text to get an AI explanation" tutor and an admin review queue for pipeline-generated candidates.

## Tech stack

- **Framework**: React 19 + TypeScript, built with Vite 7
- **Routing**: `react-router-dom` (browser router, route guards)
- **State**: Redux Toolkit (`@reduxjs/toolkit`, `react-redux`) for auth and subscriptions; local component state elsewhere
- **HTTP**: `axios`, with a request interceptor that attaches the stored JWT
- **Styling**: Tailwind CSS 4 (via `@tailwindcss/vite`)
- **Animation**: `framer-motion`
- **Content rendering**: `react-markdown` (article body), `mermaid` (architecture diagrams), `react-zoom-pan-pinch` (pan/zoom diagram viewer)
- **Auth**: Google Identity Services (`window.google.accounts.id`), `jwt-decode` for reading role/expiry off the stored JWT client-side
- **Icons**: `lucide-react`
- **Deploy**: Vercel (`vercel.json` rewrites all routes to `index.html` for client-side routing)

## Project structure

```
src/
  api/            # axios client + typed API wrappers per backend resource
    axios.ts        # shared axios instance, attaches Bearer token from localStorage
    subscription.ts # plans, subscribe, confirm, cancel, today's/subscribed articles
    workspace.ts    # create/list/get workspace, invite/remove member, delete
    explain.ts      # inline AI term explanation
  app/
    store.ts        # Redux store (auth + subscription reducers)
    hook.ts         # typed useAppDispatch / useAppSelector
  features/
    auth/           # authSlice, authThunks (googleLogin, fetchMe), route guards, types
    subscriptions/  # subscriptionSlice (plans, subscribe flow)
  routes/
    router.tsx      # all route definitions and which guard wraps each page
  pages/            # one component per route (see Routes table below)
  components/
    article/        # article body building blocks (see Article rendering below)
    layout/         # Navbar, Footer
    auth/           # GoogleLoginButton
    skeletons/      # loading-state placeholders per page
    AudioPlayer.tsx, FloatingAudioPlayer.tsx   # narration playback
    Logo.tsx
  context/
    ThemeContext.tsx  # light/dark theme provider
  hooks/
    useMediaQuery.ts  # responsive breakpoint hook
  types/
    admin.ts          # Candidate, decoded-JWT payload types
  main.tsx, App.tsx   # app bootstrap (Redux Provider, ThemeProvider, RouterProvider)
```

## Routes

| Path | Page | Guard |
|---|---|---|
| `/` | `Home` — marketing/landing page | — |
| `/pricing` | `Pricing` — plan list, subscribe (personal or team) | — |
| `/subscription/success` | `SubscriptionSuccess` — polls `/api/subscriptions/confirm` after Razorpay checkout until the subscription is active | — |
| `/login` | `Login` — Google Sign-In button | `LoginGuard` (redirects away if already authenticated) |
| `/auth/callback` | `AuthCallback` — picks up a `?token=` from a server-side OAuth redirect, or falls back to redux state | — |
| `/dashboard` | `Dashboard` — the user's subscriptions and workspaces, create/manage workspaces | `AuthGuard` |
| `/todays` | `Todays` — today's free/public article | `AuthGuard` |
| `/subscriptions/article/:slug` | `SubscribedArticle` — a specific article gated to the domain's subscribers | `AuthGuard` |
| `/admin` | `Admin` — review pipeline candidates (approve/reject/schedule) | `AuthGuard` + `AdminRoute` |

## Key features

### Auth flow

1. `Login` renders Google's One Tap / Sign-In button via the Google Identity Services script (`window.google.accounts.id`), configured with `VITE_GOOGLE_CLIENT_ID`.
2. On success, the returned Google ID token is dispatched through `googleLogin` (`src/features/auth/authThunks.ts`), which posts it to the backend's `POST /api/auth/google`.
3. The backend's JWT (`access_token`) and user profile are stored in Redux (`authSlice`) and mirrored into `localStorage` under the `token` key.
4. `src/api/axios.ts`'s request interceptor reads that token on every request and sets `Authorization: Bearer <token>`.
5. `AuthGuard` checks Redux `state.auth.isAuthenticated`; `AdminRoute` independently decodes the JWT with `jwt-decode` and checks `role === "admin"` and expiry, so it works even before `fetchMe` has populated Redux.
6. `logout` clears both Redux state and `localStorage`.

### Article rendering

Both `Todays` and `SubscribedArticle` render the same article shape returned by the backend, composed from:
- `PracticalArtifact` — the code/config/CLI/SQL snippet with a line-by-line breakdown
- `EngineeringInsights` — observability metrics and anti-patterns
- `TradeoffComparison` — pros/cons per strategy
- `FlashcardGrid` — interview-style Q&A cards
- A Mermaid diagram rendered client-side (`mermaid`) inside a pan/zoom viewer (`react-zoom-pan-pinch`)
- `FloatingAudioPlayer` / `AudioPlayer` — plays the Cloudinary-hosted narration audio the backend generated

### Inline AI explainer

`TextSelectionExplainer` listens for text selections anywhere inside an `.explain-content-area`, shows a small trigger button near the selection, and on click calls `explainApi.fetchExplanation` (`POST /api/explain/`) with the selected text and surrounding paragraph, then displays the result in `ExplanationPopover` (desktop-anchored) or `ExplanationModal` (mobile).

### Subscriptions & workspaces

- `Pricing` fetches plans (`fetchPlans` thunk → `GET /api/subscriptions/plans`) and starts a subscription (`createSubscription` → `POST /api/subscriptions/subscribe`), redirecting to Razorpay checkout; supports a `?team=true&workspace_id=...` variant for team plans.
- `SubscriptionSuccess` polls `POST /api/subscriptions/confirm` after returning from checkout, since activation is otherwise driven by the backend's Razorpay webhook.
- `Dashboard` lists the user's subscriptions and workspaces, and lets a workspace admin create workspaces, invite members by email, and remove members (`src/api/workspace.ts`, wrapping `/api/workspaces/*`).

### Admin review

`Admin` lists pending and approved-but-scheduled ("queued") pipeline candidates, renders a preview (Markdown + Mermaid) of each, and lets an admin approve (with a publish date) or reject (with a reason) — calling the backend's `admin_candidate_routes` endpoints directly with the stored JWT.

## Environment variables

Create a `.env` (or `.env.local`) in the project root:

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the Flask backend, e.g. `http://127.0.0.1:5000` in dev |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID used to render the Sign-In button (must match the backend's `GOOGLE_CLIENT_ID`) |

`.env.example` in this repo currently documents only `VITE_API_BASE_URL` — `VITE_GOOGLE_CLIENT_ID` is also required (see `src/pages/Login.tsx`).

## Setup & run

```bash
npm install

# start the dev server (http://localhost:5173 by default)
npm run dev

# type-check and build for production
npm run build

# preview the production build locally
npm run preview

# lint
npm run lint
```

The dev server expects the backend (see the `daily` repo) running and reachable at `VITE_API_BASE_URL`, with `flask-cors` configured there to allow `http://localhost:5173`.

## Connecting to the backend

All requests go through the shared `axios` instance in `src/api/axios.ts`, pointed at `VITE_API_BASE_URL` with `withCredentials: true` and an automatic `Authorization: Bearer <token>` header from `localStorage`. The full backend API surface this app talks to (auth, topics, articles, subscriptions, workspaces, explain, admin candidates) is documented in the backend's own README.
