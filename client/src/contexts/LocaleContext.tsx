import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { dict, type Lang } from "@/lib/i18n";

type LocaleCtx = {
  lang: Lang;
  dir: "rtl" | "ltr";
  isRTL: boolean;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: string) => string;
  /** Bilingual record helper — pick AR or EN side. */
  pick: (item: { ar: string; en: string } | undefined | null) => string;
};

const Ctx = createContext<LocaleCtx | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  // Arabic default per brief. We do NOT touch localStorage (sandbox-blocked).
  const [lang, setLang] = useState<Lang>("ar");
  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = dir;
  }, [lang, dir]);

  const value = useMemo<LocaleCtx>(
    () => ({
      lang,
      dir,
      isRTL: dir === "rtl",
      setLang,
      toggle: () => setLang((l) => (l === "ar" ? "en" : "ar")),
      t: (key: string) => {
        const entry = dict[key];
        if (!entry) return key;
        return entry[lang];
      },
      pick: (item) => (item ? item[lang] : ""),
    }),
    [lang, dir],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLocale() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useLocale must be used within LocaleProvider");
  return v;
}
