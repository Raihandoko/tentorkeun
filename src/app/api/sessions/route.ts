import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "tutor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tutorProfile = await db.tutor.findUnique({
      where: { userId: session.user.id },
    });

    if (!tutorProfile) {
      return NextResponse.json({ error: "Tutor profile not found" }, { status: 404 });
    }

    const { bookingId, tanggal, durasi, catatan } = await req.json();

    if (!bookingId || !tanggal || !durasi) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: { student: true },
    });

    if (!booking || booking.tutorId !== tutorProfile.id) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const session_record = await db.session.create({
      data: {
        bookingId,
        tutorId: tutorProfile.id,
        studentId: booking.studentId,
        tanggal: new Date(tanggal),
        durasi: parseInt(durasi),
        catatan: catatan || "",
      },
    });

    return NextResponse.json(session_record);
  } catch (error) {
    console.error("[session create]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
