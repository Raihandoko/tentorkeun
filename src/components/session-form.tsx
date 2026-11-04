"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Alert, buttonClass, Textarea } from "@/components/ui";

export function SessionForm({ bookingId }: { bookingId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [durasi, setDurasi] = useState("60");
  const [catatan, setCatatan] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          tanggal: new Date(tanggal).toISOString(),
          durasi: parseInt(durasi),
          catatan,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal menyimpan sesi");

      router.push("/tutor/sessions");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-line bg-card p-6">
      {!bookingId && (
        <Alert tone="error" className="mb-4">
          Booking ID tidak ditemukan. Kembali ke halaman booking.
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="tanggal" className="mb-2 block text-sm font-semibold text-ink">
            Tanggal Sesi
          </label>
          <input
            type="date"
            id="tanggal"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            required
            className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink"
          />
        </div>

        <div>
          <label htmlFor="durasi" className="mb-2 block text-sm font-semibold text-ink">
            Durasi (menit)
          </label>
          <input
            type="number"
            id="durasi"
            value={durasi}
            onChange={(e) => setDurasi(e.target.value)}
            min="30"
            max="180"
            step="30"
            required
            className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink"
          />
        </div>

        <div>
          <label htmlFor="catatan" className="mb-2 block text-sm font-semibold text-ink">
            Catatan Sesi
          </label>
          <Textarea
            id="catatan"
            rows={5}
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Materi yang diajarkan, kemajuan siswa, catatan penting..."
            className="text-[15px]"
          />
        </div>
      </div>

      {error && (
        <div className="mt-4">
          <Alert tone="error">{error}</Alert>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <button type="submit" disabled={loading || !bookingId} className={buttonClass("primary")}>
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden /> Menyimpan...
            </>
          ) : (
            "Simpan Sesi"
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
