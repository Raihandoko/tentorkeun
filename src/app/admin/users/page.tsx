import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui";
import { db } from "@/lib/db";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session || session.user.role !== "admin") redirect("/");

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  const students = users.filter((u) => u.role === "student");
  const tutors = users.filter((u) => u.role === "tutor");
  const admins = users.filter((u) => u.role === "admin");

  return (
    <section className="py-12">
      <Container>
        <h1 className="font-serif text-3xl font-semibold text-ink mb-2">Kelola User</h1>
        <p className="text-muted mb-8">Total: {users.length} user</p>

        <div className="space-y-8">
          <div>
            <h2 className="font-semibold text-xl text-ink mb-4">Siswa ({students.length})</h2>
            <div className="space-y-2">
              {students.map((u) => (
                <div key={u.id} className="bg-card border border-line rounded-lg p-4">
                  <p className="font-semibold text-ink">{u.name}</p>
                  <p className="text-sm text-muted">{u.email} {u.phone && `• ${u.phone}`}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-xl text-ink mb-4">Tentor ({tutors.length})</h2>
            <div className="space-y-2">
              {tutors.map((u) => (
                <div key={u.id} className="bg-card border border-line rounded-lg p-4">
                  <p className="font-semibold text-ink">{u.name}</p>
                  <p className="text-sm text-muted">{u.email}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-xl text-ink mb-4">Admin ({admins.length})</h2>
            <div className="space-y-2">
              {admins.map((u) => (
                <div key={u.id} className="bg-card border border-line rounded-lg p-4">
                  <p className="font-semibold text-ink">{u.name}</p>
                  <p className="text-sm text-muted">{u.email}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
