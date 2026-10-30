import type { Metadata } from "next";
import { Catalog } from "@/components/catalog";
import { Container, Eyebrow } from "@/components/ui";

export const metadata: Metadata = { title: "Katalog Tentor" };

export default function TutorsPage() {
  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-2xl">
        <Eyebrow>Katalog Tentor Terverifikasi</Eyebrow>
        <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
          Pilih langsung dari daftar tentor.
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          Semua tentor sudah melewati alur verifikasi TentorKeun. Gunakan filter ini
          untuk menyusuri sendiri, atau aktifkan filter ABK untuk siswa berkebutuhan khusus.
        </p>
      </div>

      <div className="mt-9">
        <Catalog />
      </div>
    </Container>
  );
}