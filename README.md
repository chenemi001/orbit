# Orbit

Orbit is a full-stack project management workspace: projects, tasks, team
collaboration, activity tracking, notifications, analytics, and an
AI assistant that understands your actual workspace data — built with
Next.js, TypeScript, Drizzle ORM, and PostgreSQL.

## Features

- **Authentication** — email/password registration and login, scrypt
  password hashing, signed HTTP-only session cookies, route protection via
  a Next.js proxy (middleware).
- **Projects** — create, edit, archive; role-based membership
  (owner/admin/member/viewer); progress computed from real task completion,
  not a manually-set number.
- **Tasks** — kanban board and table views, filtering/search, assignment,
  priority and status changes, due dates — all backed by the database.
- **Team** — everyone you share a project with, aggregated with task and
  project counts; invite existing users into a project by email.
- **Notifications** — task assignments, completions, and project updates,
  with unread counts and mark-as-read.
- **Activity feed** — an audit trail of what happened across your projects.
- **Analytics** — completion rate, priority/status distribution, overdue
  tasks, and a 14-day activity chart, computed from live data.
- **AI assistant** — a per-user conversation history backed by
  `ai_conversations` / `ai_messages`, with your real tasks and projects
  injected as context so it can answer "what should I work on today?"
  Degrades to a clear "not configured" message (never a fake response) when
  no `OPENAI_API_KEY` is set.
- **Search** — a command palette (⌘K / Ctrl+K) searching tasks, projects,
  and people you have access to.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, TypeScript, Tailwind CSS 4 |
| State | Zustand (client UI state only — server state is fetched, not cached client-side) |
| Database | PostgreSQL (Supabase-hosted), via `postgres.js` |
| ORM | Drizzle ORM (schema + relational queries) |
| Auth | Hand-rolled: scrypt hashing + HMAC-signed session cookies |
| Validation | Zod |
| Testing | Vitest (unit + integration) |

## Architecture

```text
app/
  (app)/              route group for every authenticated page — one
                       shared layout resolves the session server-side and
                       redirects to /login if it's missing
    dashboard/ tasks/ projects/ projects/[id]/ team/
    notifications/ analytics/ profile/ settings/ ai/
  api/                 route handlers: request → validate → service → response
  login/ register/     public auth pages
  page.tsx             marketing landing page

components/
  ui/                  design-system primitives (Button, Modal, Avatar, …)
  layout/              Sidebar, mobile nav, command palette
  dashboard/ tasks/ projects/ team/ notifications/ analytics/ ai/ shared/

lib/
  db/                  Drizzle schema, relations, typed client
  services/            all database access — the only layer that queries the DB
  auth/                session signing/verification, rate limiting
  permissions/         role → permission map + project-scoped guards
  validation/          Zod schemas per entity
  api/                 response envelope, typed errors, request parsing
  ai/                  OpenAI client, prompts, workspace-context builder

proxy.ts               route protection (Next.js 16's middleware convention)
drizzle/                generated SQL migrations
tests/unit/             pure-logic tests (hashing, validation, permissions)
tests/integration/      tests against the real database (own setup/teardown)
```

**Request flow.** A route handler in `app/api/**` authenticates
(`requireUser()`), validates the body against a Zod schema, checks
authorization for the target project (`requireProjectPermission`), calls a
function in `lib/services/*`, and returns a consistent envelope via
`lib/api/response.ts`. Services are the only code that imports `lib/db` —
nothing else touches the database directly.

**Authorization model.** Every project always has a membership row for its
owner (created atomically with the project). A user's role on a project —
`owner` / `admin` / `member` / `viewer` — is resolved once per request via
`getUserProjectRole`, and `lib/permissions` maps that role to a fixed set of
permission strings (`task:create`, `project:delete`, …). A non-member gets
a 404 on that project, not a 403 — so a private project's existence isn't
leaked to people who aren't in it.

**Progress isn't stored opinion.** `projects.progress` is recalculated from
actual task completion (`recalculateProjectProgress`) every time a task is
created, completed, or deleted — never set by hand.

## Database

8 tables: `users`, `projects`, `project_members`, `tasks`, `notifications`,
`activities`, `ai_conversations`, `ai_messages`. Enums for project status,
task status/priority, notification type, and member role. Foreign keys on
every relationship, indexes on the columns that get filtered on
(`tasks.project_id`, `notifications(user_id, read)`, etc.), and a unique
constraint on `(project_id, user_id)` in `project_members`.

Schema lives in `lib/db/schema.ts`; relations (for Drizzle's relational
query API) in `lib/db/relations.ts`. Both are the source of truth — the
files in `drizzle/` are generated history, applied with `db:push`.

## Getting started

### Prerequisites

