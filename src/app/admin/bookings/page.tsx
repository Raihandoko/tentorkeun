import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui";
import { db } from "@/lib/db";
import { format } from "@/lib/format";

export default async function AdminBookingsPage() {
  const session = await auth();
  if (!session || session.user.role !== "admin") redirect("/");

  const bookings = await db.booking.findMany({
    include: {
      student: true,
      tutor: true,
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="py-12">
      <Container>
        <h1 className="font-serif text-3xl font-semibold text-ink mb-2">Kelola Booking</h1>
        <p className="text-muted mb-8">Monitor semua booking siswa & tentor</p>

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
                      {b.payment && (
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          b.payment.status === "paid" ? "bg-green-100 text-green-700" :
                          b.payment.status === "failed" ? "bg-red-100 text-red-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {b.payment.status}
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-ink">{b.student.name} → {b.tutor.nama}</p>
                    <p className="text-sm text-muted">{b.mapel} • {b.jenjang} • {b.sessionType}</p>
                    <p className="text-sm text-muted">Tanggal: {new Date(b.tanggal).toLocaleDateString("id-ID")} • {b.durasi} menit</p>
                    <p className="text-sm font-semibold text-accent mt-1">Rp {format.rupiah(b.harga)}</p>
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
