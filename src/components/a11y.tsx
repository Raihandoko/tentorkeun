"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface A11yState {
  dyslexic: boolean;
  contrast: boolean;
  tts: boolean;
  setDyslexic: (v: boolean) => void;
  setContrast: (v: boolean) => void;
  toggleTts: () => void;
}

const A11yContext = createContext<A11yState | null>(null);

function readPref(): { dyslexic: boolean; contrast: boolean } {
  if (typeof window === "undefined") return { dyslexic: false, contrast: false };
  try {
    const raw = localStorage.getItem("tentorkeun-a11y");
    if (!raw) return { dyslexic: false, contrast: false };
    const d = JSON.parse(raw) as { dyslexic?: boolean; contrast?: boolean };
    return { dyslexic: Boolean(d.dyslexic), contrast: Boolean(d.contrast) };
  } catch {
    return { dyslexic: false, contrast: false };
  }
}

export function A11yProvider({ children }: { children: ReactNode }) {
  const [prefs] = useState(readPref);
  const [dyslexic, setDyslexicState] = useState(prefs.dyslexic);
  const [contrast, setContrastState] = useState(prefs.contrast);
  const [tts, setTts] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const el = document.documentElement;
    el.setAttribute("data-a11y-dyslexic", dyslexic ? "1" : "0");
    el.setAttribute("data-a11y-contrast", contrast ? "1" : "0");
    try {
      localStorage.setItem("tentorkeun-a11y", JSON.stringify({ dyslexic, contrast }));
    } catch {
      /* abaikan */
    }
  }, [dyslexic, contrast]);

  const setDyslexic = useCallback((v: boolean) => setDyslexicState(v), []);
  const setContrast = useCallback((v: boolean) => setContrastState(v), []);

  const toggleTts = useCallback(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;

    if (speechRef.current) {
      synth.cancel();
      speechRef.current = null;
      setTts(false);
      return;
    }

    const main = document.querySelector("main");
    const text = (main?.textContent ?? document.body.innerText).slice(0, 12000);
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "id-ID";
    utter.rate = 0.95;
    utter.onend = () => {
      speechRef.current = null;
      setTts(false);
    };
    utter.onerror = () => {
      speechRef.current = null;
      setTts(false);
    };
    speechRef.current = utter;
    setTts(true);
    synth.speak(utter);
  }, []);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  return (
    <A11yContext.Provider value={{ dyslexic, contrast, tts, setDyslexic, setContrast, toggleTts }}>
      {children}
    </A11yContext.Provider>
  );
}

export function useA11y(): A11yState {
  const ctx = useContext(A11yContext);
  if (!ctx) throw new Error("useA11y harus dipakai di dalam <A11yProvider>");
  return ctx;
}