-- Initial schema. Apply locally with `npm run db:migrate:local`,
-- to production with `npm run db:migrate:remote`.
CREATE TABLE IF NOT EXISTS properties (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      TEXT    NOT NULL,
  address    TEXT,
  price      INTEGER,
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);
