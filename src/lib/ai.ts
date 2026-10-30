import type { Tutor } from "@/lib/types";
import { db } from "@/lib/db";
import { llmConfig, llmEnabled } from "@/lib/llm/client";
import { OpenAICompatClient, extractJson } from "@/lib/llm/openai";
import { mockMatch, mockVerify, mockReport, mockStudyPlan, mockSimplify } from "@/lib/llm/mock";

export type Via = "llm" | "mock";

export interface MatchKecocokan {
  tutor: Tutor;
  skor: number;
  label: string;
  alasan: string[];
}

export interface MatchResponse {
  via: Via;
  ringkasan: string;
  dibaca: string;
  hasil: MatchKecocokan[];
}

function client(): OpenAICompatClient | null {
  const cfg = llmConfig();
  if (!llmEnabled() || !cfg.apiKey) return null;
  return new OpenAICompatClient(cfg.baseUrl, cfg.apiKey, cfg.model);
}

/* ------------------------------ Matching ------------------------------ */

const MATCH_SYSTEM = (): string => {
  const tutors = db.prepare("SELECT * FROM tutors WHERE status = ?").all("approved") as any[];

  const tutorList = tutors.map((t) => ({
    id: t.id,
    nama: t.nama,
    gelar: t.gelar,
    kota: t.kota,
    mapel: JSON.parse(t.mapel),
    jenjang: JSON.parse(t.jenjang),
    hargaPerSesi: t.harga_per_sesi,
    sesiTersedia: JSON.parse(t.sesi_tersedia),
    gender: t.gender,
    sertifikasiABK: t.sertifikasi_abk === 1,
    kondisiKhusus: JSON.parse(t.kondisi_khusus),
    jadwal: JSON.parse(t.jadwal),
    rating: t.rating,
    pengalamanTahun: t.pengalaman_tahun,
  }));

  return `Kamu adalah AI pencari tentor dari agensi TentorKeun. Tugasmu mencocokkan permintaan orang tua/siswa (dalam bahasa natural Indonesia) dengan katalog tentor terverifikasi.

Katalog tentor (JSON):
${JSON.stringify(tutorList, null, 0)}

Pahami kebutuhan dari kalimat: mapel, jenjang, anggaran, sesi (online/offline), lokasi, preferensi gender, kebutuhan ABK, dan hari. Pilih maksimal 6 tentor TERBAIK dan susun dari yang paling cocok. Beri skor 0-100 dan 2-4 alasan kualitatif per tentor dalam bahasa Indonesia yang wajar dan spesifik (bukan boilerplate).

Balas HANYA JSON (tanpa teks lain) dengan format:
{"ringkasan": "..." , "cocok": [{"tutorId": "...", "skor": 88, "alasan": ["...", "..."]}]}`;
};

