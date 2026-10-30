import type { Jenjang, KondisiKhusus, Tutor } from "@/lib/types";

/* ============================== Parser ============================== */

const MAPEL_KW: [string, string[]][] = [
  ["bahasa indonesia", ["Bahasa Indonesia"]],
  ["b. indonesia", ["Bahasa Indonesia"]],
  ["bindo", ["Bahasa Indonesia"]],
  ["bahasa inggris", ["Bahasa Inggris"]],
  ["b. inggris", ["Bahasa Inggris"]],
  ["matematika dasar", ["Matematika"]],
  ["matematika sd", ["Matematika"]],
  ["olimpiade matematika", ["Olimpiade Matematika"]],
  ["olimpiade", ["Olimpiade Matematika"]],
  ["osn", ["Olimpiade Matematika"]],
  ["matematika", ["Matematika"]],
  ["mtk", ["Matematika"]],
  ["berhitung", ["Matematika", "Calistung"]],
  ["calistung", ["Calistung"]],
  ["membaca", ["Calistung", "Bahasa Indonesia"]],
  ["menulis", ["Calistung", "Bahasa Indonesia"]],
  ["fisika", ["Fisika"]],
  ["kimia", ["Kimia"]],
  ["biologi", ["Biologi"]],
  ["ipa", ["IPA", "Biologi", "Fisika"]],
  ["komputer", ["Komputer"]],
  ["pemrograman", ["Pemrograman"]],
  ["coding", ["Pemrograman"]],
  ["programming", ["Pemrograman"]],
  ["informatika", ["Komputer", "Pemrograman"]],
  ["utbk", ["UTBK"]],
  ["sbmptn", ["UTBK"]],
  ["snbt", ["UTBK"]],
  ["snbp", ["UTBK"]],
  ["ielts", ["IELTS"]],
  ["toefl", ["TOEFL"]],
  ["toeic", ["IELTS"]],
  ["english", ["Bahasa Inggris"]],
  ["inggris", ["Bahasa Inggris"]],
  ["ekonomi", ["Ekonomi"]],
  ["akuntansi", ["Akuntansi"]],
  ["akunting", ["Akuntansi"]],
  ["ips", ["IPS"]],
  ["sejarah", ["Sejarah"]],
  ["geografi", ["IPS", "Sejarah"]],
  ["mengaji", ["Mengaji"]],
  ["ngaji", ["Mengaji"]],
  ["tajwid", ["Mengaji"]],
  ["tahfiz", ["Tahfiz"]],
  ["hafalan", ["Tahfiz"]],
  ["al-quran", ["Mengaji"]],
  ["qur\u2019an", ["Mengaji"]],
  ["quran", ["Mengaji"]],
  ["bahasa arab", ["Bahasa Arab"]],
  ["arab", ["Bahasa Arab"]],
  ["psikologi", ["Psikologi"]],
  ["bk", ["Bimbingan Belajar"]],
  ["bimbel", ["Bimbingan Belajar"]],
  ["bimbingan", ["Bimbingan Belajar"]],
  ["statistika", ["Statistika"]],
  ["statistik", ["Statistika"]],
];

const JENJANG_KW: [RegExp, Jenjang][] = [
  [/\b(tk|paud|taman kanak)\b/, "TK"],
  [/\b(sd|sekolah dasar)\b/, "SD"],
  [/\b(smp|sekolah menengah pertama)\b/, "SMP"],
  [/\b(sma|smk|sekolah menengah atas)\b/, "SMA"],
  [/\b(kuliah|mahasiswa|universitas|sarjana|campus)\b/, "Mahasiswa"],
];

const SESI_KW = {
  online: /\b(online|daring|zoom|meet|video ?call|jarak jauh)\b/,
  offline: /\b(offline|tatap muka|tatap muka|ke rumah|kerumah|datang ke rum)\b/,
} as const;

const GENDER_P = /\b(perempuan|wanita|cewek|bu|mba|ibu)\b/;
const GENDER_L = /\b(pria|cowok|laki|laki-laki|pak|mas|bapak)\b/;

const ABK_KW: [RegExp, KondisiKhusus][] = [
  [/\b(disleksia|dyslexia|lambat baca)\b/, "disleksia"],
  [/\b(tunanetra|tuna netra|buta)\b/, "tunanetra"],
  [/\b(tunarungu|tuna rungu|gangguan dengar)\b/, "tunarungu"],
  [/\b(adhd|hiperaktif)\b/, "ADHD"],
  [/\b(autis|autisme|asd)\b/, "autisme"],
  [/\b(abk|berkebutuhan khusus|kebutuhan khusus)\b/, "ABK umum"],
];

