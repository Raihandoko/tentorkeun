"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/ui";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email atau password salah");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center py-12">
      <Container>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-semibold text-ink">Masuk ke TentorKeun</h1>
            <p className="mt-2 text-sm text-muted">
              Belum punya akun?{" "}
              <Link href="/auth/register" className="text-accent font-semibold hover:underline">
                Daftar di sini
              </Link>
            </p>
          </div>

          <div className="bg-card border border-line rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-ink mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2.5 border border-line rounded-md text-sm text-ink bg-paper focus:outline-none focus:ring-2 focus:ring-accent/50"
                  placeholder="nama@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-ink mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  className="w-full px-4 py-2.5 border border-line rounded-md text-sm text-ink bg-paper focus:outline-none focus:ring-2 focus:ring-accent/50"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-accent text-accent-ink font-semibold rounded-md hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? "Masuk..." : "Masuk"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-line">
              <p className="text-xs text-muted text-center">
                Demo credentials:<br />
                Admin: admin@tentorkeun.id / admin123<br />
                Student: student@example.com / student123<br />
                Tutor: dina.maharani@tentorkeun.id / tutor123
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
