import Link from "next/link";
import { Container } from "@/components/ui";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-card">
      <Container className="grid gap-10 py-14 sm:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Agensi bimbingan belajar privat yang mempertemukan siswa dengan tentor terverifikasi,
            dipandu AI untuk kecocokan yang benar-benar singkat.
          </p>
        </div>

        <nav aria-label="Layanan">
          <p className="eyebrow mb-3">Layanan</p>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link className="hover:text-ink" href="/ajukan">Cocokkan dengan AI</Link></li>
            <li><Link className="hover:text-ink" href="/tentor">Katalog tentor</Link></li>
            <li><Link className="hover:text-ink" href="/lapor">Laporan otomatis</Link></li>
            <li><Link className="hover:text-ink" href="/rencana">Rencana belajar</Link></li>
          </ul>
        </nav>

        <nav aria-label="Untuk lembaga">
          <p className="eyebrow mb-3">Untuk Agency</p>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link className="hover:text-ink" href="/verifikasi">Verifikasi tentor</Link></li>
            <li><Link className="hover:text-ink" href="/aksesibilitas">Dukungan ABK</Link></li>
            <li><Link className="hover:text-ink" href="/tentor?abk=1">Tentor bersertifikat ABK</Link></li>
          </ul>
        </nav>

        <div>
          <p className="eyebrow mb-3">Kontak</p>
          <ul className="space-y-2 text-sm text-muted">
            <li>halo@tentorkeun.id</li>
            <li>+62 812-0000-2026</li>
            <li>Senin–Sabtu, 08.00–20.00 WIB</li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-line py-5">
        <Container className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
          <span>© 2026 TentorKeun. Demo produk.</span>
          <span>Tanpa API key, seluruh fitur berjalan dalam mode simulasi.</span>
        </Container>
      </div>
    </footer>
  );
}