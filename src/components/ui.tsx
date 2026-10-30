import type { ReactNode, TextareaHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from "react";

/* Wrapper lebar konten */
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

/* Label kecil kapital di atas judul */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

/* Kartu */
export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-line bg-card p-6 shadow-[0_1px_2px_rgba(31,32,27,0.04)] ${className}`}>
      {children}
    </div>
  );
}

/* Tombol */
const primaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink transition hover:opacity-90 disabled:opacity-50";
const secondaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-md border border-ink/25 bg-transparent px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-ink/50 disabled:opacity-50";
const ghostBtn =
  "inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-ink transition hover:bg-ink/5 disabled:opacity-50";

export function buttonClass(variant: "primary" | "secondary" | "ghost" = "primary", full = false) {
  const base = variant === "primary" ? primaryBtn : variant === "secondary" ? secondaryBtn : ghostBtn;
  return `${base} ${full ? "w-full" : ""}`;
}

/* Label + input */
export function Field({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-semibold text-ink">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function inputClass(extra = "") {
  return `w-full rounded-md border border-line bg-card px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none ${extra}`;
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;
  return <input className={inputClass(className)} {...rest} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className, ...rest } = props;
  return <textarea className={`${inputClass(className)} min-h-28 resize-y`} {...rest} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const { className, children, ...rest } = props;
  return (
    <select className={`${inputClass(className)} cursor-pointer`} {...rest}>
      {children}
    </select>
  );
}

/* Badge kecil */
export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "accent" | "rust" | "amber" | "danger" }) {
  const tones: Record<string, string> = {
    neutral: "bg-ink/6 text-ink/70",
    accent: "bg-accent-soft text-accent",
    rust: "bg-danger-soft text-danger",
    amber: "bg-amber/15 text-[#8a6416]",
    danger: "bg-danger-soft text-danger",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-ink/8 ${className}`} />;
}

export function Alert({ tone, children }: { tone: "error" | "info"; children: ReactNode }) {
  return (
    <div
      className={`rounded-md border px-4 py-3 text-sm ${
        tone === "error" ? "border-danger/30 bg-danger-soft text-danger" : "border-accent/30 bg-accent-soft text-accent"
      }`}
    >
      {children}
    </div>
  );
}

/* Judul seksi */
export function SectionHeading({
  eyebrow,
  title,
  desc,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">{title}</h2>
      {desc && <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">{desc}</p>}
    </div>
  );
}