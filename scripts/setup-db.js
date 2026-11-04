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
  { id: "t1", nama: "Dina Maharani", gelar: "S.Pd. Matematika, UPI Bandung", gender: "P", kota: "Bandung", bio: "Eks guru matematika SMP negeri, kini fokus bimbingan privat dan olimpiade. Pendekatannya bertahap: kuasai konsep, baru latihan soal menantang.", mapel: ["Matematika", "Olimpiade Matematika"], jenjang: ["SMP", "SMA", "Mahasiswa"], hargaPerSesi: 180000, hargaMin: 150000, hargaMax: 220000, sesiTersedia: ["online", "offline"], rating: 4.9, ulasanCount: 214, pengalamanTahun: 7, sertifikasiABK: false, kondisiKhusus: [], jadwal: ["Senin", "Kamis", "Sabtu", "Minggu"], keahlian: ["Belajar bertahap", "Latihan intensif", "Penguatan konsep"], email: "dina.maharani@tentorkeun.id" },
  { id: "t2", nama: "Rizky Pratama", gelar: "S.Si. Fisika & Matematika, ITB", gender: "L", kota: "Jakarta Selatan", bio: "Spesialis persiapan UTBK & fisika SMA. Terbiasa menyesuaikan ritme belajar untuk siswa dengan rentang perhatian pendek.", mapel: ["Matematika", "Fisika", "UTBK"], jenjang: ["SMP", "SMA"], hargaPerSesi: 220000, hargaMin: 200000, hargaMax: 260000, sesiTersedia: ["online", "offline"], rating: 4.8, ulasanCount: 168, pengalamanTahun: 9, sertifikasiABK: true, kondisiKhusus: ["ADHD", "ABK umum"], jadwal: ["Selasa", "Kamis", "Jumat", "Sabtu"], keahlian: ["UTBK/SBMPTN", "Fisika SMA", "Adaptif & sabar"], email: "rizky.pratama@tentorkeun.id" },
  { id: "t3", nama: "Nurhayati", gelar: "S.Psi., konselor ABK", gender: "P", kota: "Yogyakarta", bio: "Psikolog lulusan UGM dengan pengalaman pendampingan anak autisme dan ADHD. Menggabungkan pendekatan psikologis dengan materi kurikulum.", mapel: ["Psikologi", "Bimbingan Belajar", "BK"], jenjang: ["SD", "SMP", "SMA"], hargaPerSesi: 165000, hargaMin: 150000, hargaMax: 200000, sesiTersedia: ["online", "offline"], rating: 4.9, ulasanCount: 96, pengalamanTahun: 8, sertifikasiABK: true, kondisiKhusus: ["ADHD", "autisme", "ABK umum"], jadwal: ["Senin", "Rabu", "Jumat", "Sabtu"], keahlian: ["Pendampingan ABK", "Manajemen fokus", "Konsultasi orang tua"], email: "nurhayati@tentorkeun.id" },
  { id: "t4", nama: "Andi Saputra", gelar: "S.Pd. Pendidikan Bahasa, UNESA", gender: "L", kota: "Surabaya", bio: "Mengajar bahasa Indonesia dan IPS dengan banyak cerita & diskusi. Cocok untuk siswa yang bosan dengan hafalan.", mapel: ["Bahasa Indonesia", "IPS", "Sejarah"], jenjang: ["SD", "SMP"], hargaPerSesi: 130000, hargaMin: 120000, hargaMax: 150000, sesiTersedia: ["offline"], rating: 4.6, ulasanCount: 132, pengalamanTahun: 5, sertifikasiABK: false, kondisiKhusus: [], jadwal: ["Senin", "Rabu", "Sabtu", "Minggu"], keahlian: ["Belajar lewat cerita", "Bahasa Indonesia", "IPS"], email: "andi.saputra@tentorkeun.id" },
  { id: "t5", nama: "Bella Kusuma", gelar: "M.Pd. English Education, Oxford-certified", gender: "P", kota: "Jakarta Timur", bio: "Pernah mengajar bahasa Inggris di lembaga bahasa internasional. Fokus speaking, grammar, dan persiapan IELTS/TOEFL.", mapel: ["Bahasa Inggris", "IELTS", "TOEFL"], jenjang: ["SMA", "Mahasiswa", "Umum"], hargaPerSesi: 250000, hargaMin: 230000, hargaMax: 300000, sesiTersedia: ["online"], rating: 4.9, ulasanCount: 189, pengalamanTahun: 11, sertifikasiABK: false, kondisiKhusus: [], jadwal: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"], keahlian: ["IELTS/TOEFL", "Speaking", "Grammar"], email: "bella.kusuma@tentorkeun.id" },
  { id: "t6", nama: "Fajar Nugroho", gelar: "S.Kom. Informatika, UGM", gender: "L", kota: "Yogyakarta", bio: "Web developer yang juga mengajar. Belajar logika pemrograman dari nol sampai bisa bikin proyek sendiri.", mapel: ["Komputer", "Pemrograman", "Matematika"], jenjang: ["SMA", "Mahasiswa"], hargaPerSesi: 200000, hargaMin: 180000, hargaMax: 240000, sesiTersedia: ["online"], rating: 4.7, ulasanCount: 88, pengalamanTahun: 8, sertifikasiABK: false, kondisiKhusus: [], jadwal: ["Selasa", "Kamis", "Jumat", "Sabtu"], keahlian: ["Pemrograman", "Logika", "Proyek nyata"], email: "fajar.nugroho@tentorkeun.id" },
  { id: "t7", nama: "Sari Wulandari", gelar: "S.Pd. PGSD, khusus calistung & disleksia", gender: "P", kota: "Bekasi", bio: "Guru SD dengan sertifikasi pendamping disleksia. Sabar mengajari membaca, menulis, dan berhitung dengan cara yang visual.", mapel: ["Calistung", "Matematika", "Bahasa Indonesia"], jenjang: ["TK", "SD"], hargaPerSesi: 120000, hargaMin: 110000, hargaMax: 140000, sesiTersedia: ["online", "offline"], rating: 4.8, ulasanCount: 143, pengalamanTahun: 6, sertifikasiABK: true, kondisiKhusus: ["disleksia", "ABK umum"], jadwal: ["Senin", "Rabu", "Jumat", "Sabtu"], keahlian: ["Calistung", "Pendampingan disleksia", "Belajar visual"], email: "sari.wulandari@tentorkeun.id" },
  { id: "t8", nama: "Hendra Gunawan", gelar: "M.Sc. Kimia UGM, ex-guru SMA", gender: "L", kota: "Semarang", bio: "Menguasai kimia & biologi SMA/Mahasiswa. Menjelaskan konsep sulit dengan analogi kehidupan sehari-hari.", mapel: ["Kimia", "Biologi"], jenjang: ["SMA", "Mahasiswa"], hargaPerSesi: 210000, hargaMin: 190000, hargaMax: 240000, sesiTersedia: ["online"], rating: 4.7, ulasanCount: 121, pengalamanTahun: 10, sertifikasiABK: false, kondisiKhusus: [], jadwal: ["Senin", "Selasa", "Kamis", "Sabtu"], keahlian: ["Kimia", "Biologi", "Analogi sederhana"], email: "hendra.gunawan@tentorkeun.id" },
  { id: "t9", nama: "Laila Fitriani", gelar: "S.S. Bahasa Arab, UIN Bandung", gender: "P", kota: "Bandung", bio: "Mengajar mengaji, tajwid, dan tahfiz untuk anak-anak sampai remaja. Berpengalaman di TPQ dan bimbingan privat Al-Quran.", mapel: ["Mengaji", "Bahasa Arab", "Tahfiz"], jenjang: ["TK", "SD", "SMP"], hargaPerSesi: 150000, hargaMin: 140000, hargaMax: 180000, sesiTersedia: ["offline"], rating: 4.9, ulasanCount: 167, pengalamanTahun: 8, sertifikasiABK: false, kondisiKhusus: [], jadwal: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"], keahlian: ["Tahfiz", "Tajwid", "Mengaji anak"], email: "laila.fitriani@tentorkeun.id" },
  { id: "t10", nama: "Yoga Perkasa", gelar: "S.Pd. Fisika, UNY", gender: "L", kota: "Depok", bio: "Pengajar fisika & matematika kompetisi. Terbiasa membimbing siswa ABK dengan instruksi bertahap dan banyak contoh visual.", mapel: ["Fisika", "Matematika", "Olimpiade Matematika"], jenjang: ["SMP", "SMA"], hargaPerSesi: 190000, hargaMin: 170000, hargaMax: 220000, sesiTersedia: ["online", "offline"], rating: 4.8, ulasanCount: 104, pengalamanTahun: 7, sertifikasiABK: true, kondisiKhusus: ["ABK umum"], jadwal: ["Selasa", "Rabu", "Jumat", "Minggu"], keahlian: ["Olimpiade", "Instruksi bertahap", "Contoh visual"], email: "yoga.perkasa@tentorkeun.id" },
  { id: "t11", nama: "Melati Anjani", gelar: "S.Pd. Ekonomi, UNJ", gender: "P", kota: "Jakarta Pusat", bio: "Mengajar ekonomi & akuntansi dengan studi kasus nyata. Sering membantu siswa mempersiapkan ujian sekolah dan pendalaman ekonomi.", mapel: ["Ekonomi", "Akuntansi", "IPS"], jenjang: ["SMA", "Mahasiswa"], hargaPerSesi: 175000, hargaMin: 160000, hargaMax: 210000, sesiTersedia: ["online", "offline"], rating: 4.6, ulasanCount: 71, pengalamanTahun: 4, sertifikasiABK: false, kondisiKhusus: [], jadwal: ["Senin", "Rabu", "Jumat", "Sabtu"], keahlian: ["Akuntansi", "Studi kasus", "Ekonomi"], email: "melati.anjani@tentorkeun.id" },
  { id: "t12", nama: "Rangga Aditya", gelar: "S.Si. Statistika, ITS", gender: "L", kota: "Surabaya", bio: "Muda tapi solid: menguasai matematika & statistika tingkat SMA sampai kuliah, dengan cara ngobrol yang santai.", mapel: ["Matematika", "Statistika"], jenjang: ["SMA", "Mahasiswa"], hargaPerSesi: 160000, hargaMin: 150000, hargaMax: 190000, sesiTersedia: ["online"], rating: 4.5, ulasanCount: 49, pengalamanTahun: 3, sertifikasiABK: false, kondisiKhusus: [], jadwal: ["Senin", "Kamis", "Sabtu"], keahlian: ["Statistika", "Matematika", "Santai"], email: "rangga.aditya@tentorkeun.id" },
  { id: "t13", nama: "Putri Aisyah", gelar: "M.Pd. Bahasa, pengalaman ABK 12 th", gender: "P", kota: "Medan", bio: "Dua puluh tahun di dunia pendidikan; kini berfokus bahasa Inggris & Indonesia untuk siswa reguler dan ABK disleksia.", mapel: ["Bahasa Inggris", "Bahasa Indonesia", "Bimbingan Belajar"], jenjang: ["SD", "SMP", "SMA"], hargaPerSesi: 140000, hargaMin: 130000, hargaMax: 170000, sesiTersedia: ["online", "offline"], rating: 4.8, ulasanCount: 156, pengalamanTahun: 12, sertifikasiABK: true, kondisiKhusus: ["disleksia", "ABK umum"], jadwal: ["Selasa", "Rabu", "Kamis", "Sabtu", "Minggu"], keahlian: ["Disleksia", "Bahasa", "Sabar & berpengalaman"], email: "putri.aisyah@tentorkeun.id" },
  { id: "t14", nama: "Dimas Ario", gelar: "S.T. Teknik, UI", gender: "L", kota: "Jakarta Utara", bio: "Alumni UI yang paham betul seluk-beluk UTBK. Mengajar matematika & fisika dengan bank soal terstruktur.", mapel: ["Matematika", "Fisika", "UTBK"], jenjang: ["SMA"], hargaPerSesi: 200000, hargaMin: 180000, hargaMax: 240000, sesiTersedia: ["online", "offline"], rating: 4.7, ulasanCount: 92, pengalamanTahun: 6, sertifikasiABK: false, kondisiKhusus: [], jadwal: ["Senin", "Kamis", "Jumat", "Sabtu"], keahlian: ["UTBK", "Bank soal", "Strategi ujian"], email: "dimas.ario@tentorkeun.id" },
  { id: "t15", nama: "Fitria Ramadhani", gelar: "S.Psi., terapis wicara & persepsi", gender: "P", kota: "Bandung", bio: "Pendamping belajar untuk anak dengan autisme dan tunanetra; mahir materi audio-visual dan media braille-friendly.", mapel: ["Bimbingan Belajar", "Psikologi", "Calistung"], jenjang: ["TK", "SD", "SMP"], hargaPerSesi: 175000, hargaMin: 160000, hargaMax: 210000, sesiTersedia: ["online", "offline"], rating: 4.9, ulasanCount: 73, pengalamanTahun: 9, sertifikasiABK: true, kondisiKhusus: ["autisme", "tunanetra", "ABK umum"], jadwal: ["Senin", "Selasa", "Rabu", "Jumat"], keahlian: ["Autisme", "Tunanetra", "Media aksesibel"], email: "fitria.ramadhani@tentorkeun.id" },
  { id: "t16", nama: "Bagas Setyawan", gelar: "S.Pd. PGSD UNM", gender: "L", kota: "Tangerang", bio: "Guru SD yang hangat dan penuh permainan edukatif. Cocok untuk anak SD kelas 1–6 yang butuh semangat belajar lagi.", mapel: ["Calistung", "Matematika", "IPA"], jenjang: ["SD"], hargaPerSesi: 110000, hargaMin: 100000, hargaMax: 130000, sesiTersedia: ["offline"], rating: 4.6, ulasanCount: 118, pengalamanTahun: 4, sertifikasiABK: false, kondisiKhusus: [], jadwal: ["Senin", "Rabu", "Kamis", "Minggu"], keahlian: ["Permainan edukatif", "SD", "Semangat belajar"], email: "bagas.setyawan@tentorkeun.id" },
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
