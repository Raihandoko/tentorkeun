"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/ui";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      phone: formData.get("phone"),
      role: formData.get("role") || "student",
    };

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error || "Gagal mendaftar");
      setLoading(false);
    } else {
      router.push("/auth/login?registered=true");
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center py-12">
      <Container>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-semibold text-ink">Daftar ke TentorKeun</h1>
            <p className="mt-2 text-sm text-muted">
              Sudah punya akun?{" "}
              <Link href="/auth/login" className="text-accent font-semibold hover:underline">
                Masuk di sini
              </Link>
            </p>
          </div>

          <div className="bg-card border border-line rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-ink mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-2.5 border border-line rounded-md text-sm text-ink bg-paper focus:outline-none focus:ring-2 focus:ring-accent/50"
                  placeholder="Nama Anda"
                />
              </div>

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
                <label htmlFor="phone" className="block text-sm font-semibold text-ink mb-1.5">
                  No. Telepon
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-2.5 border border-line rounded-md text-sm text-ink bg-paper focus:outline-none focus:ring-2 focus:ring-accent/50"
                  placeholder="08123456789"
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
                  minLength={6}
                  className="w-full px-4 py-2.5 border border-line rounded-md text-sm text-ink bg-paper focus:outline-none focus:ring-2 focus:ring-accent/50"
                  placeholder="Min. 6 karakter"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-semibold text-ink mb-1.5">
                  Daftar Sebagai
                </label>
                <select
                  id="role"
                  name="role"
                  className="w-full px-4 py-2.5 border border-line rounded-md text-sm text-ink bg-paper focus:outline-none focus:ring-2 focus:ring-accent/50"
                >
                  <option value="student">Siswa / Orang Tua</option>
                  <option value="tutor">Tentor</option>
                </select>
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
                {loading ? "Mendaftar..." : "Daftar"}
              </button>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
