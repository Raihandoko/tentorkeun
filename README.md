# TentorKeun - Platform Bimbingan Belajar Privat Berbasis AI

Platform digital untuk mencocokkan siswa dengan tentor yang tepat menggunakan AI, lengkap dengan sistem booking, verifikasi tentor, laporan progress otomatis, dan fitur aksesibilitas untuk siswa berkebutuhan khusus.

## Setup

### 1. Install Dependencies

```bash
npm install prisma @prisma/client bcrypt @types/bcrypt next-auth@beta tsx
```

### 2. Setup Database

```bash
# Push schema ke database (SQLite)
npx prisma db push

# Seed data (16 tentor + admin + demo users)
npm run db:seed
```

### 3. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## Demo Accounts

### Admin
- Email: `admin@tentorkeun.id`
- Password: `admin123`
- Akses: Kelola tentor, booking, users

### Student
- Email: `student@example.com`
- Password: `student123`
- Akses: Cari tentor, booking, lihat laporan

### Tutor
- Email: `dina.maharani@tentorkeun.id` (atau tentor lain)
- Password: `tutor123`
- Akses: Jadwal, input sesi, buat laporan

## Fitur Utama

### 1. AI Matching Engine
- Input kebutuhan dengan bahasa natural
- AI ranking + alasan kecocokan
- Filter: mapel, jenjang, anggaran, jadwal, ABK

### 2. Authentication & Role-Based Access
- NextAuth dengan role: student, tutor, admin
- Password hashing (bcrypt)
- Protected routes per role

### 3. Admin Dashboard
- Approve/reject tentor baru
- Monitor semua booking
- Kelola users

### 4. Student Dashboard
- Cari tentor (AI matching)
- Booking & jadwal
- Lihat laporan progress
- Buat study plan adaptif

### 5. Tutor Dashboard
- Lihat jadwal booking
- Input sesi belajar
- Generate progress report dengan AI
- Profil & CV upload (future: uploadthing)

### 6. Booking System
- Create booking dengan status flow
- Payment tracking (pending/paid)
- Session tracking per booking

### 7. Progress Report Generator
- AI convert catatan tentor → laporan terstruktur
- Capaian, perlu perhatian, rekomendasi
- Otomatis kirim ke orang tua (future: email)

### 8. Review & Rating System
- Student kasih rating post-session
- Auto-update tutor rating & ulasan count

### 9. Study Plan Generator
- AI buat rencana belajar mingguan
- Soal latihan adaptif bertingkat
- Berdasarkan target & kelemahan siswa

### 10. Accessibility Features
- Filter tentor bersertifikasi ABK
- Penyederhanaan materi (disleksia/ADHD/autisme)
- Text-to-speech & live caption (future)

## Tech Stack

- **Framework**: Next.js 16 App Router + React 19
- **Database**: Prisma + SQLite (gampang migrasi ke Postgres)
- **Auth**: NextAuth v5 (beta)
- **Styling**: Tailwind CSS 4
- **AI**: OpenAI-compatible API (Gemini/OpenAI/Groq)
- **TypeScript**: Full type safety

## Database Schema

- `User` - Auth + role (student/tutor/admin)
- `Tutor` - Profil tentor lengkap
- `TutorVerification` - CV screening AI
- `Booking` - Jadwal sesi
- `Payment` - Tracking pembayaran
- `Session` - Log sesi belajar
- `Report` - Laporan progress
- `Review` - Rating & ulasan
- `StudyPlan` - Rencana belajar

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run db:push      # Push schema ke DB
npm run db:seed      # Seed demo data
npm run db:studio    # Prisma Studio GUI
```

## Environment Variables

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Optional: LLM API
OPENAI_API_KEY=
OPENAI_BASE_URL=
OPENAI_MODEL=
```

## Next Steps (Future Enhancements)

- [ ] File upload (uploadthing) untuk CV/portofolio
- [ ] Email notifications (resend/nodemailer)
- [ ] WhatsApp integration untuk notifikasi
- [ ] Payment gateway (Midtrans/Xendit)
- [ ] Real-time chat siswa-tentor
- [ ] Video call integration (Zoom/Google Meet)
- [ ] Mobile app (React Native/Flutter)
- [ ] Analytics dashboard untuk admin
- [ ] Bulk import tentor dari CSV
- [ ] Export laporan ke PDF

## Slide Tugas (Fitur yang Diimplementasikan)

✅ **Matching Engine** - AI ranking tentor + alasan kecocokan  
✅ **Verifikasi Tentor** - CV screening otomatis (admin approve)  
✅ **Progress Report** - Generate laporan dari catatan sesi  
✅ **Study Plan Generator** - Rencana mingguan + soal adaptif  
✅ **Aksesibilitas ABK** - Filter sertifikasi + simplifikasi materi  

## License

Private project untuk tugas kuliah.
