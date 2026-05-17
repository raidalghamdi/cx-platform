// Role-based page visibility. Persisted in localStorage so the Admin UI can edit
// without a backend round-trip, and the sidebar/route-guard read it live.

import { useEffect, useState } from "react";
import type { Role } from "@/contexts/AuthContext";

const KEY = "cx.rolePermissions";

export const PAGES = [
  "/about",
  "/dashboard",
  "/journeys",
  "/voc",
  "/complaints",
  "/inbox",
  "/kb",
  "/copilot",
  "/portal",
  "/programme",
  "/governance",
  "/architecture",
  "/audit",
  "/automation",
  "/admin",
] as const;
export type Page = typeof PAGES[number];

export const ROLES: Role[] = ["admin", "supervisor", "agent", "quality", "customer", "executive"];

export const DEFAULT_PERMS: Record<Role, Record<Page, boolean>> = {
  admin: PAGES.reduce((acc, p) => ({ ...acc, [p]: true }), {} as Record<Page, boolean>),
  supervisor: {
    "/about": true,
    "/dashboard": true,
    "/journeys": true,
    "/voc": true,
    "/complaints": true,
    "/inbox": true,
    "/kb": true,
    "/copilot": true,
    "/portal": false,
    "/programme": true,
    "/governance": true,
    "/architecture": true,
    "/audit": false,
    "/automation": true,
    "/admin": false,
  },
  agent: {
    "/about": true,
    "/dashboard": false,
    "/journeys": true,
    "/voc": false,
    "/complaints": true,
    "/inbox": true,
    "/kb": true,
    "/copilot": true,
    "/portal": false,
    "/programme": false,
    "/governance": false,
    "/architecture": false,
    "/audit": false,
    "/automation": false,
    "/admin": false,
  },
  quality: {
    "/about": true,
    "/dashboard": false,
    "/journeys": true,
    "/voc": true,
    "/complaints": true,
    "/inbox": false,
    "/kb": true,
    "/copilot": false,
    "/portal": false,
    "/programme": false,
    "/governance": true,
    "/architecture": true,
    "/audit": true,
    "/automation": false,
    "/admin": false,
  },
  customer: {
    "/about": true,
    "/dashboard": false,
    "/journeys": false,
    "/voc": false,
    "/complaints": false,
    "/inbox": false,
    "/kb": true,
    "/copilot": false,
    "/portal": true,
    "/programme": false,
    "/governance": false,
    "/architecture": false,
    "/audit": false,
    "/automation": false,
    "/admin": false,
  },
  executive: {
    "/about": true,
    "/dashboard": true,
    "/journeys": true,
    "/voc": true,
    "/complaints": false,
    "/inbox": false,
    "/kb": true,
    "/copilot": false,
    "/portal": false,
    "/programme": true,
    "/governance": true,
    "/architecture": true,
    "/audit": false,
    "/automation": false,
    "/admin": false,
  },
};

type Perms = Record<Role, Record<Page, boolean>>;
let cache: Perms | null = null;
const listeners = new Set<() => void>();

function read(): Perms {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge with defaults to gracefully handle new pages added after persistence.
      const merged: Perms = JSON.parse(JSON.stringify(DEFAULT_PERMS));
      for (const role of ROLES) {
        if (!parsed[role]) continue;
        for (const p of PAGES) {
          if (typeof parsed[role][p] === "boolean") merged[role][p] = parsed[role][p];
        }
      }
      // Admin always full.
      for (const p of PAGES) merged.admin[p] = true;
      return merged;
    }
  } catch {
    /* ignore */
  }
  return JSON.parse(JSON.stringify(DEFAULT_PERMS));
}

export function getRolePerms(): Perms {
  if (!cache) cache = read();
  return cache;
}

export function setRolePerms(next: Perms) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  for (const l of listeners) l();
}

export function resetRolePerms() {
  setRolePerms(JSON.parse(JSON.stringify(DEFAULT_PERMS)));
}

export function isAllowed(role: Role, page: string): boolean {
  const p = getRolePerms();
  if (role === "admin") return true;
  return !!(p[role] && (p[role] as Record<string, boolean>)[page]);
}

export function useRolePerms(): Perms {
  const [, setTick] = useState(0);
  useEffect(() => {
    const l = () => setTick((t) => t + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return getRolePerms();
}
