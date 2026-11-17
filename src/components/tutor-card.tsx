import Link from "next/link";
import type { Tutor } from "@/lib/types";
import { formatHarga } from "@/lib/format";
import { Badge } from "@/components/ui";
import { CountUp, ScoreBar } from "@/components/motion";
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

/* Warna avatar deterministik dari nama, semua dari token palet */
const avatarTones = [
  { chip: "bg-accent-soft text-accent" },
  { chip: "bg-lulus-soft text-lulus" },
  { chip: "bg-peringatan-soft text-peringatan" },
  { chip: "bg-koreksi-soft text-koreksi" },
  { chip: "bg-stabilo text-[#16211e]" },
];
function toneIndex(nama: string): number {
  let h = 0;
  for (let i = 0; i < nama.length; i++) h = (h * 31 + nama.charCodeAt(i)) >>> 0;
  return h % avatarTones.length;
}
export function avatarTone(nama: string): string {
  return avatarTones[toneIndex(nama)].chip;
}

export function Avatar({ nama, size = 48 }: { nama: string; size?: number }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-display font-bold ${avatarTone(nama)}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      aria-hidden
    >
      {initials(nama)}
    </div>
  );
}

const scoreTone: Record<string, string> = {
  "sangat tinggi": "bg-accent text-accent-ink",
  tinggi: "bg-accent-soft text-accent",
  sedang: "bg-peringatan-soft text-peringatan",
  "perlu pertimbangan": "bg-koreksi-soft text-koreksi",
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
    <article className="lift tutor-card relative flex h-full flex-col rounded-3xl border border-line bg-card p-6">
      <div className="flex items-start gap-4">
        <Avatar nama={tutor.nama} size={52} />
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold leading-snug text-ink">{tutor.nama}</h3>
          <p className="text-sm leading-snug text-muted">{tutor.gelar}</p>
        </div>
        <span className="num flex shrink-0 items-center gap-1 rounded-full bg-peringatan-soft px-2.5 py-1 text-sm font-bold text-peringatan">
          <Star size={13} className="fill-current" aria-hidden />
          <span className="sr-only">Rating </span>
          {tutor.rating.toFixed(1)}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {tutor.mapel.slice(0, 4).map((m) => (
          <Badge key={m} tone="neutral">{m}</Badge>
        ))}
        {tutor.sertifikasiABK && <Badge tone="accent">Sertifikasi ABK</Badge>}
      </div>

      <dl className="mt-4 grid gap-1.5 text-[13px] text-muted">
        <div className="flex items-center gap-1.5">
          <dt className="sr-only">Kota</dt>
          <dd className="inline-flex items-center gap-1">
            <MapPin size={13} aria-hidden /> {tutor.kota}
          </dd>
          <span aria-hidden>·</span>
          <dt className="sr-only">Sesi</dt>
          <dd>{tutor.sesiTersedia.join(" atau ")}</dd>
        </div>
        <div className="flex gap-1.5">
          <dt className="sr-only">Jenjang</dt>
          <dd>Mengajar {tutor.jenjang.join(", ")}</dd>
        </div>
      </dl>

      {skor && (
        <div className="mt-5 rounded-2xl border border-line bg-paper p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold text-muted">Kecocokan</span>
            <span className="inline-flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${scoreTone[skor.label] ?? "bg-ink/10 text-ink/80"}`}>
                {skor.label}
              </span>
              <span className="num text-sm font-bold text-ink">
                <CountUp value={skor.value} />/100
              </span>
            </span>
          </div>
          <div className="mt-2">
            <ScoreBar value={skor.value} />
          </div>
          <ul className="mt-3 space-y-1.5">
            {skor.alasan.map((a, i) => (
              <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-muted">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-auto flex items-end justify-between gap-3 pt-6">
        <p className="num leading-none">
          <span className="block text-2xl font-extrabold text-ink">{formatHarga(tutor.hargaPerSesi)}</span>
          <span className="mt-1 block text-xs font-normal text-muted">per sesi</span>
        </p>
        {/* Tautan merentang ke seluruh kartu: seluruh kartu bisa diklik */}
        <Link
          href={detailHref}
          className="group/btn inline-flex items-center gap-1.5 rounded-xl bg-accent-soft px-4 py-2.5 text-sm font-semibold text-accent after:absolute after:inset-0 after:rounded-3xl after:content-[''] hover:bg-accent hover:text-accent-ink focus-visible:bg-accent focus-visible:text-accent-ink"
        >
          Lihat profil
          <span aria-hidden className="arrow-nudge">→</span>
        </Link>
      </div>
    </article>
  );
}

/* Bentuknya sama dengan TutorCard supaya layout tidak loncat */
export function TutorCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-line bg-card p-6" aria-hidden>
      <div className="flex items-start gap-4">
        <div className="skeleton !rounded-full" style={{ width: 48, height: 48 }} />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-2/3" />
          <div className="skeleton h-3 w-1/3" />
        </div>
        <div className="skeleton h-4 w-10" />
      </div>
      <div className="mt-4 flex gap-1.5">
        <div className="skeleton h-5 w-16 !rounded-full" />
        <div className="skeleton h-5 w-20 !rounded-full" />
        <div className="skeleton h-5 w-14 !rounded-full" />
      </div>
      <div className="mt-4 skeleton h-3 w-4/5" />
      <div className="mt-5 rounded-2xl border border-line bg-paper p-4">
        <div className="skeleton h-3 w-1/2" />
        <div className="skeleton mt-3 h-1.5 w-full" />
        <div className="skeleton mt-4 h-3 w-full" />
        <div className="skeleton mt-2 h-3 w-5/6" />
      </div>
    </div>
  );
}
