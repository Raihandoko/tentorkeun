import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui";
import { db } from "@/lib/db";

export default async function StudentReportsPage() {
  const session = await auth();
  if (!session || session.user.role !== "student") redirect("/");

  const reports = db.prepare(`
    SELECT r.*, s.tutor_id, t.nama as tutor_nama
    FROM reports r
    LEFT JOIN sessions s ON r.session_id = s.id
    LEFT JOIN tutors t ON s.tutor_id = t.id
    WHERE s.student_id = ?
    ORDER BY r.created_at DESC
  `).all(session.user.id) as any[];

  return (
    <section className="py-12">
      <Container>
        <h1 className="font-serif text-3xl font-semibold text-ink mb-2">Laporan Progress</h1>
        <p className="text-muted mb-8">Perkembangan belajar dari tentor</p>

        {reports.length === 0 ? (
          <p className="text-muted">Belum ada laporan</p>
        ) : (
          <div className="space-y-6">
            {reports.map((r) => (
              <div key={r.id} className="bg-card border border-line rounded-lg p-6">
                <div className="mb-4">
                  <h3 className="font-serif text-xl font-semibold text-ink">{r.judul}</h3>
                  <p className="text-sm text-muted">
                    {r.tutor_nama} • {new Date(r.created_at).toLocaleDateString("id-ID")}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-ink mb-1">Ringkasan</p>
                    <p className="text-sm text-muted">{r.ringkasan}</p>
                  </div>

                  {JSON.parse(r.capaian).length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-ink mb-1">✅ Capaian</p>
                      <ul className="list-disc list-inside space-y-1">
                        {JSON.parse(r.capaian).map((c: string, i: number) => (
                          <li key={i} className="text-sm text-muted">{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {JSON.parse(r.perluPerhatian).length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-ink mb-1">⚠️ Perlu Perhatian</p>
                      <ul className="list-disc list-inside space-y-1">
                        {JSON.parse(r.perluPerhatian).map((p: string, i: number) => (
                          <li key={i} className="text-sm text-muted">{p}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {JSON.parse(r.rekomendasi).length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-ink mb-1">💡 Rekomendasi</p>
                      <ul className="list-disc list-inside space-y-1">
                        {JSON.parse(r.rekomendasi).map((rec: string, i: number) => (
                          <li key={i} className="text-sm text-muted">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center gap-4 pt-4 border-t border-line">
                    <div>
                      <p className="text-xs text-muted">Penilaian</p>
                      <p className="font-semibold text-accent">{r.penilaian}/100</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted">Tren</p>
                      <p className="text-sm text-ink">{r.tren}</p>
                    </div>
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
