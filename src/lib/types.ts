export type Jenjang = "TK" | "SD" | "SMP" | "SMA" | "Mahasiswa" | "Umum";

export type SessionType = "online" | "offline";

export type KondisiKhusus =
  | "disleksia"
  | "tunanetra"
  | "tunarungu"
  | "ADHD"
  | "autisme"
  | "ABK umum";

export type Gender = "P" | "L";

export interface Tutor {
  id: string;
  nama: string;
  gelar: string;
  gender: Gender;
  kota: string;
  bio: string;
  mapel: string[];
  jenjang: Jenjang[];
  hargaPerSesi: number;
  hargaMin: number;
  hargaMax: number;
  sesiTersedia: SessionType[];
  rating: number;
  ulasanCount: number;
  pengalamanTahun: number;
  sertifikasiABK: boolean;
  kondisiKhusus: KondisiKhusus[];
  jadwal: string[];
  keahlian: string[];
}