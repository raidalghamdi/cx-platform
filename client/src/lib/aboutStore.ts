// About page content — editable by admin. Persisted in localStorage.

import { useEffect, useState } from "react";

const KEY = "cx.about";

export type Bi = { en: string; ar: string };

export type AboutContent = {
  hero: Bi;
  mission: Bi;
  vision: Bi;
  values: Bi[];
  milestones: { year: string; title: Bi }[];
  team: { name: Bi; role: Bi }[];
};

const DEFAULTS: AboutContent = {
  hero: {
    en: "A unified, audit-ready customer experience platform aligned to Vision 2030, DGA, EFQM, ISO, and PDPL — with Round-2 enhancements for RPA automation, hash-chained audit, Monafasah+ integration, an editable knowledge base, MS Project import, and granular role permissions.",
    ar: "منصة موحّدة وجاهزة للتدقيق لتجربة المستفيد، متوافقة مع رؤية 2030 وهيئة الحكومة الرقمية ونموذج EFQM والأيزو ونظام حماية البيانات الشخصية — مع تحسينات الجولة الثانية للأتمتة RPA، وسلسلة تدقيق مُجزّأة، وتكامل منافسة+، وقاعدة معرفة قابلة للتحرير، واستيراد MS Project، وصلاحيات أدوار مفصّلة.",
  },
  mission: {
    en: "Listen to every citizen interaction, resolve faster than ever, and improve continuously through evidence — all in a single, governed workspace.",
    ar: "نُصغي إلى كل تفاعل مع المستفيد، نحلّ أسرع من أي وقت مضى، ونُحسّن باستمرار بناءً على الأدلة — في بيئة عمل واحدة محوكمة.",
  },
  vision: {
    en: "World-class government customer experience by 2030 — bilingual, accessible, AI-assisted, and accountable.",
    ar: "تجربة مستفيد حكومية عالمية بحلول 2030 — ثنائية اللغة، متاحة للجميع، مدعومة بالذكاء الاصطناعي، وخاضعة للمساءلة.",
  },
  values: [
    { en: "Customer-first", ar: "المستفيد أولاً" },
    { en: "Transparency", ar: "الشفافية" },
    { en: "Accountability", ar: "المساءلة" },
    { en: "Continuous improvement", ar: "التحسين المستمر" },
    { en: "Responsible AI", ar: "الذكاء الاصطناعي المسؤول" },
  ],
  milestones: [
    { year: "2025 Q3", title: { en: "Platform foundation & blueprint", ar: "تأسيس المنصة والمخطط الشامل" } },
    { year: "2025 Q4", title: { en: "Pilot rollout — Monafasah+ API integration", ar: "إطلاق تجريبي — تكامل منافسة+" } },
    { year: "2026 Q1", title: { en: "RPA automation + hash-chained audit live", ar: "تفعيل الأتمتة RPA وسلسلة التدقيق" } },
    { year: "2026 Q2", title: { en: "Round-2: editable KB, MS Project import, role permissions", ar: "الجولة الثانية: قاعدة معرفة قابلة للتحرير، استيراد MS Project، صلاحيات الأدوار" } },
  ],
  team: [
    { name: { en: "Raid Al-Ghamdi", ar: "رائد الغامدي" }, role: { en: "Chief of Strategy & Business Excellence", ar: "رئيس الاستراتيجية والتميز المؤسسي" } },
    { name: { en: "Fatima Al-Otaibi", ar: "فاطمة العتيبي" }, role: { en: "CX Supervisor", ar: "مشرفة تجربة المستفيد" } },
    { name: { en: "Layla Al-Qahtani", ar: "ليلى القحطاني" }, role: { en: "Quality Officer", ar: "مسؤولة الجودة" } },
  ],
};

let cache: AboutContent | null = null;
const listeners = new Set<() => void>();

function read(): AboutContent {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return DEFAULTS;
}

export function getAbout(): AboutContent {
  if (!cache) cache = read();
  return cache;
}

export function setAbout(next: AboutContent) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  for (const l of listeners) l();
}

export function resetAbout() {
  setAbout(DEFAULTS);
}

export function useAbout(): AboutContent {
  const [, setTick] = useState(0);
  useEffect(() => {
    const l = () => setTick((t) => t + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return getAbout();
}
