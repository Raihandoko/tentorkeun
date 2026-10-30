"use client";

import { useState } from "react";
import { ArrowRight, Info, Loader2, Sparkles } from "lucide-react";
import type { MatchResponse } from "@/lib/ai";
import { TutorCard } from "@/components/tutor-card";
import { Alert, buttonClass, Textarea } from "@/components/ui";

const contoh = [
  "Cari tentor matematika untuk anak saya kelas 9 SMP di Bandung. Sesi online, anggaran maksimal Rp200 ribu. Lebih suka tentor perempuan, bisa hari Sabtu. Anak agak kesulitan aljabar dan butuh yang sabar.",
  "Saya mahasiswa semester akhir butuh persiapan IELTS. Cari tentor bahasa inggris offline di Jakarta Timur, budget sekitar 250 ribu, yang sudah berpengalaman.",
  "Anak kelas 2 SD belum lancar membaca dan berhitung, ada kebutuhan khusus disleksia. Mohon tentor bersertifikasi ABK, sesi ke rumah di Bekasi.",
  "Butuh tentor fisika dan matematika untuk SMA, target UTBK. Bisa online, harga sekitar 200 ribu, lebih baik tentor laki-laki.",
];

export function MatchForm() {
  const [teks, setTeks] = useState(
    () => (typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("teks") ?? ""),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasil, setHasil] = useState<MatchResponse | null>(null);

  async function submit() {
    setError("");
    setLoading(true);
    setHasil(null);
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teks }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal mencocokkan.");
      setHasil(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
        className="rounded-lg border border-line bg-card p-6 sm:p-8"
      >
        <label htmlFor="kebutuhan" className="mb-2 block text-sm font-semibold text-ink">
          Ceritakan kebutuhan belajarnya
        </label>
        <Textarea
          id="kebutuhan"
          rows={5}
          value={teks}
          onChange={(e) => setTeks(e.target.value)}
          placeholder="Contoh: “Cari tentor matematika SMP untuk anak saya, online, budget maksimal 200 ribu, sabar …”"
          className="text-[15px]"
        />

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="flex items-center gap-1 text-xs text-muted">
            <Sparkles size={12} aria-hidden /> Coba salah satu:
          </span>
          {contoh.map((c) => (
            <button
              key={c.slice(0, 12)}
              type="button"
              onClick={() => setTeks(c)}
              className="rounded-full border border-line bg-paper px-3 py-1 text-xs text-muted transition hover:border-accent hover:text-accent"
            >
              Contoh {contoh.indexOf(c) + 1}
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button type="submit" disabled={loading || teks.trim().length < 10} className={buttonClass("primary")}>
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" aria-hidden /> Menganalisis…
              </>
            ) : (
              <>
                Cocokkan Saya <ArrowRight size={16} aria-hidden />
              </>
            )}
          </button>
          <p className="text-xs text-muted">
            Analisis natural language → ranking tentor + alasan kecocokan, bukan sekadar filter.
          </p>
        </div>
        {teks.trim().length < 10 && (
          <p className="mt-2 text-xs text-muted">Tulis minimal satu kalimat utuh untuk hasil yang berarti.</p>
        )}
      </form>

      {error && (
        <div className="mt-5">
          <Alert tone="error">{error}</Alert>
        </div>
      )}

      {hasil && (
        <div className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-serif text-2xl font-semibold text-ink">Tentor yang paling cocok</h2>
            <span className="text-xs text-muted">
              {hasil.via === "llm" ? "Hasil dari model bahasa (LLM)" : "Mode demo tanpa API key — hasil disimulasikan lokal"}
            </span>
          </div>

          <div className="mt-4 rounded-md border border-accent/30 bg-accent-soft p-4 text-sm leading-relaxed text-accent">
            <span className="flex items-start gap-2">
              <Info size={16} className="mt-0.5 shrink-0" aria-hidden />
              <span>
                <strong className="font-semibold">Ringkasan AI: </strong>
                {hasil.ringkasan}
              </span>
            </span>
          </div>

          <p className="mt-4 flex items-center gap-1.5 text-xs text-muted">
            <span className="font-mono text-[11px]">— dibaca dari permintaan: {hasil.dibaca}</span>
          </p>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {hasil.hasil.map((m) => (
              <TutorCard
                key={m.tutor.id}
                tutor={m.tutor}
                skor={{ value: m.skor, label: m.label, alasan: m.alasan }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}