export async function matchTentor(t: string): Promise<MatchResponse> {
  const tutors = db.prepare("SELECT * FROM tutors WHERE status = ?").all("approved") as any[];

  const tutorObjects = tutors.map((t) => ({
    id: t.id,
    nama: t.nama,
    gelar: t.gelar,
    gender: t.gender as "P" | "L",
    kota: t.kota,
    bio: t.bio,
    mapel: JSON.parse(t.mapel),
    jenjang: JSON.parse(t.jenjang),
    hargaPerSesi: t.harga_per_sesi,
    hargaMin: t.harga_min,
    hargaMax: t.harga_max,
    sesiTersedia: JSON.parse(t.sesi_tersedia),
    rating: t.rating,
    ulasanCount: t.ulasan_count,
    pengalamanTahun: t.pengalaman_tahun,
    sertifikasiABK: t.sertifikasi_abk === 1,
    kondisiKhusus: JSON.parse(t.kondisi_khusus),
    jadwal: JSON.parse(t.jadwal),
    keahlian: JSON.parse(t.keahlian),
  }));

  const mock = mockMatch(t, tutorObjects);

  const asResponse = (via: Via, data: { ringkasan: string; hasil: MatchKecocokan[] }): MatchResponse => ({
    via,
    ringkasan: data.ringkasan,
    dibaca: mock.dibaca,
    hasil: data.hasil,
  });

  const fallback = () => asResponse("mock", { ringkasan: mock.ringkasan, hasil: mock.hasil.map((m) => ({ tutor: m.tutor, skor: m.skor, label: m.label, alasan: m.alasan })) });

  const c = client();
  if (!c) return fallback();

  try {
    const systemPrompt = MATCH_SYSTEM();
    const raw = await c.chat(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: t },
      ],
      { json: true, temperature: 0.3, maxTokens: 1600 },
    );
    const data = extractJson(raw) as {
      ringkasan?: string;
      cocok?: { tutorId?: string; skor?: number; alasan?: string[] }[];
    };
    const hasil: MatchKecocokan[] = (data.cocok ?? [])
      .map(({ tutorId, skor, alasan }) => {
        const tutor = tutorObjects.find((x) => x.id === tutorId);
        if (!tutor) return null;
        const s = Math.max(0, Math.min(99, Number(skor) || 0));
        return {
          tutor,
          skor: s,
          label: s >= 84 ? "sangat tinggi" : s >= 66 ? "tinggi" : s >= 45 ? "sedang" : "perlu pertimbangan",
          alasan: Array.isArray(alasan) && alasan.length ? alasan : ["Kecocokan dinilai dari profil dan kebutuhan Anda."],
        };
      })
      .filter((x): x is MatchKecocokan => x !== null)
      .sort((a, b) => b.skor - a.skor)
      .slice(0, 6);
    if (hasil.length === 0) return fallback();
    return asResponse("llm", { ringkasan: data.ringkasan ?? mock.ringkasan, hasil });
  } catch (err) {
    console.warn("[match] LLM gagal, fallback ke mock:", err);
    return fallback();
  }
}

/* ------------------------------ Verification ------------------------------ */

export interface VerifyResponse {
  via: Via;
  ringkasan: string;
  skor: number;
  rekomendasi: string;
  kekuatan: string[];
  risiko: string[];
  pertanyaan: string[];
  saran: string[];
}

const VERIFY_SYSTEM = `Kamu adalah asisten verifikasi tentor di agensi TentorKeun. Tugasmu menyaring CV/portofolio calon tentor: bedah latar belakang pendidikan, pengalaman, sertifikasi, dan sinyal kelayakan. Lalu buat ringkasan untuk admin + pertanyaan kompetensi otomatis untuk wawancara lisan (4 pertanyaan: mapel spesifik + manajemen kelas + komunikasi orang tua).

Balas HANYA JSON (tanpa teks lain):
{"ringkasan":"...","skor":[0-100],"rekomendasi":"...","kekuatan":["..."],"risiko":["..."],"pertanyaan":["..."],"saran":["..."]}`;

export async function verifyTentor(cv: string): Promise<VerifyResponse> {
  const mock = mockVerify(cv) as unknown as VerifyResponse;
  const fallback = () => ({ ...mock, via: "mock" as Via });
  const c = client();
  if (!c) return fallback();
  try {
    const raw = await c.chat(
      [
        { role: "system", content: VERIFY_SYSTEM },
        { role: "user", content: `Berikut CV/portofolio calon tentor:\n\n${cv.slice(0, 8000)}` },
      ],
      { json: true, maxTokens: 1800 },
    );
    const d = extractJson(raw) as Partial<VerifyResponse>;
    const out: VerifyResponse = {
      via: "llm",
      ringkasan: typeof d.ringkasan === "string" ? d.ringkasan : mock.ringkasan,
      skor: Number(d.skor) || mock.skor,
      rekomendasi: typeof d.rekomendasi === "string" ? d.rekomendasi : mock.rekomendasi,
      kekuatan: Array.isArray(d.kekuatan) ? d.kekuatan : mock.kekuatan,
      risiko: Array.isArray(d.risiko) ? d.risiko : mock.risiko,
      pertanyaan: Array.isArray(d.pertanyaan) ? d.pertanyaan : mock.pertanyaan,
      saran: Array.isArray(d.saran) ? d.saran : mock.saran,
    };
    return out;
  } catch (err) {
    console.warn("[verify] LLM gagal, fallback ke mock:", err);
    return fallback();
  }
}

