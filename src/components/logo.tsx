/* Wordmark sederhana: "Tentor" gelap, "Keun" beraksen, titik kuning pensil di ujung */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display text-[1.4rem] font-extrabold leading-none tracking-tight text-ink ${className}`}>
      Tentor<span className="text-accent">Keun</span>
      <span aria-hidden className="ml-0.5 inline-block h-[0.32em] w-[0.32em] rounded-full bg-stabilo align-baseline" />
    </span>
  );
}
