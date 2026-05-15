import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// WCAG 2.2 AA + DGA 5.17.1 / 5.20.2 — user-adjustable presentation controls.
// No localStorage (sandbox-blocked). State persists for the session only.
type FontScale = "sm" | "md" | "lg" | "xl";
type Contrast = "normal" | "high";

type A11yCtx = {
  fontScale: FontScale;
  setFontScale: (s: FontScale) => void;
  contrast: Contrast;
  setContrast: (c: Contrast) => void;
  reduceMotion: boolean;
  setReduceMotion: (v: boolean) => void;
  underlineLinks: boolean;
  setUnderlineLinks: (v: boolean) => void;
  reset: () => void;
};

const Ctx = createContext<A11yCtx | null>(null);

const SCALE_MAP: Record<FontScale, string> = {
  sm: "93.75%",  // 15px base
  md: "100%",    // 16px base (default)
  lg: "112.5%",  // 18px base
  xl: "125%",    // 20px base
};

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [fontScale, setFontScale] = useState<FontScale>("md");
  const [contrast, setContrast] = useState<Contrast>("normal");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [underlineLinks, setUnderlineLinks] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = SCALE_MAP[fontScale];
    root.classList.toggle("a11y-contrast", contrast === "high");
    root.classList.toggle("a11y-reduce-motion", reduceMotion);
    root.classList.toggle("a11y-underline-links", underlineLinks);
  }, [fontScale, contrast, reduceMotion, underlineLinks]);

  const reset = () => {
    setFontScale("md");
    setContrast("normal");
    setReduceMotion(false);
    setUnderlineLinks(false);
  };

  return (
    <Ctx.Provider
      value={{
        fontScale,
        setFontScale,
        contrast,
        setContrast,
        reduceMotion,
        setReduceMotion,
        underlineLinks,
        setUnderlineLinks,
        reset,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useA11y() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useA11y must be used within AccessibilityProvider");
  return v;
}
