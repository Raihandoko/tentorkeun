"use client";

import { useState } from "react";
import { CalendarDays, Lightbulb, Loader2 } from "lucide-react";
import type { StudyPlanResponse } from "@/lib/ai";
import { Alert, Badge, buttonClass, Card, Field, Input, Select } from "@/components/ui";

const MAPEL_OPTIONS = ["Matematika", "Fisika", "Kimia", "Biologi", "Bahasa Inggris", "Bahasa Indonesia", "Calistung", "Ekonomi", "Akuntansi", "Komputer", "Mengaji", "UTBK", "Statistika"];
const JENJANG_OPTIONS = ["TK", "SD", "SMP", "SMA", "Mahasiswa"];

export function PlanForm() {
  const [mapel, setMapel] = useState("Matematika");
  const [jenjang, setJenjang] = useState("SMP");
  const [target, setTarget] = useState("");
  const [kelemahan, setKelemahan] = useState("");
  const [menit, setMenit] = useState(45);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasil, setHasil] = useState<StudyPlanResponse | null>(null);

  async function submit() {
    setError("");
    setLoading(true);
    setHasil(null);
    try {
      const res = await fetch("/api/study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mapel, jenjang, target, kelemahan, menit }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal membuat rencana.");
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Mata pelajaran">
            <Select value={mapel} onChange={(e) => setMapel(e.target.value)}>
              {MAPEL_OPTIONS.map((m) => <option key={m}>{m}</option>)}
            </Select>
          </Field>
          <Field label="Jenjang">
            <Select value={jenjang} onChange={(e) => setJenjang(e.target.value)}>
              {JENJANG_OPTIONS.map((j) => <option key={j}>{j}</option>)}
            </Select>
          </Field>
          <Field label="Alokasi per sesi (menit)">
            <Input type="number" min={15} max={180} step={5} value={menit} onChange={(e) => setMenit(Number(e.target.value))} />
          </Field>
          <Field label="Target (opsional)">
            <Input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="mis. siap menghadapi Ujian Sekolah" />
          </Field>
          <Field label="Kelemahan siswa (opsional)" className="sm:col-span-2 lg:col-span-1">
            <Input value={kelemahan} onChange={(e) => setKelemahan(e.target.value)} placeholder="mis. belum lancar pecahan" />
          </Field>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button type="submit" disabled={loading} className={buttonClass("primary")}>
            {loading ? <><Loader2 size={16} className="animate-spin" aria-hidden /> Menyusun…</> : <><CalendarDays size={16} aria-hidden /> Susun Rencana</>}
          </button>
          <p className="text-xs text-muted">Rencana mingguan + soal adaptif berdasarkan hasil evaluasi.</p>
        </div>
      </form>

      {error && (
        <div className="mt-5"><Alert tone="error">{error}</Alert></div>
      )}

      {hasil && (
        <div className="mt-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-ink">{hasil.judul}</h2>
              <p className="mt-1 text-sm text-muted">{hasil.target}</p>
            </div>
            <span className="text-xs text-muted">{hasil.via === "llm" ? "Dihasilkan LLM" : "Mode demo — disimulasikan lokal"}</span>
          </div>

          <Card>
            <span className="eyebrow">Jadwal mingguan · ±{hasil.durasiPerSesi} menit/sesi</span>
            <div className="mt-4 divide-y divide-line">
              {hasil.jadwal.map((d) => (
                <div key={d.hari} className="grid gap-1 py-3 sm:grid-cols-[90px_1fr_1.4fr] sm:items-baseline">
                  <p className="text-sm font-semibold text-ink">{d.hari}</p>
                  <p className="text-sm text-ink">{d.topik}</p>
                  <p className="text-[13px] leading-relaxed text-muted">{d.aktivitas}</p>
                </div>
              ))}
            </div>
          </Card>

          <div>
            <span className="eyebrow">Soal latihan adaptif (bertingkat)</span>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              {hasil.latihan.map((s, i) => {
                const tone = s.tingkat === "Sulit" ? "rust" : s.tingkat === "Sedang" ? "amber" : "accent";
                return (
                  <Card key={i}>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <Badge tone={tone}>{s.tingkat}</Badge>
                      <span className="text-xs text-muted">{s.mapel}</span>
                    </div>
                    <p className="font-medium text-ink">{s.pertanyaan}</p>
                    <div className="mt-3 rounded-md border border-line bg-paper p-3 text-sm">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted">Jawaban</p>
                      <p className="mt-1 font-medium text-accent">{s.jawabanSingkat}</p>
                      <p className="mt-2 text-[13px] leading-relaxed text-muted">{s.pembahasan}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
            <p className="mt-5 flex items-start gap-2 text-sm text-muted">
              <Lightbulb size={16} className="mt-0.5 shrink-0 text-amber" aria-hidden />
              {hasil.catatan || "Latihan naik tingkat otomatis mengikuti capaian sesi berikutnya."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}