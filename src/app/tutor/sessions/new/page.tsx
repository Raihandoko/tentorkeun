import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui";
import { SessionForm } from "@/components/session-form";

export const metadata = {
  title: "Input Sesi Belajar",
};

export default async function NewSessionPage({ searchParams }: { searchParams: Promise<{ bookingId?: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "tutor") redirect("/auth/login");

  const { bookingId } = await searchParams;

  return (
    <Container className="py-14 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-serif text-3xl font-semibold text-ink">Input Sesi Belajar</h1>
        <p className="mt-2 text-muted">
          Catat detail sesi yang telah selesai untuk melengkapi rekam belajar siswa.
        </p>
        <div className="mt-8">
          <SessionForm bookingId={bookingId} />
        </div>
      </div>
    </Container>
  );
}