const HARI_KW: [RegExp, string][] = [
  [/\bsenin\b/, "Senin"],
  [/\bselasa\b/, "Selasa"],
  [/\brabu\b/, "Rabu"],
  [/\bkamis\b/, "Kamis"],
  [/\bjumat\b/, "Jumat"],
  [/\bsabtu\b/, "Sabtu"],
  [/\bminggu\b/, "Minggu"],
];

export interface ParsedTeks {
  mapel: string[];
  jenjang: Jenjang | null;
  anggaran: { min?: number; max?: number } | null;
  sesi: "online" | "offline" | "both" | null;
  gender: "P" | "L" | null;
  abk: { dibutuhkan: boolean; kondisi: KondisiKhusus[] };
  hari: string[];
  kota: string | null;
}

export function parseTeks(input: string): ParsedTeks {
  const t = input.toLowerCase();

  const mapel = new Set<string>();
  for (const [kw, kanonik] of MAPEL_KW) {
    if (t.includes(kw)) {
      for (const k of kanonik) mapel.add(k);
    }
  }

  let jenjang: Jenjang | null = null;
  const kelas = t.match(/\bkelas (\d)\b/);
  if (kelas) {
    const n = parseInt(kelas[1], 10);
    if (n >= 1 && n <= 6) jenjang = "SD";
    else if (n >= 7 && n <= 9) jenjang = "SMP";
    else jenjang = "SMA";
  } else {
    for (const [re, j] of JENJANG_KW) {
      if (re.test(t)) {
        jenjang = j;
        break;
      }
    }
  }

  const anggaran = parseAnggaran(t);
  let sesi: ParsedTeks["sesi"] = null;
  if (SESI_KW.online.test(t)) sesi = "online";
  if (SESI_KW.offline.test(t)) sesi = sesi === "online" ? "both" : "offline";
  const gender: ParsedTeks["gender"] = GENDER_L.test(t)
    ? "L"
    : GENDER_P.test(t)
      ? "P"
      : null;

  const kondisi: KondisiKhusus[] = [];
  let dibutuhkan = false;
  for (const [re, k] of ABK_KW) {
    if (re.test(t)) {
      dibutuhkan = true;
      kondisi.push(k);
    }
  }

  const hari: string[] = [];
  for (const [re, h] of HARI_KW) {
    if (re.test(t)) hari.push(h);
  }

  const kota = deteksiKota(t);

  return { mapel: [...mapel], jenjang, anggaran, sesi, gender, abk: { dibutuhkan, kondisi }, hari, kota };
}

function parseAnggaran(t: string): { min?: number; max?: number } | null {
  const nums: number[] = [];
  const re = /(?:rp\.?\s*)?(\d[\d.,]*)\s*(ribu|rb|juta|jt|k)?\b/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(t)) !== null) {
    const raw = m[1].replace(/\./g, "").replace(",", "");
    if (!/^\d+$/.test(raw)) continue;
    let val = parseInt(raw, 10);
    const satuan = m[2]?.toLowerCase() ?? "";
    if (satuan.startsWith("jt") || satuan === "juta") val *= 1000;
    if (val > 5 && val < 500000) nums.push(val);
  }
  if (nums.length === 0) return null;
  if (
    /(sampai|s\/d|hingga|antara|sd|ke)/.test(t) &&
    nums.length >= 2
  ) {
    return { min: Math.min(...nums), max: Math.max(...nums) };
  }
  return { max: Math.max(...nums) };
}

const KOTA_KW = [
  "jakarta",
  "bandung",
  "surabaya",
  "yogyakarta",
  "jogja",
  "bekasi",
  "depok",
  "tangerang",
  "semarang",
  "medan",
  "malang",
  "bogor",
  "cimahi",
  "tangsel",
];

function deteksiKota(t: string): string | null {
  for (const k of KOTA_KW) {
    if (t.includes(k)) return k === "jogja" ? "yogyakarta" : k;
  }
  return null;
}

/* =========================== Match scoring =========================== */

export interface MockMatchResult {
  tutor: Tutor;
  skor: number;
  label: string;
  alasan: string[];
}

function capSkor(s: number) {
  return Math.max(0, Math.min(99, Math.round(s)));
}

