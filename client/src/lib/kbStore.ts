// Editable Knowledge Base with bilingual articles. Persisted in localStorage.

import { useEffect, useState } from "react";

const KEY = "cx.kb";

export type Bi = { en: string; ar: string };

export type KbArticle = {
  id: string;
  title: Bi;
  category: Bi;
  body: Bi;
  tags: string[];
  updatedAt: string;
  views: number;
};

const DEFAULTS: KbArticle[] = [
  {
    id: "a1",
    title: { en: "How to renew your driving licence online", ar: "كيفية تجديد رخصة القيادة إلكترونياً" },
    category: { en: "Services", ar: "الخدمات" },
    body: {
      en: "Renew via the Absher app in four steps: 1) Sign in with Nafath. 2) Select 'Renew licence'. 3) Pay the fee. 4) Receive by post.",
      ar: "يمكن تجديد الرخصة عبر تطبيق أبشر في أربع خطوات: 1) الدخول بحساب نفاذ. 2) اختيار خدمة تجديد الرخصة. 3) سداد الرسوم. 4) استلامها بالبريد.",
    },
    tags: ["driving", "absher", "renewal"],
    updatedAt: "2026-04-22",
    views: 18420,
  },
  {
    id: "a2",
    title: { en: "Booking a specialist clinic appointment", ar: "حجز موعد عيادة تخصصية" },
    category: { en: "Services", ar: "الخدمات" },
    body: {
      en: "Use the Sehhaty app: pick the facility, then the specialty, then the available slot.",
      ar: "حجز المواعيد التخصصية يتم عبر تطبيق صحتي. حدد المنشأة ثم التخصص ثم الموعد المتاح.",
    },
    tags: ["health", "sehhaty"],
    updatedAt: "2026-04-19",
    views: 12104,
  },
  {
    id: "a3",
    title: { en: "Onboarding for new platform users", ar: "إرشاد المستخدمين الجدد" },
    category: { en: "Onboarding", ar: "البدء" },
    body: {
      en: "Welcome! Sign in with Nafath, complete your profile, and bookmark your most-used services.",
      ar: "أهلاً بك. سجّل الدخول عبر نفاذ، ثم استكمل ملفك الشخصي، واحفظ خدماتك الأكثر استخداماً.",
    },
    tags: ["onboarding", "welcome"],
    updatedAt: "2026-05-02",
    views: 4321,
  },
  {
    id: "a4",
    title: { en: "Resetting your Nafath password", ar: "إعادة ضبط كلمة المرور في حساب نفاذ" },
    category: { en: "Onboarding", ar: "البدء" },
    body: {
      en: "Open the Nafath app, tap 'Forgot password', verify your mobile number, then create a new password.",
      ar: "افتح تطبيق نفاذ، اضغط على «نسيت كلمة المرور»، تحقق برقم الجوال، ثم أنشئ كلمة مرور جديدة.",
    },
    tags: ["nafath", "password"],
    updatedAt: "2026-04-11",
    views: 24309,
  },
  {
    id: "a5",
    title: { en: "Fixing payment issues in the app", ar: "حل مشاكل الدفع في التطبيق" },
    category: { en: "Troubleshooting", ar: "المعالجة" },
    body: {
      en: "Enable e-commerce on your card, verify sufficient balance, and update the app to the latest version.",
      ar: "تأكد من تفعيل بطاقتك للتجارة الإلكترونية، وتحقق من توفر رصيد كافٍ، وحدّث التطبيق إلى آخر إصدار.",
    },
    tags: ["payments", "troubleshooting"],
    updatedAt: "2026-05-02",
    views: 7654,
  },
  {
    id: "a6",
    title: { en: "How to file a formal complaint", ar: "كيفية تقديم شكوى رسمية" },
    category: { en: "Troubleshooting", ar: "المعالجة" },
    body: {
      en: "File via the citizen portal, WhatsApp, or call the service centre. You will receive a reference number for tracking.",
      ar: "يمكنك تقديم شكوى عبر بوابة المستفيد أو واتساب أو الاتصال بمركز الخدمة. سيتم تزويدك برقم مرجعي للمتابعة.",
    },
    tags: ["complaints", "support"],
    updatedAt: "2026-04-29",
    views: 6532,
  },
];

let cache: KbArticle[] | null = null;
const listeners = new Set<() => void>();

function read(): KbArticle[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as KbArticle[];
  } catch {
    /* ignore */
  }
  return DEFAULTS;
}

function persist() {
  if (!cache) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    /* ignore */
  }
  for (const l of listeners) l();
}

export function getArticles(): KbArticle[] {
  if (!cache) cache = read();
  return cache;
}

export function addArticle(a: Omit<KbArticle, "id" | "updatedAt" | "views">) {
  if (!cache) cache = read();
  const id = "a" + Date.now();
  cache = [
    ...cache,
    { ...a, id, updatedAt: new Date().toISOString().slice(0, 10), views: 0 },
  ];
  persist();
  return id;
}

export function updateArticle(id: string, patch: Partial<KbArticle>) {
  if (!cache) cache = read();
  cache = cache.map((a) =>
    a.id === id
      ? { ...a, ...patch, updatedAt: new Date().toISOString().slice(0, 10) }
      : a,
  );
  persist();
}

export function deleteArticle(id: string) {
  if (!cache) cache = read();
  cache = cache.filter((a) => a.id !== id);
  persist();
}

export function getCategories(): Bi[] {
  const seen = new Map<string, Bi>();
  for (const a of getArticles()) seen.set(a.category.en, a.category);
  return Array.from(seen.values());
}

export function useArticles(): KbArticle[] {
  const [, setTick] = useState(0);
  useEffect(() => {
    const l = () => setTick((t) => t + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return getArticles();
}
