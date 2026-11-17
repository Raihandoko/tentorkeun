"use client";

import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Transition,
} from "motion/react";
import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { useA11y } from "@/components/a11y";

/* Preset spring (tension -> stiffness, friction -> damping) */
export const spring = {
  rise: { type: "spring", stiffness: 200, damping: 26, mass: 1 } as Transition,
  hover: { type: "spring", stiffness: 300, damping: 20, mass: 1 } as Transition,
  pop: { type: "spring", stiffness: 320, damping: 18, mass: 1 } as Transition,
  soft: { type: "spring", stiffness: 170, damping: 26, mass: 1 } as Transition,
};
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

/* true bila prefers-reduced-motion ATAU toggle "Kurangi animasi" aktif */
export function useNoMotion(): boolean {
  const { reduceMotion } = useA11y();
  const media = useReducedMotion();
  return reduceMotion || Boolean(media);
}

/* Naik dan muncul saat masuk layar, sekali saja */
export function Inview({
  children,
  index = 0,
  y = 28,
  className,
  as = "div",
}: {
  children: ReactNode;
  index?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "article" | "section";
}) {
  const Comp = motion[as] as ElementType;
  return (
    <Comp
      data-reveal
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ ...spring.rise, delay: Math.min(index, 6) * 0.1 }}
    >
      {children}
    </Comp>
  );
}

/* Judul terungkap per kata dari balik masker. Teks lengkap tetap ada untuk screen reader. */
export function ClipWords({
  text,
  as = "h2",
  className,
  delay = 0,
  immediate = false,
  highlight,
}: {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  delay?: number;
  /** true: jalan saat mount (untuk h1 hero), false: saat masuk layar */
  immediate?: boolean;
  /** kata yang diberi sorotan stabilo */
  highlight?: string;
}) {
  const Tag = as as ElementType;
  const words = text.split(" ");
  // Pantau judulnya sendiri: kata yang masih tersembunyi di balik masker tidak terdeteksi oleh IntersectionObserver
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  const show = immediate || seen;

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span
          key={i}
          aria-hidden
          className="clip-word inline-block overflow-hidden align-bottom"
          style={{ paddingBottom: "0.14em", marginBottom: "-0.14em" }}
        >
          <motion.span
            data-reveal
            className="inline-block"
            initial={{ y: "115%" }}
            animate={{ y: show ? "0%" : "115%" }}
            transition={{ duration: 0.7, ease: easeOutExpo, delay: delay + i * 0.06 }}
          >
            {highlight && w.replace(/[.,]/g, "") === highlight ? <span className="stabilo">{w}</span> : w}
            {i < words.length - 1 ? "\u00a0" : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/* Angka naik. Nilai akhir sudah ada di HTML dan aria-label. */
export function CountUp({
  value,
  decimals = 0,
  className,
  suffix = "",
  duration = 1.1,
}: {
  value: number;
  decimals?: number;
  className?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });
  const noMotion = useNoMotion();
  const fmt = (n: number) => n.toFixed(decimals).replace(".", ",") + suffix;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (noMotion || !inView) {
      el.textContent = fmt(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: easeOutExpo,
      onUpdate: (v) => {
        el.textContent = fmt(v);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, noMotion, value]);

  return (
    <span ref={ref} className={`num ${className ?? ""}`} aria-label={fmt(value)}>
      {fmt(value)}
    </span>
  );
}

/* Bar skor yang terisi dengan spring (transform scaleX saja) */
export function ScoreBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-ink/10" role="presentation">
      <motion.div
        data-reveal
        className="h-full origin-left rounded-full bg-accent"
        style={{ width: `${value}%` }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ ...spring.soft, delay: 0.15 }}
      />
    </div>
  );
}

/* Centang tergambar */
export function DrawCheck({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <motion.path
        d="M5 12.5l4.5 4.5L19 7.5"
        stroke="currentColor"
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.45, ease: easeOutExpo }}
      />
    </svg>
  );
}

