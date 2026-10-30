import type { Metadata } from "next";
import { PlanForm } from "@/components/plan-form";
import { Container, Eyebrow } from "@/components/ui";

export const metadata: Metadata = { title: "Rencana Belajar & Soal Adaptif" };

export default function PlanPage() {
  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-2xl">
        <Eyebrow>Fitur 4 · AI Study Plan & Practice</Eyebrow>
        <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
          Rencana mingguan dan soal yang menyesuaikan capaian.
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          Berdasarkan target dan kelemahan siswa, AI menyusun jadwal belajar
          Senin–Minggu plus contoh soal bertingkat — mudah sampai menantang —
          lengkap dengan pembahasan singkat.
        </p>
      </div>

      <div className="mt-9">
        <PlanForm />
      </div>
    </Container>
  );
}