/* ------------------------------ Progress report ------------------------------ */

export interface ReportResponse {
  via: Via;
  judul: string;
  ringkasan: string;
  capaian: string[];
  perluPerhatian: string[];
  materiDibahas: string[];
  rekomendasi: string[];
  penilaian: number;
  tren: string;
}

const REPORT_SYSTEM = `Kamu adalah AI perangkum sesi belajar di TentorKeun. Ubah catatan kasar tentor menjadi laporan perkembangan untuk orang tua: netral, spesifik, dan tidak menakutkan. Sertakan capaian, area yang perlu perhatian, materi yang dibahas, rekomendasi untuk pekan depan, nilai kemajuan (0-100), dan tren singkat.

Balas HANYA JSON (tanpa teks lain):
{"judul":"...","ringkasan":"...","capaian":["..."],"perluPerhatian":["..."],"materiDibahas":["..."],"rekomendasi":["..."],"penilaian":[0-100],"tren":"..."}`;

export async function generateReport(args: {
  catatan: string;
  mapel: string;
  jenjang: string;
  namaSiswa: string;
  namaTentor: string;
}): Promise<ReportResponse> {
  const mock = mockReport(args) as unknown as ReportResponse;
  const fallback = () => ({ ...mock, via: "mock" as Via });
  const c = client();
  if (!c) return fallback();
  try {
    const raw = await c.chat(
      [
        { role: "system", content: REPORT_SYSTEM },
        {
          role: "user",
          content: `Catatan sesi dari tentor ${args.namaTentor} tentang ${args.namaSiswa || "siswa"} (mapel ${args.mapel}, jenjang ${args.jenjang || "umum"}):\n\n${args.catatan.slice(0, 8000)}`,
        },
      ],
      { json: true, maxTokens: 1600 },
    );
    const d = extractJson(raw) as Partial<ReportResponse>;
    const out: ReportResponse = {
      via: "llm",
      judul: typeof d.judul === "string" ? d.judul : mock.judul,
      ringkasan: typeof d.ringkasan === "string" ? d.ringkasan : mock.ringkasan,
      capaian: Array.isArray(d.capaian) ? d.capaian : mock.capaian,
      perluPerhatian: Array.isArray(d.perluPerhatian) ? d.perluPerhatian : mock.perluPerhatian,
      materiDibahas: Array.isArray(d.materiDibahas) ? d.materiDibahas : mock.materiDibahas,
      rekomendasi: Array.isArray(d.rekomendasi) ? d.rekomendasi : mock.rekomendasi,
      penilaian: Math.max(0, Math.min(100, Number(d.penilaian) || mock.penilaian)),
      tren: typeof d.tren === "string" ? d.tren : mock.tren,
    };
    return out;
  } catch (err) {
    console.warn("[report] LLM gagal, fallback ke mock:", err);
    return fallback();
  }
}

/* ------------------------------ Study plan ------------------------------ */

export interface StudyPlanResponse {
  via: Via;
  judul: string;
  target: string;
  durasiPerSesi: number;
  jadwal: { hari: string; topik: string; aktivitas: string; durasi: number }[];
  latihan: { mapel: string; tingkat: string; pertanyaan: string; jawabanSingkat: string; pembahasan: string }[];
  catatan?: string;
}

const PLAN_SYSTEM = `Kamu adalah AI perancang belajar TentorKeun. Susun rencana belajar mingguan (Senin–Minggu) untuk satu mapel berdasarkan jenjang, target, dan kelemahan siswa. Lalu buat 5 soal latihan adaptif bertingkat (Mudah/Sedang/Sulit) lengkap dengan jawaban singkat dan pembahasan satu-dua kalimat.

Balas HANYA JSON (tanpa teks lain):
{"judul":"...","target":"...","jadwal":[{"hari":"Senin","topik":"...","aktivitas":"...","durasi":[menit]} x7],"latihan":[{"mapel":"...","tingkat":"Mudah|Sedang|Sulit","pertanyaan":"...","jawabanSingkat":"...","pembahasan":"..."} x5]}`;

