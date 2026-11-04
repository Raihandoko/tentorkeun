import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tutorId, rating, komentar } = await req.json();

    if (!tutorId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
    }

    const reviewId = `r${Date.now()}`;
    
    db.prepare(`
      INSERT INTO reviews (id, tutor_id, student_id, rating, komentar, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(reviewId, tutorId, session.user.id, parseInt(rating), komentar || "", new Date().toISOString());

    const reviews = db.prepare("SELECT * FROM reviews WHERE tutor_id = ?").all(tutorId) as any[];
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    db.prepare(`
      UPDATE tutors SET rating = ?, ulasan_count = ? WHERE id = ?
    `).run(Math.round(avgRating * 10) / 10, reviews.length, tutorId);

    const review = db.prepare("SELECT * FROM reviews WHERE id = ?").get(reviewId);

    return NextResponse.json(review);
  } catch (error) {
    console.error("[review create]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
