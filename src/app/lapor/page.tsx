import type { Metadata } from "next";
import { ReportForm } from "@/components/report-form";
import { Container, Eyebrow } from "@/components/ui";

export const metadata: Metadata = { title: "Laporan Perkembangan Otomatis" };

export default function ReportPage() {
  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-2xl">
        <Eyebrow>Fitur 3 · AI Progress Report</Eyebrow>
        <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
          Catatan sesi jadi laporan untuk orang tua.
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          Tentor cukup mengetik catatan — atau merekam suara — setelah sesi.
          AI menyusunnya menjadi laporan perkembangan yang terstruktur, netral,
          dan tak menakutkan untuk orang tua.
        </p>
      </div>

      <div className="mt-9">
        <ReportForm />
      </div>
    </Container>
  );
}