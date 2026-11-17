import Link from "next/link";
import { Container } from "@/components/ui";
import { Logo } from "@/components/logo";

const lnk = "text-muted hover:text-ink hover:underline underline-offset-4";

export function SiteFooter() {
  return (
    <footer id="footer" className="relative mt-16 border-t border-line">
      <Container className="grid gap-10 py-14 sm:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Bimbel privat yang mempertemukan siswa dengan tentor yang sudah diverifikasi.
          </p>
        </div>

        <nav aria-label="Layanan">
          <p className="mb-3 text-sm font-semibold text-ink">Layanan</p>
          <ul className="space-y-2 text-sm">
            <li><Link className={lnk} href="/ajukan">Cari tentor</Link></li>
            <li><Link className={lnk} href="/tentor">Katalog tentor</Link></li>
            <li><Link className={lnk} href="/lapor">Laporan perkembangan</Link></li>
            <li><Link className={lnk} href="/rencana">Rencana belajar</Link></li>
          </ul>
        </nav>

        <nav aria-label="Untuk lembaga">
          <p className="mb-3 text-sm font-semibold text-ink">Untuk agensi</p>
          <ul className="space-y-2 text-sm">
            <li><Link className={lnk} href="/verifikasi">Verifikasi tentor</Link></li>
            <li><Link className={lnk} href="/aksesibilitas">Dukungan ABK</Link></li>
            <li><Link className={lnk} href="/tentor?abk=1">Tentor bersertifikat ABK</Link></li>
          </ul>
        </nav>

        <div>
          <p className="mb-3 text-sm font-semibold text-ink">Kontak</p>
          <ul className="space-y-2 text-sm text-muted">
            <li>halo@tentorkeun.id</li>
            <li className="num">+62 812-0000-2026</li>
            <li>Senin sampai Sabtu, 08.00 sampai 20.00 WIB</li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-line py-5">
        <Container className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
          <span>© 2026 TentorKeun. Produk demo.</span>
          <span>Tanpa API key, semua fitur jalan dalam mode simulasi.</span>
        </Container>
      </div>
    </footer>
  );
}
