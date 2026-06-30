/**
 * Bagwell Properties — Landing Page (data-driven)
 * Content + properties load from the Worker API (/api/content, /api/properties),
 * falling back to DEFAULT_CONTENT so the page always renders instantly.
 */

import { useState, useEffect, useRef } from "react";
import { Phone, Mail, MapPin, Menu, X, ChevronRight, ArrowRight, Square } from "lucide-react";
import { DEFAULT_CONTENT, DEFAULT_PROPERTIES } from "@shared/defaults";
import type { SiteContent, Property } from "@shared/types";
import { api } from "@/lib/api";

// ─── Intersection Observer hook ───────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── Brand Mark SVG ───────────────────────────────────────────────────────────
function BrandMark({ size = 32, light = false }: { size?: number; light?: boolean }) {
  const navy = light ? "#FFFFFF" : "#0D2B4E";
  const gold = "#C8A84B";
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="6" width="20" height="28" fill={navy} />
      <rect x="16" y="12" width="20" height="22" fill={navy} opacity="0.7" />
      <rect x="24" y="6" width="12" height="4" fill={gold} />
      <rect x="32" y="6" width="4" height="12" fill={gold} />
    </svg>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav({ c }: { c: SiteContent }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { label: "Properties", href: "#properties" },
    { label: "Services", href: "#services" },
    { label: "Land", href: "#land" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(13, 43, 78, 0.96)" : "rgba(13, 43, 78, 0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(200,168,75,0.18)",
      }}
    >
      <div className="container flex items-center justify-between h-16">
        <a href="#" className="flex items-center gap-2.5 group">
          <BrandMark size={34} light />
          <div className="border-l border-white/20 pl-2.5">
            <div
              className="text-white font-body font-bold tracking-tight leading-none"
              style={{ fontSize: "0.875rem", letterSpacing: "-0.01em" }}
            >
              {c.site.brandName.toUpperCase()}
            </div>
            <div
              className="text-[#C8A84B] font-body font-medium leading-none mt-0.5"
              style={{ fontSize: "0.6rem", letterSpacing: "0.14em" }}
            >
              {c.site.est}
            </div>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="font-body text-xs font-semibold text-white/70 hover:text-white relative group transition-colors duration-180 tracking-wider uppercase"
            >
              {l.label}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#C8A84B] group-hover:w-full transition-all duration-250 ease-out" />
            </a>
          ))}
          <a
            href={`tel:${c.site.phoneRaw}`}
            className="font-body text-xs font-bold px-5 py-2.5 bg-[#C8A84B] text-[#0D2B4E] hover:bg-[#d4b55e] transition-all duration-200 active:scale-[0.97] tracking-wider uppercase flex items-center gap-1.5"
          >
            <Phone size={11} />
            {c.site.phone}
          </a>
        </nav>

        <button className="md:hidden text-white p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#0D2B4E] border-t border-[#C8A84B]/20 px-6 py-6 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-body text-sm font-semibold text-white/70 hover:text-white tracking-wider uppercase transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href={`tel:${c.site.phoneRaw}`}
            className="font-body text-sm font-bold px-5 py-3 bg-[#C8A84B] text-[#0D2B4E] text-center tracking-wider uppercase mt-2"
          >
            {c.site.phone}
          </a>
        </div>
      )}
    </header>
  );
}

