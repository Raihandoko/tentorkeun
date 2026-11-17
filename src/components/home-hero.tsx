"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { Check, Pause, Play, ShieldCheck } from "lucide-react";
import { buttonClass } from "@/components/ui";
import { ClipWords, CountUp, ParallaxOut, ScoreBar, ScrollPanel, easeOutExpo, spring, useNoMotion } from "@/components/motion";
import { Avatar } from "@/components/tutor-card";

const skenario = [
  {
    chip: "Matematika SMP",
    teks: "Anak saya kelas 9, butuh tentor matematika online. Budget 200 ribu, lebih nyaman dengan tentor perempuan yang sabar.",
    hasil: [
      { nama: "Dina Maharani, S.Pd.", skor: 92, alasan: "Mapel dan jenjang pas, Rp180 ribu per sesi masuk budget." },
      { nama: "Yoga Perkasa, S.Pd.", skor: 78, alasan: "Kuat di matematika dan fisika, sesi daring tersedia." },
    ],
  },
  {
    chip: "UTBK Fisika",
    teks: "Mau ikut UTBK tahun depan, butuh tentor fisika dan matematika. Bisa online, sekitar 200 ribu per sesi.",
    hasil: [
      { nama: "Rizky Pratama, S.Si.", skor: 90, alasan: "Fokus persiapan UTBK, jadwal malam tersedia." },
      { nama: "Yoga Perkasa, S.Pd.", skor: 84, alasan: "Terbiasa membimbing siswa SMA kelas 12." },
    ],
  },
  {
    chip: "Anak disleksia",
    teks: "Anak kelas 2 SD belum lancar membaca, ada disleksia. Cari tentor bersertifikat ABK, bisa ke rumah di Bekasi.",
    hasil: [
      { nama: "Nurhayati, S.Pd.", skor: 95, alasan: "Bersertifikat ABK, berpengalaman dengan disleksia." },
      { nama: "Dina Maharani, S.Pd.", skor: 70, alasan: "Mengajar calistung, belum bersertifikat ABK." },
    ],
  },
];

const AFTER_DONE_MS = 5200;
const TYPE_MS_PER_CHAR = 16;

/* Teks yang diketik huruf demi huruf. Sisa teks tetap ada (tak terlihat) supaya tinggi gelembung tidak melompat. */
function Typed({ text, run }: { text: string; run: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(text.length, Math.floor((t - t0) / TYPE_MS_PER_CHAR));
      setN(k);
      if (k < text.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, run]);
  return (
    <>
      {text.slice(0, n)}
      <span className="invisible">{text.slice(n)}</span>
    </>
  );
}

/* Urutan tampil: 0 kosong, 1 mengetik, 2 AI berpikir, 3 hasil muncul satu per satu,
   4 pop-up kecocokan tertinggi, 5 pop-up terverifikasi */
