"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, ShieldCheck, TriangleAlert } from "lucide-react";
import type { VerifyResponse } from "@/lib/ai";
import { Alert, buttonClass, Card, Textarea } from "@/components/ui";

const CONTOH_CV = `Dina Maharani, 29 tahun
S.Pd. Matematika, Universitas Pendidikan Indonesia (UPI) Bandung
Pengalaman mengajar 7 tahun sebagai guru matematika SMP Negeri 3 Bandung (2018-2023) dan tentor privat sejak 2016.
Membimbing siswa olimpiade matematika tingkat kota dan provinsi. Sertifikat pelatihan "Matematika Asyik untuk SMP" dari Kemdikbud (2022).
Portofolio: catatan perkembangan siswa, 2 siswa juara olimpiade sains kota, testimoni 5 orang tua.
Mampu sesi daring dan tatap muka, fasih bahasa Sunda & Indonesia.`;

export function VerifyForm() {
  const [cv, setCv] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasil, setHasil] = useState<VerifyResponse | null>(null);

  async function submit() {
    setError("");
    setLoading(true);
    setHasil(null);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal memverifikasi.");
      setHasil(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  const rekomTone = hasil ? (hasil.skor >= 85 ? "bg-accent-soft text-accent" : hasil.skor >= 60 ? "bg-amber/15 text-[#8a6416]" : "bg-danger-soft text-danger") : "";

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
        className="rounded-lg border border-line bg-card p-6 sm:p-8"
      >
        <label htmlFor="cv" className="mb-2 block text-sm font-semibold text-ink">
          Tempel CV / portofolio calon tentor
        </label>
        <Textarea
          id="cv"
          rows={9}
          value={cv}
          onChange={(e) => setCv(e.target.value)}
          placeholder="Tempel riwayat pendidikan, pengalaman mengajar, sertifikasi, portofolio…"
          className="font-mono text-[13px] leading-relaxed"
        />
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setCv(CONTOH_CV)}
            className="rounded-full border border-line px-3 py-1 text-xs text-muted transition hover:border-accent hover:text-accent"
          >
            Muat contoh CV
          </button>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button type="submit" disabled={loading || cv.trim().length < 60} className={buttonClass("primary")}>
            {loading ? <><Loader2 size={16} className="animate-spin" aria-hidden /> Menyaring…</> : <><ShieldCheck size={16} aria-hidden /> Verifikasi CV</>}
          </button>
          <p className="text-xs text-muted">Screening awal untuk admin: ringkasan, risiko, pertanyaan kompetensi otomatis.</p>
        </div>
      </form>

      {error && (
        <div className="mt-5"><Alert tone="error">{error}</Alert></div>
      )}

      {hasil && (
        <div className="mt-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className={`rounded-full px-4 py-1.5 text-sm font-bold tabular-nums ${rekomTone}`}>
                Skor {hasil.skor}/100
              </span>
              <span className="text-sm font-medium text-ink">{hasil.rekomendasi}</span>
            </div>
            <span className="text-xs text-muted">{hasil.via === "llm" ? "Dihasilkan LLM" : "Mode demo — disimulasikan lokal"}</span>
          </div>

          <Card>
            <span className="eyebrow">Ringkasan verifikasi</span>
            <p className="mt-3 leading-relaxed text-ink">{hasil.ringkasan}</p>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <span className="eyebrow flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-accent" aria-hidden /> Kekuatan
              </span>
              <ul className="mt-3 space-y-2">
                {hasil.kekuatan.map((k, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed text-ink"><span className="text-accent" aria-hidden>+</span>{k}</li>
                ))}
              </ul>
            </Card>
            <Card>
              <span className="eyebrow flex items-center gap-1.5">
                <TriangleAlert size={13} className="text-rust" aria-hidden /> Risiko / perlu konfirmasi
              </span>
              <ul className="mt-3 space-y-2">
                {hasil.risiko.map((r, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted"><span className="text-rust" aria-hidden>!</span>{r}</li>
                ))}
              </ul>
            </Card>
          </div>

          <Card>
            <span className="eyebrow">Pertanyaan kompetensi otomatis untuk wawancara</span>
            <ol className="mt-3 space-y-3">
              {hasil.pertanyaan.map((q, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent">{i + 1}</span>
                  {q}
                </li>
              ))}
            </ol>
          </Card>

          <Card>
            <span className="eyebrow">Saran tindak lanjut untuk admin</span>
            <ul className="mt-3 space-y-2">
              {hasil.saran.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted"><span className="text-accent" aria-hidden>→</span>{s}</li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
}