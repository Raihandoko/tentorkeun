import type { Tutor } from "@/lib/types";
import { formatHarga } from "@/lib/format";
import { Badge } from "@/components/ui";
import { MapPin, Star } from "lucide-react";

export function initials(nama: string): string {
  return nama
    .split(" ")
    .filter((w) => w.length > 1)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

const scoreTone: Record<string, string> = {
  "sangat tinggi": "bg-accent text-accent-ink",
  tinggi: "bg-accent-soft text-accent",
  sedang: "bg-amber/15 text-[#8a6416]",
  "perlu pertimbangan": "bg-danger-soft text-danger",
};

export function TutorCard({
  tutor,
  skor,
  detailHref = `/tentor/${tutor.id}`,
}: {
  tutor: Tutor;
  skor?: { value: number; label: string; alasan: string[] };
  detailHref?: string;
}) {
  return (
    <article className="flex flex-col rounded-lg border border-line bg-card p-6 transition hover:border-ink/25">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-soft font-serif text-lg font-semibold text-accent">
          {initials(tutor.nama)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-lg font-semibold leading-snug text-ink">{tutor.nama}</h3>
          <p className="truncate text-sm text-muted">{tutor.gelar}</p>
        </div>
        <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-ink">
          <Star size={14} className="fill-amber text-amber" aria-hidden />
          {tutor.rating.toFixed(1)}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {tutor.mapel.slice(0, 4).map((m) => (
          <Badge key={m} tone="neutral">{m}</Badge>
        ))}
        {tutor.sertifikasiABK && (
          <Badge tone="accent">Sertifikasi ABK</Badge>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted">
        <span className="inline-flex items-center gap-1">
          <MapPin size={13} aria-hidden /> {tutor.kota}
        </span>
        <span>{tutor.jenjang.join(" · ")}</span>
        <span>{tutor.sesiTersedia.join(" / ")}</span>
        <span className="font-semibold text-ink">{formatHarga(tutor.hargaPerSesi)} /sesi</span>
      </div>

      {skor && (
        <div className="mt-5 rounded-md border border-line bg-paper p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">Skor kecocokan</span>
            <span className="inline-flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${scoreTone[skor.label] ?? "bg-ink/6 text-ink/70"}`}>
                {skor.label}
              </span>
              <span className="text-sm font-bold tabular-nums text-ink">{skor.value}/100</span>
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/8">
            <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${skor.value}%` }} />
          </div>
          <ul className="mt-3 space-y-1.5">
            {skor.alasan.map((a, i) => (
              <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-muted">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-auto pt-5">
        <a
          href={detailHref}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
        >
          Lihat profil
          <span aria-hidden>→</span>
        </a>
      </div>
    </article>
  );
}