- Node.js 20.9.0+ (Next.js 16's minimum)
- A PostgreSQL database (this project was built against Supabase, but any
  Postgres instance works)

### Environment variables

Create `.env.local`:

```bash
DATABASE_URL=postgresql://user:password@host:5432/dbname
SESSION_SECRET=<a long random string — used to sign session cookies>

# Optional — without it, the AI assistant returns a clear
# "not configured" message instead of a fake response.
OPENAI_API_KEY=sk-...
```

`SESSION_SECRET` and `DATABASE_URL` are server-only — never reference them
with a `NEXT_PUBLIC_` prefix. If you're pointing at Supabase, its
`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are safe
to expose (that's what "publishable" means) but aren't required by this
app's own code — only `DATABASE_URL` is read for data access.

### Install and run

```bash
npm install
npm run db:push     # applies lib/db/schema.ts to your database
npm run dev
```

Visit `http://localhost:3000`, register an account, and you're in.

### Commands

```bash
npm run dev          # start the dev server
npm run build        # production build
npm run start        # run the production build
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm test             # vitest (unit + integration, run once)
npm run test:watch   # vitest in watch mode

npm run db:generate  # generate a SQL migration from schema.ts
npm run db:push      # push schema.ts directly to the database
npm run db:studio    # browse the database in Drizzle Studio
```

Integration tests (`tests/integration/`) run against the database in
`DATABASE_URL` — they create their own users/projects and delete them in an
`afterAll`, but point this at a dev database, not production.

## Deploying to Vercel

Orbit is a standard Next.js App Router project — `vercel deploy` (or
connecting the repo in the Vercel dashboard) detects it with no extra
config. Two things matter beyond that:

### 1. Use Supabase's transaction pooler, not a direct connection

Vercel runs your API routes as serverless functions, and under load many
instances can exist at once. Each one imports `lib/db/index.ts` and opens
its own database connection — a direct Postgres connection (or Supabase's
*session* pooler on port `5432`) has a low, fixed connection limit and will
get exhausted quickly.

In the Supabase dashboard, go to **Project Settings → Database →
Connection string** and copy the **Transaction pooler** string (port
`6543`), not the direct or session-pooler one. `lib/db/index.ts` already
sets `prepare: false` and `max: 1`, which is exactly what that pooler
mode requires — one small connection per function instance, multiplexed by
the pooler itself rather than by this app.

### 2. Set environment variables in the Vercel project

**Project Settings → Environment Variables** (set for Production, and
again for Preview if you want preview deployments to have a working
database):

| Variable | Value |
|---|---|
| `DATABASE_URL` | The transaction-pooler connection string above |
| `SESSION_SECRET` | A long random string (`openssl rand -base64 32`) — **required**, the app throws on every request if it's missing |
| `OPENAI_API_KEY` | Optional — omit it and the AI assistant just reports itself as unconfigured |

None of these should ever get a `NEXT_PUBLIC_` prefix — that would ship
them to the browser.

### 3. Apply the schema before (or right after) the first deploy

Vercel's build step only runs `next build` — it does not run any Drizzle
command, so a fresh database needs its schema applied once, from your own
machine, pointed at production:

```bash
DATABASE_URL="<your transaction-pooler URL>" npm run db:push
```

Do this before the first deploy, and again after any future schema change
in `lib/db/schema.ts`. Treat it as a deliberate, manual step — nothing in
the deploy pipeline applies schema changes automatically, by design (a
migration should never run implicitly on every push).

### 4. Route protection needs the Node.js runtime

`proxy.ts` (Next's middleware convention) verifies the session cookie with
Node's `crypto` module, so it must run on the Node.js runtime rather than
the Edge runtime. This is Next 16's default for the `proxy` file — no
`runtime` config is needed (or allowed) — and Vercel supports it natively.

## Security notes

- Passwords are hashed with scrypt (random salt, timing-safe comparison) —
  never stored or logged in plaintext.
- Sessions are HMAC-SHA256-signed, httpOnly, `sameSite=lax` cookies with a
  server-side expiry check independent of the cookie's own `maxAge`.
- Every mutating API route re-derives the user's permission on the target
  resource server-side — client-supplied IDs are never trusted for
  authorization.
- Login and registration are rate-limited per IP (in-memory — fine for a
  single instance; a multi-instance deployment should back this with Redis
  instead).
- Zod validates every request body; unrecognized fields are stripped, not
  mass-assigned.
- No `dangerouslySetInnerHTML` anywhere; React's default escaping is relied
  on for all user-generated content.

## What's intentionally not here

- Real-time sync across browser tabs/users (no websockets) — the client
  refetches after each mutation instead.
- Email delivery — "inviting" someone adds an existing Orbit account to a
  project; there's no email-based signup invite flow.
- Multi-tenant "workspaces" as a distinct entity — a user's accessible
  projects and teammates are derived from project membership rather than a
  separate organization table.
