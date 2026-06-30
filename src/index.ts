export interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Example API route backed by D1. Everything else falls through to static assets.
    if (url.pathname === "/api/health") {
      const { results } = await env.DB.prepare("SELECT 1 AS ok").all();
      return Response.json({ ok: true, db: results });
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
