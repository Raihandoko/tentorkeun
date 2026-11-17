"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ScrollProgress } from "@/components/motion";

/* Pembungkus header: menandai halaman sudah di-scroll supaya garis bawah muncul.
   Latar blur ada di elemen anak terpisah, supaya menu layar penuh (fixed) tidak ikut terkurung. */
export function HeaderFrame({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      el.dataset.scrolled = window.scrollY > 8 ? "1" : "0";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header ref={ref} className="site-header sticky top-0 z-40">
      <div aria-hidden className="header-bar absolute inset-0 bg-paper/85 backdrop-blur-md" />
      <ScrollProgress />
      <div className="relative mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        {children}
      </div>
    </header>
  );
}
