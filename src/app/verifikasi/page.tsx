import type { Metadata } from "next";
import { VerifyForm } from "@/components/verify-form";
import { Container, Eyebrow } from "@/components/ui";

export const metadata: Metadata = { title: "Verifikasi Tentor — Admin" };

export default function VerifyPage() {
  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-2xl">
        <Eyebrow>Fitur 2 · AI-Assisted Verification</Eyebrow>
        <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
          Screening CV tentor, dibantu AI.
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          Halaman admin. Tempel CV atau portofolio, dan AI meringkasnya untuk verifikasi:
          kekuatan, risiko, skor kelayakan, hingga pertanyaan kompetensi yang siap
          dipakai saat wawancara.
        </p>
      </div>

      <div className="mt-9">
        <VerifyForm />
      </div>
    </Container>
  );
}