// Lightweight in-memory store for complaints (Round 2): wires the Resolve / Reopen / Assign / Note buttons
// to local state so the table re-renders and the timeline grows. localStorage-backed for persistence
// across reloads in this demo environment.

import { useEffect, useState } from "react";
import {
  COMPLAINTS as SEED_COMPLAINTS,
  type Complaint,
  type ComplaintStatus,
} from "@/lib/seed";

const STORAGE_KEY = "cx.complaints";

// Sub-set of complaints flagged as "Down Journey" — Round 2 requirement
const DOWN_JOURNEY_MAP: Record<string, { en: string; ar: string }> = {
  cx1: { en: "Status Tracking", ar: "متابعة الحالة" },
  cx3: { en: "Payment", ar: "السداد" },
  cx4: { en: "Application Submission", ar: "تقديم الطلب" },
  cx8: { en: "Service Search", ar: "البحث عن الخدمة" },
};

export type ComplaintExt = Complaint & {
  downJourney?: boolean;
  journeyStage?: { en: string; ar: string };
};

let memory: ComplaintExt[] = [];
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
  } catch {
    /* ignore quota */
  }
}

function seed(): ComplaintExt[] {
  return SEED_COMPLAINTS.map((c) => {
    const dj = DOWN_JOURNEY_MAP[c.id];
    return dj ? { ...c, downJourney: true, journeyStage: dj } : { ...c };
  });
}

function init() {
  if (memory.length) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      memory = JSON.parse(raw) as ComplaintExt[];
      return;
    }
  } catch {
    /* ignore */
  }
  memory = seed();
  persist();
}

function nowStamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function getComplaints(): ComplaintExt[] {
  init();
  return memory;
}

export function updateStatus(id: string, status: ComplaintStatus, actor: { en: string; ar: string }) {
  init();
  memory = memory.map((c) => {
    if (c.id !== id) return c;
    const action = {
      en: `Status changed to ${status}`,
      ar: `تم تغيير الحالة إلى ${status}`,
    };
    return {
      ...c,
      status,
      updated: nowStamp().slice(0, 10),
      timeline: [...c.timeline, { at: nowStamp(), action, actor }],
    };
  });
  persist();
  emit();
}

export function addNote(id: string, text: string, actor: { en: string; ar: string }) {
  init();
  memory = memory.map((c) => {
    if (c.id !== id) return c;
    return {
      ...c,
      updated: nowStamp().slice(0, 10),
      timeline: [...c.timeline, { at: nowStamp(), action: { en: `Note: ${text}`, ar: `ملاحظة: ${text}` }, actor }],
    };
  });
  persist();
  emit();
}

export function assignTo(id: string, who: { en: string; ar: string }, actor: { en: string; ar: string }) {
  init();
  memory = memory.map((c) => {
    if (c.id !== id) return c;
    return {
      ...c,
      owner: who,
      updated: nowStamp().slice(0, 10),
      timeline: [...c.timeline, { at: nowStamp(), action: { en: `Assigned to ${who.en}`, ar: `تم الإسناد إلى ${who.ar}` }, actor }],
    };
  });
  persist();
  emit();
}

export function resetComplaints() {
  memory = seed();
  persist();
  emit();
}

// React hook
export function useComplaints(): ComplaintExt[] {
  init();
  const [, setTick] = useState(0);
  useEffect(() => {
    const l = () => setTick((t) => t + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return memory;
}
