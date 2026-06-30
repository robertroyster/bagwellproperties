# Bagwell Properties

Marketing site + lightweight CMS for Bagwell Properties, Inc. (commercial real estate,
Wake County, NC). Live at **https://bp.tlbm.cc**.

React SPA frontend, a Cloudflare Worker (Hono) backend, **D1** for data, and **R2** for
images — all served from one Worker. A custom-login admin panel at `/admin` makes the page
content, property listings, contact leads, and images editable.

## Quick start

```bash
npm install
set -a; . ./.env; set +a      # loads CLOUDFLARE_API_TOKEN (gitignored)

npm run dev                   # frontend (Vite) — proxies /api to wrangler on :8787
npm run dev:worker            # the Worker (API, D1, R2) on :8787
npm run deploy                # build + deploy to Cloudflare (bp.tlbm.cc)
```

## Layout

| Path | What |
| --- | --- |
| `client/` | React 19 + Tailwind v4 + shadcn/ui SPA (builds to `dist/public`) |
| `client/src/pages/Home.tsx` | Landing page, data-driven from the API |
| `client/src/pages/admin/` | Admin panel (`/admin`) |
| `worker/` | Hono Worker — API, auth, R2 image serving, static-asset fallback |
| `shared/` | Types + default content shared by client and worker |
| `migrations/` | D1 schema |

## Admin

`/admin` — custom login (user `admin`). Tabs: **Content** (every page section), **Properties**
(CRUD + image upload), **Leads** (contact-form submissions), **Media** (R2 uploads),
**Account** (change password).

See [docs/PROJECT.md](docs/PROJECT.md) for full architecture, commands, and Cloudflare resource IDs.
