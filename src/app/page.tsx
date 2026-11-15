import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, buttonClass } from "@/components/ui";
import { HomeHero } from "@/components/home-hero";
import { IntroCurtain } from "@/components/intro-curtain";
import { BowlGlow } from "@/components/bowl-glow";
import { HomeStory } from "@/components/home-story";
import { ClipWords, Inview, StabiloSweep } from "@/components/motion";

const fitur = [
  {
    judul: "Cari tentor dengan cerita",
    desc: "Tulis seperti sedang ngobrol: mapel, jenjang, budget, jadwal, kebiasaan belajar anak. Hasilnya berupa peringkat tentor dengan alasan di setiap nama.",
    href: "/ajukan",
    cta: "Coba cari",
  },
  {
    judul: "Tentor sudah dicek duluan",
    desc: "CV dan portofolio disaring sebelum tentor tampil. Admin mendapat ringkasan, catatan yang perlu dikonfirmasi, dan pertanyaan untuk wawancara.",
    href: "/verifikasi",
    cta: "Lihat caranya",
  },
  {
    judul: "Laporan untuk orang tua",
    desc: "Catatan sesi dari tentor diubah jadi laporan rapi: apa yang sudah dikuasai, bagian yang perlu dilatih, dan saran untuk pekan depan.",
    href: "/lapor",
    cta: "Buat laporan",
  },
  {
    judul: "Rencana belajar mingguan",
    desc: "Disusun dari target dan titik lemah siswa, lengkap dengan soal latihan yang naik tingkat pelan-pelan.",
    href: "/rencana",
    cta: "Susun rencana",
  },
  {
    judul: "Ramah untuk siswa ABK",
    desc: "Filter tentor bersertifikat ABK, materi yang disederhanakan untuk disleksia, tunanetra, tunarungu, ADHD, dan autisme, plus bacaan suara dan caption langsung.",
    href: "/aksesibilitas",
    cta: "Lihat fiturnya",
  },
];

export default function Home() {
  return (
    <>
      <BowlGlow />
      <IntroCurtain />
      <HomeHero />
      <HomeStory />

      {/* ---------- Fitur ---------- */}
      <section id="fitur" className="relative z-[3] border-b border-line bg-paper">
        <Container className="grid gap-12 py-20 sm:py-24 lg:grid-cols-[0.8fr_1.4fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ClipWords
              text="Tentornya ketemu, kami tetap ikut membantu."
              className="text-3xl font-bold leading-tight text-ink sm:text-4xl"
            />
            <Inview index={2} y={20}>
              <p className="mt-4 max-w-sm text-base leading-relaxed text-muted">
                Setelah sesi berjalan ada laporan untuk orang tua, rencana belajar mingguan, dan dukungan untuk siswa ABK.
              </p>
            </Inview>
          </div>

          <ul className="divide-y divide-line border-y border-line">
            {fitur.map((f, i) => (
              <Inview as="li" key={f.href} index={i} y={28}>
                <Link
                  href={f.href}
                  className="group/btn grid gap-2 py-7 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-8 hover:bg-card focus-visible:bg-card sm:px-4 sm:-mx-4"
                >
                  <span>
                    <span className="block text-xl font-semibold text-ink">{f.judul}</span>
                    <span className="mt-2 block max-w-xl text-[15px] leading-relaxed text-muted">{f.desc}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent sm:pt-1">
                    {f.cta}
                    <ArrowRight size={15} className="arrow-nudge" aria-hidden />
                  </span>
                </Link>
              </Inview>
            ))}
          </ul>
        </Container>
      </section>

      {/* ---------- Semua jenjang + CTA ---------- */}
      <section className="relative z-[3] bg-paper">
        <Container className="py-20 sm:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <ClipWords
                text="Calistung sampai skripsi, ada tentornya."
                className="text-3xl font-bold leading-tight text-ink sm:text-4xl"
              />
              <Inview index={2}>
                <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
                  Dari calistung, olimpiade, dan UTBK, sampai tahfiz, bahasa asing, dan pemrograman. Ceritakan
                  yang kamu butuhkan, sisanya kami urus.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link href="/ajukan" className={`${buttonClass("cta")} !py-3 !pl-6`}>
                    Mulai cari tentor
                  </Link>
                  <Link href="/aksesibilitas" className={`${buttonClass("secondary")} !py-3`}>
                    Butuh mode aksesibilitas
                  </Link>
                </div>
              </Inview>
            </div>

            <Inview index={1} y={36}>
              <div className="relative rotate-[1.5deg] rounded-2xl border border-ink/15 bg-card p-6 [background-image:repeating-linear-gradient(transparent,transparent_31px,var(--line)_31px,var(--line)_32px)]">
                <p className="font-display text-lg font-semibold text-ink">
                  Cukup tulis{" "}
                  <StabiloSweep>satu kalimat</StabiloSweep>.
                </p>
                <p className="mt-3 text-[15px] leading-8 text-ink">
                  &ldquo;Anak saya kelas 5, susah fokus saat belajar matematika. Cari tentor sabar yang bisa ke
                  rumah.&rdquo;
                </p>
              </div>
            </Inview>
          </div>
        </Container>
      </section>
    </>
  );
}
