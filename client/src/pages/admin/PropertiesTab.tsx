import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Property } from "@shared/types";
import { Btn, Card, Field } from "./ui";
import { ImageField } from "./MediaTab";

type Draft = Omit<Property, "id">;

const empty: Draft = { name: "", type: "", address: "", sf: "", status: "Available", image: "", sort: 0 };

export function PropertiesTab() {
  const [items, setItems] = useState<Property[]>([]);
  const [editing, setEditing] = useState<{ id: number | null; draft: Draft } | null>(null);

  const refresh = () => api.adminProperties().then(setItems).catch(() => {});
  useEffect(() => {
    refresh();
  }, []);

  const startNew = () => setEditing({ id: null, draft: { ...empty, sort: items.length + 1 } });
  const startEdit = (p: Property) => setEditing({ id: p.id, draft: { ...p } });

  const save = async () => {
    if (!editing) return;
    if (!editing.draft.name.trim()) return toast.error("Name is required");
    try {
      if (editing.id == null) await api.createProperty(editing.draft);
      else await api.updateProperty(editing.id, editing.draft);
      toast.success("Saved");
      setEditing(null);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this property?")) return;
    try {
      await api.deleteProperty(id);
      toast.success("Deleted");
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  if (editing) {
    const d = editing.draft;
    const u = (patch: Partial<Draft>) => setEditing({ ...editing, draft: { ...d, ...patch } });
    return (
      <Card
        title={editing.id == null ? "New property" : "Edit property"}
        actions={
          <div className="flex gap-2">
            <Btn variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Btn>
            <Btn onClick={save}>Save</Btn>
          </div>
        }
      >
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Name" value={d.name} onChange={(v) => u({ name: v })} />
          <Field label="Type" value={d.type} onChange={(v) => u({ type: v })} placeholder="Office / Flex" />
          <Field label="Address" value={d.address} onChange={(v) => u({ address: v })} />
          <Field label="Size (SF)" value={d.sf} onChange={(v) => u({ sf: v })} placeholder="±4,400 SF" />
          <Field label="Status" value={d.status} onChange={(v) => u({ status: v })} placeholder="Available" />
          <Field label="Sort order" value={String(d.sort)} onChange={(v) => u({ sort: Number(v) || 0 })} />
        </div>
        <div className="mt-4">
          <ImageField label="Image" value={d.image} onChange={(v) => u({ image: v })} />
        </div>
      </Card>
    );
  }

  return (
    <Card title="Properties" actions={<Btn onClick={startNew}>Add property</Btn>}>
      {items.length === 0 ? (
        <p className="font-body text-sm text-[#6B7280]">No properties yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((p) => (
            <div key={p.id} className="flex items-center gap-4 border border-[#E8E4DE] bg-white p-3">
              {p.image ? <img src={p.image} alt="" className="w-16 h-16 object-cover" /> : <div className="w-16 h-16 bg-[#F8F6F2]" />}
              <div className="flex-1 min-w-0">
                <div className="font-body font-bold text-[#0D2B4E] text-sm">{p.name}</div>
                <div className="font-body text-xs text-[#6B7280]">
                  {p.type} · {p.sf} · {p.status}
                </div>
                <div className="font-body text-[11px] text-[#6B7280] truncate">{p.address}</div>
              </div>
              <div className="flex gap-2">
                <Btn variant="ghost" onClick={() => startEdit(p)}>
                  Edit
                </Btn>
                <Btn variant="danger" onClick={() => remove(p.id)}>
                  Delete
                </Btn>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
