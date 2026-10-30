import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui";
import { db } from "@/lib/db";

export default async function TutorSessionsPage() {
  const session = await auth();
  if (!session || session.user.role !== "tutor") redirect("/");

  const tutorProfile = await db.tutor.findUnique({
    where: { userId: session.user.id },
  });

  if (!tutorProfile) {
    return (
      <section className="py-12">
        <Container>
          <p className="text-muted">Profil tentor tidak ditemukan</p>
        </Container>
      </section>
    );
  }

  const sessions = await db.session.findMany({
    where: { tutorId: tutorProfile.id },
    include: {
      booking: {
        include: {
          student: true,
        },
      },
      report: true,
    },
    orderBy: { tanggal: "desc" },
  });

  return (
    <section className="py-12">
      <Container>
        <h1 className="font-serif text-3xl font-semibold text-ink mb-2">Riwayat Sesi</h1>
        <p className="text-muted mb-8">Sesi mengajar yang sudah selesai</p>

        {sessions.length === 0 ? (
          <p className="text-muted">Belum ada sesi selesai</p>
        ) : (
          <div className="space-y-4">
            {sessions.map((s) => (
              <div key={s.id} className="bg-card border border-line rounded-lg p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-ink">{s.booking.student.name}</h3>
                    <p className="text-sm text-muted">
                      {new Date(s.tanggal).toLocaleDateString("id-ID")} • {s.durasi} menit
                    </p>
                    {s.catatan && (
                      <p className="text-sm text-muted mt-2">Catatan: {s.catatan.slice(0, 150)}{s.catatan.length > 150 ? "..." : ""}</p>
                    )}
                    {s.report && (
                      <div className="mt-3 pt-3 border-t border-line">
                        <p className="text-xs font-semibold text-accent">✓ Laporan sudah dibuat</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
