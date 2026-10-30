import { NextResponse } from "next/server";
import { generateStudyPlan } from "@/lib/ai";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      mapel?: string;
      jenjang?: string;
      target?: string;
      kelemahan?: string;
      menit?: number;
    };
    if (!body.mapel) {
      return NextResponse.json({ error: "Pilih mata pelajaran terlebih dahulu." }, { status: 400 });
    }
    const result = await generateStudyPlan({
      mapel: body.mapel,
      jenjang: (body.jenjang ?? "SD").trim(),
      target: (body.target ?? "").trim(),
      kelemahan: (body.kelemahan ?? "").trim(),
      menit: Math.min(180, Math.max(15, Number(body.menit) || 45)),
    });
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal membuat rencana belajar." }, { status: 500 });
  }
}