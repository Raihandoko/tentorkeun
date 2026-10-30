import { NextResponse } from "next/server";
import { verifyTentor } from "@/lib/ai";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { cv?: string };
    const cv = (body.cv ?? "").trim();
    if (cv.length < 60) {
      return NextResponse.json(
        { error: "Tempel CV atau portofolio yang lebih lengkap (minimal 60 karakter)." },
        { status: 400 },
      );
    }
    const result = await verifyTentor(cv);
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal memverifikasi CV." }, { status: 500 });
  }
}