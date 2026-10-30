import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui";
import { db } from "@/lib/db";

export default async function AdminTutorsPage() {
  const session = await auth();
  if (!session || session.user.role !== "admin") redirect("/");

  const tutors = await db.tutor.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  const pending = tutors.filter((t) => t.status === "pending");
  const approved = tutors.filter((t) => t.status === "approved");
  const rejected = tutors.filter((t) => t.status === "rejected");

  return (
    <section className="py-12">
      <Container>
        <h1 className="font-serif text-3xl font-semibold text-ink mb-2">Kelola Tentor</h1>
        <p className="text-muted mb-8">Verifikasi & approve tentor baru</p>

        <div className="space-y-8">
          <div>
            <h2 className="font-semibold text-xl text-ink mb-4">Pending Verifikasi ({pending.length})</h2>
            {pending.length === 0 ? (
              <p className="text-muted text-sm">Tidak ada tentor pending</p>
            ) : (
              <div className="space-y-4">
                {pending.map((t) => (
                  <div key={t.id} className="bg-card border border-line rounded-lg p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-ink">{t.nama}</h3>
                        <p className="text-sm text-muted">{t.gelar}</p>
                        <p className="text-sm text-muted mt-1">{t.user.email}</p>
                        <p className="text-sm text-muted">{t.kota} • {t.pengalamanTahun} tahun pengalaman</p>
                      </div>
                      <div className="flex gap-2">
                        <form action={`/api/admin/tutors/${t.id}/approve`} method="POST">
                          <button className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700">
                            Approve
                          </button>
                        </form>
                        <form action={`/api/admin/tutors/${t.id}/reject`} method="POST">
                          <button className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700">
                            Reject
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="font-semibold text-xl text-ink mb-4">Approved ({approved.length})</h2>
            <div className="space-y-3">
              {approved.map((t) => (
                <div key={t.id} className="bg-card border border-line rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-ink">{t.nama}</p>
                      <p className="text-sm text-muted">{t.gelar} • {t.kota}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-muted">Rating: {t.rating} ({t.ulasanCount} ulasan)</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {rejected.length > 0 && (
            <div>
              <h2 className="font-semibold text-xl text-ink mb-4">Rejected ({rejected.length})</h2>
              <div className="space-y-3">
                {rejected.map((t) => (
                  <div key={t.id} className="bg-card border border-line rounded-lg p-4 opacity-60">
                    <p className="font-semibold text-ink">{t.nama}</p>
                    <p className="text-sm text-muted">{t.gelar}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
