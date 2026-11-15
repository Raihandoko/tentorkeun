import type { Metadata } from "next";
import { VerifyForm } from "@/components/verify-form";
import { Container } from "@/components/ui";

export const metadata: Metadata = { title: "Verifikasi tentor (admin)" };

export default function VerifyPage() {
  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold text-ink sm:text-4xl">Saring CV tentor lebih cepat.</h1>
        <p className="mt-4 text-base leading-relaxed text-muted">
          Halaman untuk admin. Tempel CV atau portofolio, lalu lihat ringkasan kekuatan, hal yang perlu dikonfirmasi, skor kelayakan, dan pertanyaan yang siap dipakai saat wawancara.
        </p>
      </div>

      <div className="mt-9">
        <VerifyForm />
      </div>
    </Container>
  );
}
