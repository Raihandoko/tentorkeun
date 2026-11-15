"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { buttonClass } from "@/components/ui";
import { ClipWords, CountUp, DotsIndicator, ScoreBar, easeOutExpo, spring, useNoMotion } from "@/components/motion";
import { Avatar } from "@/components/tutor-card";

const skenario = [
  {
    teks: "Anak saya kelas 9, butuh tentor matematika online. Budget 200 ribu, lebih nyaman dengan tentor perempuan yang sabar.",
    hasil: [
      { nama: "Dina Maharani, S.Pd.", skor: 92, alasan: "Mapel dan jenjang pas, Rp180 ribu per sesi masuk budget." },
      { nama: "Yoga Perkasa, S.Pd.", skor: 78, alasan: "Kuat di matematika dan fisika, sesi daring tersedia." },
    ],
  },
  {
    teks: "Mau ikut UTBK tahun depan, butuh tentor fisika dan matematika. Bisa online, sekitar 200 ribu per sesi.",
    hasil: [
      { nama: "Rizky Pratama, S.Si.", skor: 90, alasan: "Fokus persiapan UTBK, jadwal malam tersedia." },
      { nama: "Yoga Perkasa, S.Pd.", skor: 84, alasan: "Terbiasa membimbing siswa SMA kelas 12." },
    ],
  },
  {
    teks: "Anak kelas 2 SD belum lancar membaca, ada disleksia. Cari tentor bersertifikat ABK, bisa ke rumah di Bekasi.",
    hasil: [
      { nama: "Nurhayati, S.Pd.", skor: 95, alasan: "Bersertifikat ABK, berpengalaman dengan disleksia." },
      { nama: "Dina Maharani, S.Pd.", skor: 70, alasan: "Mengajar calistung, belum bersertifikat ABK." },
    ],
  },
];

const TYPE_MS = 28;
const READ_PAUSE = 2500;

