"use client";

import { useEffect, useRef } from "react";
import { useNoMotion } from "@/components/motion";

type RGB = [number, number, number];
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const hex = (v: string, f: RGB): RGB => {
  const s = v.trim();
  if (!/^#[0-9a-f]{6}$/i.test(s)) return f;
  const n = parseInt(s.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const rgb = (c: RGB) => `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})`;

/* Tiap huruf: transparan + blur -> warna ghost -> aksen -> warna akhir */
function paint(chars: HTMLElement[], p: number, spread: number, fin: RGB, accent: RGB, ghost: RGB) {
  const n = chars.length || 1;
  chars.forEach((el, i) => {
    const t = clamp((p * (1 + spread) - i / n) / spread);
    let op = 1, col: RGB, blur = 0;
    if (t < 0.35) {
      const k = t / 0.35;
      op = k; col = ghost; blur = 8 - 6.5 * k;
    } else if (t < 0.7) {
      const k = (t - 0.35) / 0.35;
      col = mix(ghost, accent, k); blur = 1.5 * (1 - k);
    } else {
      col = mix(accent, fin, (t - 0.7) / 0.3);
    }
    el.style.opacity = String(op);
    el.style.color = rgb(col);
    el.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none";
  });
}

function Split({ lines }: { lines: string[] }) {
  return (
    <>
      <span className="sr-only">{lines.join(" ")}</span>
      <span aria-hidden>
        {lines.map((line, li) => (
          <span key={li}>
            {line.split(" ").map((w, wi) => (
              <span key={wi}>
                <span className="inline-block whitespace-nowrap">
                  {[...w].map((c, ci) => (
                    <span key={ci} data-ch data-reveal className="inline-block" style={{ opacity: 0 }}>
                      {c}
                    </span>
                  ))}
                </span>{" "}
              </span>
            ))}
            {li < lines.length - 1 && <br className="max-md:hidden" />}
          </span>
        ))}
      </span>
    </>
  );
}

const langkah = [
  { t: "Tulis kebutuhanmu", d: "Mapel, jenjang, budget, jadwal, atau kebutuhan khusus anak. Urutan bebas." },
  { t: "Pilih dari daftar pendek", d: "Tiap tentor datang dengan skor dan alasan kenapa dia cocok." },
  { t: "Coba satu sesi", d: "Kalau cocok lanjut. Laporan dan rencana belajar menyusul tiap pekan." },
];

export function HomeStory() {
  const noMotion = useNoMotion();
  const stmtSec = useRef<HTMLElement>(null);
  const stmt = useRef<HTMLParagraphElement>(null);
  const split = useRef<HTMLElement>(null);
  const h2 = useRef<HTMLHeadingElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const vis = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sChars = Array.from(stmt.current?.querySelectorAll<HTMLElement>("[data-ch]") ?? []);
    const dChars = Array.from(h2.current?.querySelectorAll<HTMLElement>("[data-ch]") ?? []);
    const root = document.documentElement;
    let raf = 0;

    const update = () => {
      raf = 0;
      const cs = getComputedStyle(root);
      const ink = hex(cs.getPropertyValue("--ink"), [23, 27, 38]);
      const paper = hex(cs.getPropertyValue("--paper"), [251, 251, 248]);
      const accent = hex(cs.getPropertyValue("--reveal-accent"), [63, 124, 255]);
      const vh = window.innerHeight;

      let pS = 1, pD = 1, rise = 0, rowOn = true, scale = 1;
      if (!noMotion) {
        const r = stmtSec.current!.getBoundingClientRect();
        const pin = clamp(-r.top / Math.max(1, r.height - vh));
        pS = clamp((pin - 0.08) / 0.62);
        const s = clamp(pin / 0.16);
        rise = 0.2 * (1 - s) * (1 - s) * vh;
        const top = split.current!.getBoundingClientRect().top;
        pD = clamp((0.8 - top / vh) / 0.65);
        rowOn = pD > 0.92;
        scale = 1.08 - 0.08 * clamp(1 - top / vh);
      }
      paint(sChars, pS, 0.16, ink, accent, paper);
      paint(dChars, pD, 0.35, [255, 255, 255], [143, 230, 244], [92, 111, 146]);
      if (stmt.current) stmt.current.style.transform = `translateY(${rise}px)`;
      if (row.current) row.current.dataset.on = rowOn ? "1" : "0";
      if (vis.current) vis.current.style.transform = `scale(${scale})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [noMotion]);

  return (
    <>
      {/* ---- Pernyataan: teks terungkap huruf demi huruf saat scroll ---- */}
      <section ref={stmtSec} className="statement" aria-label="Tentang TentorKeun">
        <div className="pin">
          <p ref={stmt} className="stmt text-ink">
            <Split
              lines={[
                "Tulis saja kebutuhan belajarmu, pakai kata-katamu sendiri.",
                "Kami tunjukkan tentor yang paling pas dan alasannya.",
                "Setelah sesi berjalan, laporan dikirim tiap pekan",
                "supaya kelihatan apa yang sudah naik.",
              ]}
            />
          </p>
        </div>
      </section>

      {/* ---- Panel gelap ---- */}
      <section ref={split} className="split">
        <div className="relative px-[var(--gut)] pb-16 md:pb-0">
          <span aria-hidden className="absolute inset-y-0 w-px bg-white/15 max-md:hidden" style={{ left: "var(--gut)" }} />
          <h2 ref={h2} className="split-h2 text-white">
            <Split lines={["Dari satu cerita", "sampai jadwal pertama"]} />
          </h2>
          <div ref={row} data-reveal data-on="0" className="story-row">
            <div>
              <h3 className="text-[clamp(17px,1.4vw,21px)] font-medium text-white">Cara kerjanya</h3>
            </div>
            <p className="max-w-[22em] text-[clamp(13px,1.1vw,16px)] leading-[1.45] text-white/70">
              <strong className="font-medium text-white">Kamu tidak perlu membuka profil tentor satu per satu.</strong>{" "}
              Kami menyaring dari ceritamu, kamu memilih dari daftar pendek, lalu sesi pertama dijadwalkan.
            </p>
          </div>
        </div>

        <div className="split-visual">
          <div ref={vis} className="split-visual-inner">
            <ol className="relative mx-auto flex max-w-sm flex-col gap-4 px-5 py-12 md:py-0">
              {langkah.map((l, i) => (
                <li
                  key={l.t}
                  className="rounded-2xl border border-white/15 bg-white/[0.07] p-5 text-white"
                  style={{ transform: `translateX(${i % 2 ? 18 : -10}px) rotate(${i === 1 ? 1.2 : i === 2 ? -1 : 0}deg)` }}
                >
                  <p className="font-display text-lg font-semibold">{l.t}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/70">{l.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
