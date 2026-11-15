import type { ReactNode, TextareaHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from "react";

/* Wrapper lebar konten */
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

/* Label kecil di atas judul (tidak lagi kapital ber-tracking) */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

/* Kartu: sudut tajam, tanpa bayangan blur */
export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-card p-6 ${className}`}>{children}</div>;
}

/* Tombol. Efek tekan lewat CSS, panah pakai class arrow-nudge di dalam. */
const baseBtn =
  "btn-press group/btn inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50";
const primaryBtn = `${baseBtn} bg-accent text-accent-ink hover:bg-accent-hover`;
const secondaryBtn = `${baseBtn} border border-ink/30 bg-transparent text-ink hover:border-ink hover:bg-ink/5`;
const ghostBtn = `${baseBtn} text-ink hover:bg-ink/5`;
const ctaBtn = `${primaryBtn} btn-dot`;
const dangerBtn = `${baseBtn} bg-koreksi text-koreksi-ink hover:opacity-90`;

export function buttonClass(variant: "primary" | "secondary" | "ghost" | "danger" | "cta" = "primary", full = false) {
  const base =
    variant === "primary" ? primaryBtn : variant === "secondary" ? secondaryBtn : variant === "danger" ? dangerBtn : variant === "cta" ? ctaBtn : ghostBtn;
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
  return `w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-[15px] text-ink placeholder:text-muted/70 focus:border-transparent focus:outline-none ${extra}`;
}

/* Garis bawah biru terisi dari kiri saat fokus, seperti ditarik pulpen */
export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;
  return (
    <div className="ink-field">
      <input className={inputClass(className)} {...rest} />
    </div>
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className, ...rest } = props;
  return (
    <div className="ink-field">
      <textarea className={`${inputClass(className)} min-h-28 resize-y`} {...rest} />
    </div>
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const { className, children, ...rest } = props;
  return (
    <div className="ink-field">
      <select className={`${inputClass(className)} cursor-pointer`} {...rest}>
        {children}
      </select>
    </div>
  );
}

type Tone = "neutral" | "accent" | "lulus" | "peringatan" | "koreksi" | "rust" | "amber" | "danger";

/* Badge kecil: selalu teks, warna hanya penguat */
export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  const tones: Record<Tone, string> = {
    neutral: "bg-ink/8 text-ink/80",
    accent: "bg-accent-soft text-accent",
    lulus: "bg-lulus-soft text-lulus",
    peringatan: "bg-peringatan-soft text-peringatan",
    koreksi: "bg-koreksi-soft text-koreksi",
    rust: "bg-koreksi-soft text-koreksi",
    amber: "bg-peringatan-soft text-peringatan",
    danger: "bg-koreksi-soft text-koreksi",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden />;
}

export function Alert({ tone, children, className = "" }: { tone: "error" | "info"; children: ReactNode; className?: string }) {
  return (
    <div
      role={tone === "error" ? "alert" : undefined}
      className={`rounded-lg border-l-4 px-4 py-3 text-sm ${
        tone === "error" ? "border-koreksi bg-koreksi-soft text-koreksi" : "border-accent bg-accent-soft text-accent"
      } ${className}`}
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
      <h2 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">{title}</h2>
      {desc && <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">{desc}</p>}
    </div>
  );
}
