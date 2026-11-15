import type { Metadata } from "next";
import { ReportForm } from "@/components/report-form";
import { Container } from "@/components/ui";

export const metadata: Metadata = { title: "Laporan perkembangan" };

export default function ReportPage() {
  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold text-ink sm:text-4xl">Catatan sesi jadi laporan untuk orang tua.</h1>
        <p className="mt-4 text-base leading-relaxed text-muted">
          Tentor cukup mengetik catatan atau merekam suara setelah sesi. Kami rapikan jadi laporan perkembangan yang jelas, netral, dan tidak bikin orang tua cemas.
        </p>
      </div>

      <div className="mt-9">
        <ReportForm />
      </div>
    </Container>
  );
}
