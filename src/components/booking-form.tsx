"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Loader2 } from "lucide-react";
import { Alert, buttonClass, Textarea } from "@/components/ui";

type BookingFormProps = {
  tutorId: string;
  tutorNama: string;
  tutorMapel: string[];
  tutorJenjang: string[];
  tutorHarga: number;
  tutorSesi: string[];
};

export function BookingForm({ tutorId, tutorNama, tutorMapel, tutorJenjang, tutorHarga, tutorSesi }: BookingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [mapel, setMapel] = useState(tutorMapel[0] || "");
  const [jenjang, setJenjang] = useState(tutorJenjang[0] || "");
  const [sessionType, setSessionType] = useState(tutorSesi[0] || "online");
  const [tanggal, setTanggal] = useState("");
  const [durasi, setDurasi] = useState("60");
  const [kebutuhan, setKebutuhan] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tutorId,
          mapel,
          jenjang,
          sessionType,
          tanggal: new Date(tanggal).toISOString(),
          durasi: parseInt(durasi),
          harga: tutorHarga * 1000,
          kebutuhan,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal membuat booking");

      router.push("/student/bookings");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="mapel" className="mb-2 block text-sm font-semibold text-ink">
            Mata Pelajaran
          </label>
          <select
            id="mapel"
            value={mapel}
            onChange={(e) => setMapel(e.target.value)}
            required
            className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink"
          >
            {tutorMapel.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="jenjang" className="mb-2 block text-sm font-semibold text-ink">
            Jenjang
          </label>
          <select
            id="jenjang"
            value={jenjang}
            onChange={(e) => setJenjang(e.target.value)}
            required
            className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink"
          >
            {tutorJenjang.map((j) => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sessionType" className="mb-2 block text-sm font-semibold text-ink">
            Jenis Sesi
          </label>
          <select
            id="sessionType"
            value={sessionType}
            onChange={(e) => setSessionType(e.target.value)}
            required
            className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink"
          >
            {tutorSesi.map((s) => (
              <option key={s} value={s}>
                {s === "online" ? "Online / Daring" : "Offline / Tatap Muka"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="durasi" className="mb-2 block text-sm font-semibold text-ink">
            Durasi (menit)
          </label>
          <select
            id="durasi"
            value={durasi}
            onChange={(e) => setDurasi(e.target.value)}
            required
            className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink"
          >
            <option value="60">60 menit</option>
            <option value="90">90 menit</option>
            <option value="120">120 menit</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="tanggal" className="mb-2 block text-sm font-semibold text-ink">
          Tanggal & Waktu
        </label>
        <input
          type="datetime-local"
          id="tanggal"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          min={minDate}
          required
          className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink"
        />
      </div>

      <div>
        <label htmlFor="kebutuhan" className="mb-2 block text-sm font-semibold text-ink">
          Kebutuhan Khusus (opsional)
        </label>
        <Textarea
          id="kebutuhan"
          rows={3}
          value={kebutuhan}
          onChange={(e) => setKebutuhan(e.target.value)}
          placeholder="Misalnya: Fokus persiapan ujian, butuh banyak latihan soal..."
          className="text-[15px]"
        />
      </div>

      <div className="rounded-md border border-line bg-card p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">Estimasi biaya:</span>
          <span className="font-serif text-xl font-semibold text-ink">
            Rp{(tutorHarga * parseInt(durasi) / 60).toLocaleString("id-ID")}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted">
          Pembayaran via transfer bank setelah booking dikonfirmasi
        </p>
      </div>

      {error && <Alert tone="error">{error}</Alert>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className={buttonClass("primary")}>
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden /> Memproses...
            </>
          ) : (
            <>
              <Calendar size={16} aria-hidden /> Pesan Sesi dengan {tutorNama}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className={buttonClass("secondary")}
        >
          Batal
        </button>
      </div>
    </form>
  );
}