export async function generateStudyPlan(args: {
  mapel: string;
  jenjang: string;
  target: string;
  kelemahan: string;
  menit: number;
}): Promise<StudyPlanResponse> {
  const mock = mockStudyPlan(args) as unknown as StudyPlanResponse;
  const fallback = () => ({ ...mock, via: "mock" as Via });
  const c = client();
  if (!c) return fallback();
  try {
    const raw = await c.chat(
      [
        { role: "system", content: PLAN_SYSTEM },
        {
          role: "user",
          content: `Mapel: ${args.mapel}\nJenjang: ${args.jenjang || "umum"}\nTarget: ${args.target || "menguasai mapel"}\nKelemahan: ${args.kelemahan || "belum ada data"}\nAlokasi per sesi: ${args.menit} menit.`,
        },
      ],
      { json: true, maxTokens: 2200 },
    );
    const d = extractJson(raw) as Partial<StudyPlanResponse>;
    const out: StudyPlanResponse = {
      via: "llm",
      judul: typeof d.judul === "string" ? d.judul : mock.judul,
      target: typeof d.target === "string" ? d.target : mock.target,
      durasiPerSesi: Number(d.durasiPerSesi) || args.menit,
      jadwal: Array.isArray(d.jadwal) && d.jadwal.length === 7 ? d.jadwal : mock.jadwal,
      latihan: Array.isArray(d.latihan) && d.latihan.length ? d.latihan : mock.latihan,
    };
    return out;
  } catch (err) {
    console.warn("[plan] LLM gagal, fallback ke mock:", err);
    return fallback();
  }
}

/* ------------------------------ Simplify ------------------------------ */

export interface SimplifyResponse {
  via: Via;
  mode: string;
  teks: string;
  catatan: string;
}

const SIMPLIFY_SYSTEM = `Kamu adalah AI penyederhana materi TentorKeun untuk siswa berkebutuhan khusus. Tetap menjaga makna, gunakan bahasa Indonesia sederhana dan INSTRUKSI LITERAL (hindari kiasan). Penyesuaian per mode:
- disleksia: kalimat pendek, bullet, kata umum.
- tunanetra: struktur rapi, berlapis dengan penomoran, ramah dibaca screen reader.
- tunarungu: runtut visual, satu ide per poin, kalimat pendek dengan penanda.
- ADHD: pecah menjadi langkah-langkah pendek dengan subjudul, minim distraksi.
- autisme: literal, urut, antisipatif.

Balas HANYA JSON (tanpa teks lain):
{"teks":"...","catatan":"penjelasan singkat strategi yang dipakai"}`;

export async function simplifyText(text: string, mode: string): Promise<SimplifyResponse> {
  const mock = mockSimplify(text, mode) as unknown as SimplifyResponse;
  const fallback = () => ({ ...mock, via: "mock" as Via });
  const c = client();
  if (!c) return fallback();
  try {
    const raw = await c.chat(
      [
        { role: "system", content: SIMPLIFY_SYSTEM },
        {
          role: "user",
          content: `Mode: ${mode}\n\nTeks asli:\n${text.slice(0, 6000)}`,
        },
      ],
      { json: true, maxTokens: 1500 },
    );
    const d = extractJson(raw) as Partial<SimplifyResponse>;
    return {
      via: "llm",
      mode,
      teks: typeof d.teks === "string" ? d.teks : mock.teks,
      catatan: typeof d.catatan === "string" ? d.catatan : mock.catatan,
    };
  } catch (err) {
    console.warn("[simplify] LLM gagal, fallback ke mock:", err);
    return fallback();
  }
}