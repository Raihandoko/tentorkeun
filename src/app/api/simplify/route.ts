import { NextResponse } from "next/server";
import { simplifyText } from "@/lib/ai";

export const dynamic = "force-dynamic";

const MODES = ["disleksia", "tunanetra", "tunarungu", "ADHD", "autisme"] as const;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { teks?: string; mode?: string };
    const teks = (body.teks ?? "").trim();
    const mode = (MODES as readonly string[]).includes(body.mode ?? "") ? (body.mode as (typeof MODES)[number]) : "autisme";
    if (teks.length < 20) {
      return NextResponse.json({ error: "Teks terlalu pendek untuk disederhanakan." }, { status: 400 });
    }
    const result = await simplifyText(teks, mode);
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal menyederhanakan teks." }, { status: 500 });
  }
}