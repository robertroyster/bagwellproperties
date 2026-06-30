# Project Notes

Details that CLAUDE.md points to. For separate topics, create new `.md` files and
link them from this page.

## Status

Cloudflare Workers + D1 scaffold for the Bagwell Properties website.

## Stack & layout

- **Cloudflare Workers** (`src/index.ts`) — serves static assets and `/api/*` routes.
- **Static site** — files in `public/` (served via the `ASSETS` binding; SPA fallback on 404).
- **D1 database** — `bagwellproperties-db`, bound as `env.DB`. Schema in `migrations/`.
- **Config** — `wrangler.toml`. Custom-domain routes for `bagwellproperties.com` are
  present but commented out until ready to go live.

## Commands

Wrangler reads `CLOUDFLARE_API_TOKEN` from `.env` (gitignored) — `set -a; . ./.env; set +a` first,
or rely on your shell having it exported.

| Task | Command |
| --- | --- |
| Local dev server | `npm run dev` |
| Deploy to Cloudflare | `npm run deploy` |
| Live logs | `npm run tail` |
| Apply migrations (local) | `npm run db:migrate:local` |
| Apply migrations (remote) | `npm run db:migrate:remote` |
| Ad-hoc SQL (remote) | `npm run db:console -- "SELECT * FROM properties" --remote` |
| Regenerate Worker types | `npm run typegen` |

New DB changes: add a numbered file in `migrations/` (e.g. `0002_*.sql`), then run the migrate command.

## Cloudflare resources

- **Account ID:** `cd42ba0fcc5fcdd298c836c6b0fb038c`
- **D1 database id:** `d21c63ff-6462-4863-8597-5fc85e7a99a5`
- **API token:** scoped token in `.env` (id `73fc8beb8809bcf3babed960a70fbb16`); covers DNS,
  Zones, Workers, Pages, D1, KV, R2, Queues, Workers AI across all zones on the account.
  Manage at https://dash.cloudflare.com/profile/api-tokens
