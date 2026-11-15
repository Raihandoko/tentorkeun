"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Info, Mic, MicOff, Volume2 } from "lucide-react";
import type { MatchResponse } from "@/lib/ai";
import { TutorCard, TutorCardSkeleton } from "@/components/tutor-card";
import { Inview } from "@/components/motion";
import { Alert, buttonClass, Textarea } from "@/components/ui";

type SpeechResultEvent = { results: ArrayLike<ArrayLike<{ transcript: string }>> };
type SpeechRecognitionCtor = new () => {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onresult: ((e: SpeechResultEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
};

const contoh = [
  "Cari tentor matematika untuk anak saya kelas 9 SMP di Bandung. Sesi online, anggaran maksimal Rp200 ribu. Lebih suka tentor perempuan, bisa hari Sabtu. Anak agak kesulitan aljabar dan butuh yang sabar.",
  "Saya mahasiswa semester akhir butuh persiapan IELTS. Cari tentor bahasa inggris offline di Jakarta Timur, budget sekitar 250 ribu, yang sudah berpengalaman.",
  "Anak kelas 2 SD belum lancar membaca dan berhitung, ada kebutuhan khusus disleksia. Mohon tentor bersertifikasi ABK, sesi ke rumah di Bekasi.",
  "Butuh tentor fisika dan matematika untuk SMA, target UTBK. Bisa online, harga sekitar 200 ribu, lebih baik tentor laki-laki.",
];

const loadingCopy = [
  "Membaca kebutuhan belajarmu...",
  "Mencari jadwal yang cocok...",
  "Menghitung kecocokan tentor...",
];

export function MatchForm() {
  const [copyIdx, setCopyIdx] = useState(0);
  const [teks, setTeks] = useState(
    () => (typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("teks") ?? ""),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasil, setHasil] = useState<MatchResponse | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setCopyIdx((i) => (i + 1) % loadingCopy.length), 1800);
    return () => clearInterval(t);
  }, [loading]);

  async function submit() {
    setError("");
    setCopyIdx(0);
    setLoading(true);
    setHasil(null);
    stopSpeech();
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

  function speakSummary() {
    if (!hasil || !window.speechSynthesis) return;

    stopSpeech();

    let text = `Ringkasan hasil pencarian. ${hasil.ringkasan}. `;
    text += `Ditemukan ${hasil.hasil.length} tentor yang cocok. `;
    
    hasil.hasil.forEach((m, i) => {
      text += `Nomor ${i + 1}. ${m.tutor.nama}. Skor kecocokan ${m.skor} dari 100. `;
      text += `Alasan: ${m.alasan.join(". ")}. `;
    });

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setSpeaking(true);
      setPaused(false);
    };

    utterance.onend = () => {
      setSpeaking(false);
      setPaused(false);
    };

    utterance.onerror = () => {
      setSpeaking(false);
      setPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  }

  function pauseSpeech() {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  }

  function resumeSpeech() {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    }
  }

  function stopSpeech() {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      setPaused(false);
    }
  }

  function startListening() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError("Browser tidak mendukung speech recognition");
      return;
    }

    const w = window as unknown as { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor };
    const SpeechRecognition = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();

    recognition.lang = 'id-ID';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
      setError("");
    };

    recognition.onresult = (event: SpeechResultEvent) => {
      const transcript = event.results[0][0].transcript;
      setTeks(transcript);
    };

    recognition.onerror = () => {
      setListening(false);
      setError("Gagal mendengar suara. Coba lagi.");
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  }

  function stopListening() {
    setListening(false);
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
        className="rounded-xl border border-line bg-card p-6 sm:p-8"
      >
        <label htmlFor="kebutuhan" className="mb-2 block text-sm font-semibold text-ink">
          Ceritakan kebutuhan belajarnya
        </label>
        <div className="relative">
          <Textarea
            id="kebutuhan"
            rows={5}
            value={teks}
            onChange={(e) => setTeks(e.target.value)}
            placeholder="Contoh: cari tentor matematika SMP untuk anak saya, online, budget maksimal 200 ribu, yang sabar."
            className="text-[15px]"
          />
          <button
            type="button"
            onClick={listening ? stopListening : startListening}
            className={`btn-press absolute bottom-3 right-3 rounded-full p-2 ${
              listening ? "bg-koreksi text-koreksi-ink" : "bg-accent text-accent-ink hover:bg-accent-hover"
            }`}
            aria-label={listening ? "Berhenti merekam" : "Bicara untuk mengisi"}
            title={listening ? "Sedang mendengar..." : "Bicara untuk mengisi"}
          >
            {listening ? <MicOff size={16} aria-hidden /> : <Mic size={16} aria-hidden />}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="flex items-center text-xs text-muted">Coba salah satu:</span>
          {contoh.map((c) => (
            <button
              key={c.slice(0, 12)}
              type="button"
              onClick={() => setTeks(c)}
              className="btn-press rounded-full border border-line bg-paper px-3 py-1.5 text-xs text-muted hover:border-accent hover:text-accent"
            >
              Contoh {contoh.indexOf(c) + 1}
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button type="submit" disabled={loading || teks.trim().length < 10} className={buttonClass("primary")}>
            {loading ? (
              <>Mencari...</>
            ) : (
              <>
                Cari tentor <ArrowRight size={16} className="arrow-nudge" aria-hidden />
              </>
            )}
          </button>
          <p className="text-xs text-muted">Tiap hasil disertai alasan kenapa tentor itu cocok.</p>
        </div>
        {teks.trim().length < 10 && (
          <p className="mt-2 text-xs text-muted">Tulis satu kalimat utuh dulu ya, supaya hasilnya pas.</p>
        )}
      </form>

      {loading && (
        <div className="mt-10" aria-live="polite">
          <p className="text-sm font-semibold text-ink">{loadingCopy[copyIdx]}</p>
          <div className="mt-4 grid gap-5 lg:grid-cols-2">
            <TutorCardSkeleton />
            <TutorCardSkeleton />
          </div>
        </div>
      )}

      {error && (
        <div className="mt-5">
          <Alert tone="error">{error}</Alert>
        </div>
      )}

      {hasil && (
        <div className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-2xl font-semibold text-ink">Tentor yang paling cocok</h2>
            <span className="text-xs text-muted">
              {hasil.via === "llm" ? "Hasil dari model bahasa" : "Mode demo tanpa API key, hasil disimulasikan di perangkat"}
            </span>
          </div>

          <div className="mt-4 rounded-xl border-l-4 border-accent bg-accent-soft p-4 text-sm leading-relaxed text-accent">
            <span className="flex items-start gap-2">
              <Info size={16} className="mt-0.5 shrink-0" aria-hidden />
              <span>
                <strong className="font-semibold">Ringkasan: </strong>
                {hasil.ringkasan}
              </span>
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {!speaking ? (
              <button onClick={speakSummary} className={buttonClass("secondary")}>
                <Volume2 size={16} aria-hidden />
                Bacakan hasil pencarian
              </button>
            ) : (
              <>
                {paused ? (
                  <button onClick={resumeSpeech} className={buttonClass("secondary")}>
                    <Volume2 size={16} aria-hidden />
                    Lanjutkan
                  </button>
                ) : (
                  <button onClick={pauseSpeech} className={buttonClass("secondary")}>
                    <Volume2 size={16} aria-hidden />
                    Jeda
                  </button>
                )}
                <button onClick={stopSpeech} className={buttonClass("secondary")}>
                  Berhenti
                </button>
              </>
            )}
          </div>

          <p className="mt-4 flex items-center gap-1.5 text-xs text-muted">
            <span>Yang kami tangkap dari ceritamu: {hasil.dibaca}</span>
          </p>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {hasil.hasil.map((m, i) => (
              <Inview key={m.tutor.id} index={i} y={24}>
                <TutorCard tutor={m.tutor} skor={{ value: m.skor, label: m.label, alasan: m.alasan }} />
              </Inview>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}