"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { ArrowRight, Check, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui";
import { ClipWords, CountUp, Inview, ScoreBar, spring, useNoMotion } from "@/components/motion";
import { Avatar } from "@/components/tutor-card";

/* =====================================================================
   1. Alur: tulisan bebas -> dibaca AI -> jadi kriteria pencarian
   ===================================================================== */

const ROW_H = 56;
const ROW_GAP = 12;
const FLOW_H = 5 * ROW_H + 4 * ROW_GAP;
const MID = FLOW_H / 2;
const rowY = (i: number) => i * (ROW_H + ROW_GAP) + ROW_H / 2;

const kiri = [
  "matematika SMP, kelas 9",
  "budget sekitar 200 ribu per sesi",
  "anak susah fokus, cari yang sabar",
  "ada disleksia, butuh tentor ABK",
  "online, malam hari, daerah Bekasi",
];
const kanan = [
  { t: "Mapel dan jenjang", sub: "Matematika · SMP" },
  { t: "Budget", sub: "Maksimal Rp200 ribu per sesi" },
  { t: "Gaya belajar", sub: "Utamakan tentor yang sabar" },
  { t: "Kebutuhan khusus", sub: "Hanya yang bersertifikat ABK" },
  { t: "Jadwal dan lokasi", sub: "Daring · malam · Bekasi" },
];

