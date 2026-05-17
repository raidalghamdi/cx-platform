// Notifications store backing the header-bell dropdown. Bilingual, persistent.

import { useEffect, useState } from "react";

const KEY = "cx.notifications";

export type Notification = {
  id: string;
  titleKey: string;
  at: string;
  read: boolean;
  href?: string;
  severity: "info" | "warn" | "ok";
};

const DEFAULTS: Notification[] = [
  { id: "n1", titleKey: "notif.sla", at: "12:08", read: false, href: "/complaints", severity: "warn" },
  { id: "n2", titleKey: "notif.newComplaint", at: "11:54", read: false, href: "/inbox", severity: "info" },
  { id: "n3", titleKey: "notif.survey", at: "10:22", read: false, href: "/voc", severity: "info" },
  { id: "n4", titleKey: "notif.kb", at: "Yesterday", read: true, href: "/kb", severity: "ok" },
  { id: "n5", titleKey: "notif.audit", at: "Yesterday", read: true, href: "/audit", severity: "ok" },
];

let cache: Notification[] | null = null;
const listeners = new Set<() => void>();

function read(): Notification[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Notification[];
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

export function getNotifications(): Notification[] {
  if (!cache) cache = read();
  return cache;
}

export function markRead(id: string) {
  if (!cache) cache = read();
  cache = cache.map((n) => (n.id === id ? { ...n, read: true } : n));
  persist();
}

export function markAllRead() {
  if (!cache) cache = read();
  cache = cache.map((n) => ({ ...n, read: true }));
  persist();
}

export function useNotifications(): Notification[] {
  const [, setTick] = useState(0);
  useEffect(() => {
    const l = () => setTick((t) => t + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return getNotifications();
}
