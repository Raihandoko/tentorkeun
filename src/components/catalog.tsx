"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Loader2, SlidersHorizontal } from "lucide-react";
import type { Tutor } from "@/lib/types";
import { TutorCard } from "@/components/tutor-card";
import { buttonClass, Field, Input, Select } from "@/components/ui";
import { Inview } from "@/components/motion";

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
  const [filterOpen, setFilterOpen] = useState(false);
  const aktif = [mapel, jenjang, kota, sesi, maxHarga].filter(Boolean).length + (abkOnly ? 1 : 0);

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
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
      <aside aria-label="Filter katalog" className="h-fit rounded-3xl border border-line bg-card p-5 lg:sticky lg:top-24">
        <button
          type="button"
          onClick={() => setFilterOpen((o) => !o)}
          aria-expanded={filterOpen}
          aria-controls="filter-isi"
          className="flex w-full items-center gap-2 text-sm font-semibold text-ink lg:pointer-events-none"
        >
          <SlidersHorizontal size={15} aria-hidden /> Filter
          {aktif > 0 && (
            <span className="num rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-ink">{aktif} aktif</span>
          )}
          <ChevronDown
            size={16}
            aria-hidden
            className={`ml-auto transition-transform duration-300 lg:hidden ${filterOpen ? "rotate-180" : ""}`}
          />
        </button>
        <div id="filter-isi" className={`${filterOpen ? "block" : "hidden"} mt-4 space-y-4 lg:block`}>
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
          <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-line-strong/50 px-3 py-2.5 text-sm font-medium text-ink">
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
              <div key={i} className="skeleton h-56 rounded-3xl border border-line bg-card" />
            ))}
          </div>
        ) : data ? (
          <>
            <p className="mb-4 text-sm text-muted">
              {data.length} tentor terverifikasi ditemukan
              {abkOnly && ", hanya yang bersertifikat ABK"}
            </p>
            {data.length === 0 ? (
              <p className="rounded-3xl border border-line bg-card p-8 text-center text-sm text-muted">
                Tidak ada tentor yang cocok dengan filter ini. Coba longgarkan salah satu filter.
              </p>
            ) : (
              <div className="grid gap-5 lg:grid-cols-2">
                {data.map((t, i) => (
                  <Inview key={t.id} index={i % 2} y={22} className="h-full">
                    <TutorCard tutor={t} />
                  </Inview>
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