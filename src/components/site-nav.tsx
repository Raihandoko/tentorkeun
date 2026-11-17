"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Menu, User, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { spring, easeOutExpo } from "@/components/motion";

const nav = [
  { href: "/", label: "Beranda" },
  { href: "/ajukan", label: "Cari Tentor" },
  { href: "/tentor", label: "Katalog" },
];

const fitur = [
  { href: "/lapor", label: "Laporan perkembangan", desc: "Dari catatan sesi jadi laporan untuk orang tua" },
  { href: "/rencana", label: "Rencana belajar", desc: "Jadwal mingguan dan soal latihan bertingkat" },
  { href: "/verifikasi", label: "Verifikasi tentor", desc: "Saring CV pendaftar dengan cepat" },
  { href: "/aksesibilitas", label: "Aksesibilitas", desc: "Mode belajar untuk siswa ABK" },
];

function isActive(path: string, href: string) {
  return href === "/" ? path === "/" : path === href || path.startsWith(href + "/");
}

export function SiteNav({ authed, signOut }: { authed: boolean; signOut: ReactNode }) {
  const path = usePathname();
  return (
    <>
      {/* Desktop: tautan di tengah, aksi di kanan */}
      <nav
        aria-label="Navigasi utama"
        className="hidden items-center gap-1 md:absolute md:left-1/2 md:flex md:-translate-x-1/2"
      >
        {nav
          .filter((n) => n.href !== "/")
          .map((n) => {
            const active = isActive(path, n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={`relative isolate rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  active ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    aria-hidden
                    className="absolute inset-0 -z-10 rounded-lg bg-ink/[0.06]"
                    transition={spring.rise}
                  />
                )}
                {n.label}
              </Link>
            );
          })}
        <FiturPopover />
      </nav>
      <div className="hidden items-center gap-2 md:flex">
        {authed ? (
          <>
            <Link
              href="/dashboard"
              className="btn-press flex items-center gap-1.5 rounded-xl border border-line-strong/60 px-3.5 py-2 text-sm font-semibold text-ink hover:border-ink"
            >
              <User size={14} aria-hidden /> Dashboard
            </Link>
            {signOut}
          </>
        ) : (
          <>
            <Link href="/auth/login" className="rounded-lg px-3 py-2 text-sm font-semibold text-ink hover:bg-ink/5">
              Masuk
            </Link>
            <Link
              href="/ajukan"
              className="btn-press rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink shadow-[0_8px_18px_-10px_var(--accent)] hover:bg-accent-hover"
            >
              Mulai cari
            </Link>
          </>
        )}
      </div>

      <MobileMenu authed={authed} signOut={signOut} />
    </>
  );
}

function FiturPopover() {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const path = usePathname();

  const close = useCallback((refocus: boolean) => {
    setOpen(false);
    if (refocus) trigger.current?.focus();
  }, []);

  const [prevPath, setPrevPath] = useState(path);
  if (prevPath !== path) {
    setPrevPath(path);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) close(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  function onMenuKey(e: React.KeyboardEvent) {
    const items = Array.from(wrap.current?.querySelectorAll<HTMLElement>("[role=menuitem]") ?? []);
    const i = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      items[(i + 1) % items.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[(i - 1 + items.length) % items.length]?.focus();
    }
  }

  return (
    <div ref={wrap} className="relative">
      <button
        ref={trigger}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            requestAnimationFrame(() => wrap.current?.querySelector<HTMLElement>("[role=menuitem]")?.focus());
          }
        }}
        className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-muted transition-colors hover:text-ink"
      >
        Fitur
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={spring.hover} className="inline-flex">
          <ChevronDown size={14} aria-hidden />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="Fitur"
            onKeyDown={onMenuKey}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: easeOutExpo }}
            style={{ transformOrigin: "top center" }}
            className="absolute left-1/2 top-full mt-2 w-72 -translate-x-1/2 rounded-2xl border border-line bg-card p-1.5 shadow-[0_24px_48px_-24px_rgba(22,33,30,0.35)]"
          >
            {fitur.map((f) => (
              <Link
                key={f.href}
                href={f.href}
                role="menuitem"
                className="block rounded-xl px-3 py-2.5 hover:bg-ink/[0.04] focus-visible:bg-ink/[0.04]"
              >
                <span className="block text-sm font-semibold text-ink">{f.label}</span>
                <span className="block text-xs text-muted">{f.desc}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileMenu({ authed, signOut }: { authed: boolean; signOut: ReactNode }) {
  const [open, setOpen] = useState(false);
  const burger = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const path = usePathname();

  const links = [...nav, ...fitur.map((f) => ({ href: f.href, label: f.label }))];

  const [prevPath, setPrevPath] = useState(path);
  if (prevPath !== path) {
    setPrevPath(path);
    setOpen(false);
  }

  /* Scroll terkunci + konten belakang inert hanya saat terbuka */
  useEffect(() => {
    if (!open) return;
    const targets = ["konten", "footer"].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    targets.forEach((t) => t.setAttribute("inert", ""));
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const burgerEl = burger.current;
    return () => {
      document.body.style.overflow = prev;
      targets.forEach((t) => t.removeAttribute("inert"));
      document.removeEventListener("keydown", onKey);
      burgerEl?.focus();
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={burger}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Buka menu"
        aria-expanded={open}
        aria-controls="menu-mobile"
        className="btn-press flex h-11 w-11 items-center justify-center rounded-xl border border-line-strong/60 text-ink"
      >
        <Menu size={20} aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            role="dialog"
            aria-label="Menu"
            className="fixed inset-0 z-50 overflow-y-auto bg-paper text-ink"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
          >
            <div className="flex h-16 items-center justify-between border-b border-line px-5">
              <span className="font-display text-xl font-extrabold">Tentor<span className="text-accent">Keun</span></span>
              <button
                ref={closeBtn}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Tutup menu"
                className="group/x flex h-11 w-11 items-center justify-center rounded-xl border border-line-strong/60"
              >
                <X size={20} aria-hidden className="transition-transform duration-300 group-hover/x:rotate-90 group-focus-visible/x:rotate-90" />
              </button>
            </div>
            <ul className="px-5 pb-10 pt-4">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...spring.rise, delay: 0.12 + i * 0.07 }}
                >
                  <Link
                    href={l.href}
                    aria-current={isActive(path, l.href) ? "page" : undefined}
                    className={`block border-b border-line py-3.5 font-display text-2xl font-bold ${isActive(path, l.href) ? "text-accent" : "text-ink"}`}
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
              <li className="flex flex-wrap items-center gap-3 pt-6">
                {authed ? (
                  <>
                    <Link href="/dashboard" className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink">
                      Dashboard
                    </Link>
                    {signOut}
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="rounded-xl border border-line-strong/60 px-4 py-2.5 text-sm font-semibold text-ink">
                      Masuk
                    </Link>
                    <Link href="/ajukan" className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink">
                      Mulai cari
                    </Link>
                  </>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
