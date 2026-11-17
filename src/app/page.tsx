import Link from "next/link";
import { ListChecks, ShieldCheck, UserCheck } from "lucide-react";
import { buttonClass } from "@/components/ui";
import { HomeHero } from "@/components/home-hero";
import { FlowSection, ProblemSteps, StatBand } from "@/components/home-sections";
import { ClipWords, Inview, ScrollPanel, ScrollSlide } from "@/components/motion";
import { Logo } from "@/components/logo";
import { tutores } from "@/lib/data/tutors";

const mapel = [
  { n: "Calistung", j: "TK sampai SD" },
  { n: "Matematika", j: "SD sampai kuliah" },
  { n: "Fisika", j: "SMP dan SMA" },
  { n: "Kimia", j: "SMA" },
  { n: "Biologi", j: "SMA" },
  { n: "Bahasa Inggris", j: "Semua jenjang" },
  { n: "Bahasa Indonesia", j: "SD sampai SMA" },
  { n: "Ekonomi", j: "SMA" },
  { n: "Akuntansi", j: "SMA dan kuliah" },
  { n: "UTBK", j: "Persiapan kuliah" },
  { n: "IELTS", j: "Dewasa dan mahasiswa" },
];

function MarqueeRow({ reverse = false, offset = 0 }: { reverse?: boolean; offset?: number }) {
  const list = [...mapel.slice(offset), ...mapel.slice(0, offset)];
  return (
    <div className="marquee">
      <ScrollSlide from={reverse ? 0 : -70} to={reverse ? -70 : 0}>
      <div className="marquee-track" style={reverse ? { animationDirection: "reverse" } : undefined}>
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 gap-3 pr-3" aria-hidden={copy === 1 ? true : undefined}>
            {list.map((m) => (
              <li
                key={m.n}
                className="w-52 shrink-0 rounded-2xl border border-line bg-card px-5 py-4 sm:w-60"
              >
                <p className="font-display text-lg font-extrabold text-ink">{m.n}</p>
                <p className="mt-0.5 text-sm text-muted">{m.j}</p>
              </li>
            ))}
          </ul>
        ))}
      </div>
      </ScrollSlide>
    </div>
  );
}

const trust = [
  {
    icon: UserCheck,
    t: "Keputusan tetap di kamu",
    d: "AI hanya menyarankan dan mengurutkan. Kamu yang memilih tentor dan memutuskan lanjut atau tidak.",
  },
  {
    icon: ListChecks,
    t: "Skor selalu ada alasannya",
    d: "Setiap tentor di hasil pencarian disertai alasan yang bisa kamu baca, bukan angka misterius.",
  },
  {
    icon: ShieldCheck,
    t: "Disaring sebelum tampil",
    d: "CV dan portofolio dicek lebih dulu, lalu admin mengonfirmasi bagian yang masih meragukan.",
  },
];

export default function Home() {
  const total = tutores.length;
  const abk = tutores.filter((t) => t.sertifikasiABK).length;
  const rating = tutores.reduce((a, t) => a + t.rating, 0) / total;

  return (
    <>
      <HomeHero />

      {/* ---------- Alur: tulis seperti biasa ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <ClipWords
          text="Cukup tulis seperti biasa, TentorKeun yang memilah."
          className="mx-auto max-w-2xl text-center text-3xl font-extrabold leading-tight text-ink sm:text-5xl"
        />
        <Inview index={1} y={20}>
          <p className="mx-auto mt-4 max-w-xl text-center text-base leading-relaxed text-muted">
            Satu kalimat bebas diubah jadi kriteria yang jelas: mapel, budget, gaya belajar, kebutuhan khusus, dan jadwal.
          </p>
        </Inview>
        <Inview index={2} y={32}>
          <div className="mt-12 sm:mt-14">
            <FlowSection />
          </div>
        </Inview>
      </section>

      {/* ---------- Pita statistik ---------- */}
      <section className="px-3 sm:px-6">
        <ScrollPanel className="mx-auto max-w-[1240px]">
          <StatBand total={total} abk={abk} rating={rating} />
        </ScrollPanel>
      </section>

      {/* ---------- Masalah dan jawaban ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <ProblemSteps />
      </section>

      {/* ---------- Mapel ---------- */}
      <section className="overflow-hidden pb-20 sm:pb-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <ClipWords
            text="Dari calistung sampai UTBK."
            className="text-center text-3xl font-extrabold leading-tight text-ink sm:text-5xl"
          />
          <Inview index={1} y={20}>
            <p className="mx-auto mt-4 max-w-md text-center text-base leading-relaxed text-muted">
              Apa pun mapelnya, caranya sama: ceritakan kebutuhanmu, sisanya kami urus.
            </p>
          </Inview>
        </div>
        <Inview index={2} y={24}>
          <div className="mt-12 space-y-3">
            <MarqueeRow />
            <MarqueeRow reverse offset={5} />
          </div>
        </Inview>
      </section>

      {/* ---------- Kepercayaan ---------- */}
      <section className="px-3 sm:px-6">
        <ScrollPanel className="tint-block mx-auto max-w-[1240px] rounded-[1.75rem] sm:rounded-[2.25rem]">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div>
              <ClipWords
                text="AI membantu mencari, keputusannya tetap di kamu."
                className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl"
              />
              <Inview index={1} y={20}>
                <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
                  TentorKeun mengerti bahasa sehari-hari, tapi tidak memutuskan apa pun untukmu. Semua hasil bisa kamu baca
                  alasannya dan kamu cek sendiri.
                </p>
                <Link href="/ajukan" className={`${buttonClass("primary")} group/btn mt-7`}>
                  Mulai cari tentor
                  <span aria-hidden className="arrow-nudge">→</span>
                </Link>
              </Inview>
            </div>
            <ul className="space-y-3">
              {trust.map((x, i) => (
                <Inview as="li" key={x.t} index={i} y={24}>
                  <div className="flex gap-4 rounded-2xl border border-line bg-card p-5 shadow-[0_18px_36px_-28px_rgba(22,33,30,0.35)]">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                      <x.icon size={20} aria-hidden />
                    </span>
                    <div>
                      <p className="font-bold text-ink">{x.t}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{x.d}</p>
                    </div>
                  </div>
                </Inview>
              ))}
            </ul>
          </div>
        </ScrollPanel>
      </section>

      {/* ---------- CTA penutup ---------- */}
      <section className="px-3 pt-6 sm:px-6 sm:pt-8">
        <ScrollPanel className="tint-block mx-auto max-w-[1240px] rounded-[1.75rem] sm:rounded-[2.25rem]">
          <div className="mx-auto flex max-w-2xl flex-col items-center px-5 py-16 text-center sm:py-24">
            <Inview>
              <Logo />
            </Inview>
            <ClipWords
              text="Temukan tentor pertamamu hari ini."
              delay={0.15}
              className="mt-5 text-3xl font-extrabold leading-tight text-ink sm:text-5xl"
            />
            <Inview index={2} y={20}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link href="/ajukan" className={`${buttonClass("primary")} group/btn !px-6 !py-3`}>
                  Mulai cari tentor
                  <span aria-hidden className="arrow-nudge">→</span>
                </Link>
                <Link href="/tentor" className={`${buttonClass("secondary")} !px-6 !py-3`}>
                  Lihat katalog
                </Link>
              </div>
            </Inview>
          </div>
        </ScrollPanel>
      </section>
    </>
  );
}
