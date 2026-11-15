import type { Metadata } from "next";
import { MatchForm } from "@/components/match-form";
import { Container } from "@/components/ui";

export const metadata: Metadata = { title: "Cari tentor" };

export default function MatchPage() {
  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold text-ink sm:text-4xl">
          Tulis aja kebutuhanmu, kami carikan tentornya.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted">
          Tidak perlu isi formulir panjang. Ceritakan mapel, jenjang, budget, jadwal, sampai kebutuhan khusus anak.
          Kamu akan dapat daftar tentor lengkap dengan alasan kenapa mereka cocok.
        </p>
      </div>

      <div className="mt-9">
        <MatchForm />
      </div>
    </Container>
  );
}
