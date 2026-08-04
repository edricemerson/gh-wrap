# GitHub Wrap

A "Spotify Wrapped"–style year-in-review for your GitHub account. Sign in with GitHub and get a dashboard of stats pulled from your repos: top languages, commit habits, repo highlights, a fun "archetype" verdict, and your social stats.

## How it works

1. **Login** — the landing page (`Weblockpage`) offers "Sign in with GitHub" (real GitHub OAuth) or "Skip" (a guest path, gated by a short-lived cookie rather than a real session).
2. **Auth** — [NextAuth.js (Auth.js) v5](https://authjs.dev) handles the GitHub OAuth flow. The GitHub access token is attached to the session via custom `jwt`/`session` callbacks so it can be used server-side to call the GitHub API.
3. **Routing** — everything is decided in one place: `app/page.tsx` is a server component that checks for a real session (`auth()`) or the guest cookie, and renders one of three views: `Weblockpage` (login), `Ghpage` (logged-in dashboard), or `Skippage` (guest flow). There are no separate `/login`, `/dashboard`, etc. routes — access to `Ghpage`/`Skippage` can't be forced by just typing a URL, since the same route always re-checks server-side state.
4. **Stats computation** — once logged in, `computeWrapStats` (`app/github/wrapStats.ts`) fetches data from the GitHub REST API for your most-recently-updated non-fork repos (capped at 30, to bound API usage) and computes:
   - **Top Language** — language bytes summed across repos, plus "most polyglot repo" and "one-hit wonder" languages
   - **Commit Personality** — peak coding hour, chronotype (Night Owl / Early Bird / Steady Coder), most active day, longest streak, favorite commit word, fix/WIP/oops counts — all scoped to the current calendar year
   - **Volume** — total commits, repos, languages touched, and lines added/removed (via GitHub's contributor-stats endpoint)
   - **Repo Highlights** — most-starred repo, the repo you committed to most this year, newest repo, total stars, and a "graveyard" of repos abandoned right after creation
   - **Archetype** — a rule-based "verdict" (e.g. The Monogamist, The Polyglot, The Full-Stacker, The Night Owl) with a primary pick and a runner-up if a second archetype also matches
   - **Social Layer** — follower count, who you starred the most, and the top languages among repos you've starred
5. **Rendering** — `Ghpage` renders all of this as a set of cards in a fixed one-screen dashboard layout (no page scrolling; each section fits `100vh`).

## Tech stack

- **[Next.js 16](https://nextjs.org/)** (App Router, Turbopack) — React framework, server components for data fetching
- **[React 19](https://react.dev/)**
- **[TypeScript](https://www.typescriptlang.org/)**
- **[NextAuth.js (Auth.js) v5](https://authjs.dev/)** — GitHub OAuth, JWT sessions
- **[Tailwind CSS v4](https://tailwindcss.com/)** — styling
- **[GitHub REST API](https://docs.github.com/en/rest)** — source of all stats (repos, languages, commits, contributor stats, starred repos)
- **next/font** — Geist (UI) and Yellowtail (the "WRAPPED" wordmark)

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a GitHub OAuth App at [github.com/settings/developers](https://github.com/settings/developers):
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
3. Copy the Client ID and generate a Client Secret, then fill in `.env.local`:
   ```
   AUTH_SECRET=<random string>
   AUTH_GITHUB_ID=<client id>
   AUTH_GITHUB_SECRET=<client secret>
   ```
4. Run the dev server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  auth/                 NextAuth config, GitHub OAuth scope, server actions (auth.ts, actions.ts)
  api/auth/[...nextauth] NextAuth route handler
  github/wrapStats.ts    All GitHub API calls + stat computation
  page/
    weblockPage.tsx      Login screen
    repoPage/ghPage.tsx  Logged-in dashboard (the wrap itself)
    repoPage/skipPage.tsx Guest "insert repo link" screen
  page.tsx               Root route — decides which view to render
```
