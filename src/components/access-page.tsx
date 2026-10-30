"use client";

import { useEffect, useRef, useState } from "react";
import { AudioLines, Captions, Loader2, Megaphone, Volume2 } from "lucide-react";
import { useA11y } from "@/components/a11y";
import { Alert, Badge, buttonClass, Textarea } from "@/components/ui";
import type { SimplifyResponse } from "@/lib/ai";

const MODES = [
  { id: "disleksia", nama: "Disleksia", warna: "accent", desc: "Kalimat pendek, bullet, kata umum yang mudah dipindai." },
  { id: "tunanetra", nama: "Tunanetra", warna: "amber", desc: "Struktur rapi berlapis, ramah dibaca screen reader." },
  { id: "tunarungu", nama: "Tunarungu", warna: "rust", desc: "Satu ide per poin, penanda visual, minim ketergantungan audio." },
  { id: "ADHD", nama: "ADHD / fokus", warna: "rust", desc: "Pecah jadi langkah pendek dengan subjudul, minim distraksi." },
  { id: "autisme", nama: "Autisme", warna: "accent", desc: "Instruksi literal, urut, tanpa kiasan atau makna ganda." },
] as const;

const MATERI_CONTOH = `Baiklah anak-anak, hari ini kita akan belajar tentang sumber daya alam. Sumber daya alam adalah segala sesuatu yang berasal dari alam dan bisa dimanfaatkan oleh manusia untuk memenuhi kebutuhannya, baik itu berupa tumbuhan, hewan, maupun bahan tambang yang jumlahnya bisa habis jika kita terlalu boros menggunakannya.`;

const SCRIPT_CAPTION = [
  { teks: "Selamat pagi semua. Hari ini kita belajar pecahan.", dur: 3200 },
  { teks: "Pecahan itu seperti memotong kue menjadi beberapa bagian.", dur: 3600 },
  { teks: "Kalau kue dipotong dua sama besar, setiap bagian adalah satu per dua.", dur: 3800 },
  { teks: "Kita tulis satu per dua sebagai satu di atas, dua di bawah.", dur: 3600 },
  { teks: "Angka di atas disebut pembilang. Angka di bawah disebut penyebut.", dur: 3600 },
  { teks: "Sekarang coba buka buku kalian di halaman 12.", dur: 3200 },
  { teks: "Kita kerjakan tiga soal bersama, pelan-pelan saja.", dur: 3400 },
];

export function AccessPage() {
  const { toggleTts, tts } = useA11y();
  const [mode, setMode] = useState<(typeof MODES)[number]["id"]>("disleksia");
  const [teks, setTeks] = useState(MATERI_CONTOH);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasil, setHasil] = useState<SimplifyResponse | null>(null);

  async function simplify() {
    setError("");
    setLoading(true);
    setHasil(null);
    try {
      const res = await fetch("/api/simplify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teks, mode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal menyederhanakan.");
      setHasil(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* -------- Mode & penyederhanaan -------- */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            aria-pressed={mode === m.id}
            className={`rounded-lg border p-4 text-left transition ${
              mode === m.id ? "border-accent bg-accent-soft" : "border-line bg-card hover:border-ink/25"
            }`}
          >
            <span className={`block text-sm font-semibold ${mode === m.id ? "text-accent" : "text-ink"}`}>
              {m.nama}
            </span>
            <span className="mt-1 block text-xs leading-relaxed text-muted">{m.desc}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-line bg-card p-6">
          <p className="mb-2 text-sm font-semibold text-ink">Materi asli</p>
          <Textarea rows={7} value={teks} onChange={(e) => setTeks(e.target.value)} className="text-[15px] leading-relaxed" />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button onClick={() => void simplify()} disabled={loading || teks.trim().length < 20} className={buttonClass("primary")}>
              {loading ? <><Loader2 size={16} className="animate-spin" aria-hidden /> Menyederhanakan…</> : <>Sederhanakan untuk mode {MODES.find((m) => m.id === mode)?.nama}</>}
            </button>
            <button onClick={toggleTts} disabled={tts} className={buttonClass("secondary")}>
              <Volume2 size={16} aria-hidden /> Bacakan materi
            </button>
          </div>
          {error && <div className="mt-4"><Alert tone="error">{error}</Alert></div>}
        </div>

        <div className="rounded-lg border border-line bg-paper p-6">
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
            <AudioLines size={15} className="text-accent" aria-hidden /> Hasil penyederhanaan
          </p>
          {hasil ? (
            <>
              <pre className="whitespace-pre-wrap rounded-md border border-line bg-card p-4 font-sans text-[15px] leading-loose text-ink">
                {hasil.teks}
              </pre>
              <p className="mt-3 flex items-start gap-2 rounded-md border border-accent/30 bg-accent-soft p-3 text-[13px] text-accent">
                <Megaphone size={14} className="mt-0.5 shrink-0" aria-hidden />
                {hasil.catatan + (hasil.via === "mock" ? " (mode demo)" : "")}
              </p>
            </>
          ) : (
            <p className="rounded-md border border-dashed border-line p-6 text-center text-sm text-muted">
              Hasil penyederhanaan akan muncul di sini.
            </p>
          )}
        </div>
      </div>

      {/* -------- Demo live caption -------- */}
      <div className="mt-14">
        <CaptionDemo />
      </div>

      <p className="mt-10 rounded-md border border-line bg-card p-5 text-sm leading-relaxed text-muted">
        <strong className="text-ink">Catatan kunci bentuk luas:</strong> TentorKeun memagari seluruh pengalaman — pencarian
        dapat disaring hanya ke tentor bersertifikasi ABK, materi bisa disederhanakan per kebutuhan, pembacaan layar (TTS)
        tersedia di semua halaman lewat tombol “Aksesibilitas”, dan sesi daring menyediakan live caption seperti demo di atas.
        Font ramah disleksia & kontras tinggi aktif via toolbar global di kanan bawah.
      </p>
    </div>
  );
}

/* ---------- Demo live caption sesi daring ---------- */
function CaptionDemo() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!playing) return;
    timerRef.current = setTimeout(() => {
      setIdx((i) => (i + 1) % SCRIPT_CAPTION.length);
    }, SCRIPT_CAPTION[idx] ? SCRIPT_CAPTION[idx].dur : 3000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [playing, idx]);

  const progress = ((idx + 1) / SCRIPT_CAPTION.length) * 100;

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-[#12110d]">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <p className="flex items-center gap-2 text-sm font-medium text-white/90">
          <span className="h-2 w-2 rounded-full bg-[#e4572e] animate-pulse" aria-hidden />
          Demo: Sesi daring langsung — Matematika (SMP)
        </p>
        <Badge tone="accent">Live caption on</Badge>
      </div>

      <div className="flex h-56 items-center justify-center px-6">
        <div className="max-w-xl text-center" aria-live="polite">
          <p className="h-10 rounded-full px-4 py-2 text-xs uppercase tracking-widest text-white/40">
            caption
          </p>
          <p className="text-xl font-medium leading-relaxed text-white sm:text-2xl">
            {SCRIPT_CAPTION[idx].teks}
          </p>
          <div className="mx-auto mt-5 h-1 w-40 overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-[#86c9a8] transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 border-t border-white/10 px-5 py-4">
        <button
          onClick={() => setPlaying((v) => !v)}
          className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#12110d] transition hover:opacity-90"
        >
          <Captions size={16} aria-hidden />
          {playing ? "Jeda" : "Putar caption"}
        </button>
        <p className="text-xs text-white/40">Caption otomatis sesuai ujaran tentor (streaming STT).</p>
      </div>
    </div>
  );
}