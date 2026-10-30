import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui";
import Link from "next/link";
import { db } from "@/lib/db";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  const { user } = session;

  // Get stats based on role
  let stats: any = {};
  
  if (user.role === "admin") {
    const [tutorsPending, totalBookings, totalUsers] = await Promise.all([
      db.tutor.count({ where: { status: "pending" } }),
      db.booking.count(),
      db.user.count(),
    ]);
    stats = { tutorsPending, totalBookings, totalUsers };
  } else if (user.role === "student") {
    const [myBookings, completedSessions] = await Promise.all([
      db.booking.count({ where: { studentId: user.id } }),
      db.session.count({ where: { studentId: user.id } }),
    ]);
    stats = { myBookings, completedSessions };
  } else if (user.role === "tutor") {
    const tutorProfile = await db.tutor.findUnique({ where: { userId: user.id } });
    if (tutorProfile) {
      const [myBookings, mySessions] = await Promise.all([
        db.booking.count({ where: { tutorId: tutorProfile.id } }),
        db.session.count({ where: { tutorId: tutorProfile.id } }),
      ]);
      stats = { myBookings, mySessions, status: tutorProfile.status };
    }
  }

  return (
    <section className="py-12">
      <Container>
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-semibold text-ink">Dashboard</h1>
          <p className="mt-2 text-muted">Selamat datang, {user.name}</p>
          <p className="text-sm text-muted">Role: <span className="font-semibold text-accent">{user.role}</span></p>
        </div>

        {user.role === "admin" && (
          <>
            <div className="grid gap-6 sm:grid-cols-3 mb-8">
              <div className="bg-card border border-line rounded-lg p-6">
                <p className="text-sm text-muted">Tentor Pending</p>
                <p className="mt-2 font-serif text-3xl font-semibold text-ink">{stats.tutorsPending}</p>
              </div>
              <div className="bg-card border border-line rounded-lg p-6">
                <p className="text-sm text-muted">Total Booking</p>
                <p className="mt-2 font-serif text-3xl font-semibold text-ink">{stats.totalBookings}</p>
              </div>
              <div className="bg-card border border-line rounded-lg p-6">
                <p className="text-sm text-muted">Total User</p>
                <p className="mt-2 font-serif text-3xl font-semibold text-ink">{stats.totalUsers}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link href="/admin/tutors" className="block bg-card border border-line rounded-lg p-6 hover:border-accent transition">
                <h3 className="font-semibold text-ink">Kelola Tentor</h3>
                <p className="mt-1 text-sm text-muted">Verifikasi & approve tentor baru</p>
              </Link>
              <Link href="/admin/bookings" className="block bg-card border border-line rounded-lg p-6 hover:border-accent transition">
                <h3 className="font-semibold text-ink">Kelola Booking</h3>
                <p className="mt-1 text-sm text-muted">Monitor semua booking</p>
              </Link>
              <Link href="/admin/users" className="block bg-card border border-line rounded-lg p-6 hover:border-accent transition">
                <h3 className="font-semibold text-ink">Kelola User</h3>
                <p className="mt-1 text-sm text-muted">Manage semua pengguna</p>
              </Link>
            </div>
          </>
        )}

        {user.role === "student" && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 mb-8">
              <div className="bg-card border border-line rounded-lg p-6">
                <p className="text-sm text-muted">Booking Saya</p>
                <p className="mt-2 font-serif text-3xl font-semibold text-ink">{stats.myBookings}</p>
              </div>
              <div className="bg-card border border-line rounded-lg p-6">
                <p className="text-sm text-muted">Sesi Selesai</p>
                <p className="mt-2 font-serif text-3xl font-semibold text-ink">{stats.completedSessions}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Link href="/ajukan" className="block bg-card border border-line rounded-lg p-6 hover:border-accent transition">
                <h3 className="font-semibold text-ink">Cari Tentor</h3>
                <p className="mt-1 text-sm text-muted">AI matching untuk tentor cocok</p>
              </Link>
              <Link href="/student/bookings" className="block bg-card border border-line rounded-lg p-6 hover:border-accent transition">
                <h3 className="font-semibold text-ink">Booking Saya</h3>
                <p className="mt-1 text-sm text-muted">Lihat riwayat & jadwal</p>
              </Link>
              <Link href="/student/reports" className="block bg-card border border-line rounded-lg p-6 hover:border-accent transition">
                <h3 className="font-semibold text-ink">Laporan Progress</h3>
                <p className="mt-1 text-sm text-muted">Lihat perkembangan belajar</p>
              </Link>
              <Link href="/rencana" className="block bg-card border border-line rounded-lg p-6 hover:border-accent transition">
                <h3 className="font-semibold text-ink">Rencana Belajar</h3>
                <p className="mt-1 text-sm text-muted">Buat study plan adaptif</p>
              </Link>
            </div>
          </>
        )}

        {user.role === "tutor" && (
          <>
            <div className="grid gap-6 sm:grid-cols-3 mb-8">
              <div className="bg-card border border-line rounded-lg p-6">
                <p className="text-sm text-muted">Status Verifikasi</p>
                <p className="mt-2 font-semibold text-ink capitalize">{stats.status || "pending"}</p>
              </div>
              <div className="bg-card border border-line rounded-lg p-6">
                <p className="text-sm text-muted">Booking Saya</p>
                <p className="mt-2 font-serif text-3xl font-semibold text-ink">{stats.myBookings || 0}</p>
              </div>
              <div className="bg-card border border-line rounded-lg p-6">
                <p className="text-sm text-muted">Sesi Selesai</p>
                <p className="mt-2 font-serif text-3xl font-semibold text-ink">{stats.mySessions || 0}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Link href="/tutor/bookings" className="block bg-card border border-line rounded-lg p-6 hover:border-accent transition">
                <h3 className="font-semibold text-ink">Jadwal Saya</h3>
                <p className="mt-1 text-sm text-muted">Lihat booking & schedule</p>
              </Link>
              <Link href="/tutor/sessions" className="block bg-card border border-line rounded-lg p-6 hover:border-accent transition">
                <h3 className="font-semibold text-ink">Input Sesi</h3>
                <p className="mt-1 text-sm text-muted">Catat hasil sesi belajar</p>
              </Link>
              <Link href="/tutor/profile" className="block bg-card border border-line rounded-lg p-6 hover:border-accent transition">
                <h3 className="font-semibold text-ink">Profil Saya</h3>
                <p className="mt-1 text-sm text-muted">Edit profil & CV</p>
              </Link>
              <Link href="/lapor" className="block bg-card border border-line rounded-lg p-6 hover:border-accent transition">
                <h3 className="font-semibold text-ink">Buat Laporan</h3>
                <p className="mt-1 text-sm text-muted">Generate progress report</p>
              </Link>
            </div>
          </>
        )}

        <div className="mt-8 pt-8 border-t border-line">
          <Link href="/api/auth/signout" className="text-sm text-red-600 hover:underline">
            Keluar
          </Link>
        </div>
      </Container>
    </section>
  );
}
