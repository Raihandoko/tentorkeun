import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Plus_Jakarta_Sans, Atkinson_Hyperlegible_Next } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { A11yProvider } from "@/components/a11y";
import { A11yToolbar } from "@/components/a11y-toolbar";

const display = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});
const body = Atkinson_Hyperlegible_Next({
  variable: "--font-atkinson",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TentorKeun: bimbingan belajar privat dengan tentor terverifikasi",
    template: "%s | TentorKeun",
  },
  description:
    "Bimbingan belajar privat dari TK sampai kuliah. Ceritakan kebutuhanmu, kami carikan tentor terverifikasi yang cocok, lengkap dengan laporan perkembangan dan dukungan untuk siswa berkebutuhan khusus.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <a href="#konten" className="a11y-focus-skip absolute -left-96 top-2">
          Lewati ke konten
        </a>
        <A11yProvider>
          <SiteHeader />
          <main id="konten" className="relative flex-1">
            {children}
          </main>
          <SiteFooter />
          <A11yToolbar />
        </A11yProvider>
      </body>
    </html>
  );
}
