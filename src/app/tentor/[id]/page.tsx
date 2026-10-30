import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Star, Users } from "lucide-react";
import { tutores } from "@/lib/data/tutors";
import { formatHarga } from "@/lib/format";
import { initials } from "@/components/tutor-card";
import { Badge, Card, Container } from "@/components/ui";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const tutor = tutores.find((t) => t.id === id);
  if (!tutor) return { title: "Tentor tidak ditemukan" };
  return { title: `${tutor.nama} — Tentor ${tutor.mapel[0]}` };
}

export default async function TutorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tutor = tutores.find((t) => t.id === id);
  if (!tutor) notFound();

  const teksPrefill = encodeURIComponent(
    `Saya sedang mencari tentor ${tutor.mapel[0]} untuk jenjang ${tutor.jenjang[0]}, seperti profil ${tutor.nama} yang ada di katalog TentorKeun.`,
  );

  return (
    <Container className="py-14 sm:py-20">
      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <Link href="/tentor" className="text-sm font-medium text-muted transition hover:text-ink">
            ← Kembali ke katalog
          </Link>

          <div className="mt-5 flex items-start gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent-soft font-serif text-2xl font-semibold text-accent">
              {initials(tutor.nama)}
            </div>
            <div>
              <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink">{tutor.nama}</h1>
              <p className="mt-1 text-muted">{tutor.gelar}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                <span className="inline-flex items-center gap-1">
                  <Star size={14} className="fill-amber text-amber" aria-hidden /> {tutor.rating.toFixed(1)}
                  <span className="text-xs">({tutor.ulasanCount} ulasan)</span>
                </span>
                <span className="inline-flex items-center gap-1"><MapPin size={13} aria-hidden /> {tutor.kota}</span>
                <span className="inline-flex items-center gap-1"><Users size={13} aria-hidden /> {tutor.pengalamanTahun} tahun mengajar</span>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {tutor.mapel.map((m) => <Badge key={m} tone="neutral">{m}</Badge>)}
            {tutor.sertifikasiABK && <Badge tone="accent">Sertifikasi ABK</Badge>}
          </div>

          <Card className="mt-8">
            <p className="eyebrow">Tentang</p>
            <p className="mt-3 leading-relaxed text-ink">{tutor.bio}</p>
            <p className="eyebrow mt-6 block">Cara mengajar</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {tutor.keahlian.map((k) => <Badge key={k} tone="accent">{k}</Badge>)}
            </div>
            <p className="eyebrow mt-6 block">Jadwal ketersediaan</p>
            <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-ink">
              <CalendarDays size={15} className="text-muted" aria-hidden />
              {tutor.jadwal.join(" · ")}
            </p>
            {tutor.sertifikasiABK && (
              <>
                <p className="eyebrow mt-6 block">Dukungan kebutuhan khusus</p>
                <p className="mt-3 text-sm text-ink">
                  Berpengalaman dengan: {tutor.kondisiKhusus.join(", ")}
                </p>
              </>
            )}
          </Card>
        </div>

        <aside className="h-fit lg:sticky lg:top-24">
          <Card>
            <p className="eyebrow">Tarif & jenis sesi</p>
            <div className="mt-3 flex items-end justify-between">
              <span className="font-serif text-3xl font-semibold text-ink">{formatHarga(tutor.hargaPerSesi)}</span>
              <span className="text-sm text-muted">/ 60 menit</span>
            </div>
            <p className="mt-1 text-xs text-muted">
              Kisaran Rp{tutor.hargaMin.toLocaleString("id-ID")}–Rp{tutor.hargaMax.toLocaleString("id-ID")} ribu
            </p>
            <div className="mt-4 flex gap-2">
              {tutor.sesiTersedia.map((s) => (
                <Badge key={s} tone={s === "online" ? "amber" : "neutral"}>{s === "online" ? "Online / daring" : "Offline / tatap muka"}</Badge>
              ))}
            </div>

            <Link
              href={`/ajukan?teks=${teksPrefill}`}
              className="mt-6 block w-full rounded-md bg-accent px-4 py-3 text-center text-sm font-semibold text-accent-ink transition hover:opacity-90"
            >
              Pesan sesi uji coba
            </Link>
            <Link
              href={`/ajukan`}
              className="mt-2 block w-full rounded-md border border-ink/25 px-4 py-3 text-center text-sm font-semibold text-ink transition hover:border-ink/50"
            >
              Cocokkan kebutuhan lain dengan AI
            </Link>

            <p className="mt-4 rounded-md border border-line bg-paper p-3 text-xs leading-relaxed text-muted">
              Tentor ini sudah lolos verifikasi dokumen TentorKeun. Kecocokan final tetap
              diminta lewat sesi uji coba pertama.
            </p>
          </Card>
        </aside>
      </div>
    </Container>
  );
}