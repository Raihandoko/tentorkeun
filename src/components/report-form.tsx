"use client";

import { useEffect, useState } from "react";
import { FileText, Loader2, Mic } from "lucide-react";
import type { ReportResponse } from "@/lib/ai";
import { Alert, Badge, buttonClass, Card, Field, Input, Select, Textarea } from "@/components/ui";

const MAPEL_OPTIONS = ["Matematika", "Fisika", "Kimia", "Biologi", "Bahasa Inggris", "Bahasa Indonesia", "Calistung", "Ekonomi", "Akuntansi", "Komputer", "Mengaji", "UTBK"];
const JENJANG_OPTIONS = ["TK", "SD", "SMP", "SMA", "Mahasiswa"];

function supportsSpeechRecognition() {
  return typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
}

export function ReportForm() {
  const [catatan, setCatatan] = useState("");
  const [mapel, setMapel] = useState("Matematika");
  const [jenjang, setJenjang] = useState("SD");
  const [namaSiswa, setNamaSiswa] = useState("");
  const [namaTentor, setNamaTentor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasil, setHasil] = useState<ReportResponse | null>(null);
  const [rekam, setRekam] = useState(false);

  type Rec = {
    lang: string;
    interimResults: boolean;
    continuous: boolean;
    onresult: (e: { results: { length: number; [i: number]: { [j: number]: { transcript: string } } } }) => void;
    onend: () => void;
    onerror: () => void;
    start: () => void;
    stop: () => void;
  };

  useEffect(() => {
    if (!rekam) return;
    const w = window as unknown as {
      SpeechRecognition?: new () => Rec;
      webkitSpeechRecognition?: new () => Rec;
    };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) return;
    const rec = new Ctor();
    rec.lang = "id-ID";
    rec.interimResults = true;
    rec.continuous = true;
    rec.onresult = (e) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      setCatatan(text);
    };
    rec.onend = () => setRekam(false);
    rec.onerror = () => setRekam(false);
    rec.start();
    return () => {
      try {
        rec.stop();
      } catch {
        /* abaikan */
      }
    };
  }, [rekam]);

  async function submit() {
    setError("");
    setLoading(true);
    setHasil(null);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ catatan, mapel, jenjang, namaSiswa, namaTentor }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal membuat laporan.");
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
        <div className="mb-4 flex items-center justify-between gap-3">
          <label htmlFor="catatan" className="block text-sm font-semibold text-ink">
            Catatan sesi tentor
          </label>
          {supportsSpeechRecognition() ? (
            <button
              type="button"
              onClick={() => {
                if (!supportsSpeechRecognition()) return;
                setRekam((v) => !v);
              }}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
                rekam ? "bg-danger-soft text-danger" : "border border-line text-muted hover:border-accent hover:text-accent"
              }`}
            >
              <Mic size={13} className={rekam ? "animate-pulse" : ""} aria-hidden />
              {rekam ? "Merekam… klik untuk berhenti" : "Catatan suara"}
            </button>
          ) : null}
        </div>
        <Textarea
          id="catatan"
          rows={6}
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
          placeholder="Contoh: “Sesi hari ini bahas aljabar. Rara sudah mulai paham konsep variabel, tapi masih kesulitan kalau sudah campur pecahan. Di akhir sesi bisa ngerjain 3 dari 5 soal sendiri. Tadi sempat agak kehilangan fokus setelah 40 menit …”"
          className="text-[15px]"
        />

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Mapel">
            <Select value={mapel} onChange={(e) => setMapel(e.target.value)}>
              {MAPEL_OPTIONS.map((m) => <option key={m}>{m}</option>)}
            </Select>
          </Field>
          <Field label="Jenjang">
            <Select value={jenjang} onChange={(e) => setJenjang(e.target.value)}>
              {JENJANG_OPTIONS.map((j) => <option key={j}>{j}</option>)}
            </Select>
          </Field>
          <Field label="Nama siswa">
            <Input value={namaSiswa} onChange={(e) => setNamaSiswa(e.target.value)} placeholder="mis. Rara" />
          </Field>
          <Field label="Nama tentor">
            <Input value={namaTentor} onChange={(e) => setNamaTentor(e.target.value)} placeholder="mis. Dina" />
          </Field>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button type="submit" disabled={loading || catatan.trim().length < 20} className={buttonClass("primary")}>
            {loading ? <><Loader2 size={16} className="animate-spin" aria-hidden /> Merangkum…</> : <><FileText size={16} aria-hidden /> Buat Laporan</>}
          </button>
          <p className="text-xs text-muted">Catatan teks/voice diubah jadi laporan terstruktur untuk orang tua.</p>
        </div>
      </form>

      {error && (
        <div className="mt-5"><Alert tone="error">{error}</Alert></div>
      )}

      {hasil && (
        <div className="mt-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-serif text-2xl font-semibold text-ink">{hasil.judul}</h2>
            <span className="text-xs text-muted">{hasil.via === "llm" ? "Dihasilkan LLM" : "Mode demo — disimulasikan lokal"}</span>
          </div>

          <Card>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <span className="eyebrow">Ringkasan eksekutif</span>
              <span className="flex items-center gap-2 text-sm text-muted">
                Tren: <Badge tone={hasil.penilaian >= 75 ? "accent" : hasil.penilaian >= 60 ? "amber" : "danger"}>{hasil.tren}</Badge>
              </span>
            </div>
            <p className="leading-relaxed text-ink">{hasil.ringkasan}</p>
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs text-muted">
                <span>Perkiraan kemajuan</span>
                <span className="font-semibold tabular-nums text-ink">{hasil.penilaian}/100</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-ink/8">
                <div className="h-full rounded-full bg-accent" style={{ width: `${hasil.penilaian}%` }} />
              </div>
            </div>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <span className="eyebrow">Capaian</span>
              <ul className="mt-3 space-y-2">
                {hasil.capaian.map((c, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed text-ink"><span className="mt-0.5 text-accent" aria-hidden>+</span>{c}</li>
                ))}
              </ul>
              <span className="eyebrow mt-5 block">Perlu perhatian</span>
              <ul className="mt-3 space-y-2">
                {hasil.perluPerhatian.map((c, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted"><span className="mt-0.5 text-rust" aria-hidden>·</span>{c}</li>
                ))}
              </ul>
            </Card>

            <Card>
              <span className="eyebrow">Materi dibahas</span>
              <div className="mt-3 flex flex-wrap gap-2">
                {hasil.materiDibahas.map((m, i) => <Badge key={i} tone="neutral">{m}</Badge>)}
              </div>
              <span className="eyebrow mt-5 block">Rekomendasi pekan depan</span>
              <ul className="mt-3 space-y-2">
                {hasil.rekomendasi.map((r, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed text-ink"><span className="text-accent" aria-hidden>→</span>{r}</li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}