export function FlowSection() {
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, { margin: "-10% 0px -10% 0px" });
  const noMotion = useNoMotion();
  const [active, setActive] = useState(0);
  const [hold, setHold] = useState(false);

  useEffect(() => {
    if (noMotion || hold || !inView) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % kiri.length), 2800);
    return () => clearTimeout(t);
  }, [active, noMotion, hold, inView]);

  return (
    <div ref={wrap} onMouseLeave={() => setHold(false)}>
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-x-0 gap-y-6 md:grid-cols-[1fr_72px_208px_72px_1fr] lg:grid-cols-[1fr_96px_220px_96px_1fr]">
        {/* Kolom label */}
        <p className="eyebrow md:self-end">Yang kamu tulis</p>
        <span className="hidden md:block" />
        <p className="eyebrow hidden text-center md:block">Dibaca AI</p>
        <span className="hidden md:block" />
        <p className="eyebrow hidden md:block md:self-end">Jadi kriteria pencarian</p>

        {/* Kiri */}
        <ul className="flex flex-col" style={{ gap: ROW_GAP }}>
          {kiri.map((k, i) => (
            <li key={k}>
              <button
                type="button"
                onClick={() => setActive(i)}
                onMouseEnter={() => {
                  setHold(true);
                  setActive(i);
                }}
                onFocus={() => {
                  setHold(true);
                  setActive(i);
                }}
                aria-pressed={i === active}
                style={{ height: ROW_H }}
                className={`relative flex w-full items-center rounded-2xl border px-4 text-left text-sm leading-tight transition-colors duration-300 ${
                  i === active
                    ? "border-accent bg-accent-soft font-semibold text-ink"
                    : "border-line bg-card text-ink hover:border-line-strong"
                }`}
              >
                <span className="line-clamp-2">{k}</span>
                <span
                  aria-hidden
                  className={`absolute -right-1.5 top-1/2 hidden h-3 w-3 -translate-y-1/2 rounded-full border-2 bg-card transition-colors duration-300 md:block ${
                    i === active ? "border-accent" : "border-line-strong"
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>

        {/* Garis kiri -> tengah */}
        <svg
          aria-hidden
          viewBox={`0 0 100 ${FLOW_H}`}
          preserveAspectRatio="none"
          className="hidden w-full md:block"
          style={{ height: FLOW_H }}
        >
          {kiri.map((_, i) => (
            <path
              key={i}
              d={`M0 ${rowY(i)} C 55 ${rowY(i)}, 45 ${MID}, 100 ${MID}`}
              fill="none"
              stroke="var(--line)"
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <AnimatePresence>
            <motion.path
              key={active}
              data-reveal
              d={`M0 ${rowY(active)} C 55 ${rowY(active)}, 45 ${MID}, 100 ${MID}`}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={2.5}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            />
          </AnimatePresence>
        </svg>

        {/* Tengah */}
        <div className="relative mx-auto w-full max-w-[220px] rounded-3xl border border-line bg-card p-5 text-center shadow-[0_0_0_8px_color-mix(in_srgb,var(--stabilo)_22%,transparent),0_24px_48px_-28px_rgba(22,33,30,0.4)]">
          <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-accent font-display text-sm font-extrabold text-accent-ink">
            TK
          </span>
          <p className="mt-3 text-sm font-bold text-ink">TentorKeun AI</p>
          <p className="mt-0.5 flex items-center justify-center gap-1 text-xs text-muted">
            membaca maksudnya
            <span aria-hidden className="inline-flex gap-0.5">
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="h-1 w-1 animate-pulse rounded-full bg-muted"
                  style={{ animationDelay: `${d * 0.2}s` }}
                />
              ))}
            </span>
          </p>
        </div>

        {/* Garis tengah -> kanan */}
        <svg
          aria-hidden
          viewBox={`0 0 100 ${FLOW_H}`}
          preserveAspectRatio="none"
          className="hidden w-full md:block"
          style={{ height: FLOW_H }}
        >
          {kanan.map((_, i) => (
            <path
              key={i}
              d={`M0 ${MID} C 55 ${MID}, 45 ${rowY(i)}, 100 ${rowY(i)}`}
              fill="none"
              stroke="var(--line)"
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <AnimatePresence>
            <motion.path
              key={active}
              data-reveal
              d={`M0 ${MID} C 55 ${MID}, 45 ${rowY(active)}, 100 ${rowY(active)}`}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={2.5}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
            />
          </AnimatePresence>
        </svg>

        {/* Kanan */}
        <ul className="flex flex-col" style={{ gap: ROW_GAP }}>
          {kanan.map((k, i) => (
            <li
              key={k.t}
              style={{ height: ROW_H }}
              className={`relative flex flex-col justify-center rounded-2xl border px-4 transition-colors duration-300 ${
                i === active ? "border-accent bg-card shadow-[0_14px_30px_-20px_var(--accent)]" : "border-line bg-card"
              }`}
              aria-current={i === active ? "true" : undefined}
            >
              <span
                aria-hidden
                className={`absolute -left-1.5 top-1/2 hidden h-3 w-3 -translate-y-1/2 rounded-full border-2 bg-card transition-colors duration-300 md:block ${
                  i === active ? "border-accent" : "border-line-strong"
                }`}
              />
              <span className="flex items-center gap-1.5 text-sm font-bold text-ink">
                {k.t}
                {i === active && <Check size={14} className="text-lulus" aria-hidden />}
              </span>
              <span className={`text-xs leading-tight transition-colors duration-300 ${i === active ? "text-accent" : "text-muted"}`}>
                {k.sub}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* =====================================================================
   2. Masalah -> jawaban, stepper menempel di kiri saat halaman di-scroll
   ===================================================================== */

function MockCard({ children, tag, floatTag }: { children: ReactNode; tag: string; floatTag?: string }) {
  return (
    <div className="tint-block rounded-3xl p-5 sm:p-9">
      <div className="relative mx-auto max-w-md">
        <div className="rounded-2xl border border-line bg-card p-5 shadow-[0_24px_48px_-30px_rgba(22,33,30,0.35)]">
          <div className="mb-3 flex items-center justify-between gap-3">
            <Badge tone="neutral">Contoh ilustrasi</Badge>
            <span className="text-xs font-semibold text-muted">{tag}</span>
          </div>
          {children}
        </div>
        {floatTag && (
          <motion.span
            data-reveal
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ ...spring.pop, delay: 0.5 }}
            className="absolute -bottom-4 right-3 inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 text-xs font-semibold text-ink shadow-[0_12px_24px_-14px_rgba(22,33,30,0.45)]"
          >
            <Check size={13} className="text-lulus" aria-hidden /> {floatTag}
          </motion.span>
        )}
      </div>
    </div>
  );
}

function Row({ children, i }: { children: ReactNode; i: number }) {
  return (
    <motion.li
      data-reveal
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ ...spring.rise, delay: 0.15 + i * 0.12 }}
      className="flex items-start gap-2.5 border-t border-line py-2.5 text-[13.5px] leading-snug text-ink first:border-t-0"
    >
      {children}
    </motion.li>
  );
}

function Switch({ label, delay }: { label: string; delay: number }) {
  return (
    <li className="flex items-center justify-between gap-3 border-t border-line py-3 text-sm font-semibold text-ink first:border-t-0">
      {label}
      <motion.span
        data-reveal
        aria-hidden
        className="flex h-6 w-11 items-center rounded-full p-0.5"
        initial={{ backgroundColor: "rgba(120,135,130,0.35)" }}
        whileInView={{ backgroundColor: "var(--accent)" }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay }}
      >
        <motion.span
          className="h-5 w-5 rounded-full bg-white shadow"
          initial={{ x: 0 }}
          whileInView={{ x: 20 }}
          viewport={{ once: true }}
          transition={{ ...spring.pop, delay }}
        />
      </motion.span>
    </li>
  );
}

const langkah = [
  {
    masalah: "Susah menilai tentor",
    judul: "Tentor sudah dicek duluan.",
    desc: "CV dan portofolio disaring sebelum tentor tampil. Admin mendapat ringkasan, catatan yang perlu dikonfirmasi, dan pertanyaan untuk wawancara.",
    href: "/verifikasi",
    cta: "Lihat cara verifikasi",
    visual: (
      <MockCard tag="Verifikasi tentor" floatTag="Disaring sebelum tampil">
        <p className="text-sm font-bold text-ink">Pendaftar baru: ringkasan CV</p>
        <ul className="mt-2">
          <Row i={0}>
            <Check size={15} className="mt-0.5 shrink-0 text-lulus" aria-hidden /> Pendidikan: S.Pd. Matematika
          </Row>
          <Row i={1}>
            <Check size={15} className="mt-0.5 shrink-0 text-lulus" aria-hidden /> Portofolio: pembinaan olimpiade
          </Row>
          <Row i={2}>
            <TriangleAlert size={15} className="mt-0.5 shrink-0 text-peringatan" aria-hidden /> Perlu dikonfirmasi: lama
            mengajar privat
          </Row>
        </ul>
      </MockCard>
    ),
  },
  {
    masalah: "Bingung mana yang cocok",
    judul: "Hasil dengan alasan, bukan sekadar daftar.",
    desc: "Tulis mapel, jenjang, budget, dan jadwal. Kamu dapat peringkat tentor, masing-masing dengan alasan kenapa dia cocok.",
    href: "/ajukan",
    cta: "Coba cari tentor",
    visual: (
      <MockCard tag="Pencocokan" floatTag="Ada alasannya">
        <div className="flex items-center gap-3">
          <Avatar nama="Dina Maharani" size={38} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-ink">Dina Maharani, S.Pd.</p>
            <p className="text-xs text-muted">Matematika · SMP, SMA</p>
          </div>
          <p className="num text-lg font-extrabold text-accent">
            <CountUp value={92} />
          </p>
        </div>
        <div className="mt-3">
          <ScoreBar value={92} />
        </div>
        <ul className="mt-3">
          <Row i={0}>
            <Check size={15} className="mt-0.5 shrink-0 text-lulus" aria-hidden /> Mapel dan jenjang pas
          </Row>
          <Row i={1}>
            <Check size={15} className="mt-0.5 shrink-0 text-lulus" aria-hidden /> Rp180 ribu per sesi, masuk budget
          </Row>
        </ul>
      </MockCard>
    ),
  },
  {
    masalah: "Tidak tahu perkembangan anak",
    judul: "Laporan yang bisa dibaca orang tua.",
    desc: "Catatan sesi dari tentor diubah jadi laporan rapi: apa yang sudah dikuasai, bagian yang perlu dilatih, dan saran untuk pekan depan. Ada juga rencana belajar mingguan.",
    href: "/lapor",
    cta: "Buat laporan",
    visual: (
      <MockCard tag="Laporan pekan ini" floatTag="Untuk orang tua">
        <dl className="text-[13.5px] leading-snug">
          {[
            ["Sudah dikuasai", "Persamaan linear satu variabel"],
            ["Perlu dilatih", "Soal cerita dan membaca soal pelan-pelan"],
            ["Saran pekan depan", "20 menit latihan soal cerita tiap hari"],
          ].map(([k, v], i) => (
            <motion.div
              key={k}
              data-reveal
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...spring.rise, delay: 0.15 + i * 0.12 }}
              className="border-t border-line py-2.5 first:border-t-0"
            >
              <dt className="text-xs font-semibold text-muted">{k}</dt>
              <dd className="mt-0.5 font-semibold text-ink">{v}</dd>
            </motion.div>
          ))}
        </dl>
      </MockCard>
    ),
  },
  {
    masalah: "Kebutuhan khusus kurang terlayani",
    judul: "Ramah untuk siswa ABK.",
    desc: "Filter tentor bersertifikat ABK, materi yang disederhanakan, mode kontras tinggi, font ramah disleksia, dan bacaan suara.",
    href: "/aksesibilitas",
    cta: "Lihat fitur aksesibilitas",
    visual: (
      <MockCard tag="Mode belajar" floatTag="Bisa diatur sendiri">
        <ul>
          <Switch label="Kontras tinggi" delay={0.2} />
          <Switch label="Font ramah disleksia" delay={0.4} />
          <Switch label="Bacaan suara" delay={0.6} />
          <Switch label="Kurangi animasi" delay={0.8} />
        </ul>
      </MockCard>
    ),
  },
];

export function ProblemSteps() {
  const noMotion = useNoMotion();
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        });
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  function go(i: number) {
    refs.current[i]?.scrollIntoView({ behavior: noMotion ? "auto" : "smooth", block: "center" });
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
      {/* Stepper */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <h2 className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl">Begini TentorKeun menjawabnya.</h2>
        <p className="mt-2 text-muted">Empat masalah yang sering muncul, satu per satu.</p>

        <ol className="mt-8 hidden lg:block">
          {langkah.map((l, i) => (
            <li key={l.masalah} className="relative pb-6 last:pb-0">
              {i < langkah.length - 1 && (
                <span aria-hidden className="absolute left-[15px] top-9 h-[calc(100%-2.25rem)] w-px bg-line" />
              )}
              <button
                type="button"
                onClick={() => go(i)}
                aria-current={i === active ? "step" : undefined}
                className="group/btn flex w-full items-center gap-3 text-left"
              >
                <span
                  className={`num relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-colors duration-300 ${
                    i === active
                      ? "border-accent bg-accent text-accent-ink"
                      : "border-line-strong/60 bg-card text-muted group-hover/btn:border-ink"
                  }`}
                >
                  {i + 1}
                </span>
                <span
                  className={`text-[15px] font-semibold transition-colors duration-300 ${
                    i === active ? "text-ink" : "text-muted group-hover/btn:text-ink"
                  }`}
                >
                  {l.masalah}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      {/* Blok jawaban */}
      <div>
        {langkah.map((l, i) => (
          <article
            key={l.masalah}
            data-i={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="scroll-mt-28 pb-14 last:pb-0 lg:pb-24"
          >
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-accent lg:hidden">
              <span className="num flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-ink">
                {i + 1}
              </span>
              {l.masalah}
            </p>
            <Inview y={36}>{l.visual}</Inview>
            <Inview index={1} y={20}>
              <h3 className="mt-9 text-2xl font-extrabold leading-snug text-ink sm:text-[1.7rem]">{l.judul}</h3>
              <p className="mt-2 max-w-lg text-base leading-relaxed text-muted">{l.desc}</p>
              <Link
                href={l.href}
                className="group/btn mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline underline-offset-4"
              >
                {l.cta}
                <ArrowRight size={15} className="arrow-nudge" aria-hidden />
              </Link>
            </Inview>
          </article>
        ))}
      </div>
    </div>
  );
}

/* =====================================================================
   3. Pita aksen dengan titik-titik yang terisi saat masuk layar
   ===================================================================== */

function DotGrid({ total, filled, cols = 8 }: { total: number; filled: number; cols?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  return (
    <div
      ref={ref}
      aria-hidden
      className="grid shrink-0 gap-1.5"
      style={{ gridTemplateColumns: `repeat(${cols}, 10px)` }}
    >
      {Array.from({ length: total }, (_, i) => (
        <motion.span
          key={i}
          data-reveal
          className={`h-2.5 w-2.5 rounded-full ${i < filled ? "bg-accent-ink" : "border border-accent-ink/50"}`}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={inView ? { opacity: 1, scale: 1 } : undefined}
          transition={{ ...spring.pop, delay: i * 0.035 }}
        />
      ))}
    </div>
  );
}

export function StatBand({ total, abk, rating }: { total: number; abk: number; rating: number }) {
  return (
    <div className="rounded-[1.75rem] bg-accent px-6 py-12 text-accent-ink sm:rounded-[2.25rem] sm:px-12 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <ClipWords
          text="Cari tentor tanpa menebak-nebak."
          className="max-w-2xl text-3xl font-extrabold leading-tight sm:text-5xl"
        />

        <div className="mt-10 grid gap-10 sm:grid-cols-2 sm:gap-12">
          <Inview index={1}>
            <div className="flex items-center gap-5">
              <DotGrid total={total} filled={total} />
              <div>
                <p className="num text-5xl font-extrabold leading-none sm:text-6xl">
                  <CountUp value={total} />
                </p>
                <p className="mt-2 text-sm leading-snug text-accent-ink/90 sm:text-base">tentor terverifikasi di katalog</p>
              </div>
            </div>
          </Inview>
          <Inview index={2}>
            <div className="flex items-center gap-5">
              <DotGrid total={total} filled={abk} />
              <div>
                <p className="num text-5xl font-extrabold leading-none sm:text-6xl">
                  <CountUp value={abk} />
                  <span className="text-2xl font-bold sm:text-3xl"> dari {total}</span>
                </p>
                <p className="mt-2 text-sm leading-snug text-accent-ink/90 sm:text-base">bersertifikat untuk siswa ABK</p>
              </div>
            </div>
          </Inview>
        </div>

        <Inview index={3}>
          <p className="mt-10 border-t border-accent-ink/25 pt-5 text-xs text-accent-ink/85">
            Rata-rata rating tentor di katalog: <span className="num font-bold">{rating.toFixed(1).replace(".", ",")}</span>. Angka dihitung dari
            data demo TentorKeun, bukan hasil survei.
          </p>
        </Inview>
      </div>
    </div>
  );
}