function HeroDemo() {
  const noMotion = useNoMotion();
  const [idx, setIdx] = useState(0);
  const [chars, setChars] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const typed = skenario[idx].teks;
  const shown = noMotion ? typed.length : chars;
  const done = shown >= typed.length;
  const stopped = noMotion || paused || hover;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Ketik huruf demi huruf */
  useEffect(() => {
    if (stopped || done) return;
    timer.current = setTimeout(() => setChars((c) => c + 1), TYPE_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [chars, stopped, done, noMotion, typed.length]);

  /* Pindah skenario hanya setelah ketikan selesai + jeda baca */
  useEffect(() => {
    if (stopped || !done) return;
    const t = setTimeout(() => {
      setIdx((i) => (i + 1) % skenario.length);
      setChars(0);
    }, READ_PAUSE + 1500);
    return () => clearTimeout(t);
  }, [stopped, done, idx]);

  function pick(i: number) {
    setIdx(i);
    setChars(0);
  }

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className="relative"
    >
      <div className="rounded-3xl border border-line bg-card p-5 shadow-[0_24px_60px_-30px_rgba(11,93,107,0.3)] sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-ink">Contoh hasil</p>
          {!noMotion && (
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-pressed={paused}
              className="btn-press inline-flex items-center gap-1.5 rounded-md border border-ink/25 px-2.5 py-1 text-xs font-semibold text-ink hover:border-ink"
            >
              {paused ? <Play size={12} aria-hidden /> : <Pause size={12} aria-hidden />}
              {paused ? "Putar demo" : "Jeda demo"}
            </button>
          )}
        </div>

        {/* Teks lengkap untuk screen reader; animasi ketik disembunyikan */}
        <p className="sr-only">Contoh kebutuhan: {skenario[idx].teks}</p>
        <div aria-hidden className="mt-4 min-h-[6rem] border-l-2 border-accent pl-4 text-[15px] leading-relaxed text-ink">
          {typed.slice(0, shown)}
          {!noMotion && !done && <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 bg-accent" />}
        </div>

        <div aria-hidden className="mt-4 min-h-[14rem] sm:min-h-[13.5rem]">
          <AnimatePresence mode="wait">
            {done && (
              <motion.div
                data-reveal
                key={idx}
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.96 }}
                transition={{ duration: 0.25 }}
              >
                {skenario[idx].hasil.map((t, i) => (
                  <motion.div
                    data-reveal
                    key={t.nama}
                    className="rounded-xl border border-line bg-paper p-4"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...spring.rise, delay: i * 0.18 }}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar nama={t.nama} size={36} />
                      <p className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">{t.nama}</p>
                      <p className="num text-sm font-bold text-accent">
                        {noMotion ? t.skor : <CountUp value={t.skor} />}/100
                      </p>
                    </div>
                    <div className="mt-2.5">
                      <ScoreBar value={t.skor} />
                    </div>
                    <p className="mt-2 text-[13px] leading-relaxed text-muted">{t.alasan}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <DotsIndicator count={skenario.length} active={idx} onSelect={pick} label="Contoh kebutuhan" />
          <p className="text-xs text-muted">Skor di sini hanya ilustrasi.</p>
        </div>
      </div>
    </div>
  );
}

export function HomeHero() {
  const [teks, setTeks] = useState("");
  /* Bila tirai intro aktif, koreografi hero mulai setelah tirai naik. Hanya mengubah delay, bukan markup. */
  const [base] = useState(() =>
    typeof document !== "undefined" && document.documentElement.dataset.intro === "1" ? 1.5 : 0,
  );

  const href = teks.trim().length > 0 ? `/ajukan?teks=${encodeURIComponent(teks.trim())}` : "/ajukan";

  return (
    <section className="relative">
      <div className="relative mx-auto grid w-full max-w-6xl items-start gap-12 px-5 pb-16 pt-8 sm:px-8 sm:pb-24 sm:pt-12 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div>
          <ClipWords
            as="h1"
            immediate
            delay={base}
            text="Tentor yang cocok dengan cara belajarmu."
            className="max-w-xl text-[clamp(2.25rem,6vw,3.75rem)] font-bold leading-[1.05] text-ink"
          />

          <motion.p
            data-reveal
            className="mt-5 max-w-lg text-lg leading-relaxed text-muted"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring.rise, delay: base + 0.5 }}
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
            transition={{ ...spring.rise, delay: base + 0.65 }}
          >
            <label htmlFor="hero-teks" className="mb-2 block text-sm font-semibold text-ink">
              Kebutuhan belajarmu
            </label>
            <div className="ink-field">
              <textarea
                id="hero-teks"
                name="teks"
                rows={3}
                value={teks}
                onChange={(e) => setTeks(e.target.value)}
                placeholder="Contoh: tentor matematika SMP, online, budget 200 ribu."
                className="w-full resize-none rounded-2xl border border-ink/20 bg-card px-4 py-3 text-base text-ink placeholder:text-muted focus:border-transparent focus:outline-none"
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Link href={href} className={`${buttonClass("cta")} !py-3.5 !pl-6 text-base`}>
                Cari tentor
              </Link>
              <Link href="/tentor" className={`${buttonClass("secondary")} !py-3.5 text-base`}>
                Lihat katalog
              </Link>
            </div>
          </motion.form>

          <motion.dl
            data-reveal
            className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: easeOutExpo, delay: base + 0.9 }}
          >
            {[
              { v: 16, d: 0, s: "+", l: "tentor terverifikasi" },
              { v: 4.8, d: 1, s: "", l: "rating rata-rata" },
              { v: 5, d: 0, s: "", l: "jenjang, TK sampai kuliah" },
            ].map((x) => (
              <div key={x.l}>
                <dt className="text-2xl font-bold text-ink">
                  <CountUp value={x.v} decimals={x.d} suffix={x.s} />
                </dt>
                <dd className="mt-0.5 text-xs text-muted">{x.l}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          data-reveal
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring.rise, delay: base + 0.8 }}
          className="relative lg:mt-8"
        >
          <span className="tape absolute -top-3 right-6 z-10 rounded-xl bg-stabilo px-3 py-1 text-xs font-bold text-[#16211e]">
            Tiap hasil ada alasannya
          </span>
          <HeroDemo />
        </motion.div>
      </div>
    </section>
  );
}
