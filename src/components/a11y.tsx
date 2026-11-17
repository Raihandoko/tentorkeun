"use client";

import { MotionConfig } from "motion/react";
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
  reduceMotion: boolean;
  tts: boolean;
  setDyslexic: (v: boolean) => void;
  setContrast: (v: boolean) => void;
  setReduceMotion: (v: boolean) => void;
  toggleTts: () => void;
}

const A11yContext = createContext<A11yState | null>(null);

type Pref = { dyslexic: boolean; contrast: boolean; reduceMotion: boolean };

function readPref(): Pref {
  if (typeof window === "undefined") return { dyslexic: false, contrast: false, reduceMotion: false };
  try {
    const raw = localStorage.getItem("tentorkeun-a11y");
    if (!raw) return { dyslexic: false, contrast: false, reduceMotion: false };
    const d = JSON.parse(raw) as Partial<Pref>;
    return { dyslexic: Boolean(d.dyslexic), contrast: Boolean(d.contrast), reduceMotion: Boolean(d.reduceMotion) };
  } catch {
    return { dyslexic: false, contrast: false, reduceMotion: false };
  }
}

export function A11yProvider({ children }: { children: ReactNode }) {
  const [dyslexic, setDyslexicState] = useState(false);
  const [contrast, setContrastState] = useState(false);
  const [reduceMotion, setReduceMotionState] = useState(false);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [tts, setTts] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const prefs = readPref();
    setDyslexicState(prefs.dyslexic);
    setContrastState(prefs.contrast);
    setReduceMotionState(prefs.reduceMotion);
    setPreferencesLoaded(true);
  }, []);

  useEffect(() => {
    if (!preferencesLoaded) return;
    const el = document.documentElement;
    el.setAttribute("data-a11y-dyslexic", dyslexic ? "1" : "0");
    el.setAttribute("data-a11y-contrast", contrast ? "1" : "0");
    el.setAttribute("data-a11y-motion", reduceMotion ? "1" : "0");
    el.setAttribute("data-hydrated", "1");
    try {
      localStorage.setItem("tentorkeun-a11y", JSON.stringify({ dyslexic, contrast, reduceMotion }));
    } catch {
      /* abaikan */
    }
  }, [dyslexic, contrast, reduceMotion, preferencesLoaded]);

  const setDyslexic = useCallback((v: boolean) => setDyslexicState(v), []);
  const setContrast = useCallback((v: boolean) => setContrastState(v), []);
  const setReduceMotion = useCallback((v: boolean) => setReduceMotionState(v), []);

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
    <A11yContext.Provider value={{ dyslexic, contrast, reduceMotion, tts, setDyslexic, setContrast, setReduceMotion, toggleTts }}>
      <MotionConfig reducedMotion={reduceMotion ? "always" : "user"}>{children}</MotionConfig>
    </A11yContext.Provider>
  );
}

export function useA11y(): A11yState {
  const ctx = useContext(A11yContext);
  if (!ctx) throw new Error("useA11y harus dipakai di dalam <A11yProvider>");
  return ctx;
}
