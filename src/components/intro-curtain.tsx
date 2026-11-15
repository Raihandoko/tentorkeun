"use client";

import { useEffect } from "react";

/* Tirai pembuka. Keputusan tampil dibuat oleh skrip kecil di <head> (layout) sebelum paint,
   jadi tidak ada kedip konten dan tidak ada hydration mismatch. Animasinya murni CSS,
   jadi tetap selesai sendiri meski JS lambat. */
export function IntroCurtain() {
  useEffect(() => {
    const t = setTimeout(() => {
      delete document.documentElement.dataset.intro;
    }, 2300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div id="intro-curtain" aria-hidden className="intro-curtain">
      <div className="intro-word font-display text-[clamp(2rem,9vw,3.5rem)] font-bold">
        Tentor<span className="intro-stabilo">Keun</span>
      </div>
      <div className="intro-progress" />
    </div>
  );
}
