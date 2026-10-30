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

    const review = await db.review.create({
      data: {
        tutorId,
        studentId: session.user.id,
        rating: parseInt(rating),
        komentar: komentar || "",
      },
    });

    // Update tutor rating
    const reviews = await db.review.findMany({
      where: { tutorId },
    });

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await db.tutor.update({
      where: { id: tutorId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        ulasanCount: reviews.length,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("[review create]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
