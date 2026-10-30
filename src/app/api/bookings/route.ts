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

    const booking = await db.booking.create({
      data: {
        studentId: session.user.id,
        tutorId,
        mapel,
        jenjang,
        sessionType: sessionType || "online",
        tanggal: new Date(tanggal),
        durasi: parseInt(durasi),
        harga: parseInt(harga),
        kebutuhan: kebutuhan || "",
        status: "pending",
      },
    });

    // Create pending payment
    await db.payment.create({
      data: {
        bookingId: booking.id,
        amount: parseInt(harga),
        method: "transfer",
        status: "pending",
      },
    });

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

    let where = {};
    if (session.user.role === "student") {
      where = { studentId: session.user.id };
    } else if (session.user.role === "tutor") {
      const tutor = await db.tutor.findUnique({ where: { userId: session.user.id } });
      if (tutor) where = { tutorId: tutor.id };
    }

    const bookings = await db.booking.findMany({
      where,
      include: {
        student: true,
        tutor: true,
        payment: true,
        sessions: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("[booking get]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
