import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Lora, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { A11yProvider } from "@/components/a11y";
import { A11yToolbar } from "@/components/a11y-toolbar";

const lora = Lora({ variable: "--font-lora", subsets: ["latin"], display: "swap" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "TentorKeun — Bimbingan belajar privat dengan tentor terverifikasi",
    template: "%s — TentorKeun",
  },
  description:
    "Agensi bimbingan belajar privat TK–mahasiswa. AI mencocokkan siswa dengan tentor terverifikasi, membuat laporan perkembangan, rencana belajar, dan mendukung siswa berkebutuhan khusus.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={`${lora.variable} ${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a href="#konten" className="a11y-focus-skip absolute -left-96 top-2">
          Lewati ke konten
        </a>
        <A11yProvider>
          <SiteHeader />
          <main id="konten" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <A11yToolbar />
        </A11yProvider>
      </body>
    </html>
  );
}