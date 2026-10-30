import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui";
import { Logo } from "@/components/logo";

const nav = [
  { href: "/", label: "Beranda" },
  { href: "/ajukan", label: "Cari Tentor" },
  { href: "/tentor", label: "Katalog" },
];

const fitur = [
  { href: "/lapor", label: "Laporan Otomatis", desc: "Progress report dari catatan sesi" },
  { href: "/rencana", label: "Rencana & Latihan", desc: "Study plan mingguan adaptif" },
  { href: "/verifikasi", label: "Verifikasi Tentor", desc: "Screening CV berbantuan AI" },
  { href: "/aksesibilitas", label: "Aksesibilitas", desc: "Mode untuk siswa ABK & TTS" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="TentorKeun — beranda">
          <Logo />
        </Link>

        <nav aria-label="Navigasi utama" className="flex items-center gap-1 sm:gap-2">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-md px-2.5 py-2 text-sm font-medium text-ink/80 transition hover:bg-ink/5 hover:text-ink"
            >
              {n.label}
            </Link>
          ))}

          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-1 rounded-md px-2.5 py-2 text-sm font-medium text-ink/80 transition hover:bg-ink/5 hover:text-ink">
              Fitur AI
              <ChevronDown size={14} className="transition group-open:rotate-180" aria-hidden />
            </summary>
            <div className="absolute right-0 top-full mt-2 w-72 rounded-lg border border-line bg-card p-2 shadow-[0_12px_32px_rgba(31,32,27,0.14)]">
              {fitur.map((f) => (
                <Link
                  key={f.href}
                  href={f.href}
                  className="block rounded-md px-3 py-2.5 transition hover:bg-accent-soft"
                >
                  <span className="block text-sm font-semibold text-ink">{f.label}</span>
                  <span className="block text-xs text-muted">{f.desc}</span>
                </Link>
              ))}
            </div>
          </details>

          <Link
            href="/auth/login"
            className="ml-1 rounded-md border border-ink/25 px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-ink/50"
          >
            Login
          </Link>
          
          <Link
            href="/ajukan"
            className="ml-1 hidden rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink transition hover:opacity-90 sm:inline-flex"
          >
            Mulai Cari
          </Link>
        </nav>
      </Container>
    </header>
  );
}