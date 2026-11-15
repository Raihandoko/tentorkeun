"use client";

import { useEffect, useRef } from "react";
import { drawBowl, targetFor, type BowlState, type RGB } from "@/lib/bowl";
import { useNoMotion } from "@/components/motion";

const W = 96;
const H = 60;

function hex(v: string, fallback: RGB): RGB {
  const s = v.trim();
  if (!/^#[0-9a-f]{6}$/i.test(s)) return fallback;
  const n = parseInt(s.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/* Glow mangkuk di latar beranda. Warna dibaca dari token, jadi ikut mode kontras tinggi. */
export function BowlGlow() {
  const ref = useRef<HTMLCanvasElement>(null);
  const noMotion = useNoMotion();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const img = ctx.createImageData(W, H);
    const root = document.documentElement;

    const colors = () => {
      const cs = getComputedStyle(root);
      return {
        outside: hex(cs.getPropertyValue("--paper"), [251, 251, 248]),
        rim: hex(cs.getPropertyValue("--glow-rim"), [238, 241, 255]),
        core: hex(cs.getPropertyValue("--glow-core"), [219, 228, 255]),
      };
    };
    let pal = colors();
    const mo = new MutationObserver(() => (pal = colors()));
    mo.observe(root, { attributes: true, attributeFilter: ["data-a11y-contrast"] });

    const vh = () => window.innerHeight;
    const start: BowlState = { tip: -0.3, half: 0.3, soft: 0.1 };
    const cur: BowlState = noMotion ? targetFor(window.scrollY / vh()) : { ...start };
    const introDelay = root.dataset.intro === "1" ? 1500 : 250;
    const introDur = 1050;
    const t0 = performance.now();
    let raf = 0;
    let stopped = false;

    const frame = (now: number) => {
      if (stopped) return;
      raf = requestAnimationFrame(frame);
      const q = window.scrollY / vh();
      if (q > 3.4 || document.hidden) return; // tertutup panel gelap
      const tgt = targetFor(q);
      if (noMotion) {
        Object.assign(cur, tgt);
      } else {
        const e = now - t0 - introDelay;
        if (e < 0) {
          Object.assign(cur, start);
        } else if (e < introDur) {
          const k = e / introDur;
          const s = k * k * (3 - 2 * k);
          const base = targetFor(0);
          cur.tip = start.tip + (base.tip - start.tip) * s;
          cur.half = start.half + (base.half - start.half) * s;
          cur.soft = start.soft + (base.soft - start.soft) * s;
        } else {
          cur.tip += (tgt.tip - cur.tip) * 0.12;
          cur.half += (tgt.half - cur.half) * 0.12;
          cur.soft += (tgt.soft - cur.soft) * 0.12;
        }
      }
      const drift = noMotion ? { tip: 0, half: 0 } : {
        tip: Math.sin(now * 0.00033 + 1.3) * 0.02,
        half: Math.sin(now * 0.0005) * 0.015,
      };
      drawBowl(
        img.data, W, H,
        window.innerWidth / window.innerHeight,
        { tip: cur.tip + drift.tip, half: cur.half + drift.half, soft: cur.soft },
        pal.outside, pal.rim, pal.core,
      );
      ctx.putImageData(img, 0, 0);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      mo.disconnect();
    };
  }, [noMotion]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <canvas ref={ref} width={W} height={H} className="block h-full w-full" />
    </div>
  );
}
