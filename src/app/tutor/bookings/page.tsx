import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui";
import { db } from "@/lib/db";
import Link from "next/link";

export default async function TutorBookingsPage() {
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

  const bookings = await db.booking.findMany({
    where: { tutorId: tutorProfile.id },
    include: {
      student: true,
      sessions: true,
    },
    orderBy: { tanggal: "desc" },
  });

  return (
    <section className="py-12">
      <Container>
        <h1 className="font-serif text-3xl font-semibold text-ink mb-2">Jadwal Saya</h1>
        <p className="text-muted mb-8">Booking & schedule mengajar</p>

        {bookings.length === 0 ? (
          <p className="text-muted">Belum ada booking</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div key={b.id} className="bg-card border border-line rounded-lg p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        b.status === "confirmed" ? "bg-green-100 text-green-700" :
                        b.status === "completed" ? "bg-blue-100 text-blue-700" :
                        b.status === "cancelled" ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {b.status}
                      </span>
                    </div>
                    <h3 className="font-semibold text-ink">{b.student.name}</h3>
                    <p className="text-sm text-muted">{b.mapel} • {b.jenjang}</p>
                    <p className="text-sm text-muted">
                      {new Date(b.tanggal).toLocaleDateString("id-ID", { 
                        weekday: "long", 
                        day: "numeric", 
                        month: "long" 
                      })} • {b.durasi} menit • {b.sessionType}
                    </p>
                    {b.kebutuhan && (
                      <p className="text-sm text-muted mt-2 italic">"{b.kebutuhan}"</p>
                    )}
                  </div>
                  {b.status === "confirmed" && (
                    <Link
                      href={`/tutor/sessions/new?bookingId=${b.id}`}
                      className="px-4 py-2 bg-accent text-accent-ink text-sm font-semibold rounded-md hover:opacity-90"
                    >
                      Input Sesi
                    </Link>
                  )}
                </div>
                {b.sessions.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-line">
                    <p className="text-xs text-muted">Sesi selesai: {b.sessions.length}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
