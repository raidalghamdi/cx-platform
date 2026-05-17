// Programme tasks — imported/exported as MS Project XML, CSV, or hand-edited.
// Persisted in localStorage.

import { useEffect, useState } from "react";

const KEY = "cx.programme";

export type ProgrammeTask = {
  id: string;
  name: string;
  start: string;     // ISO date
  finish: string;    // ISO date
  durationDays: number;
  predecessors: string[]; // task ids
  percentDone?: number;
};

const DEFAULTS: ProgrammeTask[] = [
  { id: "1", name: "Discovery & blueprint",      start: "2025-04-01", finish: "2025-06-30", durationDays: 91,  predecessors: [],     percentDone: 100 },
  { id: "2", name: "Design & architecture",      start: "2025-06-01", finish: "2025-09-30", durationDays: 122, predecessors: ["1"],  percentDone: 90 },
  { id: "3", name: "Build — core platform",      start: "2025-09-01", finish: "2026-03-31", durationDays: 212, predecessors: ["2"],  percentDone: 65 },
  { id: "4", name: "Pilot deployment",           start: "2026-04-01", finish: "2026-06-30", durationDays: 91,  predecessors: ["3"],  percentDone: 30 },
  { id: "5", name: "Production rollout",         start: "2026-07-01", finish: "2026-10-31", durationDays: 123, predecessors: ["4"],  percentDone: 0 },
  { id: "6", name: "Hypercare & optimisation",   start: "2026-11-01", finish: "2026-12-31", durationDays: 61,  predecessors: ["5"],  percentDone: 0 },
];

let cache: ProgrammeTask[] | null = null;
const listeners = new Set<() => void>();

function read(): ProgrammeTask[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as ProgrammeTask[];
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

export function getTasks(): ProgrammeTask[] {
  if (!cache) cache = read();
  return cache;
}

export function setTasks(next: ProgrammeTask[]) {
  cache = next;
  persist();
}

export function resetTasks() {
  setTasks(DEFAULTS);
}

export function useProgrammeTasks(): ProgrammeTask[] {
  const [, setTick] = useState(0);
  useEffect(() => {
    const l = () => setTick((t) => t + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return getTasks();
}

// ─── MS Project XML parsing/serialisation ─────────────────────────────────────

function isoFromXml(s: string): string {
  // MSP XML dates look like "2025-04-01T00:00:00"
  return s.slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a).getTime();
  const db = new Date(b).getTime();
  return Math.max(1, Math.round((db - da) / 86400000));
}

export function parseMspXml(xml: string): ProgrammeTask[] {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const err = doc.querySelector("parsererror");
  if (err) throw new Error("Invalid XML");
  const taskNodes = Array.from(doc.getElementsByTagName("Task"));
  if (!taskNodes.length) throw new Error("No <Task> elements found");
  const out: ProgrammeTask[] = [];
  for (const tn of taskNodes) {
    const uid = tn.getElementsByTagName("UID")[0]?.textContent ?? tn.getElementsByTagName("ID")[0]?.textContent ?? "";
    if (uid === "0") continue; // MSP root task
    const name = tn.getElementsByTagName("Name")[0]?.textContent?.trim() ?? "";
    if (!name) continue;
    const start = tn.getElementsByTagName("Start")[0]?.textContent ?? "";
    const finish = tn.getElementsByTagName("Finish")[0]?.textContent ?? "";
    const predNodes = Array.from(tn.getElementsByTagName("PredecessorLink"));
    const predecessors = predNodes.map((p) => p.getElementsByTagName("PredecessorUID")[0]?.textContent ?? "").filter(Boolean);
    const startIso = start ? isoFromXml(start) : new Date().toISOString().slice(0, 10);
    const finishIso = finish ? isoFromXml(finish) : startIso;
    out.push({
      id: uid,
      name,
      start: startIso,
      finish: finishIso,
      durationDays: daysBetween(startIso, finishIso),
      predecessors,
    });
  }
  return out;
}

export function parseCsv(csv: string): ProgrammeTask[] {
  const lines = csv.split(/\r?\n/).filter((l) => l.trim().length);
  if (!lines.length) throw new Error("Empty CSV");
  const header = lines[0].toLowerCase().split(",").map((h) => h.trim().replace(/"/g, ""));
  const idx = (k: string) => header.indexOf(k);
  const iName = idx("name") >= 0 ? idx("name") : 0;
  const iStart = idx("start") >= 0 ? idx("start") : 1;
  const iFinish = idx("finish") >= 0 ? idx("finish") : idx("end") >= 0 ? idx("end") : 2;
  const out: ProgrammeTask[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
    const name = cells[iName];
    if (!name) continue;
    const start = (cells[iStart] || new Date().toISOString().slice(0, 10)).slice(0, 10);
    const finish = (cells[iFinish] || start).slice(0, 10);
    out.push({
      id: String(i),
      name,
      start,
      finish,
      durationDays: daysBetween(start, finish),
      predecessors: [],
    });
  }
  if (!out.length) throw new Error("No tasks parsed");
  return out;
}

export function serialiseMspXml(tasks: ProgrammeTask[]): string {
  const t0 = new Date().toISOString();
  const taskXml = tasks
    .map(
      (t) => `    <Task>
      <UID>${t.id}</UID>
      <ID>${t.id}</ID>
      <Name>${escapeXml(t.name)}</Name>
      <Start>${t.start}T00:00:00</Start>
      <Finish>${t.finish}T00:00:00</Finish>
      <Duration>PT${t.durationDays * 8}H0M0S</Duration>
${t.predecessors.map((p) => `      <PredecessorLink><PredecessorUID>${p}</PredecessorUID><Type>1</Type></PredecessorLink>`).join("\n")}
    </Task>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<Project xmlns="http://schemas.microsoft.com/project">
  <Name>CX Platform Programme</Name>
  <CreationDate>${t0}</CreationDate>
  <Tasks>
${taskXml}
  </Tasks>
</Project>`;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
