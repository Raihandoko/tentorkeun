"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Loader2 } from "lucide-react";
import { Alert, buttonClass, Textarea } from "@/components/ui";

type ReviewFormProps = {
  tutorId: string;
  tutorNama: string;
  bookingId?: string;
};

export function ReviewForm({ tutorId, tutorNama, bookingId }: ReviewFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [komentar, setKomentar] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tutorId, rating, komentar }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal mengirim ulasan");

      router.refresh();
      setKomentar("");
      setRating(5);
      alert("Terima kasih! Ulasan berhasil dikirim.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-line bg-card p-6">
      <p className="mb-4 text-sm font-semibold text-ink">
        Beri ulasan untuk {tutorNama}
      </p>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-semibold text-ink">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition hover:scale-110"
            >
              <Star
                size={32}
                className={
                  star <= (hoverRating || rating)
                    ? "fill-amber text-amber"
                    : "text-line"
                }
                aria-hidden
              />
              <span className="sr-only">{star} bintang</span>
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-muted">
          {rating === 5 && "Sangat memuaskan"}
          {rating === 4 && "Memuaskan"}
          {rating === 3 && "Cukup"}
          {rating === 2 && "Kurang"}
          {rating === 1 && "Sangat kurang"}
        </p>
      </div>

      <div>
        <label htmlFor="komentar" className="mb-2 block text-sm font-semibold text-ink">
          Komentar (opsional)
        </label>
        <Textarea
          id="komentar"
          rows={4}
          value={komentar}
          onChange={(e) => setKomentar(e.target.value)}
          placeholder="Ceritakan pengalaman belajar dengan tentor ini..."
          className="text-[15px]"
        />
      </div>

      {error && (
        <div className="mt-4">
          <Alert tone="error">{error}</Alert>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <button type="submit" disabled={loading} className={buttonClass("primary")}>
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden /> Mengirim...
            </>
          ) : (
            <>
              <Star size={16} aria-hidden /> Kirim Ulasan
            </>
          )}
        </button>
      </div>
    </form>
  );
}
