import type { Metadata } from "next";
import { Catalog } from "@/components/catalog";
import { Container } from "@/components/ui";

export const metadata: Metadata = { title: "Katalog tentor" };

export default function TutorsPage() {
  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold text-ink sm:text-4xl">Pilih langsung dari daftar tentor.</h1>
        <p className="mt-4 text-base leading-relaxed text-muted">
          Semua tentor sudah melewati verifikasi TentorKeun. Pakai filter untuk menjelajah sendiri, atau aktifkan filter ABK untuk siswa berkebutuhan khusus.
        </p>
      </div>

      <div className="mt-9">
        <Catalog />
      </div>
    </Container>
  );
}