// ─── Hero — TRUE split-screen ─────────────────────────────────────────────────
function Hero({ c }: { c: SiteContent }) {
  const h = c.hero;
  return (
    <section className="min-h-screen flex flex-col md:flex-row pt-16">
      <div className="relative flex flex-col justify-center bg-[#0D2B4E] md:w-[55%] px-8 md:px-16 py-20 md:py-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(to right, #C8A84B 1px, transparent 1px), linear-gradient(to bottom, #C8A84B 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute bottom-8 right-8 opacity-[0.06]">
          <BrandMark size={120} light />
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-3 mb-8 animate-fade-up">
            <div className="w-8 h-px bg-[#C8A84B]" />
            <span
              className="font-body font-semibold text-[#C8A84B] tracking-[0.18em] uppercase"
              style={{ fontSize: "0.65rem" }}
            >
              {h.label}
            </span>
          </div>

          <h1
            className="font-body font-bold text-white leading-[0.95] animate-fade-up animate-fade-up-delay-1"
            style={{ fontSize: "clamp(2.75rem, 5.5vw, 4.75rem)", letterSpacing: "-0.025em" }}
          >
            {h.line1}
            <br />
            <span className="text-[#C8A84B]">{h.line2}</span>
            <br />
            {h.line3}
          </h1>

          <div className="w-full h-px bg-white/10 my-8 animate-fade-up animate-fade-up-delay-2" />

          <p
            className="font-body text-white/60 text-base leading-relaxed animate-fade-up animate-fade-up-delay-2"
            style={{ maxWidth: "38ch" }}
          >
            {h.sub}
          </p>

          <div className="flex flex-wrap gap-3 mt-8 animate-fade-up animate-fade-up-delay-3">
            <a
              href="#properties"
              className="font-body font-bold text-xs px-7 py-3.5 bg-[#C8A84B] text-[#0D2B4E] hover:bg-[#d4b55e] transition-all duration-200 active:scale-[0.97] tracking-wider uppercase flex items-center gap-2"
            >
              {h.ctaPrimary}
              <ChevronRight size={14} />
            </a>
            <a
              href="#contact"
              className="font-body font-bold text-xs px-7 py-3.5 border border-white/25 text-white hover:border-[#C8A84B] hover:text-[#C8A84B] transition-all duration-200 active:scale-[0.97] tracking-wider uppercase"
            >
              {h.ctaSecondary}
            </a>
          </div>

          <div className="flex gap-8 mt-12 pt-8 border-t border-white/10 animate-fade-up animate-fade-up-delay-4">
            {h.miniStats.map((s) => (
              <div key={s.l}>
                <div className="font-body font-bold text-white text-xl leading-none" style={{ letterSpacing: "-0.02em" }}>
                  {s.n}
                </div>
                <div className="font-body text-white/40 text-[10px] uppercase tracking-widest mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative md:w-[45%] h-64 md:h-auto overflow-hidden">
        <img src={h.image} alt="Bagwell Properties commercial real estate" className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 w-1 h-32 bg-[#C8A84B]" />
        <div className="absolute bottom-0 left-0 w-32 h-1 bg-[#C8A84B]" />
        <div className="absolute top-6 right-6 bg-[#0D2B4E]/90 backdrop-blur-sm px-4 py-3 border-l-2 border-[#C8A84B]">
          <div className="font-body text-[9px] text-[#C8A84B] uppercase tracking-[0.15em]">Location</div>
          <div className="font-body text-white text-sm font-bold mt-0.5">{h.badgeTitle}</div>
          <div className="font-body text-white/50 text-[10px]">{h.badgeSub}</div>
        </div>
      </div>
    </section>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar({ c }: { c: SiteContent }) {
  const { ref, inView } = useInView();
  return (
    <section ref={ref} style={{ background: "#C8A84B" }}>
      <div className="container py-0">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#0D2B4E]/15">
          {c.stats.map((s, i) => (
            <div
              key={s.label}
              className={`py-8 md:py-10 px-6 md:px-10 transition-all duration-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <div
                className="font-body font-bold text-[#0D2B4E] leading-none"
                style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", letterSpacing: "-0.03em" }}
              >
                {s.number}
              </div>
              <div className="font-body text-[#0D2B4E]/60 text-[10px] mt-2 tracking-[0.12em] uppercase font-semibold">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────
function Services({ c }: { c: SiteContent }) {
  const { ref, inView } = useInView();
  return (
    <section id="services" className="py-24 md:py-32 bg-[#F8F6F2]" ref={ref}>
      <div className="container">
        <div
          className={`flex items-end justify-between mb-12 pb-6 border-b border-[#0D2B4E]/10 transition-all duration-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
        >
          <div>
            <div
              className="font-body font-semibold text-[#C8A84B] tracking-[0.16em] uppercase mb-2"
              style={{ fontSize: "0.65rem" }}
            >
              What We Do
            </div>
            <h2
              className="font-body font-bold text-[#0D2B4E] leading-none"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", letterSpacing: "-0.025em" }}
            >
              Locally Owned.
              <br />
              Personally Managed.
            </h2>
          </div>
          <div
            className="hidden md:block font-body text-[#0D2B4E]/25 font-bold text-6xl leading-none"
            style={{ letterSpacing: "-0.04em" }}
          >
            {String(c.services.length).padStart(2, "0")}
          </div>
        </div>

        <div className="flex flex-col divide-y divide-[#0D2B4E]/10">
          {c.services.map((s, i) => (
            <div
              key={s.title}
              className={`grid md:grid-cols-[80px_1fr_1fr] gap-6 md:gap-10 py-10 items-start transition-all duration-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="font-body font-bold text-[#C8A84B] text-3xl leading-none" style={{ letterSpacing: "-0.03em" }}>
                {s.num}
              </div>
              <div>
                <h3 className="font-body font-bold text-[#0D2B4E] text-xl leading-tight" style={{ letterSpacing: "-0.02em" }}>
                  {s.title}
                </h3>
                <div className="font-body text-[9px] text-[#0D2B4E]/40 uppercase tracking-[0.14em] mt-2 font-semibold">
                  {s.tag}
                </div>
              </div>
              <p className="font-body text-[#6B7280] text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Properties ───────────────────────────────────────────────────────────────
function Properties({ c, properties }: { c: SiteContent; properties: Property[] }) {
  const { ref, inView } = useInView();
  return (
    <section id="properties" className="py-24 md:py-32 bg-white" ref={ref}>
      <div className="container">
        <div
          className={`flex items-end justify-between mb-12 pb-6 border-b border-[#0D2B4E]/10 transition-all duration-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
        >
          <div>
            <div
              className="font-body font-semibold text-[#C8A84B] tracking-[0.16em] uppercase mb-2"
              style={{ fontSize: "0.65rem" }}
            >
              Space Available
            </div>
            <h2
              className="font-body font-bold text-[#0D2B4E] leading-none"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", letterSpacing: "-0.025em" }}
            >
              Commercial Properties
            </h2>
          </div>
          <div
            className="hidden md:block font-body text-[#0D2B4E]/25 font-bold text-6xl leading-none"
            style={{ letterSpacing: "-0.04em" }}
          >
            {String(properties.length).padStart(2, "0")}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {properties.map((p, i) => (
            <div
              key={p.id}
              className={`group border border-[#E8E4DE] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-250 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: `${i * 100}ms`, transitionDuration: "500ms" }}
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D2B4E]/70 via-transparent to-transparent" />
                <div className="absolute top-0 left-0 bg-[#C8A84B] text-[#0D2B4E] font-body font-bold text-[9px] tracking-[0.14em] uppercase px-3 py-1.5">
                  {p.status}
                </div>
                <div
                  className="absolute top-3 right-4 font-body font-bold text-white/20 text-5xl leading-none"
                  style={{ letterSpacing: "-0.04em" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="absolute bottom-4 left-4 border-l-4 border-[#C8A84B] pl-3">
                  <div className="font-body font-bold text-white text-2xl leading-none" style={{ letterSpacing: "-0.02em" }}>
                    {p.sf}
                  </div>
                  <div className="font-body text-white/60 text-[10px] uppercase tracking-widest mt-0.5">{p.type}</div>
                </div>
              </div>

              <div className="p-6 bg-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-body font-bold text-[#0D2B4E] text-lg leading-tight" style={{ letterSpacing: "-0.02em" }}>
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[#6B7280] text-xs font-body mt-1.5">
                      <MapPin size={11} className="flex-shrink-0" />
                      {p.address}
                    </div>
                  </div>
                  <a
                    href="#contact"
                    className="flex-shrink-0 flex items-center gap-1 font-body text-xs font-bold text-[#0D2B4E] hover:text-[#C8A84B] transition-colors duration-180 group/link uppercase tracking-wider"
                  >
                    Inquire
                    <ArrowRight size={12} className="group-hover/link:translate-x-0.5 transition-transform duration-180" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`mt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 p-7 bg-[#F8F6F2] border border-[#E8E4DE] transition-all duration-500 delay-200 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div>
            <div className="font-body font-bold text-[#0D2B4E] text-base" style={{ letterSpacing: "-0.01em" }}>
              Don't see the right fit?
            </div>
            <p className="font-body text-[#6B7280] text-xs mt-1">
              Our portfolio changes regularly — call us for unlisted availability.
            </p>
          </div>
          <a
            href={`tel:${c.site.phoneRaw}`}
            className="flex-shrink-0 font-body font-bold text-xs px-6 py-3 bg-[#0D2B4E] text-white hover:bg-[#0a2240] transition-colors duration-200 flex items-center gap-2 uppercase tracking-wider"
          >
            <Phone size={12} />
            {c.site.phone}
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Industrial Land ──────────────────────────────────────────────────────────
function LandSection({ c }: { c: SiteContent }) {
  const { ref, inView } = useInView();
  const l = c.land;
  return (
    <section id="land" className="bg-[#0D2B4E] py-24 md:py-32 overflow-hidden relative" ref={ref}>
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #C8A84B 1px, transparent 1px), linear-gradient(to bottom, #C8A84B 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />
      <div className="container relative">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className={`transition-all duration-600 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
            <div
              className="font-body font-semibold text-[#C8A84B] tracking-[0.16em] uppercase mb-4"
              style={{ fontSize: "0.65rem" }}
            >
              {l.label}
            </div>
            <h2
              className="font-body font-bold text-white leading-none"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.025em" }}
            >
              {l.title1}
              <br />
              {l.title2}
            </h2>
            <div className="w-12 h-px bg-[#C8A84B] mt-6 mb-6" />
            <p className="font-body text-white/60 text-sm leading-relaxed">{l.body}</p>

            <div className="mt-8 grid grid-cols-2 gap-5">
              {l.stats.map((item) => (
                <div key={item.label} className="border-l-2 border-[#C8A84B] pl-4">
                  <div className="font-body font-bold text-[#C8A84B] text-xl leading-none" style={{ letterSpacing: "-0.02em" }}>
                    {item.stat}
                  </div>
                  <div className="font-body text-white/40 text-[10px] uppercase tracking-[0.12em] mt-1 font-semibold">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <a
              href="#contact"
              className="mt-10 inline-flex items-center gap-2 font-body font-bold text-xs px-7 py-3.5 border border-[#C8A84B] text-[#C8A84B] hover:bg-[#C8A84B] hover:text-[#0D2B4E] transition-all duration-200 active:scale-[0.97] tracking-wider uppercase"
            >
              {l.cta}
              <ChevronRight size={14} />
            </a>
          </div>

          <div className={`relative transition-all duration-600 delay-150 ${inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
            <div className="relative">
              <img src={l.image} alt="Industrial land Wake County NC" className="w-full h-72 md:h-[440px] object-cover" />
              <div className="absolute -bottom-3 -right-3 w-full h-full border border-[#C8A84B]/25 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-1 h-24 bg-[#C8A84B]" />
              <div className="absolute bottom-0 right-0 w-24 h-1 bg-[#C8A84B]" />
            </div>
            <div className="absolute top-4 left-0 bg-[#0D2B4E]/95 px-4 py-3 border-l-2 border-[#C8A84B]">
              <div className="font-body text-[9px] text-[#C8A84B] uppercase tracking-[0.14em] font-semibold">Location</div>
              <div className="font-body text-white text-sm font-bold leading-tight mt-0.5">{l.locationTitle}</div>
              <div className="font-body text-white/50 text-[10px]">{l.locationSub}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function About({ c }: { c: SiteContent }) {
  const { ref, inView } = useInView();
  const a = c.about;
  return (
    <section id="about" className="py-24 bg-[#F8F6F2] border-t border-[#0D2B4E]/08" ref={ref}>
      <div className="container">
        <div className="grid md:grid-cols-[1fr_2px_1fr] gap-12 md:gap-16 items-start">
          <div className={`transition-all duration-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
            <div
              className="font-body font-semibold text-[#C8A84B] tracking-[0.16em] uppercase mb-3"
              style={{ fontSize: "0.65rem" }}
            >
              {a.label}
            </div>
            <h2
              className="font-body font-bold text-[#0D2B4E] leading-none"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", letterSpacing: "-0.025em" }}
            >
              {a.title1}
              <br />
              {a.title2}
            </h2>
            <div className="w-10 h-px bg-[#C8A84B] mt-5 mb-5" />
            <div className="flex items-center gap-3 mt-8 pt-6 border-t border-[#0D2B4E]/10">
              <BrandMark size={36} />
              <div>
                <div className="font-body font-bold text-[#0D2B4E] text-sm" style={{ letterSpacing: "-0.01em" }}>
                  {a.companyName}
                </div>
                <div className="font-body text-[#6B7280] text-xs">{a.companyAddress}</div>
              </div>
            </div>
          </div>

          <div className="hidden md:block w-px bg-[#0D2B4E]/10 self-stretch" />

          <div className={`transition-all duration-500 delay-100 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
            {a.paragraphs.map((p, i) => (
              <p key={i} className={`font-body text-[#6B7280] text-base leading-relaxed ${i > 0 ? "mt-4" : ""}`}>
                {p}
              </p>
            ))}
            <div className="mt-8 border-l-4 border-[#C8A84B] pl-5">
              <p className="font-display italic text-[#0D2B4E] text-lg leading-snug">"{a.quote}"</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function Contact({ c }: { c: SiteContent }) {
  const { ref, inView } = useInView();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.submitLead(form);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const contactItems = [
    { icon: Phone, label: "Phone", value: c.site.phone, href: `tel:${c.site.phoneRaw}` },
    { icon: Mail, label: "Email", value: c.site.email, href: `mailto:${c.site.email}` },
  ];

  return (
    <section id="contact" className="py-24 md:py-32 bg-white" ref={ref}>
      <div className="container">
        <div className={`mb-14 pb-6 border-b border-[#0D2B4E]/10 transition-all duration-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
          <div className="font-body font-semibold text-[#C8A84B] tracking-[0.16em] uppercase mb-2" style={{ fontSize: "0.65rem" }}>
            {c.contact.label}
          </div>
          <h2
            className="font-body font-bold text-[#0D2B4E] leading-none"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", letterSpacing: "-0.025em" }}
          >
            {c.contact.heading}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          <div className={`transition-all duration-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
            <p className="font-body text-[#6B7280] text-sm leading-relaxed mb-10">{c.contact.blurb}</p>

            <div className="flex flex-col gap-6">
              {contactItems.map(({ icon: Icon, label, value, href }) => (
                <a key={label} href={href} className="flex items-center gap-4 group border-b border-[#E8E4DE] pb-6">
                  <div className="w-9 h-9 bg-[#0D2B4E] flex items-center justify-center flex-shrink-0 group-hover:bg-[#C8A84B] transition-colors duration-200">
                    <Icon size={14} className="text-[#C8A84B] group-hover:text-[#0D2B4E] transition-colors duration-200" />
                  </div>
                  <div>
                    <div className="font-body text-[9px] text-[#6B7280] uppercase tracking-[0.14em] font-semibold">{label}</div>
                    <div className="font-body font-bold text-[#0D2B4E] text-sm mt-0.5" style={{ letterSpacing: "-0.01em" }}>
                      {value}
                    </div>
                  </div>
                </a>
              ))}
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 bg-[#0D2B4E] flex items-center justify-center flex-shrink-0">
                  <MapPin size={14} className="text-[#C8A84B]" />
                </div>
                <div>
                  <div className="font-body text-[9px] text-[#6B7280] uppercase tracking-[0.14em] font-semibold">Office</div>
                  <div className="font-body font-bold text-[#0D2B4E] text-sm mt-0.5" style={{ letterSpacing: "-0.01em" }}>
                    {c.site.address}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-500 delay-150 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 border border-[#E8E4DE]">
                <div className="w-14 h-14 bg-[#C8A84B] flex items-center justify-center mb-5">
                  <Square size={24} className="text-[#0D2B4E]" fill="#0D2B4E" />
                </div>
                <h3 className="font-body font-bold text-[#0D2B4E] text-xl" style={{ letterSpacing: "-0.02em" }}>
                  Message Received
                </h3>
                <p className="font-body text-[#6B7280] mt-2 text-sm max-w-xs">
                  Thank you for reaching out. We'll be in touch shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-[9px] text-[#0D2B4E]/50 uppercase tracking-[0.14em] font-semibold block mb-1.5">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-[#E8E4DE] bg-[#F8F6F2] px-4 py-3 font-body text-sm text-[#0D2B4E] focus:outline-none focus:border-[#0D2B4E] transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="font-body text-[9px] text-[#0D2B4E]/50 uppercase tracking-[0.14em] font-semibold block mb-1.5">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full border border-[#E8E4DE] bg-[#F8F6F2] px-4 py-3 font-body text-sm text-[#0D2B4E] focus:outline-none focus:border-[#0D2B4E] transition-colors"
                      placeholder="(919) 000-0000"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-body text-[9px] text-[#0D2B4E]/50 uppercase tracking-[0.14em] font-semibold block mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-[#E8E4DE] bg-[#F8F6F2] px-4 py-3 font-body text-sm text-[#0D2B4E] focus:outline-none focus:border-[#0D2B4E] transition-colors"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label className="font-body text-[9px] text-[#0D2B4E]/50 uppercase tracking-[0.14em] font-semibold block mb-1.5">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-[#E8E4DE] bg-[#F8F6F2] px-4 py-3 font-body text-sm text-[#0D2B4E] focus:outline-none focus:border-[#0D2B4E] transition-colors resize-none"
                    placeholder="Tell us what you're looking for..."
                  />
                </div>
                {error && <p className="font-body text-sm text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="font-body font-bold text-xs px-8 py-4 bg-[#0D2B4E] text-white hover:bg-[#0a2240] transition-colors duration-200 active:scale-[0.97] tracking-wider uppercase self-start disabled:opacity-60"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ c }: { c: SiteContent }) {
  return (
    <footer className="bg-[#0a1f3a]" style={{ borderTop: "1px solid rgba(200,168,75,0.15)" }}>
      <div className="container py-12">
        <div className="grid md:grid-cols-3 gap-10 md:gap-16">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <BrandMark size={32} light />
              <div className="border-l border-white/15 pl-3">
                <div className="font-body font-bold text-white text-xs tracking-tight">{c.about.companyName.toUpperCase()}</div>
                <div className="font-body text-[#C8A84B] text-[9px] tracking-[0.14em] uppercase mt-0.5">Est. 1992</div>
              </div>
            </div>
            <p className="font-body text-white/35 text-xs leading-relaxed">
              Locally owned commercial real estate in Wake County, North Carolina.
            </p>
          </div>

          <div>
            <div className="font-body font-semibold text-white/30 text-[9px] uppercase tracking-[0.16em] mb-4">Navigate</div>
            <div className="flex flex-col gap-2.5">
              {[
                ["Properties", "#properties"],
                ["Services", "#services"],
                ["Land Opportunities", "#land"],
                ["About", "#about"],
                ["Contact", "#contact"],
              ].map(([l, h]) => (
                <a key={l} href={h} className="font-body text-xs text-white/45 hover:text-white transition-colors duration-180 font-medium">
                  {l}
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="font-body font-semibold text-white/30 text-[9px] uppercase tracking-[0.16em] mb-4">Contact</div>
            <div className="flex flex-col gap-3">
              <a href={`tel:${c.site.phoneRaw}`} className="font-body text-xs text-white/45 hover:text-white transition-colors flex items-center gap-2 font-medium">
                <Phone size={11} className="text-[#C8A84B]" /> {c.site.phone}
              </a>
              <a href={`mailto:${c.site.email}`} className="font-body text-xs text-white/45 hover:text-white transition-colors flex items-center gap-2 font-medium">
                <Mail size={11} className="text-[#C8A84B]" /> {c.site.email}
              </a>
              <div className="font-body text-xs text-white/45 flex items-start gap-2 font-medium">
                <MapPin size={11} className="text-[#C8A84B] mt-0.5 flex-shrink-0" />
                {c.site.address}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="font-body text-[10px] text-white/25">
            © {new Date().getFullYear()} {c.about.companyName} All rights reserved.
          </div>
          <div className="font-body text-[9px] text-white/15 tracking-[0.16em] uppercase">
            Raleigh · Wake County · Johnston County · NC
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [properties, setProperties] = useState<Property[]>(
    DEFAULT_PROPERTIES.map((p, i) => ({ ...p, id: i + 1 })),
  );

  useEffect(() => {
    api.getContent().then(setContent).catch(() => {});
    api
      .getProperties()
      .then((p) => {
        if (p.length) setProperties(p);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      <Nav c={content} />
      <Hero c={content} />
      <StatsBar c={content} />
      <Services c={content} />
      <Properties c={content} properties={properties} />
      <LandSection c={content} />
      <About c={content} />
      <Contact c={content} />
      <Footer c={content} />
    </div>
  );
}
