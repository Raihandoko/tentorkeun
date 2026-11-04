import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "tutor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tutorProfile = db.prepare("SELECT * FROM tutors WHERE userId = ?").get(session.user.id) as any;

    if (!tutorProfile) {
      return NextResponse.json({ error: "Tutor profile not found" }, { status: 404 });
    }

    const { bookingId, tanggal, durasi, catatan } = await req.json();

    if (!bookingId || !tanggal || !durasi) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const booking = db.prepare("SELECT * FROM bookings WHERE id = ?").get(bookingId) as any;

    if (!booking || booking.tutorId !== tutorProfile.id) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const sessionId = `s${Date.now()}`;
    
    db.prepare(`
      INSERT INTO sessions (id, bookingId, tutorId, studentId, tanggal, durasi, catatan, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      sessionId,
      bookingId,
      tutorProfile.id,
      booking.studentId,
      new Date(tanggal).toISOString(),
      parseInt(durasi),
      catatan || "",
      new Date().toISOString()
    );

    db.prepare("UPDATE bookings SET status = ? WHERE id = ?").run("completed", bookingId);

    const session_record = db.prepare("SELECT * FROM sessions WHERE id = ?").get(sessionId);

    return NextResponse.json(session_record);
  } catch (error) {
    console.error("[session create]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
