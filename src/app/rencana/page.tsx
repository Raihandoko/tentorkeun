import type { Metadata } from "next";
import { PlanForm } from "@/components/plan-form";
import { Container } from "@/components/ui";

export const metadata: Metadata = { title: "Rencana belajar dan soal latihan" };

export default function PlanPage() {
  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold text-ink sm:text-4xl">Rencana mingguan dan soal yang ikut naik tingkat.</h1>
        <p className="mt-4 text-base leading-relaxed text-muted">
          Dari target dan titik lemah siswa, kami susun jadwal belajar Senin sampai Minggu plus contoh soal bertingkat, dari yang mudah sampai menantang, lengkap dengan pembahasan singkat.
        </p>
      </div>

      <div className="mt-9">
        <PlanForm />
      </div>
    </Container>
  );
}
