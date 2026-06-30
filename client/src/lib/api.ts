import type { SiteContent, Property, Lead, MediaItem, AdminUser } from "@shared/types";

async function req<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { credentials: "same-origin", ...init });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body?.error) msg = body.error;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

function jsonInit(method: string, body?: unknown): RequestInit {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  };
}

export const api = {
  // public
  getContent: () => req<SiteContent>("/api/content"),
  getProperties: () => req<Property[]>("/api/properties"),
  submitLead: (lead: { name: string; email: string; phone: string; message: string }) =>
    req<{ ok: true }>("/api/leads", jsonInit("POST", lead)),

  // auth
  login: (username: string, password: string) =>
    req<AdminUser>("/api/auth/login", jsonInit("POST", { username, password })),
  logout: () => req<{ ok: true }>("/api/auth/logout", jsonInit("POST")),
  me: () => req<AdminUser>("/api/auth/me"),
  changePassword: (current: string, next: string) =>
    req<{ ok: true }>("/api/admin/password", jsonInit("POST", { current, next })),

  // admin content
  saveContent: <K extends keyof SiteContent>(key: K, value: SiteContent[K]) =>
    req<{ ok: true }>(`/api/admin/content/${key}`, jsonInit("PUT", value)),

  // admin properties
  adminProperties: () => req<Property[]>("/api/admin/properties"),
  createProperty: (p: Omit<Property, "id">) => req<{ id: number }>("/api/admin/properties", jsonInit("POST", p)),
  updateProperty: (id: number, p: Omit<Property, "id">) =>
    req<{ ok: true }>(`/api/admin/properties/${id}`, jsonInit("PUT", p)),
  deleteProperty: (id: number) => req<{ ok: true }>(`/api/admin/properties/${id}`, jsonInit("DELETE")),

  // admin leads
  leads: () => req<Lead[]>("/api/admin/leads"),
  setLeadArchived: (id: number, archived: boolean) =>
    req<{ ok: true }>(`/api/admin/leads/${id}`, jsonInit("PATCH", { archived })),
  deleteLead: (id: number) => req<{ ok: true }>(`/api/admin/leads/${id}`, jsonInit("DELETE")),

  // admin media
  media: () => req<MediaItem[]>("/api/admin/media"),
  uploadMedia: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return req<{ key: string; path: string }>("/api/admin/media", { method: "POST", body: fd });
  },
  deleteMedia: (key: string) => req<{ ok: true }>(`/api/admin/media/${key}`, jsonInit("DELETE")),
};
