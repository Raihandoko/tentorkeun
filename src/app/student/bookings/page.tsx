import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui";
import { db } from "@/lib/db";
import { format } from "@/lib/format";
import Link from "next/link";

export default async function StudentBookingsPage() {
  const session = await auth();
  if (!session || session.user.role !== "student") redirect("/");

  const bookings = await db.booking.findMany({
    where: { studentId: session.user.id },
    include: {
      tutor: true,
      payment: true,
      sessions: {
        include: {
          report: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="py-12">
      <Container>
        <h1 className="font-serif text-3xl font-semibold text-ink mb-2">Booking Saya</h1>
        <p className="text-muted mb-8">Riwayat & jadwal belajar</p>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted mb-4">Belum ada booking</p>
            <Link href="/ajukan" className="inline-block px-5 py-3 bg-accent text-accent-ink font-semibold rounded-md hover:opacity-90">
              Cari Tentor Sekarang
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div key={b.id} className="bg-card border border-line rounded-lg p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
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
                    <h3 className="font-serif text-lg font-semibold text-ink">{b.tutor.nama}</h3>
                    <p className="text-sm text-muted">{b.tutor.gelar}</p>
                    <p className="text-sm text-muted mt-2">
                      {b.mapel} • {b.jenjang} • {b.sessionType}
                    </p>
                    <p className="text-sm text-muted">
                      {new Date(b.tanggal).toLocaleDateString("id-ID", { 
                        weekday: "long", 
                        day: "numeric", 
                        month: "long", 
                        year: "numeric" 
                      })} • {b.durasi} menit
                    </p>
                    <p className="text-sm font-semibold text-accent mt-2">Rp {format.rupiah(b.harga)}</p>
                  </div>
                </div>

                {b.sessions.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-line">
                    <p className="text-sm font-semibold text-ink mb-2">Sesi Selesai: {b.sessions.length}</p>
                    {b.sessions.filter(s => s.report).length > 0 && (
                      <Link 
                        href={`/student/reports?bookingId=${b.id}`}
                        className="text-sm text-accent hover:underline"
                      >
                        Lihat Laporan Progress →
                      </Link>
                    )}
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
