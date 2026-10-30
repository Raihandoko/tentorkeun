"use client";

import { useState } from "react";
import { Accessibility, BookOpen, Contrast, Mic, Volume2, X } from "lucide-react";
import Link from "next/link";
import { useA11y } from "@/components/a11y";

export function A11yToolbar() {
  const [open, setOpen] = useState(false);
  const { dyslexic, contrast, tts, setDyslexic, setContrast, toggleTts } = useA11y();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {open && (
        <div
          role="dialog"
          aria-label="Pengaturan aksesibilitas"
          className="w-64 rounded-lg border border-line bg-card p-4 shadow-[0_12px_32px_rgba(31,32,27,0.16)]"
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">Aksesibilitas</p>
            <button
              onClick={() => setOpen(false)}
              className="rounded p-1 text-muted hover:bg-ink/5 hover:text-ink"
              aria-label="Tutup"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-1.5">
            <ToggleRow
              icon={<Volume2 size={16} />}
              label={tts ? "Hentikan bacaan" : "Bacakan halaman"}
              sub="Text-to-speech (id-ID)"
              on={tts}
              onClick={toggleTts}
            />
            <ToggleRow
              icon={<BookOpen size={16} />}
              label="Font ramah disleksia"
              sub="Spasi & tipografi lebih longgar"
              on={dyslexic}
              onClick={() => setDyslexic(!dyslexic)}
            />
            <ToggleRow
              icon={<Contrast size={16} />}
              label="Kontras tinggi"
              sub="Meningkatkan keterbacaan"
              on={contrast}
              onClick={() => setContrast(!contrast)}
            />
          </div>

          <Link
            href="/aksesibilitas"
            className="mt-3 flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-accent hover:bg-accent-soft"
          >
            <Mic size={13} />
            Sesi daring dengan live caption
            <span aria-hidden>→</span>
          </Link>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Buka pengaturan aksesibilitas"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full bg-ink px-4 py-3 text-sm font-medium text-paper shadow-[0_8px_24px_rgba(31,32,27,0.28)] transition hover:opacity-90"
      >
        <Accessibility size={18} aria-hidden />
        Aksesibilitas
      </button>
    </div>
  );
}

function ToggleRow({
  icon,
  label,
  sub,
  on,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={`flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left transition ${
        on ? "bg-accent-soft" : "hover:bg-ink/5"
      }`}
    >
      <span className={`${on ? "text-accent" : "text-muted"}`}>{icon}</span>
      <span className="flex-1">
        <span className={`block text-sm font-medium ${on ? "text-accent" : "text-ink"}`}>{label}</span>
        <span className="block text-xs text-muted">{sub}</span>
      </span>
      <span aria-hidden className={`h-2 w-2 rounded-full ${on ? "bg-accent" : "bg-muted/40"}`} />
    </button>
  );
}