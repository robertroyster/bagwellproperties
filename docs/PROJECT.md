# Project Notes

Bagwell Properties website — React SPA + Cloudflare Worker backend, D1 database, R2 image
storage, with a custom admin panel. Live at **https://bp.tlbm.cc**.

## Stack & layout

- **Frontend** — Vite + React 19 + Tailwind v4 + shadcn/ui in `client/`. Builds to `dist/public`.
  - `client/src/pages/Home.tsx` — landing page, fully data-driven (fetches `/api/content` +
    `/api/properties`, falls back to `shared/defaults.ts` so it always renders).
  - `client/src/pages/admin/` — admin panel (`/admin`): Content, Properties, Leads, Media, Account.
- **Backend** — Hono Worker in `worker/index.ts` (auth in `worker/auth.ts`).
  - Public: `GET /api/content`, `GET /api/properties`, `POST /api/leads`.
  - Auth: `POST /api/auth/login|logout`, `GET /api/auth/me` (custom login, PBKDF2 + D1 sessions).
  - Admin (session-guarded): content/properties/leads/media CRUD + `POST /api/admin/password`.
  - `GET /images/:key` streams from R2 (cached `immutable`); unmatched routes → static assets.
- **Shared** — `shared/types.ts`, `shared/defaults.ts`, `shared/const.ts` (used by client + worker).
- **Data** — D1 `bagwell-site`; schema in `migrations/`. Editable content stored one JSON blob
  per section in the `content` table (missing keys fall back to defaults).
- **Images** — R2 bucket `bagwell-assets`, objects under `images/`, served at `/images/<key>`.

## Commands

Wrangler reads `CLOUDFLARE_API_TOKEN` from `.env` — run `set -a; . ./.env; set +a` first.

| Task | Command |
| --- | --- |
| Frontend dev (proxies /api to :8787) | `npm run dev` |
| Worker dev | `npm run dev:worker` |
| Build | `npm run build` |
| Deploy (build + push to CF) | `npm run deploy` |
| Typecheck | `npm run check` |
| Migrate D1 (remote) | `npm run db:migrate:remote` |
| Ad-hoc SQL (remote) | `npm run db:console -- "SELECT ..."` |

## Cloudflare resources

- **Worker:** `bagwellproperties` → custom domain `bp.tlbm.cc` (tlbm.cc zone)
- **D1:** `bagwell-site` (id `a7cf06cc-1ec3-44ee-b1d8-8dccfaa629e6`)
- **R2:** `bagwell-assets`
- **Account ID:** `cd42ba0fcc5fcdd298c836c6b0fb038c`
- **Admin login:** username `admin`; password was generated at seed time — change it via the
  Account tab in `/admin`.

## Notes

- This site (bp.tlbm.cc) is the NEW build. The live bagwellproperties.com site still serves from
  GoDaddy Website Builder until we point the apex at this Worker.
- `docs/temp/` (the original Manus zip + extracted app) is gitignored — source of truth is the repo.
