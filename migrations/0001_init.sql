-- Bagwell Properties site schema

-- Editable page content, stored one JSON blob per section (hero, stats, ...).
CREATE TABLE IF NOT EXISTS content (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Property listings.
CREATE TABLE IF NOT EXISTS properties (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  name    TEXT    NOT NULL,
  type    TEXT    NOT NULL DEFAULT '',
  address TEXT    NOT NULL DEFAULT '',
  sf      TEXT    NOT NULL DEFAULT '',
  status  TEXT    NOT NULL DEFAULT 'Available',
  image   TEXT    NOT NULL DEFAULT '',
  sort    INTEGER NOT NULL DEFAULT 0
);

-- Contact-form submissions.
CREATE TABLE IF NOT EXISTS leads (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL,
  email      TEXT    NOT NULL,
  phone      TEXT    NOT NULL DEFAULT '',
  message    TEXT    NOT NULL DEFAULT '',
  created_at TEXT    NOT NULL DEFAULT (datetime('now')),
  archived   INTEGER NOT NULL DEFAULT 0
);

-- Admin users (custom login).
CREATE TABLE IF NOT EXISTS admin_users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  username      TEXT    NOT NULL UNIQUE,
  password_hash TEXT    NOT NULL,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Server-side sessions (random token stored in an httpOnly cookie).
CREATE TABLE IF NOT EXISTS sessions (
  token      TEXT PRIMARY KEY,
  user_id    INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
);

-- Uploaded media catalog (objects live in R2; this is the index for the admin UI).
CREATE TABLE IF NOT EXISTS media (
  key          TEXT PRIMARY KEY,
  filename     TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size         INTEGER NOT NULL,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_properties_sort ON properties(sort);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
