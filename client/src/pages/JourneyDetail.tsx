import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { useLocale } from "@/contexts/LocaleContext";
import { useJourneys } from "@/contexts/JourneyContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { HeroPattern } from "@/components/brand/HeroPattern";
import {
  StageCard,
  EmotionCurve,
  StageDetailPanel,
  BiInlineEdit,
  LucideIcon,
  ICON_CHOICES,
} from "@/components/journeys/JourneyBits";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Pencil,
  X,
  Layers,
  Building2,
  Clock,
} from "lucide-react";

export default function JourneyDetail() {
  const { id } = useParams<{ id: string }>();
  const { t, lang, pick, isRTL } = useLocale();
  const {
    journeys,
    editMode,
    setEditMode,
    updateJourney,
    deleteJourney,
    addStage,
    addType,
    updateType,
    deleteType,
    addOutcome,
    updateOutcome,
    deleteOutcome,
  } = useJourneys();
  const [, navigate] = useLocation();
  const journey = journeys.find((j) => j.id === id);
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);
  const [typeIdx, setTypeIdx] = useState(0);
  const [outcomeIdx, setOutcomeIdx] = useState(0);

  useEffect(() => {
    if (journey && !selectedStageId && journey.stages[0]) {
      setSelectedStageId(journey.stages[0].id);
    }
  }, [journey, selectedStageId]);

  if (!journey) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4">{lang === "ar" ? "الرحلة غير موجودة" : "Journey not found"}</p>
        <Button asChild variant="outline"><Link href="/journeys">{t("journeys.back")}</Link></Button>
      </div>
    );
  }

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;
  const selectedStage = journey.stages.find((s) => s.id === selectedStageId);
  const selectedIdx = journey.stages.findIndex((s) => s.id === selectedStageId);

  const entityCount = new Set(
    journey.stages.flatMap((s) => s.entities.map((e) => pick(e.label))),
  ).size;

  const handleDelete = () => {
    if (window.confirm(t("journeys.confirmDelete"))) {
      deleteJourney(journey.id);
      navigate("/journeys");
    }
  };

  return (
    <div>
      {/* Top bar: back link + edit toggle */}
      <div className="flex items-center justify-between mb-4">
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
          <Link href="/journeys"><BackIcon size={14} /> {t("journeys.back")}</Link>
        </Button>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-medium select-none cursor-pointer">
            <Pencil size={13} className={cn("transition-colors", editMode ? "text-primary" : "text-muted-foreground")} />
            <span className={cn(editMode ? "text-primary" : "text-muted-foreground")}>{t("journeys.editMode")}</span>
            <Switch checked={editMode} onCheckedChange={setEditMode} data-testid="toggle-edit-mode" />
          </label>
          {editMode && (
            <Button variant="ghost" size="sm" className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleDelete}>
              <Trash2 size={13} /> {t("journeys.deleteJourney")}
            </Button>
          )}
        </div>
      </div>

      {/* Header strip — title, subtitle, owner, stats */}
      <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/85 text-primary-foreground p-6 lg:p-8 mb-6 relative overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }} />
        <div className="text-white"><HeroPattern variant="hex" opacity={0.05} color="currentColor" /></div>
        <div className="pointer-events-none absolute -top-16 -end-16 h-56 w-56 rounded-full bg-amber-300/15 blur-3xl" />
        <div className="relative flex flex-wrap items-start gap-6 justify-between">
          <div className="flex items-start gap-4 min-w-0 flex-1">
            <div className="h-14 w-14 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center shrink-0 ring-1 ring-white/20">
              {editMode ? (
                <select
                  value={journey.icon}
                  onChange={(e) => updateJourney(journey.id, { icon: e.target.value })}
                  className="bg-transparent text-primary-foreground text-xs border-0 outline-none"
                >
                  {ICON_CHOICES.map((n) => <option key={n} value={n} className="text-foreground">{n}</option>)}
                </select>
              ) : (
                <LucideIcon name={journey.icon} size={28} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-lg lg:text-xl font-semibold leading-tight">
                <BiInlineEdit value={journey.title} onSave={(v) => updateJourney(journey.id, { title: v })} className="text-primary-foreground" />
              </div>
              <div className="mt-1.5 text-sm opacity-85 max-w-2xl">
                <BiInlineEdit value={journey.subtitle} onSave={(v) => updateJourney(journey.id, { subtitle: v })} />
              </div>
              <div className="mt-3 inline-flex items-center gap-2 text-xs bg-white/15 rounded-full px-3 py-1 ring-1 ring-white/20">
                <Building2 size={12} />
                <span className="font-medium">
                  <BiInlineEdit value={journey.owner} onSave={(v) => updateJourney(journey.id, { owner: v })} />
                </span>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex items-stretch gap-3">
            <div className="rounded-lg bg-white/12 ring-1 ring-white/15 backdrop-blur px-4 py-3 text-center min-w-[88px]">
              <Layers size={14} className="mx-auto opacity-80 mb-1" />
              <p className="text-2xl font-bold tabular-nums leading-none">{journey.stages.length}</p>
              <p className="text-[10px] uppercase tracking-wider opacity-80 mt-1">{t("journeys.stages")}</p>
            </div>
            <div className="rounded-lg bg-white/12 ring-1 ring-white/15 backdrop-blur px-4 py-3 text-center min-w-[88px]">
              <Building2 size={14} className="mx-auto opacity-80 mb-1" />
              <p className="text-2xl font-bold tabular-nums leading-none">{entityCount}</p>
              <p className="text-[10px] uppercase tracking-wider opacity-80 mt-1">{t("journeys.entitiesInvolved")}</p>
            </div>
            <div className="rounded-lg bg-white/12 ring-1 ring-white/15 backdrop-blur px-4 py-3 text-center min-w-[88px]">
              <Clock size={14} className="mx-auto opacity-80 mb-1" />
              <p className="text-2xl font-bold tabular-nums leading-none">{journey.types.length}</p>
              <p className="text-[10px] uppercase tracking-wider opacity-80 mt-1">{t("journeys.journeyType")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Journey type + outcome path pills */}
      <div className="space-y-3 mb-6">
        {/* Types */}
        <PillRow
          label={t("journeys.journeyType")}
          items={journey.types}
          activeIdx={typeIdx}
          onSelect={setTypeIdx}
          onAdd={() => addType(journey.id)}
          onUpdate={(idx, v) => updateType(journey.id, idx, v)}
          onDelete={(idx) => { deleteType(journey.id, idx); if (typeIdx >= idx) setTypeIdx(Math.max(0, typeIdx - 1)); }}
          editMode={editMode}
          tone="primary"
        />
        {/* Outcomes */}
        <PillRow
          label={t("journeys.outcomePath")}
          items={journey.outcomes}
          activeIdx={outcomeIdx}
          onSelect={setOutcomeIdx}
          onAdd={() => addOutcome(journey.id)}
          onUpdate={(idx, v) => updateOutcome(journey.id, idx, v)}
          onDelete={(idx) => { deleteOutcome(journey.id, idx); if (outcomeIdx >= idx) setOutcomeIdx(Math.max(0, outcomeIdx - 1)); }}
          editMode={editMode}
          tone="amber"
        />
      </div>

      {/* Stage grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        {journey.stages.map((s, i) => (
          <StageCard
            key={s.id}
            journey={journey}
            stage={s}
            index={i}
            selected={s.id === selectedStageId}
            onSelect={() => setSelectedStageId(s.id)}
          />
        ))}
        {editMode && (
          <button
            onClick={() => addStage(journey.id)}
            className="rounded-xl border-2 border-dashed border-border bg-card/40 p-4 hover:border-primary/50 hover:bg-primary/5 transition-colors flex flex-col items-center justify-center min-h-[140px] text-muted-foreground hover:text-primary"
            data-testid="button-add-stage"
          >
            <Plus size={22} />
            <span className="text-xs font-medium mt-1.5">{t("journeys.addStage")}</span>
          </button>
        )}
      </div>

      {/* Emotion curve */}
      {journey.stages.length > 0 && (
        <div className="mb-6">
          <EmotionCurve journey={journey} />
        </div>
      )}

      {/* Stage detail */}
      {selectedStage ? (
        <StageDetailPanel journey={journey} stage={selectedStage} stageIdx={selectedIdx} />
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
          {t("journeys.selectStage")}
        </div>
      )}

      {/* Footer breadcrumb */}
      <div className="mt-8 pt-4 border-t border-border flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
        <span><span className="font-medium">{t("journeys.docRef")}:</span> CX-J-{journey.id.slice(-6).toUpperCase()}</span>
        <span><span className="font-medium">{t("journeys.path")}:</span> {t("journeys.title")} / {pick(journey.title)}{selectedStage ? ` / ${pick(selectedStage.name)}` : ""}</span>
      </div>
    </div>
  );
}

