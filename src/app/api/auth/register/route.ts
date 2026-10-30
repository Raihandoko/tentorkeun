import { NextResponse } from "next/server";
import * as bcrypt from "bcrypt";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, email, password, phone, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const exists = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (exists) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
    }

    const hash = await bcrypt.hash(password, 10);
    const userId = "user-" + Date.now();
    
    db.prepare("INSERT INTO users (id, email, name, password, role, phone) VALUES (?, ?, ?, ?, ?, ?)").run(
      userId, email, name, hash, role || "student", phone || null
    );

    return NextResponse.json({ id: userId, email });
  } catch (error) {
    console.error("[register]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