export function mockMatch(input: string, catalog: Tutor[]): {
  ringkasan: string;
  dibaca: string;
  hasil: MockMatchResult[];
} {
  const p = parseTeks(input);

  const subjectSet = new Set(p.mapel);
  const importance = {
    mapel: 34,
    jenjang: 12,
    anggaran: 12,
    sesi: 8,
    gender: 5,
    abk: 24,
    hari: 4,
    kota: 8,
    kualitas: 6,
  };

  const results: MockMatchResult[] = catalog.map((tutor) => {
    const s: { skor: number; alasan: string[] } = { skor: 0, alasan: [] };

    const matchedMapel = tutor.mapel.filter((x) => subjectSet.has(x));
    const abkKejar = subjectSet.has("Bimbingan Belajar") && p.abk.dibutuhkan && tutor.sertifikasiABK;

    if (matchedMapel.length > 0) {
      s.skor += importance.mapel;
      s.alasan.push(
        `Mengampu ${matchedMapel.join(" & ")} — persis dengan yang Anda cari.`,
      );
    } else if (subjectSet.size > 0) {
      s.skor -= 20;
    }

    if (p.jenjang && tutor.jenjang.includes(p.jenjang)) {
      s.skor += importance.jenjang;
      s.alasan.push(
        p.jenjang === "Mahasiswa"
          ? "Terbiasa mengajar tingkat kuliah."
          : `Pengalaman mengajar jenjang ${p.jenjang}.`,
      );
    } else if (p.jenjang) {
      s.skor -= 10;
      s.alasan.push(`Jenjang yang biasa ia pegang adalah ${tutor.jenjang.join("/")}.`);
    }

    if (p.anggaran) {
      const { min, max } = p.anggaran;
      const harga = tutor.hargaPerSesi;
      const within =
        (min === undefined || harga >= min) &&
        (max === undefined || harga <= max);
      if (within) {
        s.skor += importance.anggaran;
        s.alasan.push(
          `Tarif per sesi Rp${tutor.hargaPerSesi.toLocaleString("id-ID")} sesuai anggaran.`,
        );
      } else {
        s.skor -= importance.anggaran;
        s.alasan.push(
          `Tarif per sesi Rp${tutor.hargaPerSesi.toLocaleString("id-ID")} — di luar anggaran.`,
        );
      }
    }

    if (p.sesi && p.sesi !== "both") {
      if (tutor.sesiTersedia.includes(p.sesi)) {
        s.skor += importance.sesi;
        s.alasan.push(
          p.sesi === "online" ? "Mendukung sesi daring." : "Siap tatap muka.",
        );
      } else {
        s.skor -= importance.sesi;
        s.alasan.push(
          p.sesi === "online"
            ? "Saat ini tidak menerima sesi daring."
            : "Hanya menerima sesi daring.",
        );
      }
    }

    if (p.gender && tutor.gender !== p.gender) {
      s.skor -= 12;
      s.alasan.push(
        p.gender === "P"
          ? "Anda meminta tentor perempuan, tentor ini laki-laki."
          : "Anda meminta tentor laki-laki, tentor ini perempuan.",
      );
    } else if (p.gender && tutor.gender === p.gender) {
      s.skor += importance.gender;
      s.alasan.push(
        p.gender === "P" ? "Tentor perempuan, sesuai permintaan." : "Tentor laki-laki, sesuai permintaan.",
      );
    }

    if (p.abk.dibutuhkan) {
      const cocokKondisi = tutor.kondisiKhusus.some((k) => p.abk.kondisi.includes(k) || k === "ABK umum");
      if (tutor.sertifikasiABK) {
        s.skor += importance.abk;
        if (cocokKondisi && p.abk.kondisi.length > 0) {
          const nama = [...new Set(p.abk.kondisi)].join(", ");
          s.alasan.push(`Tersertifikasi ABK dan berpengalaman dengan ${nama}.`);
        } else {
          s.alasan.push("Memiliki sertifikasi pendamping ABK.");
        }
      } else {
        s.skor -= 34;
        s.alasan.push("Belum tersertifikasi untuk pendampingan ABK.");
      }
    } else if (abkKejar) {
      s.skor += importance.abk;
      s.alasan.push("Memiliki sertifikasi pendamping ABK.");
    }

    if (tutor.hargaPerSesi >= 150) {
      s.skor -= 0; // placeholder utk menyeimbangkan
    }

    const hariSesuai = tutor.jadwal.filter((h) => p.hari.includes(h)).length;
    if (p.hari.length > 0) {
      if (hariSesuai > 0) {
        s.skor += Math.min(importance.hari, hariSesuai * 2);
        s.alasan.push(`Jadwal hari ${p.hari.join(", ")} tersedia.`);
      } else {
        s.skor -= importance.hari;
        s.alasan.push(`Biasanya mengajar hari ${tutor.jadwal.slice(0, 3).join(", ")}.`);
      }
    }

    if (p.kota) {
      if (tutor.kota.toLowerCase().startsWith(p.kota) || p.kota.toLowerCase().startsWith(tutor.kota.toLowerCase())) {
        s.skor += importance.kota;
        s.alasan.push(`Berdomisili ${tutor.kota} — memudahkan pertemuan luring.`);
      } else if (tutor.sesiTersedia.includes("online")) {
        s.skor -= 0;
        s.alasan.push(`Berdomisili ${tutor.kota}, cocok untuk sesi daring.`);
      }
    }

    if (tutor.rating >= 4.7) {
      s.skor += 4;
      s.alasan.push(`Rating ${tutor.rating.toFixed(1)} dari ${tutor.ulasanCount} ulasan.`);
    }
    if (tutor.pengalamanTahun >= 6) {
      s.skor += 3;
      s.alasan.push(`Pengalaman mengajar ${tutor.pengalamanTahun} tahun.`);
    }

    const skor = capSkor(s.skor + 6);
    const label =
      skor >= 84 ? "sangat tinggi" : skor >= 66 ? "tinggi" : skor >= 45 ? "sedang" : "perlu pertimbangan";

    return { tutor, skor, label, alasan: s.alasan.slice(0, 4) };
  });

  results.sort((a, b) => b.skor - a.skor);

  const dibaca = [
    p.mapel.length ? `mapel: ${p.mapel.join(", ")}` : "mapel: tidak spesifik",
    p.jenjang ?? "jenjang: semua",
    p.anggaran
      ? `anggaran: ${p.anggaran.min ? `Rp${p.anggaran.min}rb` : ""}${p.anggaran.max ? ` s.d. Rp${p.anggaran.max}rb` : ""}`
      : "anggaran: fleksibel",
    p.sesi && p.sesi !== "both" ? `sesi: ${p.sesi}` : "sesi: fleksibel",
  ].join(" · ");

  const layak = results.filter((r) => r.skor >= 45);
  const ringkasan =
    `Dari katalog ${catalog.length} tentor terverifikasi, saya pilihkan ` +
    `${Math.min(layak.length, 5)} tentor yang paling cocok dengan permintaan Anda` +
    (p.abk.dibutuhkan ? ", disaring khusus untuk kebutuhan ABK" : "") +
    `. ${layak.length === 0 ? "Bisa perluas permintaan untuk hasil lebih banyak." : "Urutan diprioritaskan dari yang paling cocok."}`;

  return { ringkasan, dibaca, hasil: results.slice(0, 6) };
}

