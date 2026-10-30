export function Logo({ size = 28 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
        <rect width="32" height="32" rx="7" fill="var(--accent)" />
        <path d="M9 9.5h14M16 9.5v13" stroke="var(--accent-ink)" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
      <span className="font-serif text-xl font-semibold tracking-tight text-ink">
        Tentor<span className="text-accent">Keun</span>
      </span>
    </span>
  );
}