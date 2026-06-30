import { type ReactNode } from "react";

export const NAVY = "#0D2B4E";
export const GOLD = "#C8A84B";

export function Btn({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "ghost" | "danger";
  disabled?: boolean;
  className?: string;
}) {
  const styles =
    variant === "primary"
      ? "bg-[#0D2B4E] text-white hover:bg-[#0a2240]"
      : variant === "danger"
        ? "bg-red-600 text-white hover:bg-red-700"
        : "bg-transparent text-[#0D2B4E] border border-[#E8E4DE] hover:border-[#0D2B4E]";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`font-body font-semibold text-xs px-4 py-2.5 tracking-wide uppercase transition-colors disabled:opacity-50 ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  value,
  onChange,
  textarea,
  rows = 3,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  rows?: number;
  placeholder?: string;
}) {
  const cls =
    "w-full border border-[#E8E4DE] bg-white px-3 py-2 font-body text-sm text-[#0D2B4E] focus:outline-none focus:border-[#0D2B4E] transition-colors";
  return (
    <label className="block">
      <span className="font-body text-[10px] text-[#0D2B4E]/55 uppercase tracking-[0.12em] font-semibold block mb-1.5">
        {label}
      </span>
      {textarea ? (
        <textarea value={value} rows={rows} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={`${cls} resize-y`} />
      ) : (
        <input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
    </label>
  );
}

export function Card({ title, children, actions }: { title?: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <div className="border border-[#E8E4DE] bg-[#F8F6F2] p-6 mb-6">
      {(title || actions) && (
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#0D2B4E]/10">
          {title && (
            <h3 className="font-body font-bold text-[#0D2B4E] text-sm uppercase tracking-wide" style={{ letterSpacing: "0.04em" }}>
              {title}
            </h3>
          )}
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}
