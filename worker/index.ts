import { Hono } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { DEFAULT_CONTENT } from "../shared/defaults";
import type { SiteContent } from "../shared/types";
import { COOKIE_NAME, ONE_YEAR_MS } from "../shared/const";
import { hashPassword, verifyPassword, generateToken } from "./auth";

export interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  BUCKET: R2Bucket;
}

type Vars = { userId: number; username: string };

const SECTION_KEYS = ["site", "hero", "stats", "services", "land", "about", "contact"] as const;
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 days

const app = new Hono<{ Bindings: Env; Variables: Vars }>();

// ─── Content helpers ──────────────────────────────────────────────────────────
async function getContent(db: D1Database): Promise<SiteContent> {
  const { results } = await db.prepare("SELECT key, value FROM content").all<{ key: string; value: string }>();
  const out = structuredClone(DEFAULT_CONTENT) as Record<string, unknown>;
  for (const row of results ?? []) {
    try {
      out[row.key] = JSON.parse(row.value);
    } catch {
      /* keep default */
    }
  }
  return out as unknown as SiteContent;
}

// ─── Public API ───────────────────────────────────────────────────────────────
app.get("/api/content", async (c) => c.json(await getContent(c.env.DB)));

app.get("/api/properties", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT id, name, type, address, sf, status, image, sort FROM properties ORDER BY sort ASC, id ASC",
  ).all();
  return c.json(results ?? []);
});

app.post("/api/leads", async (c) => {
  const body = await c.req.json().catch(() => null);
  const name = (body?.name ?? "").toString().trim();
  const email = (body?.email ?? "").toString().trim();
  const phone = (body?.phone ?? "").toString().trim();
  const message = (body?.message ?? "").toString().trim();
  if (!name || !email) return c.json({ error: "Name and email are required." }, 400);
  if (name.length > 200 || email.length > 200 || phone.length > 60 || message.length > 5000)
    return c.json({ error: "Input too long." }, 400);
  await c.env.DB.prepare("INSERT INTO leads (name, email, phone, message) VALUES (?, ?, ?, ?)")
    .bind(name, email, phone, message)
    .run();
  return c.json({ ok: true });
});

// ─── Image serving from R2 ──────────────────────────────────────────────────────
app.get("/images/:key", async (c) => {
  const key = c.req.param("key");
  const obj = await c.env.BUCKET.get(`images/${key}`);
  if (!obj) return c.notFound();
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("etag", obj.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");
  return new Response(obj.body, { headers });
});

// ─── Auth ───────────────────────────────────────────────────────────────────────
app.post("/api/auth/login", async (c) => {
  const body = await c.req.json().catch(() => null);
  const username = (body?.username ?? "").toString().trim();
  const password = (body?.password ?? "").toString();
  if (!username || !password) return c.json({ error: "Missing credentials." }, 400);
  const user = await c.env.DB.prepare("SELECT id, username, password_hash FROM admin_users WHERE username = ?")
    .bind(username)
    .first<{ id: number; username: string; password_hash: string }>();
  if (!user || !(await verifyPassword(password, user.password_hash)))
    return c.json({ error: "Invalid username or password." }, 401);

  const token = generateToken();
  const expires = Date.now() + SESSION_TTL_MS;
  await c.env.DB.prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)")
    .bind(token, user.id, expires)
    .run();
  setCookie(c, COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
  return c.json({ id: user.id, username: user.username });
});

app.post("/api/auth/logout", async (c) => {
  const token = getCookie(c, COOKIE_NAME);
  if (token) await c.env.DB.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
  deleteCookie(c, COOKIE_NAME, { path: "/" });
  return c.json({ ok: true });
});

// ─── Admin auth guard ─────────────────────────────────────────────────────────
const requireAuth = async (c: any, next: any) => {
  const token = getCookie(c, COOKIE_NAME);
  if (!token) return c.json({ error: "Unauthorized" }, 401);
  const session = await c.env.DB.prepare(
    "SELECT s.user_id, s.expires_at, u.username FROM sessions s JOIN admin_users u ON u.id = s.user_id WHERE s.token = ?",
  )
    .bind(token)
    .first<{ user_id: number; expires_at: number; username: string }>();
  if (!session || session.expires_at < Date.now()) {
    if (session) await c.env.DB.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
    return c.json({ error: "Unauthorized" }, 401);
  }
  c.set("userId", session.user_id);
  c.set("username", session.username);
  await next();
};

app.get("/api/auth/me", requireAuth, (c) => c.json({ id: c.get("userId"), username: c.get("username") }));

app.post("/api/admin/password", requireAuth, async (c) => {
  const body = await c.req.json().catch(() => null);
  const current = (body?.current ?? "").toString();
  const next = (body?.next ?? "").toString();
  if (next.length < 8) return c.json({ error: "New password must be at least 8 characters." }, 400);
  const user = await c.env.DB.prepare("SELECT password_hash FROM admin_users WHERE id = ?")
    .bind(c.get("userId"))
    .first<{ password_hash: string }>();
  if (!user || !(await verifyPassword(current, user.password_hash)))
    return c.json({ error: "Current password is incorrect." }, 401);
  await c.env.DB.prepare("UPDATE admin_users SET password_hash = ? WHERE id = ?")
    .bind(await hashPassword(next), c.get("userId"))
    .run();
  return c.json({ ok: true });
});

// ─── Admin: content ─────────────────────────────────────────────────────────────
app.put("/api/admin/content/:key", requireAuth, async (c) => {
  const key = c.req.param("key");
  if (!SECTION_KEYS.includes(key as any)) return c.json({ error: "Unknown section." }, 400);
  const value = await c.req.json().catch(() => null);
  if (value === null) return c.json({ error: "Invalid JSON." }, 400);
  await c.env.DB.prepare(
    "INSERT INTO content (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
  )
    .bind(key, JSON.stringify(value))
    .run();
  return c.json({ ok: true });
});

// ─── Admin: properties ──────────────────────────────────────────────────────────
app.get("/api/admin/properties", requireAuth, async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT id, name, type, address, sf, status, image, sort FROM properties ORDER BY sort ASC, id ASC",
  ).all();
  return c.json(results ?? []);
});

