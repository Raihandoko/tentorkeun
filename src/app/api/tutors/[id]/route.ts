import { NextResponse } from "next/server";
import { tutores } from "@/lib/data/tutors";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const tutor = tutores.find((t) => t.id === id);
  if (!tutor) {
    return NextResponse.json({ error: "Tentor tidak ditemukan." }, { status: 404 });
  }
  return NextResponse.json(tutor);
}