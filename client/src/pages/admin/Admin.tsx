import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { AdminUser, Lead } from "@shared/types";
import { Btn, Card, Field, GOLD, NAVY } from "./ui";
import { ContentTab } from "./ContentTab";
import { PropertiesTab } from "./PropertiesTab";
import { MediaTab } from "./MediaTab";

type Tab = "content" | "properties" | "leads" | "media" | "account";
const TABS: { id: Tab; label: string }[] = [
  { id: "content", label: "Content" },
  { id: "properties", label: "Properties" },
  { id: "leads", label: "Leads" },
  { id: "media", label: "Media" },
  { id: "account", label: "Account" },
];

export default function Admin() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<Tab>("content");

  useEffect(() => {
    api
      .me()
      .then((u) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setChecking(false));
  }, []);

  if (checking)
    return <div className="min-h-screen flex items-center justify-center font-body text-[#6B7280]">Loading…</div>;
  if (!user) return <Login onLogin={setUser} />;

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#0D2B4E] text-white">
        <div className="container flex items-center justify-between h-14">
          <div className="font-body font-bold text-sm tracking-wide">
            Bagwell Admin <span className="text-[#C8A84B]">·</span>{" "}
            <span className="text-white/50 font-normal">bp.tlbm.cc</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" className="font-body text-xs text-white/70 hover:text-white">
              View site ↗
            </a>
            <button
              className="font-body text-xs text-white/70 hover:text-white"
              onClick={async () => {
                await api.logout().catch(() => {});
                setUser(null);
              }}
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <nav className="border-b border-[#E8E4DE] bg-[#F8F6F2]">
        <div className="container flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="font-body text-xs font-semibold uppercase tracking-wide px-4 py-3 border-b-2 transition-colors"
              style={{
                color: tab === t.id ? NAVY : "#6B7280",
                borderColor: tab === t.id ? GOLD : "transparent",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="container py-8">
        {tab === "content" && <ContentTab />}
        {tab === "properties" && <PropertiesTab />}
        {tab === "leads" && <LeadsTab />}
        {tab === "media" && <MediaTab />}
        {tab === "account" && <AccountTab />}
      </main>
    </div>
  );
}

function Login({ onLogin }: { onLogin: (u: AdminUser) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      onLogin(await api.login(username, password));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D2B4E] px-4">
      <form onSubmit={submit} className="bg-white p-8 w-full max-w-sm border-t-4 border-[#C8A84B]">
        <h1 className="font-body font-bold text-[#0D2B4E] text-lg mb-1">Bagwell Properties</h1>
        <p className="font-body text-xs text-[#6B7280] mb-6 uppercase tracking-wide">Admin sign in</p>
        <div className="space-y-4">
          <Field label="Username" value={username} onChange={setUsername} />
          <label className="block">
            <span className="font-body text-[10px] text-[#0D2B4E]/55 uppercase tracking-[0.12em] font-semibold block mb-1.5">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#E8E4DE] bg-white px-3 py-2 font-body text-sm text-[#0D2B4E] focus:outline-none focus:border-[#0D2B4E]"
            />
          </label>
          {error && <p className="font-body text-sm text-red-600">{error}</p>}
          <Btn type="submit" disabled={busy} className="w-full">
            {busy ? "Signing in…" : "Sign in"}
          </Btn>
        </div>
      </form>
    </div>
  );
}

function LeadsTab() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const refresh = () => api.leads().then(setLeads).catch(() => {});
  useEffect(() => {
    refresh();
  }, []);

  const visible = leads.filter((l) => (showArchived ? true : !l.archived));

  return (
    <Card
      title={`Leads (${leads.filter((l) => !l.archived).length} active)`}
      actions={
        <Btn variant="ghost" onClick={() => setShowArchived((s) => !s)}>
          {showArchived ? "Hide archived" : "Show archived"}
        </Btn>
      }
    >
      {visible.length === 0 ? (
        <p className="font-body text-sm text-[#6B7280]">No leads yet.</p>
      ) : (
        <div className="space-y-3">
          {visible.map((l) => (
            <div key={l.id} className={`border border-[#E8E4DE] bg-white p-4 ${l.archived ? "opacity-60" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-body font-bold text-[#0D2B4E] text-sm">
                    {l.name} {l.archived ? <span className="text-[10px] text-[#6B7280]">(archived)</span> : null}
                  </div>
                  <div className="font-body text-xs text-[#6B7280]">
                    <a href={`mailto:${l.email}`} className="underline">
                      {l.email}
                    </a>
                    {l.phone ? ` · ${l.phone}` : ""} · {l.created_at} UTC
                  </div>
                  {l.message && <p className="font-body text-sm text-[#0D2B4E] mt-2 whitespace-pre-wrap">{l.message}</p>}
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <Btn
                    variant="ghost"
                    onClick={async () => {
                      await api.setLeadArchived(l.id, !l.archived);
                      refresh();
                    }}
                  >
                    {l.archived ? "Unarchive" : "Archive"}
                  </Btn>
                  <Btn
                    variant="danger"
                    onClick={async () => {
                      if (!confirm("Delete this lead?")) return;
                      await api.deleteLead(l.id);
                      refresh();
                    }}
                  >
                    Delete
                  </Btn>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function AccountTab() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (next.length < 8) return toast.error("New password must be at least 8 characters");
    setBusy(true);
    try {
      await api.changePassword(current, next);
      toast.success("Password updated");
      setCurrent("");
      setNext("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card title="Change password" actions={<Btn onClick={submit} disabled={busy}>{busy ? "Saving…" : "Update"}</Btn>}>
      <div className="grid md:grid-cols-2 gap-4 max-w-lg">
        <label className="block">
          <span className="font-body text-[10px] text-[#0D2B4E]/55 uppercase tracking-[0.12em] font-semibold block mb-1.5">
            Current password
          </span>
          <input
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="w-full border border-[#E8E4DE] bg-white px-3 py-2 font-body text-sm text-[#0D2B4E] focus:outline-none focus:border-[#0D2B4E]"
          />
        </label>
        <label className="block">
          <span className="font-body text-[10px] text-[#0D2B4E]/55 uppercase tracking-[0.12em] font-semibold block mb-1.5">
            New password
          </span>
          <input
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            className="w-full border border-[#E8E4DE] bg-white px-3 py-2 font-body text-sm text-[#0D2B4E] focus:outline-none focus:border-[#0D2B4E]"
          />
        </label>
      </div>
    </Card>
  );
}
