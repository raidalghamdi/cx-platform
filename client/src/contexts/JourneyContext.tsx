// JourneyContext — useState-backed CRUD for the Service Journeys module.
// In-memory only (matches the rest of the platform). Provides:
// - list / add / update / delete journey
// - addStage / updateStage / deleteStage / reorderStage
// - updateField on any stage sub-item (touchpoints / actions / entities / opportunities)
// - edit-mode toggle (global) so the UI can switch between view and edit

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { SEED_JOURNEYS, type Journey, type Stage, type StageItem, type Bi } from "@/lib/seedJourneys";

type SectionKey = "touchpoints" | "actions" | "entities" | "opportunities";

type JourneyCtx = {
  journeys: Journey[];
  editMode: boolean;
  setEditMode: (v: boolean) => void;

  // Journey-level CRUD
  addJourney: (j: Omit<Journey, "id">) => string;
  updateJourney: (id: string, patch: Partial<Journey>) => void;
  deleteJourney: (id: string) => void;

  // Stage-level CRUD
  addStage: (journeyId: string) => void;
  updateStage: (journeyId: string, stageId: string, patch: Partial<Stage>) => void;
  deleteStage: (journeyId: string, stageId: string) => void;
  moveStage: (journeyId: string, stageId: string, dir: -1 | 1) => void;

  // Items inside a stage section
  addItem: (journeyId: string, stageId: string, section: SectionKey) => void;
  updateItem: (
    journeyId: string,
    stageId: string,
    section: SectionKey,
    itemId: string,
    patch: Partial<StageItem>,
  ) => void;
  deleteItem: (journeyId: string, stageId: string, section: SectionKey, itemId: string) => void;

  // Type/outcome pills
  addType: (journeyId: string) => void;
  updateType: (journeyId: string, idx: number, patch: Bi) => void;
  deleteType: (journeyId: string, idx: number) => void;

  addOutcome: (journeyId: string) => void;
  updateOutcome: (journeyId: string, idx: number, patch: Bi) => void;
  deleteOutcome: (journeyId: string, idx: number) => void;
};

const Ctx = createContext<JourneyCtx | null>(null);

const uid = () => Math.random().toString(36).slice(2, 9);

function emptyStage(): Stage {
  return {
    id: uid(),
    icon: "Circle",
    name: { ar: "مرحلة جديدة", en: "New stage" },
    sla: { ar: "", en: "" },
    sentiment: "neutral",
    emotionScore: 0,
    touchpoints: [],
    actions: [],
    entities: [],
    opportunities: [],
  };
}

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [journeys, setJourneys] = useState<Journey[]>(SEED_JOURNEYS);
  const [editMode, setEditMode] = useState(false);

  const value = useMemo<JourneyCtx>(() => {
    const setOne = (id: string, fn: (j: Journey) => Journey) =>
      setJourneys((list) => list.map((j) => (j.id === id ? fn(j) : j)));

    return {
      journeys,
      editMode,
      setEditMode,

      addJourney: (j) => {
        const id = "j-" + uid();
        setJourneys((list) => [...list, { ...j, id }]);
        return id;
      },
      updateJourney: (id, patch) => setOne(id, (j) => ({ ...j, ...patch })),
      deleteJourney: (id) => setJourneys((list) => list.filter((j) => j.id !== id)),

      addStage: (jid) =>
        setOne(jid, (j) => ({ ...j, stages: [...j.stages, emptyStage()] })),
      updateStage: (jid, sid, patch) =>
        setOne(jid, (j) => ({
          ...j,
          stages: j.stages.map((s) => (s.id === sid ? { ...s, ...patch } : s)),
        })),
      deleteStage: (jid, sid) =>
        setOne(jid, (j) => ({ ...j, stages: j.stages.filter((s) => s.id !== sid) })),
      moveStage: (jid, sid, dir) =>
        setOne(jid, (j) => {
          const idx = j.stages.findIndex((s) => s.id === sid);
          const newIdx = idx + dir;
          if (idx < 0 || newIdx < 0 || newIdx >= j.stages.length) return j;
          const arr = j.stages.slice();
          const [m] = arr.splice(idx, 1);
          arr.splice(newIdx, 0, m);
          return { ...j, stages: arr };
        }),

      addItem: (jid, sid, section) =>
        setOne(jid, (j) => ({
          ...j,
          stages: j.stages.map((s) =>
            s.id === sid
              ? { ...s, [section]: [...s[section], { id: uid(), label: { ar: "", en: "" } }] }
              : s,
          ),
        })),
      updateItem: (jid, sid, section, itemId, patch) =>
        setOne(jid, (j) => ({
          ...j,
          stages: j.stages.map((s) =>
            s.id === sid
              ? {
                  ...s,
                  [section]: s[section].map((it) =>
                    it.id === itemId ? { ...it, ...patch } : it,
                  ),
                }
              : s,
          ),
        })),
      deleteItem: (jid, sid, section, itemId) =>
        setOne(jid, (j) => ({
          ...j,
          stages: j.stages.map((s) =>
            s.id === sid
              ? { ...s, [section]: s[section].filter((it) => it.id !== itemId) }
              : s,
          ),
        })),

      addType: (jid) =>
        setOne(jid, (j) => ({ ...j, types: [...j.types, { ar: "", en: "" }] })),
      updateType: (jid, idx, patch) =>
        setOne(jid, (j) => ({
          ...j,
          types: j.types.map((t, i) => (i === idx ? patch : t)),
        })),
      deleteType: (jid, idx) =>
        setOne(jid, (j) => ({ ...j, types: j.types.filter((_, i) => i !== idx) })),

      addOutcome: (jid) =>
        setOne(jid, (j) => ({ ...j, outcomes: [...j.outcomes, { ar: "", en: "" }] })),
      updateOutcome: (jid, idx, patch) =>
        setOne(jid, (j) => ({
          ...j,
          outcomes: j.outcomes.map((t, i) => (i === idx ? patch : t)),
        })),
      deleteOutcome: (jid, idx) =>
        setOne(jid, (j) => ({ ...j, outcomes: j.outcomes.filter((_, i) => i !== idx) })),
    };
  }, [journeys, editMode]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useJourneys() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useJourneys must be used within JourneyProvider");
  return v;
}
