import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { MediaItem } from "@shared/types";
import { Btn, Card } from "./ui";

export function useMedia() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const refresh = () => api.media().then(setItems).catch(() => {});
  useEffect(() => {
    refresh();
  }, []);
  return { items, refresh };
}

export function MediaTab() {
  const { items, refresh } = useMedia();
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const f of Array.from(files)) await api.uploadMedia(f);
      toast.success("Uploaded");
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = async (key: string) => {
    if (!confirm("Delete this image? Anything still using it will break.")) return;
    try {
      await api.deleteMedia(key);
      toast.success("Deleted");
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <Card
      title="Media Library"
      actions={
        <>
          <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files)} />
          <Btn onClick={() => inputRef.current?.click()} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Image"}
          </Btn>
        </>
      }
    >
      {items.length === 0 ? (
        <p className="font-body text-sm text-[#6B7280]">No images yet. Upload one to get started.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((m) => {
            const path = `/images/${m.key}`;
            return (
              <div key={m.key} className="border border-[#E8E4DE] bg-white">
                <img src={path} alt={m.filename} className="w-full h-28 object-cover" />
                <div className="p-2">
                  <div className="font-body text-[11px] text-[#0D2B4E] truncate" title={m.filename}>
                    {m.filename}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      className="font-body text-[10px] text-[#0D2B4E] underline"
                      onClick={() => {
                        navigator.clipboard.writeText(path);
                        toast.success("Path copied");
                      }}
                    >
                      Copy path
                    </button>
                    <button className="font-body text-[10px] text-red-600 underline" onClick={() => remove(m.key)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

// Inline image field: text input for the path + upload button + thumbnail.
export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const upload = async (file: File | null | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      const { path } = await api.uploadMedia(file);
      onChange(path);
      toast.success("Image uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <span className="font-body text-[10px] text-[#0D2B4E]/55 uppercase tracking-[0.12em] font-semibold block mb-1.5">
        {label}
      </span>
      <div className="flex items-center gap-3">
        {value ? <img src={value} alt="" className="w-16 h-16 object-cover border border-[#E8E4DE]" /> : null}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/images/..."
          className="flex-1 border border-[#E8E4DE] bg-white px-3 py-2 font-body text-sm text-[#0D2B4E] focus:outline-none focus:border-[#0D2B4E]"
        />
        <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => upload(e.target.files?.[0])} />
        <Btn variant="ghost" onClick={() => inputRef.current?.click()} disabled={busy}>
          {busy ? "..." : "Upload"}
        </Btn>
      </div>
    </div>
  );
}
