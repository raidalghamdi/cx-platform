// Inbox store — Round 3
// Functional Agent Inbox backed by localStorage so the reply drawer
// roundtrips through the channel adapter and shows a real status change.

import { useEffect, useState } from "react";
import { getAdapter, type AdapterChannel } from "@/lib/channelAdapters";

const STORAGE_KEY = "cx.inbox";

export type InboxStatus = "new" | "open" | "replied" | "closed";
export type InboxPriority = "low" | "normal" | "high";

export type InboxThread = {
  id: string;
  channel: AdapterChannel;
  from: string;          // email address / phone / chat handle
  fromName: string;
  subject?: string;
  body: string;
  status: InboxStatus;
  priority: InboxPriority;
  receivedAt: string;    // ISO datetime
  repliedAt?: string;
  replyBody?: string;
  replySubject?: string;
  customerId?: string;
};

const DEFAULTS: InboxThread[] = [
  {
    id: "t1",
    channel: "email",
    from: "k.almutairi@example.com",
    fromName: "Khalid Al-Mutairi",
    subject: "Service application stuck on submit",
    body:
      "I tried to submit my new commercial-registry application this morning but the page froze after the OTP. The reference number never arrived by SMS. Can you please look into this?",
    status: "new",
    priority: "high",
    receivedAt: "2026-05-17T09:14:00.000Z",
    customerId: "c1",
  },
  {
    id: "t2",
    channel: "email",
    from: "f.alzahrani@example.com",
    fromName: "Fatima Al-Zahrani",
    subject: "Question about the new tariff schedule",
    body:
      "Hello — could you confirm whether the published Q3 tariff schedule supersedes the one in your December circular? I would like to plan our procurement accordingly.",
    status: "open",
    priority: "normal",
    receivedAt: "2026-05-17T08:22:00.000Z",
    customerId: "c2",
  },
  {
    id: "t3",
    channel: "email",
    from: "m.alamri@example.com",
    fromName: "Mohammed Al-Amri",
    subject: "Refund request — duplicate fee charge",
    body:
      "Attached is the receipt for the duplicate residency-fee charge from 04 May. Please refund the second transaction.",
    status: "replied",
    priority: "high",
    receivedAt: "2026-05-16T15:01:00.000Z",
    repliedAt: "2026-05-16T16:48:00.000Z",
    replySubject: "Re: Refund request — duplicate fee charge",
    replyBody:
      "Thank you for the receipt. The duplicate has been confirmed and the refund will be processed within five working days.",
    customerId: "c3",
  },
  {
    id: "t4",
    channel: "whatsapp",
    from: "+966 50 123 4567",
    fromName: "Aisha Al-Dosari",
    body: "ما زلت أنتظر تحديث طلب التسجيل منذ يومين، هل من تحديث؟",
    status: "new",
    priority: "normal",
    receivedAt: "2026-05-17T10:42:00.000Z",
    customerId: "c4",
  },
  {
    id: "t5",
    channel: "whatsapp",
    from: "+966 55 765 4321",
    fromName: "Sara Al-Shehri",
    body: "Hello, can someone confirm whether tomorrow's appointment window is still 09:00–11:00? Thanks.",
    status: "open",
    priority: "low",
    receivedAt: "2026-05-17T07:14:00.000Z",
    customerId: "c5",
  },
  {
    id: "t6",
    channel: "whatsapp",
    from: "+966 53 999 8888",
    fromName: "Abdullah Al-Subaie",
    body: "تم رفض الدفع مرتين في تطبيق النقل. أحتاج مساعدة عاجلة.",
    status: "new",
    priority: "high",
    receivedAt: "2026-05-17T11:05:00.000Z",
    customerId: "c6",
  },
  {
    id: "t7",
    channel: "chat",
    from: "chat-anon-7f2c",
    fromName: "Anonymous visitor",
    body: "Hi — where can I find the latest published competition guidelines (the ones updated in March)?",
    status: "new",
    priority: "normal",
    receivedAt: "2026-05-17T11:32:00.000Z",
  },
  {
    id: "t8",
    channel: "chat",
    from: "chat-anon-91d3",
    fromName: "Anonymous visitor",
    body: "Quick one: is the office open on Thursday afternoons?",
    status: "replied",
    priority: "low",
    receivedAt: "2026-05-16T14:01:00.000Z",
    repliedAt: "2026-05-16T14:06:00.000Z",
    replyBody:
      "Yes — our offices are open Sunday through Thursday, 08:00–16:00. We are closed on weekends.",
  },
];

let cache: InboxThread[] | null = null;
const listeners = new Set<() => void>();

function read(): InboxThread[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as InboxThread[];
  } catch {
    /* ignore */
  }
  return DEFAULTS;
}

function persist() {
  if (!cache) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    /* ignore */
  }
  for (const l of listeners) l();
}

function init() {
  if (!cache) cache = read();
}

export function list(): InboxThread[] {
  init();
  return cache!;
}

export function get(id: string): InboxThread | undefined {
  init();
  return cache!.find((t) => t.id === id);
}

export function filterByChannel(channel: AdapterChannel | "all"): InboxThread[] {
  init();
  return channel === "all" ? cache! : cache!.filter((t) => t.channel === channel);
}

export function markOpen(id: string) {
  init();
  cache = cache!.map((t) => (t.id === id ? { ...t, status: t.status === "closed" ? "open" : "open" } : t));
  persist();
}

export function markClosed(id: string) {
  init();
  cache = cache!.map((t) => (t.id === id ? { ...t, status: "closed" } : t));
  persist();
}

export async function addReply(
  threadId: string,
  payload: { subject?: string; body: string },
): Promise<{ ok: boolean; error?: string }> {
  init();
  const thread = cache!.find((t) => t.id === threadId);
  if (!thread) return { ok: false, error: "Thread not found" };

  const adapter = getAdapter(thread.channel);
  const result = await adapter.send(threadId, payload);
  if (!result.ok) return { ok: false, error: result.error };

  cache = cache!.map((t) =>
    t.id === threadId
      ? {
          ...t,
          status: "replied",
          repliedAt: new Date().toISOString(),
          replyBody: payload.body,
          replySubject: payload.subject,
        }
      : t,
  );
  persist();
  return { ok: true };
}

export function useInbox(): InboxThread[] {
  init();
  const [, setTick] = useState(0);
  useEffect(() => {
    const l = () => setTick((t) => t + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return cache!;
}
