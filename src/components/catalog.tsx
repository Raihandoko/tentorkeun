"use client";

import { useEffect, useState } from "react";
import { Loader2, SlidersHorizontal } from "lucide-react";
import type { Tutor } from "@/lib/types";
import { TutorCard } from "@/components/tutor-card";
import { buttonClass, Field, Input, Select } from "@/components/ui";

const MAPEL = ["Matematika", "Fisika", "Kimia", "Biologi", "Bahasa Inggris", "Bahasa Indonesia", "Calistung", "Ekonomi", "Akuntansi", "UTBK", "IELTS"];
const JENJANG = ["TK", "SD", "SMP", "SMA", "Mahasiswa"];
const KOTA = ["Jakarta", "Bandung", "Surabaya", "Yogyakarta", "Bekasi", "Depok", "Tangerang", "Semarang", "Medan"];

export function Catalog() {
  const [mapel, setMapel] = useState("");
  const [jenjang, setJenjang] = useState("");
  const [kota, setKota] = useState("");
  const [sesi, setSesi] = useState("");
  const [maxHarga, setMaxHarga] = useState("");
  const [abkOnly, setAbkOnly] = useState(
    () => typeof window !== "undefined" && new URLSearchParams(window.location.search).get("abk") === "1",
  );
  const [data, setData] = useState<Tutor[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const q = new URLSearchParams();
      if (mapel) q.set("mapel", mapel);
      if (jenjang) q.set("jenjang", jenjang);
      if (kota) q.set("kota", kota);
      if (sesi) q.set("sesi", sesi);
      if (maxHarga) q.set("maxHarga", maxHarga);
      if (abkOnly) q.set("abk", "1");
      const res = await fetch(`/api/tutors?${q.toString()}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Gagal memuat katalog.");
      setData(json.tentor);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let alive = true;
    void (async () => {
      const q = new URLSearchParams();
      if (abkOnly) q.set("abk", "1");
      try {
        const res = await fetch(`/api/tutors?${q.toString()}`);
        const json = await res.json();
        if (!alive) return;
        if (!res.ok) throw new Error(json.error ?? "Gagal memuat katalog.");
        setData(json.tentor);
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside aria-label="Filter katalog" className="h-fit rounded-lg border border-line bg-card p-5 lg:sticky lg:top-24">
        <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink">
          <SlidersHorizontal size={15} aria-hidden /> Filter
        </p>
        <div className="space-y-4">
          <Field label="Mata pelajaran">
            <Select value={mapel} onChange={(e) => setMapel(e.target.value)}>
              <option value="">Semua</option>
              {MAPEL.map((m) => <option key={m}>{m}</option>)}
            </Select>
          </Field>
          <Field label="Jenjang">
            <Select value={jenjang} onChange={(e) => setJenjang(e.target.value)}>
              <option value="">Semua</option>
              {JENJANG.map((j) => <option key={j}>{j}</option>)}
            </Select>
          </Field>
          <Field label="Kota">
            <Select value={kota} onChange={(e) => setKota(e.target.value)}>
              <option value="">Semua</option>
              {KOTA.map((k) => <option key={k}>{k}</option>)}
            </Select>
          </Field>
          <Field label="Jenis sesi">
            <Select value={sesi} onChange={(e) => setSesi(e.target.value)}>
              <option value="">Semua</option>
              <option value="online">Online / daring</option>
              <option value="offline">Offline / tatap muka</option>
            </Select>
          </Field>
          <Field label="Maksimal harga per sesi (ribu Rupiah)">
            <Input
              type="number"
              min={50}
              step={10}
              value={maxHarga}
              onChange={(e) => setMaxHarga(e.target.value)}
              placeholder="mis. 200"
            />
          </Field>
          <label className="flex cursor-pointer items-center gap-2.5 rounded-md border border-line px-3 py-2.5 text-sm font-medium text-ink">
            <input
              type="checkbox"
              checked={abkOnly}
              onChange={(e) => setAbkOnly(e.target.checked)}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            Hanya tentor bersertifikasi ABK
          </label>
          <button type="button" onClick={() => void load()} className={buttonClass("primary", true)}>
            Terapkan filter
          </button>
        </div>
      </aside>

      <div>
        {error && <p className="mb-4 text-sm text-danger">{error}</p>}
        {loading ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-56 animate-pulse rounded-lg border border-line bg-card" />
            ))}
          </div>
        ) : data ? (
          <>
            <p className="mb-4 text-sm text-muted">
              {data.length} tentor terverifikasi ditemukan
              {abkOnly && " · filter ABK aktif"}
            </p>
            {data.length === 0 ? (
              <p className="rounded-md border border-line bg-card p-8 text-center text-sm text-muted">
                Tidak ada tentor yang cocok dengan filter ini. Coba longgarkan salah satu filter.
              </p>
            ) : (
              <div className="grid gap-5 lg:grid-cols-2">
                {data.map((t) => (
                  <TutorCard key={t.id} tutor={t} />
                ))}
              </div>
            )}
          </>
        ) : null}
        {!loading && !data && (
          <p className="flex items-center gap-2 text-sm text-muted">
            <Loader2 size={14} className="animate-spin" aria-hidden /> Memuat…
          </p>
        )}
      </div>
    </div>
  );
}