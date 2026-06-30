import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { DEFAULT_CONTENT } from "@shared/defaults";
import type { SiteContent } from "@shared/types";
import { Btn, Card, Field } from "./ui";
import { ImageField } from "./MediaTab";

type Setter = (next: SiteContent) => void;

export function ContentTab() {
  const [c, setC] = useState<SiteContent>(DEFAULT_CONTENT);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api
      .getContent()
      .then((d) => {
        setC(d);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const save = async <K extends keyof SiteContent>(key: K) => {
    try {
      await api.saveContent(key, c[key]);
      toast.success(`${String(key)} saved`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  };

  if (!loaded) return <p className="font-body text-sm text-[#6B7280]">Loading…</p>;

  return (
    <div>
      <SiteCard c={c} set={setC} onSave={() => save("site")} />
      <HeroCard c={c} set={setC} onSave={() => save("hero")} />
      <StatsCard c={c} set={setC} onSave={() => save("stats")} />
      <ServicesCard c={c} set={setC} onSave={() => save("services")} />
      <LandCard c={c} set={setC} onSave={() => save("land")} />
      <AboutCard c={c} set={setC} onSave={() => save("about")} />
      <ContactCard c={c} set={setC} onSave={() => save("contact")} />
    </div>
  );
}

function SaveBtn({ onSave }: { onSave: () => void }) {
  return <Btn onClick={onSave}>Save</Btn>;
}

function SiteCard({ c, set, onSave }: { c: SiteContent; set: Setter; onSave: () => void }) {
  const s = c.site;
  const u = (patch: Partial<typeof s>) => set({ ...c, site: { ...s, ...patch } });
  return (
    <Card title="Site / Brand" actions={<SaveBtn onSave={onSave} />}>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Brand name" value={s.brandName} onChange={(v) => u({ brandName: v })} />
        <Field label="Established line" value={s.est} onChange={(v) => u({ est: v })} />
        <Field label="Phone (display)" value={s.phone} onChange={(v) => u({ phone: v })} />
        <Field label="Phone (digits only)" value={s.phoneRaw} onChange={(v) => u({ phoneRaw: v })} />
        <Field label="Email" value={s.email} onChange={(v) => u({ email: v })} />
        <Field label="Address" value={s.address} onChange={(v) => u({ address: v })} />
      </div>
    </Card>
  );
}

function HeroCard({ c, set, onSave }: { c: SiteContent; set: Setter; onSave: () => void }) {
  const h = c.hero;
  const u = (patch: Partial<typeof h>) => set({ ...c, hero: { ...h, ...patch } });
  return (
    <Card title="Hero" actions={<SaveBtn onSave={onSave} />}>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Label" value={h.label} onChange={(v) => u({ label: v })} />
        <Field label="Headline line 1" value={h.line1} onChange={(v) => u({ line1: v })} />
        <Field label="Headline line 2 (gold)" value={h.line2} onChange={(v) => u({ line2: v })} />
        <Field label="Headline line 3" value={h.line3} onChange={(v) => u({ line3: v })} />
        <Field label="Primary CTA" value={h.ctaPrimary} onChange={(v) => u({ ctaPrimary: v })} />
        <Field label="Secondary CTA" value={h.ctaSecondary} onChange={(v) => u({ ctaSecondary: v })} />
        <Field label="Badge title" value={h.badgeTitle} onChange={(v) => u({ badgeTitle: v })} />
        <Field label="Badge subtitle" value={h.badgeSub} onChange={(v) => u({ badgeSub: v })} />
      </div>
      <div className="mt-4">
        <Field label="Sub copy" value={h.sub} onChange={(v) => u({ sub: v })} textarea />
      </div>
      <div className="mt-4">
        <ImageField label="Hero image" value={h.image} onChange={(v) => u({ image: v })} />
      </div>
      <ArrayEditor
        label="Mini stats"
        items={h.miniStats}
        columns={[
          ["n", "Value"],
          ["l", "Label"],
        ]}
        make={() => ({ n: "", l: "" })}
        onChange={(miniStats) => u({ miniStats })}
      />
    </Card>
  );
}

function StatsCard({ c, set, onSave }: { c: SiteContent; set: Setter; onSave: () => void }) {
  return (
    <Card title="Stats bar" actions={<SaveBtn onSave={onSave} />}>
      <ArrayEditor
        label="Stats"
        items={c.stats}
        columns={[
          ["number", "Number"],
          ["label", "Label"],
        ]}
        make={() => ({ number: "", label: "" })}
        onChange={(stats) => set({ ...c, stats })}
      />
    </Card>
  );
}

function ServicesCard({ c, set, onSave }: { c: SiteContent; set: Setter; onSave: () => void }) {
  return (
    <Card title="Services" actions={<SaveBtn onSave={onSave} />}>
      <ArrayEditor
        label="Services"
        items={c.services}
        columns={[
          ["num", "No."],
          ["title", "Title"],
          ["tag", "Tag"],
          ["body", "Body", true],
        ]}
        make={() => ({ num: "", title: "", tag: "", body: "" })}
        onChange={(services) => set({ ...c, services })}
      />
    </Card>
  );
}

function LandCard({ c, set, onSave }: { c: SiteContent; set: Setter; onSave: () => void }) {
  const l = c.land;
  const u = (patch: Partial<typeof l>) => set({ ...c, land: { ...l, ...patch } });
  return (
    <Card title="Industrial Land" actions={<SaveBtn onSave={onSave} />}>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Label" value={l.label} onChange={(v) => u({ label: v })} />
        <Field label="CTA" value={l.cta} onChange={(v) => u({ cta: v })} />
        <Field label="Title line 1" value={l.title1} onChange={(v) => u({ title1: v })} />
        <Field label="Title line 2" value={l.title2} onChange={(v) => u({ title2: v })} />
        <Field label="Location title" value={l.locationTitle} onChange={(v) => u({ locationTitle: v })} />
        <Field label="Location subtitle" value={l.locationSub} onChange={(v) => u({ locationSub: v })} />
      </div>
      <div className="mt-4">
        <Field label="Body" value={l.body} onChange={(v) => u({ body: v })} textarea />
      </div>
      <div className="mt-4">
        <ImageField label="Land image" value={l.image} onChange={(v) => u({ image: v })} />
      </div>
      <ArrayEditor
        label="Land stats"
        items={l.stats}
        columns={[
          ["stat", "Value"],
          ["label", "Label"],
        ]}
        make={() => ({ stat: "", label: "" })}
        onChange={(stats) => u({ stats })}
      />
    </Card>
  );
}

function AboutCard({ c, set, onSave }: { c: SiteContent; set: Setter; onSave: () => void }) {
  const a = c.about;
  const u = (patch: Partial<typeof a>) => set({ ...c, about: { ...a, ...patch } });
  return (
    <Card title="About" actions={<SaveBtn onSave={onSave} />}>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Label" value={a.label} onChange={(v) => u({ label: v })} />
        <Field label="Quote" value={a.quote} onChange={(v) => u({ quote: v })} />
        <Field label="Title line 1" value={a.title1} onChange={(v) => u({ title1: v })} />
        <Field label="Title line 2" value={a.title2} onChange={(v) => u({ title2: v })} />
        <Field label="Company name" value={a.companyName} onChange={(v) => u({ companyName: v })} />
        <Field label="Company address" value={a.companyAddress} onChange={(v) => u({ companyAddress: v })} />
      </div>
      <div className="mt-4 space-y-3">
        {a.paragraphs.map((p, i) => (
          <Field
            key={i}
            label={`Paragraph ${i + 1}`}
            value={p}
            textarea
            onChange={(v) => u({ paragraphs: a.paragraphs.map((x, j) => (j === i ? v : x)) })}
          />
        ))}
        <div className="flex gap-2">
          <Btn variant="ghost" onClick={() => u({ paragraphs: [...a.paragraphs, ""] })}>
            Add paragraph
          </Btn>
          {a.paragraphs.length > 1 && (
            <Btn variant="ghost" onClick={() => u({ paragraphs: a.paragraphs.slice(0, -1) })}>
              Remove last
            </Btn>
          )}
        </div>
      </div>
    </Card>
  );
}

function ContactCard({ c, set, onSave }: { c: SiteContent; set: Setter; onSave: () => void }) {
  const k = c.contact;
  const u = (patch: Partial<typeof k>) => set({ ...c, contact: { ...k, ...patch } });
  return (
    <Card title="Contact section" actions={<SaveBtn onSave={onSave} />}>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Label" value={k.label} onChange={(v) => u({ label: v })} />
        <Field label="Heading" value={k.heading} onChange={(v) => u({ heading: v })} />
      </div>
      <div className="mt-4">
        <Field label="Blurb" value={k.blurb} onChange={(v) => u({ blurb: v })} textarea />
      </div>
    </Card>
  );
}

// Generic editor for an array of flat string-keyed objects.
function ArrayEditor<T extends Record<string, string>>({
  label,
  items,
  columns,
  make,
  onChange,
}: {
  label: string;
  items: T[];
  columns: Array<[keyof T & string, string, boolean?]>;
  make: () => T;
  onChange: (items: T[]) => void;
}) {
  const update = (i: number, key: string, value: string) =>
    onChange(items.map((it, j) => (j === i ? { ...it, [key]: value } : it)));
  return (
    <div className="mt-5">
      <div className="font-body text-[10px] text-[#0D2B4E]/55 uppercase tracking-[0.12em] font-semibold mb-2">{label}</div>
      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="border border-[#E8E4DE] bg-white p-3">
            <div className="grid md:grid-cols-2 gap-3">
              {columns.map(([key, lbl, ta]) => (
                <Field key={key} label={lbl} value={it[key] ?? ""} textarea={ta} onChange={(v) => update(i, key, v)} />
              ))}
            </div>
            <div className="mt-2 text-right">
              <button
                className="font-body text-[10px] text-red-600 underline"
                onClick={() => onChange(items.filter((_, j) => j !== i))}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3">
        <Btn variant="ghost" onClick={() => onChange([...items, make()])}>
          Add
        </Btn>
      </div>
    </div>
  );
}
