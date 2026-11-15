/* Wordmark: "Keun" disapu stabilo, tanpa kotak ikon */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display text-[1.35rem] font-bold leading-none text-ink ${className}`}>
      Tentor<span className="stabilo !px-[0.1em]">Keun</span>
    </span>
  );
}