/* ============================ Verify (mock) ============================ */

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

function pick<T>(arr: T[], seed: number, n: number): T[] {
  const out: T[] = [];
  let s = seed;
  for (let i = 0; i < n; i++) {
    s = (s * 1103515245 + 12345) % 2147483648;
    out.push(arr[s % arr.length]);
  }
  return out;
}

export function mockVerify(cv: string): Record<string, unknown> {
  const t = cv.toLowerCase();
  const h = hash(cv || "cv");

  const universitas = (cv.match(/(universitas|univ\.?|institut|itb|ui|ugm|its|unj|uny|upi|uin|ipb|unair|unesa|undip|unpad)(\s+[a-z0-9]+){0,3}/gi) ?? []).map((x) => x.trim());
  const tahunPengalaman = (cv.match(/[^.]*(\d{1,2})\s*(tahun|thn|th)\b[^.]*\./gi) ?? []) as string[];
  const degree = t.match(/\b(S\.?Pd\.?|M\.?Pd\.?|S\.?Si\.?|S\.?Kom\.?|S\.?Psi\.?|M\.?Sc\.?\b|S\.?S\.?|S\.?T\.?)\.?\b/gi)?.[0] ?? "";
  const punyaSertif = /sertifikat|sertifikasi|sertif/i.test(t);
  const adaPorto = /portfolio|porto|berkas karya|hasil karya|lampiran/i.test(t);

  const mapelDetected = ["matematika", "fisika", "kimia", "biologi", "bahasa indonesia", "bahasa inggris", "ekonomi", "akuntansi", "mengaji", "pemrograman"].filter((m) => t.includes(m));

  const skor =
    (degree ? 20 : 8) +
    (universitas.length ? Math.min(universitas.length, 3) * 8 : 4) +
    (punyaSertif ? 15 : 0) +
    (tahunPengalaman.length ? Math.min(tahunPengalaman.length, 2) * 10 : 5) +
    (adaPorto ? 12 : 3) +
    (mapelDetected.length ? Math.min(mapelDetected.length, 4) * 5 : 4);

  const skorFinal = Math.min(98, skor);

  const kekuatan = [
    punyaSertif ? "Mencantumkan sertifikasi / pelatihan." : "Latar belakang pendidikan tertera.",
    universitas.slice(0, 2).map((u) => `Rekam jejak ${u}.`)[0] ?? "Ada riwayat mengajar/direktori karya.",
    mapelDetected.length ? `Kecocokan bidang: ${mapelDetected.slice(0, 3).join(", ")}.` : "Bidang kompetensi cukup jelas.",
    adaPorto ? "Menyertakan portofolio — bisa diverifikasi langsung." : "CV memuat deskripsi pengalaman.",
  ].filter(Boolean);

  const risiko: string[] = [];
  if (!punyaSertif) risiko.push("Sertifikasi kompetensi belum tercantum.");
  if (!adaPorto) risiko.push("Portofolio belum dilampirkan.");
  if (tahunPengalaman.length === 0) risiko.push("Durasi pengalaman tidak terdokumentasi.");
  if (/lulusan smk|smk|mengantikan/i.test(t) && !degree) risiko.push("Latar belakang keilmuan belum jelas.");

  const pertanyaan = [
    mapelDetected[0]
      ? `Jelaskan pendekatan Anda saat siswa tidak paham konsep ${mapelDetected[0]} padahal sudah 2 sesi berturut-turut.`
      : "Jelaskan pendekatan Anda saat siswa tidak paham konsep dasar pada 2 sesi berturut-turut.",
    "Bagaimana Anda menyesuaikan metode jika siswa terlihat bosan atau kehilangan fokus di tengah sesi?",
    "Apa kebiasaan/ritual yang Anda lakukan di awal sesi untuk membangun kenyamanan siswa baru?",
    "Bagaimana Anda mengomunikasikan perkembangan siswa kepada orang tua tanpa mengkhawatirkan mereka?",
  ];

  const rekomendasi =
    skorFinal >= 85
      ? "Layak lanjut ke verifikasi lisan & sesi uji coba."
      : skorFinal >= 60
        ? "Layak diverifikasi lanjutan; mintakan dokumen sertifikat & referensi."
        : "Perlu dokumen pelengkap (sertifikat, portofolio, referensi) sebelum verifikasi lisan.";

  const ringkasan = `CV menunjukkan latar belakang ${degree ? `pendidikan ${degree}` : "pendidikan yang tercantum"}${universitas.length ? ` (${universitas.slice(0, 2).join(", ")})` : ""}, pengalaman ${tahunPengalaman.length ? tahunPengalaman.map((x) => x.trim()).join("; ") : "yang belum terdokumentasi jelas"}, dengan fokus bidang ${mapelDetected.slice(0, 3).join(", ") || "yang belum dinyatakan"}. Total skor kelayakan awal ${skorFinal}/100.`;

  return {
    ringkasan,
    skor: skorFinal,
    rekomendasi,
    kekuatan,
    risiko,
    pertanyaan,
    saran: pick(
      [
        "Minta tentor menyiapkan demo mengajar 10 menit untuk 1 topik.",
        "Cek nomor sertifikasi ke lembaga penerbit jika memungkinkan.",
        "Jadwalkan sesi uji coba berbayar sebelum dikontrak tetap.",
        "Catat pengalaman mengasuh/kunjungan lama sebagai bahan wawancara.",
        "Minta 1–2 kontak referensi dari siswa/orang tua terdahulu.",
      ],
      h,
      3,
    ),
  };
}

