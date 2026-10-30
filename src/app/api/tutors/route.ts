import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { Jenjang, SessionType } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const mapel = url.searchParams.get("mapel");
    const jenjang = url.searchParams.get("jenjang") as Jenjang | null;
    const kota = url.searchParams.get("kota");
    const maxHarga = url.searchParams.get("maxHarga");
    const abk = url.searchParams.get("abk") === "1";
    const sesi = url.searchParams.get("sesi") as SessionType | null;

    const tutors = db.prepare("SELECT * FROM tutors WHERE status = ?").all("approved") as any[];

    const hasil = tutors
      .map((t) => ({
        id: t.id,
        nama: t.nama,
        gelar: t.gelar,
        gender: t.gender,
        kota: t.kota,
        bio: t.bio,
        mapel: JSON.parse(t.mapel),
        jenjang: JSON.parse(t.jenjang),
        hargaPerSesi: t.harga_per_sesi,
        hargaMin: t.harga_min,
        hargaMax: t.harga_max,
        sesiTersedia: JSON.parse(t.sesi_tersedia),
        rating: t.rating,
        ulasanCount: t.ulasan_count,
        pengalamanTahun: t.pengalaman_tahun,
        sertifikasiABK: t.sertifikasi_abk === 1,
        kondisiKhusus: JSON.parse(t.kondisi_khusus),
        jadwal: JSON.parse(t.jadwal),
        keahlian: JSON.parse(t.keahlian),
      }))
      .filter((t) => {
        if (mapel && !t.mapel.some((m: string) => m.toLowerCase().includes(mapel.toLowerCase()))) return false;
        if (jenjang && !t.jenjang.includes(jenjang)) return false;
        if (kota && !t.kota.toLowerCase().includes(kota.toLowerCase())) return false;
        if (maxHarga && t.hargaPerSesi > Number(maxHarga)) return false;
        if (abk && !t.sertifikasiABK) return false;
        if (sesi && !t.sesiTersedia.includes(sesi)) return false;
        return true;
      });

    return NextResponse.json({ jumlah: hasil.length, tentor: hasil });
  } catch (error) {
    console.error("[tutors api]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}