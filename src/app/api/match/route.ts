import { NextResponse } from "next/server";
import { matchTentor } from "@/lib/ai";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { teks?: string };
    const teks = (body.teks ?? "").trim();
    if (teks.length < 10) {
      return NextResponse.json(
        { error: "Tuliskan kebutuhan Anda minimal dalam satu kalimat utuh (mis. kursus, jenjang, anggaran)." },
        { status: 400 },
      );
    }
    const result = await matchTentor(teks);
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal memproses pencocokan." }, { status: 500 });
  }
}