/* ============================ Report (mock) ============================ */

const POSITIF = ["paham", "menguasai", "lancar", "bagus", "semangat", "cepat", "naik", "aktif", "hafal", "tepat", "mahir", "percaya diri", "lancar mengerjakan"];
const HAMBATAN = ["kesulitan", "belum paham", "bingung", "lemah", "malas", "lupa", "salah", "sulit", "khawatir", "lambat", "menurun", "terganggu"];

export function mockReport(args: {
  catatan: string;
  mapel: string;
  jenjang: string;
  namaSiswa: string;
  namaTentor: string;
}): Record<string, unknown> {
  const cat = args.catatan.toLowerCase();
  const positif = POSITIF.filter((k) => cat.includes(k));
  const hambatan = HAMBATAN.filter((k) => cat.includes(k));
  const nKalimat = args.catatan.split(/(?<=[.!?])\s+/).filter(Boolean).length;
  const h = hash(args.catatan || "r");

  const ringkasan = `Pada sesi ${args.mapel} (${args.jenjang || "jenjang umum"}) bersama ${args.namaTentor}, ${args.namaSiswa || "siswa"} menunjukkan ${positif.length >= 2 ? "kemajuan yang terlihat" : "partisipasi yang lebih stabil"} dibanding pertemuan sebelumnya. Sesi berlangsung dengan ${nKalimat > 6 ? "kondisi yang cukup dinamis dan banyak diskusi" : "fokus yang terjaga pada materi utama"}.`;

  const capaian = (
    positif.length
      ? [
          `Menyelesaikan latihan ${args.mapel} dengan peningkatan ketepatan.`,
          `Menunjukkan pemahaman pada ${positif.slice(0, 2).join(" dan ")}.`,
          "Bertanya lebih aktif apabila menemukan bagian yang belum jelas.",
        ]
      : [
          "Mengikuti seluruh alur sesi sampai selesai.",
          "Mampu mencatat poin penting materi yang dibahas.",
        ]
  );

  const perlu = hambatan.length
    ? hambatan.slice(0, 3).map((k) => `Masih terlihat ${k} pada sebagian materi.`)
    : ["Belum ada hambatan menonjol; lanjutkan ritme saat ini."];

  const rekomendasi = [
    hambatan.length
      ? `Berikan 3 soal pengulangan bertema ${hambatan[0]} di rumah sebelum sesi berikutnya.`
      : "Naikkan tingkat kesulitan latihan secara bertahap minggu ini.",
    "Minta siswa menjelaskan ulang 'jadi begini, bu' di akhir sesi untuk mengecek pemahaman (metode Feynman).",
    args.namaSiswa ? `Ajak ${args.namaSiswa} menentukan sendiri target kecil per sesi.` : "Ajak siswa menentukan target kecil per sesi.",
  ];

  const penilaian = Math.min(98, Math.max(58, 64 + positif.length * 7 - hambatan.length * 5 + Math.min(nKalimat, 5) * 2));
  const tren = hambatan.length === 0 ? "Meningkat stabil" : positif.length > hambatan.length ? "Meningkat bertahap" : "Perlu perhatian";

  return {
    judul: `Laporan Perkembangan — ${args.namaSiswa || "Siswa"}`,
    ringkasan,
    capaian,
    perluPerhatian: perlu,
    materiDibahas: pick(["Konsep dasar", "Latihan soal bertingkat", "Ulangan singkat", "Teknik membaca cepat", "Strategi pengerjaan soal"], h, 2),
    rekomendasi,
    penilaian,
    tren,
    sumber: "dibuat dari catatan sesi tentor",
  };
}

