/**
 * Verifikasi Rasio Kontras Warna WCAG 2.1 (AA & AAA)
 * Standar WCAG:
 * - Normal Text (AA): >= 4.5:1
 * - Large Text / Bold (AA): >= 3.0:1
 * - Normal Text (AAA): >= 7.0:1
 */

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function sRgbToLinear(c) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function relativeLuminance(rgb) {
  const rLin = sRgbToLinear(rgb.r);
  const gLin = sRgbToLinear(rgb.g);
  const bLin = sRgbToLinear(rgb.b);
  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hexToRgb(hex1));
  const l2 = relativeLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const pairs = [
  // Mode Normal (Default)
  { label: "Teks Utama (--ink on --paper)", fg: "#16211E", bg: "#F7F8F4", req: 4.5 },
  { label: "Teks Utama (--ink on --card)", fg: "#16211E", bg: "#FFFFFF", req: 4.5 },
  { label: "Teks Muted (--muted on --paper)", fg: "#52605B", bg: "#F7F8F4", req: 4.5 },
  { label: "Teks Muted (--muted on --card)", fg: "#52605B", bg: "#FFFFFF", req: 4.5 },
  { label: "Tombol Primer (White on --accent)", fg: "#FFFFFF", bg: "#0B5D6B", req: 4.5 },
  { label: "Link / Accent (--accent on --paper)", fg: "#0B5D6B", bg: "#F7F8F4", req: 4.5 },
  { label: "Link / Accent (--accent on --accent-soft)", fg: "#0B5D6B", bg: "#DCECEE", req: 4.5 },
  { label: "Sorotan Stabilo (--on-stabilo on --stabilo)", fg: "#16211E", bg: "#FFD23F", req: 4.5 },
  { label: "Badge Koreksi/Error (--koreksi on --koreksi-soft)", fg: "#B3261E", bg: "#FDEEEC", req: 4.5 },
  { label: "Badge Sukses (--lulus on --lulus-soft)", fg: "#2B7A4B", bg: "#E3F3E9", req: 4.5 },
  { label: "Badge Peringatan (--peringatan on --peringatan-soft)", fg: "#8A5A00", bg: "#FDF3D9", req: 4.5 },
  { label: "Teks putih di panel gelap (--panel)", fg: "#FFFFFF", bg: "#0D2B30", req: 7.0 },
  { label: "Teks putih 70% di panel gelap", fg: "#B6C0C2", bg: "#0D2B30", req: 4.5 },

  // Mode Kontras Tinggi (High Contrast)
  { label: "[Kontras Tinggi] Teks Utama (--ink on --paper)", fg: "#F2F7F5", bg: "#0C1A1C", req: 7.0 },
  { label: "[Kontras Tinggi] Teks Utama (--ink on --card)", fg: "#F2F7F5", bg: "#132628", req: 7.0 },
  { label: "[Kontras Tinggi] Teks Muted (--muted on --paper)", fg: "#C5D4D0", bg: "#0C1A1C", req: 7.0 },
  { label: "[Kontras Tinggi] Tombol Primer (--accent-ink on --accent)", fg: "#0C1A1C", bg: "#7FD1DE", req: 7.0 },
  { label: "[Kontras Tinggi] Accent Link (--accent on --paper)", fg: "#7FD1DE", bg: "#0C1A1C", req: 7.0 },
  { label: "[Kontras Tinggi] Sorotan Stabilo (--on-stabilo on --stabilo)", fg: "#16211E", bg: "#FFD23F", req: 4.5 },
  { label: "[Kontras Tinggi] Badge Koreksi (--koreksi on --koreksi-soft)", fg: "#FF9D8F", bg: "#3A1C1E", req: 4.5 },
  { label: "[Kontras Tinggi] Badge Sukses (--lulus on --lulus-soft)", fg: "#7FDCAB", bg: "#17352A", req: 4.5 },
  { label: "[Kontras Tinggi] Badge Peringatan (--peringatan on --peringatan-soft)", fg: "#F2C15A", bg: "#3A2C0C", req: 4.5 },
];

console.log("==========================================================================================");
console.log(" HASIL VERIFIKASI RASIO KONTRAS WCAG 2.1 — TENTORKEUN PALETTE");
console.log("==========================================================================================");
console.log(
  "| " +
  "Elemen UI".padEnd(52) +
  "| FG".padEnd(10) +
  "| BG".padEnd(10) +
  "| Rasio".padEnd(10) +
  "| Target".padEnd(9) +
  "| Status |"
);
console.log("|" + "-".repeat(53) + "|" + "-".repeat(10) + "|" + "-".repeat(10) + "|" + "-".repeat(10) + "|" + "-".repeat(9) + "|--------|");

let allPass = true;
pairs.forEach((p) => {
  const ratio = contrastRatio(p.fg, p.bg);
  const ratioStr = ratio.toFixed(2) + ":1";
  const pass = ratio >= p.req;
  if (!pass) allPass = false;
  const status = ratio >= 7.0 ? "PASS (AAA)" : pass ? "PASS (AA)" : "FAIL";
  console.log(
    `| ${p.label.padEnd(51)} | ${p.fg.padEnd(8)} | ${p.bg.padEnd(8)} | ${ratioStr.padEnd(8)} | >= ${p.req}:1  | ${status} |`
  );
});
console.log("==========================================================================================");
console.log(allPass ? "✅ SEMUA PASANGAN WARNA LOLOS STANDAR WCAG AA / AAA!" : "❌ ADA PASANGAN YANG GAGAL!");
