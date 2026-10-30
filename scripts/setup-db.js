import Database from "better-sqlite3";
import * as bcrypt from "bcrypt";
import path from "path";

const dbPath = path.join(process.cwd(), "tentorkeun.db");
const db = new Database(dbPath);

// Create tables
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'student',
  phone TEXT,
  avatar TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tutors (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  nama TEXT NOT NULL,
  gelar TEXT NOT NULL,
  gender TEXT NOT NULL,
  kota TEXT NOT NULL,
  bio TEXT DEFAULT '',
  mapel TEXT NOT NULL,
  jenjang TEXT NOT NULL,
  harga_per_sesi INTEGER NOT NULL,
  harga_min INTEGER NOT NULL,
  harga_max INTEGER NOT NULL,
  sesi_tersedia TEXT NOT NULL,
  pengalaman_tahun INTEGER DEFAULT 0,
  sertifikasi_abk INTEGER DEFAULT 0,
  kondisi_khusus TEXT DEFAULT '[]',
  jadwal TEXT DEFAULT '[]',
  keahlian TEXT DEFAULT '[]',
  status TEXT DEFAULT 'pending',
  cv_url TEXT,
  portofolio_url TEXT,
  rating REAL DEFAULT 0,
  ulasan_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  tutor_id TEXT NOT NULL,
  mapel TEXT NOT NULL,
  jenjang TEXT NOT NULL,
  session_type TEXT NOT NULL,
  tanggal TEXT NOT NULL,
  durasi INTEGER NOT NULL,
  harga INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  kebutuhan TEXT DEFAULT '',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (tutor_id) REFERENCES tutors(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  booking_id TEXT UNIQUE NOT NULL,
  amount INTEGER NOT NULL,
  method TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  paid_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL,
  tutor_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  tanggal TEXT NOT NULL,
  durasi INTEGER NOT NULL,
  catatan TEXT DEFAULT '',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (tutor_id) REFERENCES tutors(id),
  FOREIGN KEY (student_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  judul TEXT NOT NULL,
  ringkasan TEXT NOT NULL,
  capaian TEXT NOT NULL,
  perlu_perhatian TEXT NOT NULL,
  materi_dibahas TEXT NOT NULL,
  rekomendasi TEXT NOT NULL,
  penilaian INTEGER NOT NULL,
  tren TEXT NOT NULL,
  sent_to_parent INTEGER DEFAULT 0,
  sent_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  tutor_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  rating INTEGER NOT NULL,
  komentar TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tutor_id) REFERENCES tutors(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);
`);

console.log("✅ Database tables created");

// Seed data
const tutorsData = [
  { id: "t1", nama: "Dina Maharani", gelar: "S.Pd. Matematika, UPI Bandung", gender: "P", kota: "Bandung", bio: "Eks guru matematika SMP negeri, kini fokus bimbingan privat dan olimpiade.", mapel: ["Matematika", "Olimpiade Matematika"], jenjang: ["SMP", "SMA", "Mahasiswa"], hargaPerSesi: 180000, hargaMin: 150000, hargaMax: 220000, sesiTersedia: ["online", "offline"], rating: 4.9, ulasanCount: 214, pengalamanTahun: 7, sertifikasiABK: false, kondisiKhusus: [], jadwal: ["Senin", "Kamis", "Sabtu", "Minggu"], keahlian: ["Belajar bertahap", "Latihan intensif"], email: "dina.maharani@tentorkeun.id" },
  { id: "t2", nama: "Rizky Pratama", gelar: "S.Si. Fisika & Matematika, ITB", gender: "L", kota: "Jakarta Selatan", bio: "Spesialis persiapan UTBK & fisika SMA.", mapel: ["Matematika", "Fisika", "UTBK"], jenjang: ["SMP", "SMA"], hargaPerSesi: 220000, hargaMin: 200000, hargaMax: 260000, sesiTersedia: ["online", "offline"], rating: 4.8, ulasanCount: 168, pengalamanTahun: 9, sertifikasiABK: true, kondisiKhusus: ["ADHD", "ABK umum"], jadwal: ["Selasa", "Kamis", "Jumat", "Sabtu"], keahlian: ["UTBK/SBMPTN", "Fisika SMA"], email: "rizky.pratama@tentorkeun.id" },
  { id: "t3", nama: "Nurhayati", gelar: "S.Psi., konselor ABK", gender: "P", kota: "Yogyakarta", bio: "Psikolog lulusan UGM dengan pengalaman pendampingan anak autisme dan ADHD.", mapel: ["Psikologi", "Bimbingan Belajar", "BK"], jenjang: ["SD", "SMP", "SMA"], hargaPerSesi: 165000, hargaMin: 150000, hargaMax: 200000, sesiTersedia: ["online", "offline"], rating: 4.9, ulasanCount: 96, pengalamanTahun: 8, sertifikasiABK: true, kondisiKhusus: ["ADHD", "autisme", "ABK umum"], jadwal: ["Senin", "Rabu", "Jumat", "Sabtu"], keahlian: ["Pendampingan ABK"], email: "nurhayati@tentorkeun.id" },
];

const adminHash = bcrypt.hashSync("admin123", 10);
const studentHash = bcrypt.hashSync("student123", 10);
const tutorHash = bcrypt.hashSync("tutor123", 10);

// Insert admin
const adminId = "admin-" + Date.now();
db.prepare("INSERT OR IGNORE INTO users (id, email, name, password, role) VALUES (?, ?, ?, ?, ?)").run(adminId, "admin@tentorkeun.id", "Admin TentorKeun", adminHash, "admin");

// Insert student
const studentId = "student-" + Date.now();
db.prepare("INSERT OR IGNORE INTO users (id, email, name, password, role, phone) VALUES (?, ?, ?, ?, ?, ?)").run(studentId, "student@example.com", "Budi Santoso", studentHash, "student", "081234567890");

// Insert tutors
tutorsData.forEach((t) => {
  const userId = "user-" + t.id;
  db.prepare("INSERT OR IGNORE INTO users (id, email, name, password, role) VALUES (?, ?, ?, ?, ?)").run(userId, t.email, t.nama, tutorHash, "tutor");
  
  db.prepare(`INSERT OR IGNORE INTO tutors (id, user_id, nama, gelar, gender, kota, bio, mapel, jenjang, harga_per_sesi, harga_min, harga_max, sesi_tersedia, pengalaman_tahun, sertifikasi_abk, kondisi_khusus, jadwal, keahlian, status, rating, ulasan_count) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    t.id, userId, t.nama, t.gelar, t.gender, t.kota, t.bio,
    JSON.stringify(t.mapel), JSON.stringify(t.jenjang),
    t.hargaPerSesi, t.hargaMin, t.hargaMax,
    JSON.stringify(t.sesiTersedia), t.pengalamanTahun,
    t.sertifikasiABK ? 1 : 0, JSON.stringify(t.kondisiKhusus),
    JSON.stringify(t.jadwal), JSON.stringify(t.keahlian),
    "approved", t.rating, t.ulasanCount
  );
  
  console.log(`✅ Tutor: ${t.nama}`);
});

console.log("✨ Database seeded!");
db.close();