/* ============================ Study plan (mock) ============================ */

const TOPIK_MAPEL: Record<string, string[]> = {
  Matematika: ["Bilangan & aljabar", "Bangun datar", "Persamaan linear", "Statistika dasar", "Turunan dasar", "Trigonometri"],
  Fisika: ["Vektor", "Gerak lurus", "Hukum Newton", "Usaha & energi", "Listrik statis"],
  Kimia: ["Struktur atom", "Ikatan kimia", "Stoikiometri", "Larutan & pH", "Termokimia"],
  Biologi: ["Sel", "Jaringan", "Sistem pencernaan", "Genetika", "Ekosistem"],
  "Bahasa Inggris": ["Tenses", "Vocabulary daily", "Reading comprehension", "Speaking drill", "Writing simple paragraph"],
  "Bahasa Indonesia": ["Ide pokok paragraf", "Struktur teks", "Kalimat efektif", "Menulis opini"],
  Ekonomi: ["Kebutuhan & kelangkaan", "Permintaan-penawaran", "Pasar", "Laporan keuangan sederhana"],
  Akuntansi: ["Persamaan dasar akuntansi", "Jurnal umum", "Neraca saldo", "Laba rugi"],
  Komputer: ["Logika & algoritma", "Variabel & tipe data", "Percabangan", "Perulangan", "Fungsi"],
  Pemrograman: ["Logika & algoritma", "Variabel & tipe data", "Percabangan", "Perulangan", "Fungsi"],
  UTBK: ["Literasi bahasa", "Penalaran numerik", "Pengetahuan kuantitatif", "Tes potensi skolastik"],
  Calistung: ["Pengenalan huruf", "Membaca suku kata", "Membaca kata", "Menghitung 1-20", "Menulis kalimat pendek"],
  Mengaji: ["Makhraj huruf", "Tajwid dasar", "Tilawah surat pendek", "Hafalan juz 30"],
  "Bahasa Arab": ["Huruf & kosakata", "Kalimat sederhana", "Percakapan dasar"],
  Psikologi: ["Perkembangan anak", "Teknik relaksasi fokus", "Komunikasi orang tua-anak"],
  Statistika: ["Ukuran pemusatan", "Ukuran penyebaran", "Distribusi", "Korelasi"],
  default: ["Konsep fondasi", "Latihan terbimbing", "Review & latihan mandiri"],
};

