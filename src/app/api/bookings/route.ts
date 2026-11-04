import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tutorId, mapel, jenjang, sessionType, tanggal, durasi, harga, kebutuhan } = await req.json();

    if (!tutorId || !mapel || !jenjang || !tanggal || !durasi || !harga) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const bookingId = `b${Date.now()}`;
    
    db.prepare(`
      INSERT INTO bookings (id, studentId, tutorId, mapel, jenjang, sessionType, tanggal, durasi, harga, kebutuhan, status, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      bookingId,
      session.user.id,
      tutorId,
      mapel,
      jenjang,
      sessionType || "online",
      new Date(tanggal).toISOString(),
      parseInt(durasi),
      parseInt(harga),
      kebutuhan || "",
      "pending",
      new Date().toISOString()
    );

    const paymentId = `p${Date.now()}`;
    db.prepare(`
      INSERT INTO payments (id, bookingId, amount, method, status, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(paymentId, bookingId, parseInt(harga), "transfer", "pending", new Date().toISOString());

    const booking = db.prepare("SELECT * FROM bookings WHERE id = ?").get(bookingId);

    return NextResponse.json(booking);
  } catch (error) {
    console.error("[booking create]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let bookings;
    if (session.user.role === "student") {
      bookings = db.prepare(`
        SELECT b.*, 
               u.nama as studentNama, u.email as studentEmail,
               t.nama as tutorNama, t.gelar as tutorGelar,
               p.amount as paymentAmount, p.status as paymentStatus
        FROM bookings b
        LEFT JOIN users u ON b.studentId = u.id
        LEFT JOIN tutors t ON b.tutorId = t.id
        LEFT JOIN payments p ON b.id = p.bookingId
        WHERE b.studentId = ?
        ORDER BY b.createdAt DESC
      `).all(session.user.id);
    } else if (session.user.role === "tutor") {
      const tutor = db.prepare("SELECT * FROM tutors WHERE userId = ?").get(session.user.id) as any;
      if (tutor) {
        bookings = db.prepare(`
          SELECT b.*, 
                 u.nama as studentNama, u.email as studentEmail,
                 t.nama as tutorNama, t.gelar as tutorGelar,
                 p.amount as paymentAmount, p.status as paymentStatus
          FROM bookings b
          LEFT JOIN users u ON b.studentId = u.id
          LEFT JOIN tutors t ON b.tutorId = t.id
          LEFT JOIN payments p ON b.id = p.bookingId
          WHERE b.tutorId = ?
          ORDER BY b.createdAt DESC
        `).all(tutor.id);
      } else {
        bookings = [];
      }
    } else {
      bookings = db.prepare(`
        SELECT b.*, 
               u.nama as studentNama, u.email as studentEmail,
               t.nama as tutorNama, t.gelar as tutorGelar,
               p.amount as paymentAmount, p.status as paymentStatus
        FROM bookings b
        LEFT JOIN users u ON b.studentId = u.id
        LEFT JOIN tutors t ON b.tutorId = t.id
        LEFT JOIN payments p ON b.id = p.bookingId
        ORDER BY b.createdAt DESC
      `).all();
    }

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("[booking get]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
