// Editable surveys for VoC. Persisted in localStorage.

import { useEffect, useState } from "react";
import { SURVEYS as SEED_SURVEYS, type Survey, type Bi } from "@/lib/seed";

const KEY = "cx.surveys";

export type SurveyChannel = "email" | "sms" | "whatsapp" | "in-app";

export type EditableSurvey = Survey & {
  channel: SurveyChannel;
  questions: { id: string; prompt: Bi }[];
  isActive: boolean;
};

function withDefaults(s: Survey, idx: number): EditableSurvey {
  return {
    ...s,
    channel: (["email", "sms", "whatsapp", "in-app"][idx % 4] as SurveyChannel),
    isActive: s.status.en.toLowerCase() === "active",
    questions: [
      { id: "q1", prompt: { en: "How satisfied are you?", ar: "ما مدى رضاك عن الخدمة؟" } },
      { id: "q2", prompt: { en: "How easy was the service to use?", ar: "ما مدى سهولة استخدام الخدمة؟" } },
      { id: "q3", prompt: { en: "Any additional comments?", ar: "ملاحظات إضافية؟" } },
    ],
  };
}

const DEFAULTS = (): EditableSurvey[] => SEED_SURVEYS.map(withDefaults);

let cache: EditableSurvey[] | null = null;
const listeners = new Set<() => void>();

function read(): EditableSurvey[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as EditableSurvey[];
  } catch {
    /* ignore */
  }
  return DEFAULTS();
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

export function getSurveys(): EditableSurvey[] {
  if (!cache) cache = read();
  return cache;
}

export function addSurvey() {
  if (!cache) cache = read();
  const id = "s" + Date.now();
  cache = [
    ...cache,
    {
      id,
      name: { en: "Untitled survey", ar: "استبيان بدون عنوان" },
      audience: { en: "All customers", ar: "كل المستفيدين" },
      responses: 0,
      responseRate: 0,
      score: 0,
      status: { en: "Draft", ar: "مسودة" },
      type: "CSAT",
      channel: "email",
      isActive: false,
      questions: [
        { id: "q1", prompt: { en: "How satisfied are you?", ar: "ما مدى رضاك عن الخدمة؟" } },
        { id: "q2", prompt: { en: "How easy was the service to use?", ar: "ما مدى سهولة استخدام الخدمة؟" } },
        { id: "q3", prompt: { en: "Additional comments?", ar: "ملاحظات إضافية؟" } },
      ],
    },
  ];
  persist();
  return id;
}

export function editSurvey(id: string, patch: Partial<EditableSurvey>) {
  if (!cache) cache = read();
  cache = cache.map((s) => (s.id === id ? { ...s, ...patch } : s));
  persist();
}

export function deleteSurvey(id: string) {
  if (!cache) cache = read();
  cache = cache.filter((s) => s.id !== id);
  persist();
}

export function toggleActive(id: string) {
  if (!cache) cache = read();
  cache = cache.map((s) =>
    s.id === id
      ? {
          ...s,
          isActive: !s.isActive,
          status: !s.isActive
            ? { en: "Active", ar: "نشط" }
            : { en: "Draft", ar: "مسودة" },
        }
      : s,
  );
  persist();
}

export function useSurveys(): EditableSurvey[] {
  const [, setTick] = useState(0);
  useEffect(() => {
    const l = () => setTick((t) => t + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return getSurveys();
}
