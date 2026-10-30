import Link from "next/link";
import {
  Accessibility,
  ArrowRight,
  FileText,
  GraduationCap,
  ListChecks,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Container, Eyebrow } from "@/components/ui";

const fitur = [
  {
    n: "01",
    icon: Search,
    judul: "AI Matching Engine",
    desc: "Siswa atau orang tua mengetik kebutuhan dengan bahasa sehari-hari. AI membaca maknanya — mapel, jenjang, anggaran, jadwal, kondisi khusus — lalu meranking tentor dan menjelaskan alasan tiap rekomendasi. Bukan sekadar filter kategori.",
    href: "/ajukan",
    cta: "Coba cocokkan",
  },
  {
    n: "02",
    icon: ShieldCheck,
    judul: "Verifikasi tentor berbantuan AI",
    desc: "CV dan portofolio disaring otomatis: ringkasan untuk admin, sinyal risiko, hingga pertanyaan kompetensi yang siap dipakai saat wawancara lisan.",
    href: "/verifikasi",
    cta: "Lihat kerjanya",
  },
  {
    n: "03",
    icon: FileText,
    judul: "Laporan perkembangan otomatis",
    desc: "Catatan sesi tentor — diketik atau direkam suara — diubah jadi laporan terstruktur untuk orang tua: capaian, area perlu perhatian, dan rekomendasi pekan depan.",
    href: "/lapor",
    cta: "Buat laporan",
  },
  {
    n: "04",
    icon: ListChecks,
    judul: "Rencana belajar & soal adaptif",
    desc: "Rencana mingguan disusun dari target dan kelemahan siswa, lengkap dengan soal latihan bertingkat yang naik perlahan seiring capaian.",
    href: "/rencana",
    cta: "Susun rencana",
  },
  {
    n: "05",
    icon: Accessibility,
    judul: "Akses penuh untuk siswa ABK",
    desc: "Filter tentor bersertifikasi ABK, penyederhanaan materi untuk disleksia/tunanetra/tunarungu/ADHD/autisme, text-to-speech, font ramah disleksia, dan live caption di sesi daring.",
    href: "/aksesibilitas",
    cta: "Jelajahi fitur",
  },
];

const langkah = [
  {
    t: "Ceritakan kebutuhan",
    d: "Tulis bebas: mapel, jenjang, budget, jadwal, sampai kebutuhan khusus anak.",
  },
  {
    t: "AI ranking + alasan",
    d: "LLM mencocokkan dengan profil & riwayat tentor, lalu memberi peringkat dan alasan tiap pilihan.",
  },
  {
    t: "Kenalan & mulai sesi",
    d: "Atur sesi uji coba, pantau laporan otomatis, dan sesuaikan rencana belajar tiap minggu.",
  },
];