/* Stempel "Terverifikasi": sekali saja */
export function Stamp({ children }: { children: ReactNode }) {
  return (
    <motion.span
      data-reveal
      className="inline-flex items-center gap-1.5 rounded-xl border-2 border-lulus px-2.5 py-0.5 text-xs font-bold text-lulus"
      initial={{ scale: 1.4, rotate: -8, opacity: 0 }}
      whileInView={{ scale: 1, rotate: -3, opacity: 1 }}
      viewport={{ once: true }}
      transition={spring.pop}
    >
      {children}
    </motion.span>
  );
}

/* Sapuan stabilo di belakang kata kunci (scaleX dari kiri) */
export function StabiloSweep({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline" style={{ boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>
      <motion.span
        data-reveal
        aria-hidden
        className="sweep-bg absolute inset-x-0 bottom-[0.08em] top-[0.5em] -z-10 origin-left bg-stabilo"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.35 }}
      />
      <span className="relative text-[#16211e]">{children}</span>
    </span>
  );
}

/* Dots: dot aktif melebar jadi pil */
export function DotsIndicator({
  count,
  active,
  onSelect,
  label = "Contoh",
}: {
  count: number;
  active: number;
  onSelect?: (i: number) => void;
  label?: string;
}) {
  return (
    <div className="flex items-center gap-2" role="group" aria-label={`${label}, pilih`}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect?.(i)}
          aria-label={`${label} ${i + 1}`}
          aria-current={i === active ? "true" : undefined}
          className="flex h-6 items-center"
        >
          <motion.span
            className="block h-1.5 rounded-full bg-accent"
            animate={{ width: i === active ? 20 : 6, opacity: i === active ? 1 : 0.35 }}
            transition={spring.rise}
          />
        </button>
      ))}
    </div>
  );
}

/* =====================================================================
   Transisi yang mengikuti posisi scroll
   ===================================================================== */

/* Panel besar: "in" = membesar dan menebal saat masuk layar,
   "out" = mengecil dan memudar pelan saat meninggalkan layar (untuk hero) */
export function ScrollPanel({
  children,
  className,
  mode = "in",
}: {
  children: ReactNode;
  className?: string;
  mode?: "in" | "out";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const noMotion = useNoMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: mode === "in" ? ["start end", "start 0.55"] : ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], mode === "in" ? [0.93, 1] : [1, 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 1], mode === "in" ? [0.4, 1] : [1, 0.5]);
  const y = useTransform(scrollYProgress, [0, 1], mode === "in" ? [64, 0] : [0, 48]);

  return (
    <motion.div
      ref={ref}
      data-reveal
      className={className}
      style={noMotion ? undefined : { scale, opacity, y, transformOrigin: mode === "in" ? "50% 100%" : "50% 0%" }}
    >
      {children}
    </motion.div>
  );
}

/* Geser horizontal mengikuti scroll (untuk baris marquee) */
export function ScrollSlide({ children, from = -60, to = 0 }: { children: ReactNode; from?: number; to?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const noMotion = useNoMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], [from, to]);
  return (
    <div ref={ref}>
      <motion.div style={noMotion ? undefined : { x }}>{children}</motion.div>
    </div>
  );
}

/* Geser vertikal pelan saat meninggalkan layar (parallax) */
export function ParallaxOut({ children, distance = 70, className }: { children: ReactNode; distance?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const noMotion = useNoMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, distance]);
  return (
    <motion.div ref={ref} data-reveal className={className} style={noMotion ? undefined : { y }}>
      {children}
    </motion.div>
  );
}

/* Garis tipis di bawah header yang memanjang sesuai seberapa jauh halaman dibaca */
export function ScrollProgress() {
  const noMotion = useNoMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 30, mass: 0.4 });
  return (
    <motion.div
      aria-hidden
      className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-accent"
      style={{ scaleX: mounted && noMotion ? scrollYProgress : scaleX }}
    />
  );
}
