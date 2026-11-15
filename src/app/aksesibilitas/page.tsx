import type { Metadata } from "next";
import { AccessPage } from "@/components/access-page";
import { Container } from "@/components/ui";

export const metadata: Metadata = { title: "Aksesibilitas dan dukungan ABK" };

export default function AccessRoute() {
  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold text-ink sm:text-4xl">Belajar tetap adil untuk semua cara belajar.</h1>
        <p className="mt-4 text-base leading-relaxed text-muted">
          Pilih mode kebutuhan khusus untuk menyederhanakan materi. Nyalakan bacaan suara, font ramah disleksia, kontras tinggi, atau kurangi animasi lewat tombol di kanan bawah. Kamu juga bisa menyaring tentor bersertifikat ABK dan mencoba caption langsung untuk sesi daring.
        </p>
      </div>

      <div className="mt-9">
        <AccessPage />
      </div>
    </Container>
  );
}
