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
    en: "This is the customer experience system used by the General Authority for Competition. Our IT team built it in-house — no external vendor. Every page you see is something we run, audit, and improve ourselves, in line with Vision 2030, the Digital Government Authority, the National Cybersecurity Authority (NCA), and the National Data Management Office (NDMO).",
    ar: "هذه هي منظومة تجربة المستفيد التي تستخدمها الهيئة العامة للمنافسة. طوّرها فريق تقنية المعلومات لدينا داخلياً وبدون أي مزوّد خارجي. كل صفحة هنا نديرها ونراجعها ونحسّنها بأنفسنا، بما يتوافق مع رؤية 2030 وهيئة الحكومة الرقمية والأمن السيبراني (NCA) وإدارة البيانات الوطنية (NDMO).",
  },
  mission: {
    en: "We listen to every citizen and business that reaches out to us, we close the loop quickly, and we keep an honest record of what worked and what didn't.",
    ar: "نُصغي إلى كل مواطن ومنشأة يتواصلون معنا، نُغلق الحلقة بسرعة، ونحتفظ بسجل أمين لما نجح وما لم ينجح.",
  },
  vision: {
    en: "A government service experience that we — the GAC team — would be proud to use ourselves, every working day.",
    ar: "تجربة خدمة حكومية نفخر — نحن فريق الهيئة — باستخدامها بأنفسنا كل يوم عمل.",
  },
  values: [
    { en: "Built in-house — no external vendor", ar: "تطوير داخلي — بدون مزوّد خارجي" },
    { en: "Plain language over jargon", ar: "لغة واضحة بدلاً من المصطلحات" },
    { en: "Closing the loop, not just logging it", ar: "إغلاق الحلقة وليس مجرد التسجيل" },
    { en: "Evidence over opinions", ar: "الأدلة قبل الآراء" },
    { en: "Honest about what we don't know", ar: "صادقون فيما لا نعرفه" },
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