export default function Home() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="border-b border-line">
        <Container className="grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <Eyebrow>Bimbingan belajar privat · TK sampai mahasiswa</Eyebrow>
            <h1 className="mt-4 max-w-2xl font-serif text-4xl font-medium leading-tight tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
              Tentor yang cocok, dibuktikan —{" "}
              <span className="text-accent">bukan sekadar difilter.</span>
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted sm:text-base">
              TentorKeun adalah agency digital bimbingan belajar privat. Setiap tentor diverifikasi.
              Kecocokan ditentukan AI dari apa yang <em>benar-benar</em> Anda ketik — lengkap dengan alasan,
              bukan sekadar daftar kategori yang sama pada semua orang.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/ajukan"
                className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-ink transition hover:opacity-90"
              >
                Cocokkan dengan AI <ArrowRight size={16} aria-hidden />
              </Link>
              <Link
                href="/tentor"
                className="inline-flex items-center gap-2 rounded-md border border-ink/25 px-5 py-3 text-sm font-semibold text-ink transition hover:border-ink/50"
              >
                Jelajahi katalog
              </Link>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-6">
              {[
                ["16+", "tentor terverifikasi"],
                ["4.8", "rating rata-rata"],
                ["5", "fitur berbasis AI"],
              ].map(([a, b]) => (
                <div key={a}>
                  <dt className="font-serif text-2xl font-semibold text-ink">{a}</dt>
                  <dd className="mt-0.5 text-xs text-muted">{b}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Sample match card */}
          <div className="relative">
            <div className="rounded-lg border border-line bg-card p-6 shadow-[0_24px_60px_rgba(31,32,27,0.08)]">
              <p className="eyebrow flex items-center gap-1.5">
                <Sparkles size={12} className="text-amber" aria-hidden /> Contoh hasil pencocokan
              </p>
              <blockquote className="mt-4 border-l-2 border-accent pl-4 text-[15px] italic leading-relaxed text-ink">
                “Anak saya kelas 9, matematika online, budget 200 ribu, lebih suka tentor perempuan
                yang sabar.”
              </blockquote>

              <div className="mt-6 space-y-4">
                {[
                  { nama: "Dina Maharani, S.Pd.", skor: 92, alasan: "Mapel & jenjang persis; tarif per sesi Rp180rb sesuai anggaran" },
                  { nama: "Yoga Perkasa, S.Pd.", skor: 78, alasan: "Fisika-matematika kuat; sesi daring tersedia" },
                ].map((t) => (
                  <div key={t.nama} className="rounded-md border border-line bg-paper p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-ink">{t.nama}</p>
                      <p className="text-sm font-bold tabular-nums text-accent">{t.skor}/100</p>
                    </div>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{t.alasan}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-center text-xs text-muted">
                Setiap kartu menyertakan <em>alasan kecocokan</em>, bukan skor tanpa penjelasan.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------- Fitur ---------- */}
      <section id="fitur" className="border-b border-line">
        <Container className="py-20 sm:py-24">
          <div className="max-w-2xl">
            <Eyebrow>Kenapa berbasis AI, dan bukan sekadar kategori</Eyebrow>
            <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Lima kemampuan yang membuat agensi ini terasa hidup.
            </h2>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
            {fitur.map((f) => (
              <article key={f.n} className="flex flex-col bg-paper p-8 transition hover:bg-card">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-soft text-accent">
                    <f.icon size={18} aria-hidden />
                  </span>
                  <span className="font-serif text-3xl text-line select-none">{f.n}</span>
                </div>
                <h3 className="mt-5 font-serif text-xl font-semibold text-ink">{f.judul}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{f.desc}</p>
                <Link
                  href={f.href}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
                >
                  {f.cta} <span aria-hidden>→</span>
                </Link>
              </article>
            ))}
            <article className="flex flex-col items-start justify-center bg-accent p-8 text-accent-ink">
              <GraduationCap size={26} aria-hidden />
              <h3 className="mt-4 font-serif text-xl font-semibold">Dari TK sampai mahasiswa</h3>
              <p className="mt-2 text-sm leading-relaxed opacity-90">
                Calistung, olimpiade, UTBK, tahfiz, hingga bahasa asing dan pemrograman.
                Apapun jenjangnya, ada tentor yang memang tinggal menunggu untuk dicocokkan.
              </p>
              <Link href="/tentor" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold underline underline-offset-4">
                Lihat semua tentor <span aria-hidden>→</span>
              </Link>
            </article>
          </div>
        </Container>
      </section>

      {/* ---------- Cara kerja ---------- */}
      <section className="border-b border-line">
        <Container className="py-20 sm:py-24">
          <div className="max-w-2xl">
            <Eyebrow>Cara kerja</Eyebrow>
            <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Dari kalimat, jadi jadwal belajar.
            </h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {langkah.map((l, i) => (
              <div key={l.t} className="relative border-t-2 border-accent/40 pt-5">
                <span className="absolute -top-[9px] left-0 flex h-4 w-4 items-center justify-center rounded-full bg-accent">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-ink" aria-hidden />
                </span>
                <p className="eyebrow">Langkah {i + 1}</p>
                <h3 className="mt-2 font-serif text-lg font-semibold text-ink">{l.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{l.d}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------- CTA ---------- */}
      <section>
        <Container className="py-20 sm:py-24">
          <div className="rounded-xl border border-line bg-card px-8 py-14 text-center sm:px-16 sm:py-16">
            <Eyebrow>Siap mencoba?</Eyebrow>
            <h2 className="mx-auto mt-3 max-w-xl font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Ceritakan kebutuhan Anda. Biar AI yang menyortir 16 tentor.
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/ajukan"
                className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-ink transition hover:opacity-90"
              >
                Mulai cari tentor <ArrowRight size={16} aria-hidden />
              </Link>
              <Link
                href="/aksesibilitas"
                className="inline-flex items-center gap-2 rounded-md border border-ink/25 px-5 py-3 text-sm font-semibold text-ink transition hover:border-ink/50"
              >
                Butuh mode aksesibilitas
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}