const TINGKAT = ["Mudah", "Sedang", "Sulit"] as const;

const BANK_SOAL: Record<string, { q: string; a: string; p: string }[]> = {
  Matematika: [
    { q: "Jika x + 7 = 15, berapakah nilai x?", a: "x = 8", p: "Kurangkan 7 dari kedua ruas." },
    { q: "Hitung luas persegi panjang 5 cm × 12 cm.", a: "60 cm²", p: "L = p × l." },
    { q: "Sederhanakan 4(2x + 3) - 10.", a: "8x + 2", p: "Kalikan lalu kurangkan konstanta." },
    { q: "Tentukan gradien garis y = 3x - 5.", a: "3", p: "Koefisien x adalah gradien." },
    { q: "Jika 2x + 3y = 12 dan x = 3, tentukan y.", a: "y = 2", p: "Subtitusi lalu hitung." },
  ],
  Fisika: [
    { q: "Jarak tempuh 100 m dalam 20 s. Berapa kelajuan rata-rata?", a: "5 m/s", p: "v = s / t." },
    { q: "Gaya 20 N pada massa 4 kg. Berapa percepatan?", a: "5 m/s²", p: "a = F / m (Hukum Newton II)." },
    { q: "Energi kinetik benda bermassa 2 kg bergerak 3 m/s?", a: "9 Joule", p: "Ek = ½ mv²." },
  ],
  Kimia: [
    { q: "Nomor atom menentukan jumlah apa?", a: "Proton", p: "Nomor atom = jumlah proton = elektron (netral)." },
    { q: "Berapa mol dalam 22 g CO₂ (Mr = 44)?", a: "0,5 mol", p: "mol = massa / Mr." },
  ],
  Biologi: [
    { q: "Organ yang menyerap sari makanan?", a: "Usus halus", p: "Vili di usus halus memperluas penyerapan." },
    { q: "Bagian sel yang mengendalikan aktivitas sel?", a: "Inti sel (nukleus)", p: "Nukleus membawa DNA." },
  ],
  "Bahasa Inggris": [
    { q: "Fill the blank: She ___ to school yesterday.", a: "went", p: "Past simple dari 'go'." },
    { q: "Choose: I have lived here ___ 2015.", a: "since", p: "'Since' untuk titik waktu." },
    { q: "Arrange: apple / is / this / an.", a: "This is an apple.", p: "Susunan S-V-O baku." },
    { q: "What is the synonym of 'happy'?", a: "glad / cheerful", p: "Padanan makna positif." },
  ],
  "Bahasa Indonesia": [
    { q: "Ide pokok paragraf biasanya terletak di kalimat apa?", a: "Kalimat utama (awal/akhir)", p: "Cari kalimat yang mengikat kalimat lain." },
    { q: "Perbaiki: 'Para siswa-siswa sedang belajar.'", a: "'Para siswa sedang belajar.'", p: "'Para' sudah jamak." },
  ],
  Ekonomi: [
    { q: "Kebutuhan manusia tidak terbatas, sedangkan alat pemuasnya…?", a: "Terbatas (kelangkaan)", p: "Kelangkaan = dasar masalah ekonomi." },
  ],
  Akuntansi: [
    { q: "Persamaan dasar akuntansi?", a: "Aset = Liabilitas + Ekuitas", p: "Dua sisi harus selalu seimbang." },
  ],
  Komputer: [
    { q: "Apa output dari 10 % 3 dalam kebanyakan bahasa?", a: "1", p: "Sisa bagi 10 oleh 3." },
    { q: "Operator yang menguji kesamaan nilai?", a: "== (perbandingan)", p: "'=' untuk assignment." },
  ],
  Pemrograman: [
    { q: "Apa output dari 10 % 3?", a: "1", p: "Sisa bagi 10 oleh 3." },
  ],
  UTBK: [
    { q: "Jika A = 2B dan A + B = 18, nilai B?", a: "6", p: "3B = 18 → B = 6." },
    { q: "Sin 90° = ?", a: "1", p: "Nilai trigonometri dasar." },
  ],
  Calistung: [
    { q: "Huruf apa yang mengawali kata 'Apel'?", a: "A", p: "Kenali bunyi huruf awal." },
    { q: "5 + 3 = ?", a: "8", p: "Gunakan jari atau benda bantu." },
  ],
  Mengaji: [
    { q: "Hukum bacaan untuk nun mati bertemu huruf b?", a: "Ikhfa", p: "Nun mati dibaca samar." },
  ],
  "Bahasa Arab": [
    { q: "Arti dari 'kitab'?", a: "Buku", p: "Kosakata dasar." },
  ],
  Psikologi: [
    { q: "Teknik sederhana menenangkan anak saat fokus hilang?", a: "Teknik 4-7-8 napas", p: "Ambil napas 4 – tahan 7 – hembus 8." },
  ],
  Statistika: [
    { q: "Rata-rata dari 4, 6, 8, 10?", a: "7", p: "Jumlah data dibagi banyak data." },
  ],
};

