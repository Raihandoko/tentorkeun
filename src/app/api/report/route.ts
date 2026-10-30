import { NextResponse } from "next/server";
import { generateReport } from "@/lib/ai";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      catatan?: string;
      mapel?: string;
      jenjang?: string;
      namaSiswa?: string;
      namaTentor?: string;
    };
    const catatan = (body.catatan ?? "").trim();
    if (catatan.length < 20) {
      return NextResponse.json(
        { error: "Catatan sesi masih terlalu pendek. Ceritakan apa yang terjadi di sesi." },
        { status: 400 },
      );
    }
    const result = await generateReport({
      catatan,
      mapel: (body.mapel ?? "Matematika").trim(),
      jenjang: (body.jenjang ?? "SD").trim(),
      namaSiswa: (body.namaSiswa ?? "siswa").trim(),
      namaTentor: (body.namaTentor ?? "tentor").trim(),
    });
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal membuat laporan." }, { status: 500 });
  }
}