app.post("/api/admin/properties", requireAuth, async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const r = await c.env.DB.prepare(
    "INSERT INTO properties (name, type, address, sf, status, image, sort) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id",
  )
    .bind(
      (b.name ?? "").toString(),
      (b.type ?? "").toString(),
      (b.address ?? "").toString(),
      (b.sf ?? "").toString(),
      (b.status ?? "Available").toString(),
      (b.image ?? "").toString(),
      Number(b.sort ?? 0),
    )
    .first<{ id: number }>();
  return c.json({ id: r?.id });
});

app.put("/api/admin/properties/:id", requireAuth, async (c) => {
  const id = Number(c.req.param("id"));
  const b = await c.req.json().catch(() => ({}));
  await c.env.DB.prepare(
    "UPDATE properties SET name=?, type=?, address=?, sf=?, status=?, image=?, sort=? WHERE id=?",
  )
    .bind(
      (b.name ?? "").toString(),
      (b.type ?? "").toString(),
      (b.address ?? "").toString(),
      (b.sf ?? "").toString(),
      (b.status ?? "Available").toString(),
      (b.image ?? "").toString(),
      Number(b.sort ?? 0),
      id,
    )
    .run();
  return c.json({ ok: true });
});

app.delete("/api/admin/properties/:id", requireAuth, async (c) => {
  await c.env.DB.prepare("DELETE FROM properties WHERE id = ?").bind(Number(c.req.param("id"))).run();
  return c.json({ ok: true });
});

// ─── Admin: leads ───────────────────────────────────────────────────────────────
app.get("/api/admin/leads", requireAuth, async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT id, name, email, phone, message, created_at, archived FROM leads ORDER BY created_at DESC, id DESC",
  ).all();
  return c.json(results ?? []);
});

app.patch("/api/admin/leads/:id", requireAuth, async (c) => {
  const b = await c.req.json().catch(() => ({}));
  await c.env.DB.prepare("UPDATE leads SET archived = ? WHERE id = ?")
    .bind(b.archived ? 1 : 0, Number(c.req.param("id")))
    .run();
  return c.json({ ok: true });
});

app.delete("/api/admin/leads/:id", requireAuth, async (c) => {
  await c.env.DB.prepare("DELETE FROM leads WHERE id = ?").bind(Number(c.req.param("id"))).run();
  return c.json({ ok: true });
});

// ─── Admin: media (R2) ──────────────────────────────────────────────────────────
app.get("/api/admin/media", requireAuth, async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT key, filename, content_type, size, created_at FROM media ORDER BY created_at DESC",
  ).all();
  return c.json(results ?? []);
});

app.post("/api/admin/media", requireAuth, async (c) => {
  const form = await c.req.parseBody();
  const file = form["file"];
  if (!(file instanceof File)) return c.json({ error: "No file uploaded." }, 400);
  if (file.size > 15 * 1024 * 1024) return c.json({ error: "File exceeds 15 MB." }, 400);
  const safe = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "upload";
  const key = `${generateToken().slice(0, 8)}-${safe}`;
  await c.env.BUCKET.put(`images/${key}`, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type || "application/octet-stream" },
  });
  await c.env.DB.prepare(
    "INSERT INTO media (key, filename, content_type, size) VALUES (?, ?, ?, ?)",
  )
    .bind(key, file.name, file.type || "application/octet-stream", file.size)
    .run();
  return c.json({ key, path: `/images/${key}` });
});

app.delete("/api/admin/media/:key", requireAuth, async (c) => {
  const key = c.req.param("key");
  await c.env.BUCKET.delete(`images/${key}`);
  await c.env.DB.prepare("DELETE FROM media WHERE key = ?").bind(key).run();
  return c.json({ ok: true });
});

// ─── Static assets (SPA) fallback ───────────────────────────────────────────────
app.all("*", (c) => c.env.ASSETS.fetch(c.req.raw));

export default app;