export function mockStudyPlan(args: {
  mapel: string;
  jenjang: string;
  target: string;
  kelemahan: string;
  menit: number;
}): Record<string, unknown> {
  const topik = TOPIK_MAPEL[args.mapel] ?? TOPIK_MAPEL.default;
  const hariNama = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  const durasi = args.menit || 45;

  const jadwal = hariNama.map((hari, i) => {
    const t = topik[i % topik.length];
    const ulangan = i === 4 || i === 6;
    return {
      hari,
      topik: ulangan ? `Ulangan mingguan: ${t}` : t,
      aktivitas: ulangan
        ? `Kerjakan 5 soal campuran & review catatan.`
        : i % 2 === 0
          ? `Materi inti, lalu 3 soal terbimbing (${args.mapel}).`
          : `Latihan mandiri + koreksi bersama (fokus: ${args.kelemahan || "konsep inti"}).`,
      durasi,
    };
  });

  const bank = BANK_SOAL[args.mapel] ?? BANK_SOAL.default ?? [];
  const latihan = bank.slice(0, 5).map((s, i) => ({
    mapel: args.mapel,
    tingkat: TINGKAT[i === 4 ? 2 : i === 3 ? 1 : i <= 1 ? 0 : 1],
    pertanyaan: s.q,
    jawabanSingkat: s.a,
    pembahasan: s.p,
    tip: i === 0 ? "Baca soal dua kali sebelum menjawab." : i === 4 ? "Kerjakan di akhir ketika energi masih fokus." : "Tulis langkah singkat di kertas coret.",
  }));

  return {
    judul: `Rencana belajar mingguan — ${args.mapel}`,
    target: args.target || `Menguasai ${args.mapel} di jenjang ${args.jenjang || "sekolah"}`,
    durasiPerSesi: durasi,
    jadwal,
    latihan,
    catatan: "Rencana ini disesuaikan dengan kelemahan yang disebutkan. Sesuaikan kecepatan bila siswa butuh pengulangan.",
  };
}

/* ============================ Simplify (mock) ============================ */

export function mockSimplify(text: string, mode: string): Record<string, unknown> {
  const kalimat = text
    .split(/(?<=[.!?:])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const pecah = (s: string): string[] => {
    if (s.length <= 90) return [s];
    const parts = s.split(/,\s*|;|—|\s-\s/);
    const out: string[] = [];
    let cur = "";
    for (const p of parts) {
      if ((cur + " " + p).length > 90) {
        out.push(cur);
        cur = p;
      } else {
        cur = cur ? cur + " " + p : p;
      }
    }
    if (cur) out.push(cur);
    return out;
  };

  const pendek = kalimat.flatMap(pecah);

  let teks: string;
  let catatan = "";

  if (mode === "disleksia") {
    teks = pendek.map((s, i) => `${i % 2 === 0 ? "•" : "◦"} ${s}`).join("\n");
    catatan = "Kalimat dipecah pendek dengan bullet supaya lebih mudah dipindai mata.";
  } else if (mode === "tunanetra") {
    teks = pendek.map((s, i) => `${i + 1}. ${s}`).join("\n");
    catatan = "Diberi penomoran agar rapi dibaca pembaca layar (screen reader).";
  } else if (mode === "tunarungu") {
    teks = pendek.map((s, i) => `[${i + 1}] ${s.replace(/\b(mikrofon|audio)\b/gi, "teks pengganti")}`).join("\n");
    catatan = "Setiap titik informasi diberi penanda visual agar mudah diikuti isyarat/tulisan.";
  } else if (mode === "ADHD") {
    teks = pendek
      .slice(0, 4)
      .map((s, i) => `LANGKAH ${i + 1}. ${s}`)
      .join("\n\n");
    catatan = "Pecah jadi langkah pendek supaya fokus tidak hilang di tengah jalan.";
  } else {
    teks = pendek.map((s, i) => `${i + 1}. ${s}`).join("\n");
    catatan = "Instruksi ditulis literal berurutan, tanpa kiasan, agar mudah dipahami apa adanya.";
  }

  return { mode, teks, catatan };
}