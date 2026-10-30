import type { Metadata } from "next";
import { MatchForm } from "@/components/match-form";
import { Container, Eyebrow } from "@/components/ui";

export const metadata: Metadata = { title: "Cari Tentor dengan AI" };

export default function MatchPage() {
  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-2xl">
        <Eyebrow>AI Matching Engine</Eyebrow>
        <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
          Ketik bebas. Dapatkan tentor terbaik beserta alasannya.
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          Tidak perlu mengisi formulir berlapis. Tulis kebutuhan Anda seperti bicara —
          AI membaca mapel, jenjang, anggaran, jadwal, hingga kebutuhan khusus,
          lalu meranking tentor dan menjelaskan <em>kenapa</em> tiap pilihan cocok.
        </p>
      </div>

      <div className="mt-9">
        <MatchForm />
      </div>
    </Container>
  );
}