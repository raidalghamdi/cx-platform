// Contact channels — persisted in localStorage so the Inbox banner and the Admin
// console stay in sync.

import { useEffect, useState } from "react";

const KEY = "cx.channels";

export type Channels = {
  whatsapp: string;
  email: string;
  hours: string;
};

const DEFAULTS: Channels = {
  whatsapp: "+966 11 000 0000",
  email: "info@cx.gov.sa",
  hours: "24/7",
};

function read(): Channels {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return DEFAULTS;
}

const listeners = new Set<() => void>();
let cache: Channels | null = null;

export function getChannels(): Channels {
  if (!cache) cache = read();
  return cache;
}

export function setChannels(next: Channels) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  for (const l of listeners) l();
}

export function useChannels(): Channels {
  const [, setTick] = useState(0);
  useEffect(() => {
    const l = () => setTick((t) => t + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return getChannels();
}