function HeroPhone() {
  const noMotion = useNoMotion();
  const [idx, setIdx] = useState(0);
  const [run, setRun] = useState(0);
  const [rawStep, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const first = useRef(true);
  const root = useRef<HTMLDivElement>(null);
  // Urutan baru mulai setelah ponsel benar-benar terlihat (penting di layar HP, ponsel ada di bawah)
  const seen = useInView(root, { once: true, amount: 0.3 });
  const step = noMotion ? 5 : rawStep;
  const stopped = noMotion || paused || hover;
  const cur = skenario[idx];

  // Jalankan urutan animasi tiap kali contoh berganti atau diulang
  useEffect(() => {
    if (noMotion || !seen) return;
    const t0 = first.current ? 1100 : 550;
    first.current = false;
    const typed = t0 + 120 + skenario[idx].teks.length * TYPE_MS_PER_CHAR;
    const think = typed + 450;
    const results = think + 900;
    const score = results + 1100;
    const verified = score + 600;
    const timers = [
      setTimeout(() => setStep(0), 0),
      setTimeout(() => setStep(1), t0),
      setTimeout(() => setStep(2), typed + 120),
      setTimeout(() => setStep(3), results),
      setTimeout(() => setStep(4), score),
      setTimeout(() => setStep(5), verified),
    ];
    return () => timers.forEach(clearTimeout);
  }, [idx, run, noMotion, seen]);

  // Setelah semuanya tampil sebentar, pindah ke contoh berikutnya
  useEffect(() => {
    if (step < 5 || stopped) return;
    const t = setTimeout(() => setIdx((i) => (i + 1) % skenario.length), AFTER_DONE_MS);
    return () => clearTimeout(t);
  }, [step, stopped, idx, run]);

  function pick(i: number) {
    if (i === idx) setRun((r) => r + 1);
    else setIdx(i);
  }

  return (
    <div
      ref={root}
      className="relative mx-auto w-full max-w-[420px] lg:max-w-none"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink">Coba contoh, lihat hasilnya</p>
        {!noMotion && (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            className="btn-press inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-muted hover:bg-ink/5 hover:text-ink"
          >
            {paused ? <Play size={12} aria-hidden /> : <Pause size={12} aria-hidden />}
            {paused ? "Putar demo" : "Jeda demo"}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Contoh kebutuhan">
        {skenario.map((s, i) => (
          <button
            key={s.chip}
            type="button"
            onClick={() => pick(i)}
            aria-pressed={i === idx}
            className={`btn-press rounded-xl border px-3.5 py-2 text-sm font-semibold ${
              i === idx
                ? "border-accent bg-accent-soft text-accent"
                : "border-line bg-card text-ink hover:border-line-strong"
            }`}
          >
            {s.chip}
          </button>
        ))}
      </div>

      <p className="sr-only">Contoh kebutuhan: {cur.teks}</p>

      <div className="relative mt-6 flex justify-center lg:mt-8">
        {/* Pop-up: baru muncul setelah hasil pencocokan tampil */}
        <AnimatePresence>
          {step >= 5 && (
            <motion.div
              key="verifikasi"
              data-reveal
              aria-hidden
              initial={{ opacity: 0, scale: 0.55, y: 16, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.18 } }}
              transition={spring.pop}
              style={{ transformOrigin: "0% 100%" }}
              className="absolute bottom-24 left-0 z-20 w-40 sm:left-2 sm:w-44 xl:-left-2 xl:w-48"
            >
              <div className="float-y-slow rounded-2xl border border-line bg-card p-3 shadow-[0_20px_40px_-24px_rgba(22,33,30,0.45)] sm:p-3.5">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-lulus">
                  <ShieldCheck size={14} aria-hidden /> Terverifikasi
                </p>
                <p className="mt-1.5 text-[12.5px] leading-snug text-muted sm:text-[13px]">
                  CV dan portofolio sudah dicek sebelum tentor tampil.
                </p>
              </div>
            </motion.div>
          )}
          {step >= 4 && (
            <motion.div
              key="skor"
              data-reveal
              aria-hidden
              initial={{ opacity: 0, scale: 0.55, y: -14, rotate: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.18 } }}
              transition={spring.pop}
              style={{ transformOrigin: "100% 0%" }}
              className="absolute right-0 top-24 z-20 w-36 sm:right-2 sm:w-40 xl:-right-2 xl:w-44"
            >
              <div className="float-y rounded-2xl border border-line bg-card p-3 shadow-[0_20px_40px_-24px_rgba(22,33,30,0.45)] sm:p-3.5">
                <p className="text-xs font-semibold text-muted">Kecocokan tertinggi</p>
                <p className="num mt-0.5 text-2xl font-extrabold text-accent">
                  {noMotion ? cur.hasil[0].skor : <CountUp key={`${idx}-${run}`} value={cur.hasil[0].skor} duration={0.8} />}
                  <span className="text-sm font-bold text-muted">/100</span>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ponsel: naik dari bawah saat pertama muncul */}
        <motion.div
          data-reveal
          aria-hidden
          initial={{ opacity: 0, y: 80, scale: 0.92 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ ...spring.soft, delay: 0.25 }}
          className="relative w-[280px] shrink-0 rounded-[2.4rem] border-[7px] border-ink bg-card p-0 shadow-[0_40px_80px_-40px_rgba(22,33,30,0.55)] sm:w-[300px]"
        >
          <div className="absolute left-1/2 top-2 z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-ink" />
          <div className="overflow-hidden rounded-[1.8rem]">
            <div className="flex items-center gap-2.5 border-b border-line px-4 pb-3 pt-9">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent font-display text-xs font-extrabold text-accent-ink">
                TK
              </span>
              <div className="leading-tight">
                <p className="text-sm font-bold text-ink">Pencocokan tentor</p>
                <p className="h-4 overflow-hidden text-[11px] text-muted">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={step === 2 ? "mikir" : step >= 3 ? "selesai" : "siap"}
                      className="block"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                    >
                      {step === 2 ? "sedang mencocokkan…" : step >= 3 ? "selesai" : "TentorKeun"}
                    </motion.span>
                  </AnimatePresence>
                </p>
              </div>
            </div>

            <div className="min-h-[430px] bg-paper px-3.5 py-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${idx}-${run}`}
                  data-reveal
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-3"
                >
                  {step >= 1 && (
                    <motion.div
                      data-reveal
                      initial={{ opacity: 0, y: 14, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={spring.rise}
                      style={{ transformOrigin: "100% 100%" }}
                      className="ml-6 rounded-2xl rounded-tr-md bubble-user px-3.5 py-2.5 text-[12.5px] leading-relaxed text-ink"
                    >
                      <Typed text={cur.teks} run={!noMotion && step >= 1} />
                    </motion.div>
                  )}

                  <AnimatePresence>
                    {step === 2 && (
                      <motion.div
                        key="berpikir"
                        data-reveal
                        initial={{ opacity: 0, y: 8, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                        transition={spring.rise}
                        style={{ transformOrigin: "0% 0%" }}
                        className="inline-flex items-center gap-1 rounded-2xl rounded-tl-md border border-line bg-card px-3.5 py-3"
                      >
                        {[0, 1, 2].map((d) => (
                          <span
                            key={d}
                            className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted"
                            style={{ animationDelay: `${d * 0.15}s` }}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {step >= 3 && (
                    <>
                      <motion.p
                        data-reveal
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={spring.rise}
                        className="text-[12.5px] font-semibold text-ink"
                      >
                        Ketemu {cur.hasil.length} tentor yang cocok:
                      </motion.p>

                      {cur.hasil.map((t, i) => (
                        <motion.div
                          data-reveal
                          key={t.nama}
                          initial={{ opacity: 0, y: 22, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ ...spring.rise, delay: 0.15 + i * 0.35 }}
                          className="rounded-2xl border border-line bg-card p-3"
                        >
                          <div className="flex items-center gap-2.5">
                            <Avatar nama={t.nama} size={32} />
                            <p className="min-w-0 flex-1 truncate text-[13px] font-bold text-ink">{t.nama}</p>
                            <p className="num text-[13px] font-extrabold text-accent">
                              {noMotion ? t.skor : <CountUp value={t.skor} duration={0.9} />}
                            </p>
                          </div>
                          <div className="mt-2">
                            <ScoreBar value={t.skor} />
                          </div>
                          <p className="mt-2 text-[12px] leading-snug text-muted">{t.alasan}</p>
                        </motion.div>
                      ))}
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="border-t border-line bg-card px-3.5 py-3">
              <div className="rounded-full border border-line px-3.5 py-2 text-[12px] text-muted">Tulis kebutuhanmu…</div>
            </div>
          </div>
        </motion.div>
      </div>

      <p className="mt-4 text-center text-xs text-muted">Skor dan nama di atas hanya ilustrasi.</p>
    </div>
  );
}

export function HomeHero() {
  const [teks, setTeks] = useState("");
  const href = teks.trim().length > 0 ? `/ajukan?teks=${encodeURIComponent(teks.trim())}` : "/ajukan";

  return (
    <section className="px-3 pt-1 sm:px-6 sm:pt-2">
      <ScrollPanel mode="out" className="tint-block mx-auto max-w-[1240px] rounded-[1.75rem] sm:rounded-[2.25rem]">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
          <div>
            <ClipWords
              as="h1"
              immediate
              text="Tentor yang cocok dengan cara belajarmu."
              className="max-w-xl text-[clamp(2.4rem,5.6vw,4rem)] font-extrabold leading-[1.04] text-ink"
            />

            <motion.p
              data-reveal
              className="mt-5 max-w-lg text-lg leading-relaxed text-muted"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring.rise, delay: 0.5 }}
            >
              Tulis mapel, jenjang, budget, dan jadwal yang kamu mau. Kamu dapat daftar tentor terverifikasi, masing-masing
              dengan alasan kenapa dia cocok.
            </motion.p>

            <motion.form
              data-reveal
              action="/ajukan"
              onSubmit={(e) => {
                e.preventDefault();
                window.location.assign(href);
              }}
              className="mt-8 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring.rise, delay: 0.65 }}
            >
              <label htmlFor="hero-teks" className="sr-only">
                Kebutuhan belajarmu
              </label>
              <div className="rounded-2xl border border-line-strong bg-card p-2 shadow-[0_18px_40px_-28px_rgba(22,33,30,0.4)] focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15">
                <textarea
                  id="hero-teks"
                  name="teks"
                  rows={2}
                  value={teks}
                  onChange={(e) => setTeks(e.target.value)}
                  placeholder="Contoh: tentor matematika SMP, online, budget 200 ribu."
                  className="w-full resize-none rounded-xl bg-transparent px-3 py-2.5 text-base text-ink placeholder:text-muted focus:outline-none"
                />
                <div className="flex flex-wrap items-center justify-between gap-2 px-1 pb-1">
                  <Link href="/tentor" className="rounded-lg px-2.5 py-2 text-sm font-semibold text-muted hover:text-ink">
                    Atau lihat katalog
                  </Link>
                  <Link href={href} className={`${buttonClass("primary")} group/btn !py-2.5 !pl-5`}>
                    Cari tentor
                    <span aria-hidden className="arrow-nudge">→</span>
                  </Link>
                </div>
              </div>
            </motion.form>

            <motion.ul
              data-reveal
              className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.9 }}
            >
              {["Tentor lolos cek CV dan portofolio", "Setiap hasil ada alasannya"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <Check size={15} className="text-accent" aria-hidden /> {t}
                </li>
              ))}
            </motion.ul>
          </div>

          <ParallaxOut distance={90}>
            <motion.div
              data-reveal
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring.rise, delay: 0.3 }}
            >
              <HeroPhone />
            </motion.div>
          </ParallaxOut>
        </div>
      </ScrollPanel>
    </section>
  );
}
