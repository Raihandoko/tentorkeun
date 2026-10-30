import type { Metadata } from "next";
import { AccessPage } from "@/components/access-page";
import { Container, Eyebrow } from "@/components/ui";

export const metadata: Metadata = { title: "Aksesibilitas & Dukungan ABK" };

export default function AccessRoute() {
  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-2xl">
        <Eyebrow>Fitur 5 · ABK & Aksesibilitas</Eyebrow>
        <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
          Belajar tetap adil untuk semua cara belajar.
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          Pilih mode kebutuhan khusus untuk menyederhanakan materi, nyalakan
          text-to-speech & font ramah disleksia lewat toolbar di kanan bawah,
          saring tentor bersertifikasi ABK, dan lihat demo live caption untuk sesi daring.
        </p>
      </div>

      <div className="mt-9">
        <AccessPage />
      </div>
    </Container>
  );
}