function PillRow({
  label,
  items,
  activeIdx,
  onSelect,
  onAdd,
  onUpdate,
  onDelete,
  editMode,
  tone,
}: {
  label: string;
  items: { ar: string; en: string }[];
  activeIdx: number;
  onSelect: (idx: number) => void;
  onAdd: () => void;
  onUpdate: (idx: number, v: { ar: string; en: string }) => void;
  onDelete: (idx: number) => void;
  editMode: boolean;
  tone: "primary" | "amber";
}) {
  const { lang, pick, t } = useLocale();
  const activeClass = tone === "primary"
    ? "bg-primary text-primary-foreground border-primary"
    : "bg-amber-500 text-white border-amber-500";

  if (items.length === 0 && !editMode) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground me-1">{label}:</span>
      {items.map((it, i) => (
        <div key={i} className={cn(
          "inline-flex items-center gap-1.5 h-8 rounded-full text-xs font-medium border transition-colors",
          activeIdx === i ? activeClass : "bg-card border-border text-muted-foreground hover:bg-muted",
          editMode ? "pe-1 ps-3" : "px-3",
        )}>
          {editMode ? (
            <>
              <input
                value={lang === "ar" ? it.ar : it.en}
                onChange={(e) => onUpdate(i, lang === "ar" ? { ...it, ar: e.target.value } : { ...it, en: e.target.value })}
                className="bg-transparent outline-none text-xs w-32 placeholder:text-current/60"
                placeholder={lang === "ar" ? "عربي" : "English"}
              />
              <button onClick={() => onDelete(i)} className="h-5 w-5 rounded-full hover:bg-black/10 flex items-center justify-center">
                <X size={11} />
              </button>
            </>
          ) : (
            <button onClick={() => onSelect(i)}>{pick(it)}</button>
          )}
        </div>
      ))}
      {editMode && (
        <Button size="sm" variant="ghost" className="h-8 gap-1 text-xs" onClick={onAdd}>
          <Plus size={12} /> {t("journeys.addItem")}
        </Button>
      )}
    </div>
  );
}
