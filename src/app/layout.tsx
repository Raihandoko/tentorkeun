import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque, Atkinson_Hyperlegible_Next } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { A11yProvider } from "@/components/a11y";
import { A11yToolbar } from "@/components/a11y-toolbar";

const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz"],
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement;if(location.pathname!=="/")return;if(sessionStorage.getItem("tk-intro"))return;var m=matchMedia("(prefers-reduced-motion: reduce)").matches;var a=JSON.parse(localStorage.getItem("tentorkeun-a11y")||"{}");if(m||a.reduceMotion)return;d.dataset.intro="1";sessionStorage.setItem("tk-intro","1")}catch(e){}})();setTimeout(function(){var d=document.documentElement;if(!d.dataset.hydrated)d.dataset.revealFallback="1"},2500)`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <a href="#konten" className="a11y-focus-skip absolute -left-96 top-2">
          Lewati ke konten
        </a>
        <A11yProvider>
          <SiteHeader />
          <main id="konten" className="relative flex-1 pt-20">
            {children}
          </main>
          <SiteFooter />
          <A11yToolbar />
        </A11yProvider>
      </body>
    </html>
  );
}