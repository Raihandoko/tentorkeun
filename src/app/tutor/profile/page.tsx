import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui";
import { db } from "@/lib/db";

export default async function TutorProfilePage() {
  const session = await auth();
  if (!session || session.user.role !== "tutor") redirect("/");

  const tutorProfile = db.prepare("SELECT * FROM tutors WHERE user_id = ?").get(session.user.id) as any;

  if (!tutorProfile) {
    return (
      <section className="py-12">
        <Container>
          <p className="text-muted">Profil tentor tidak ditemukan</p>
        </Container>
      </section>
    );
  }

  const mapel = JSON.parse(tutorProfile.mapel);
  const jenjang = JSON.parse(tutorProfile.jenjang);
  const keahlian = JSON.parse(tutorProfile.keahlian);
  const jadwal = JSON.parse(tutorProfile.jadwal);

  return (
    <section className="py-12">
      <Container>
        <h1 className="font-serif text-3xl font-semibold text-ink mb-2">Profil Saya</h1>
        <p className="text-muted mb-8">Informasi tentor Anda</p>

        <div className="max-w-3xl space-y-6">
          <div className="bg-card border border-line rounded-lg p-6">
            <h2 className="font-semibold text-xl text-ink mb-4">Informasi Dasar</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-semibold text-ink">Nama</dt>
                <dd className="text-sm text-muted">{tutorProfile.nama}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-ink">Gelar</dt>
                <dd className="text-sm text-muted">{tutorProfile.gelar}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-ink">Kota</dt>
                <dd className="text-sm text-muted">{tutorProfile.kota}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-ink">Bio</dt>
                <dd className="text-sm text-muted">{tutorProfile.bio}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-ink">Status</dt>
                <dd className="text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    tutorProfile.status === "approved" ? "bg-green-100 text-green-700" :
                    tutorProfile.status === "rejected" ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {tutorProfile.status}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-card border border-line rounded-lg p-6">
            <h2 className="font-semibold text-xl text-ink mb-4">Pengajaran</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-semibold text-ink">Mata Pelajaran</dt>
                <dd className="text-sm text-muted">{mapel.join(", ")}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-ink">Jenjang</dt>
                <dd className="text-sm text-muted">{jenjang.join(", ")}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-ink">Keahlian</dt>
                <dd className="text-sm text-muted">{keahlian.join(", ")}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-ink">Pengalaman</dt>
                <dd className="text-sm text-muted">{tutorProfile.pengalaman_tahun} tahun</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-ink">Sertifikasi ABK</dt>
                <dd className="text-sm text-muted">{tutorProfile.sertifikasi_abk ? "Ya" : "Tidak"}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-card border border-line rounded-lg p-6">
            <h2 className="font-semibold text-xl text-ink mb-4">Tarif & Jadwal</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-semibold text-ink">Harga per Sesi</dt>
                <dd className="text-sm text-muted">Rp {new Intl.NumberFormat("id-ID").format(tutorProfile.harga_per_sesi)}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-ink">Range Harga</dt>
                <dd className="text-sm text-muted">
                  Rp {new Intl.NumberFormat("id-ID").format(tutorProfile.harga_min)} - Rp {new Intl.NumberFormat("id-ID").format(tutorProfile.harga_max)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-ink">Jadwal Tersedia</dt>
                <dd className="text-sm text-muted">{jadwal.join(", ")}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-card border border-line rounded-lg p-6">
            <h2 className="font-semibold text-xl text-ink mb-4">Rating & Ulasan</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-semibold text-ink">Rating</dt>
                <dd className="text-sm text-muted">{tutorProfile.rating} / 5.0</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-ink">Jumlah Ulasan</dt>
                <dd className="text-sm text-muted">{tutorProfile.ulasan_count} ulasan</dd>
              </div>
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}
