// Shared building blocks for the Service Journeys module:
// - dynamic Lucide icon resolver
// - sentiment helpers (color / label / emoji-icon)
// - inline-edit primitives (single-line, bilingual)
// - StageCard, EmotionCurve, StageDetailPanel, JourneyEditDialog

import { useState, useEffect, type ReactNode } from "react";
import * as Icons from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useJourneys } from "@/contexts/JourneyContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import type { Bi, Journey, Sentiment, Stage, StageItem } from "@/lib/seedJourneys";
import {
  Pencil,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Check,
  X,
  Smile,
  Meh,
  Frown,
  Annoyed,
  HelpCircle,
  Circle,
} from "lucide-react";

// ---------- Icon resolver ----------
export function LucideIcon({
  name,
  size = 18,
  className,
  strokeWidth = 2,
}: {
  name: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  // @ts-ignore
  const Comp = (Icons as any)[name] || Circle;
  return <Comp size={size} className={className} strokeWidth={strokeWidth} />;
}

export const ICON_CHOICES = [
  "Search",
  "ShieldCheck",
  "CalendarSearch",
  "BellRing",
  "ClipboardList",
  "HeartPulse",
  "Stethoscope",
  "ListChecks",
  "Wallet",
  "Activity",
  "BadgeCheck",
  "Tag",
  "FileText",
  "Stamp",
  "Banknote",
  "ScrollText",
  "Users",
  "Building",
  "Building2",
  "MessageSquarePlus",
  "MessageSquareWarning",
  "MailCheck",
  "SearchCheck",
  "Lightbulb",
  "Smile",
  "BookOpen",
  "MapPin",
  "Upload",
  "Shuffle",
  "Package",
  "Sparkles",
  "Car",
  "GraduationCap",
  "Globe",
  "Phone",
  "Mail",
  "Send",
  "Clock",
  "FileCheck",
  "Star",
];

// ---------- Sentiment helpers ----------
export const SENTIMENT_META: Record<
  Sentiment,
  { Icon: any; color: string; bg: string; ring: string; key: string; score: number }
> = {
  delighted: { Icon: Smile, color: "text-emerald-600", bg: "bg-emerald-50", ring: "ring-emerald-200", key: "sentiment.delighted", score: 2 },
  satisfied: { Icon: Smile, color: "text-emerald-500", bg: "bg-emerald-50", ring: "ring-emerald-200", key: "sentiment.satisfied", score: 1 },
  neutral: { Icon: Meh, color: "text-slate-500", bg: "bg-slate-50", ring: "ring-slate-200", key: "sentiment.neutral", score: 0 },
  confused: { Icon: HelpCircle, color: "text-amber-600", bg: "bg-amber-50", ring: "ring-amber-200", key: "sentiment.confused", score: -1 },
  frustrated: { Icon: Frown, color: "text-rose-600", bg: "bg-rose-50", ring: "ring-rose-200", key: "sentiment.frustrated", score: -2 },
};

export const SENTIMENT_OPTIONS: Sentiment[] = ["frustrated", "confused", "neutral", "satisfied", "delighted"];

// ---------- Inline edit single-line ----------
export function InlineEdit({
  value,
  onSave,
  className,
  placeholder,
  multiline = false,
  editing: forceEditing,
}: {
  value: string;
  onSave: (v: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  editing?: boolean;
}) {
  const { editMode } = useJourneys();
  const [local, setLocal] = useState(value);
  const [active, setActive] = useState(false);
  useEffect(() => setLocal(value), [value]);

  const isEditing = forceEditing ?? (editMode && active);

  if (!editMode) {
    return <span className={className}>{value || placeholder}</span>;
  }

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={() => setActive(true)}
        className={cn(
          "text-start rounded px-1 -mx-1 hover:bg-primary/5 hover:ring-1 hover:ring-primary/20 transition-colors cursor-text",
          !value && "text-muted-foreground italic",
          className,
        )}
      >
        {value || placeholder || "—"}
      </button>
    );
  }

  const commit = () => {
    onSave(local);
    setActive(false);
  };
  const cancel = () => {
    setLocal(value);
    setActive(false);
  };

  if (multiline) {
    return (
      <div className="flex flex-col gap-1.5">
        <Textarea
          autoFocus
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          rows={2}
          className="text-sm"
        />
        <div className="flex gap-1.5">
          <Button size="sm" className="h-7 px-2" onClick={commit}><Check size={12} /></Button>
          <Button size="sm" variant="ghost" className="h-7 px-2" onClick={cancel}><X size={12} /></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <Input
        autoFocus
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") cancel();
        }}
        onBlur={commit}
        className="h-8 text-sm"
      />
    </div>
  );
}

// ---------- Bi (AR + EN) inline edit row ----------
export function BiInlineEdit({
  value,
  onSave,
  placeholderAr,
  placeholderEn,
  className,
}: {
  value: Bi;
  onSave: (v: Bi) => void;
  placeholderAr?: string;
  placeholderEn?: string;
  className?: string;
}) {
  const { lang, pick } = useLocale();
  const { editMode } = useJourneys();
  if (!editMode) {
    return <span className={className}>{pick(value)}</span>;
  }
  // In edit mode, we expose two stacked inputs (AR + EN) but with a tight layout.
  return (
    <div className="flex flex-col gap-1.5">
      <Input
        value={value.ar}
        onChange={(e) => onSave({ ...value, ar: e.target.value })}
        placeholder={placeholderAr || "AR"}
        dir="rtl"
        className="h-7 text-[13px]"
      />
      <Input
        value={value.en}
        onChange={(e) => onSave({ ...value, en: e.target.value })}
        placeholder={placeholderEn || "EN"}
        dir="ltr"
        className="h-7 text-[13px]"
      />
    </div>
  );
}

// ---------- Stage Card (in the grid) ----------
export function StageCard({
  journey,
  stage,
  index,
  selected,
  onSelect,
}: {
  journey: Journey;
  stage: Stage;
  index: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const { lang, pick, t } = useLocale();
  const { editMode, updateStage, deleteStage, moveStage } = useJourneys();
  const meta = SENTIMENT_META[stage.sentiment];

  return (
    <div
      className={cn(
        "relative rounded-xl border bg-card p-4 transition-all cursor-pointer group",
        selected
          ? "border-primary ring-2 ring-primary/30 shadow-card-hover"
          : "border-border hover:border-primary/40 hover:shadow-card-hover",
      )}
      onClick={onSelect}
      data-testid={`stage-card-${index + 1}`}
    >
      {/* Number badge */}
      <span className="absolute -top-2.5 -start-2.5 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold tabular-nums shadow-sm ring-2 ring-card">
        {index + 1}
      </span>

      {/* Sentiment chip top-end */}
      <span
        className={cn(
          "absolute top-2 end-2 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium ring-1 ring-inset",
          meta.bg,
          meta.color,
          meta.ring,
        )}
      >
        <meta.Icon size={11} />
      </span>

      <div className="flex items-start gap-3 pt-2">
        <span className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <LucideIcon name={stage.icon} size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold leading-snug text-foreground line-clamp-2">
            {pick(stage.name)}
          </div>
          <div className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
            {pick(stage.sla) || "—"}
          </div>
        </div>
      </div>

      {editMode && (
        <div
          className="mt-3 pt-3 border-t border-border/70 flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={() => moveStage(journey.id, stage.id, -1)}
            title={t("journeys.moveUp")}
            data-testid={`stage-move-up-${index + 1}`}
          >
            <ArrowUp size={13} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={() => moveStage(journey.id, stage.id, 1)}
            title={t("journeys.moveDown")}
          >
            <ArrowDown size={13} />
          </Button>
          <div className="ms-auto">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-destructive hover:bg-destructive/10"
              onClick={() => deleteStage(journey.id, stage.id)}
              title={t("journeys.deleteStage")}
              data-testid={`stage-delete-${index + 1}`}
            >
              <Trash2 size={13} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Emotion Curve ----------
export function EmotionCurve({ journey }: { journey: Journey }) {
  const { pick, isRTL, t } = useLocale();

  const data = journey.stages.map((s, i) => ({
    idx: i + 1,
    name: pick(s.name),
    score: s.emotionScore,
    sentiment: s.sentiment,
  }));

  // For RTL, reverse the x-axis visually but keep data order.
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-sm font-semibold">{t("journeys.emotionCurve")}</h3>
        <p className="text-[11px] text-muted-foreground">{journey.stages.length} {t("journeys.stages")}</p>
      </div>
      <div className="h-[220px] w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 16, right: 16, left: 8, bottom: 24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
            <XAxis
              dataKey="idx"
              reversed={isRTL}
              tick={{ fontSize: 11, fill: "hsl(215 16% 47%)" }}
              tickLine={false}
              axisLine={{ stroke: "hsl(220 13% 91%)" }}
            />
            <YAxis
              domain={[-2.5, 2.5]}
              ticks={[-2, -1, 0, 1, 2]}
              tick={{ fontSize: 11, fill: "hsl(215 16% 47%)" }}
              tickLine={false}
              axisLine={false}
            />
            <ReferenceLine y={0} stroke="hsl(220 13% 85%)" strokeDasharray="2 4" />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid hsl(220 13% 91%)",
                background: "hsl(0 0% 100%)",
              }}
              formatter={(v: any) => [v, t("journeys.emotion")]}
              labelFormatter={(idx: any) => `${t("journeys.stage")} ${idx}`}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="hsl(var(--primary))"
              strokeWidth={2.5}
              dot={(props: any) => {
                const s = data[props.index]?.sentiment as Sentiment;
                const m = SENTIMENT_META[s];
                const Icon = m.Icon;
                return (
                  <g key={props.index}>
                    <circle cx={props.cx} cy={props.cy} r={14} fill="white" stroke="hsl(var(--primary))" strokeWidth={2} />
                    <foreignObject x={props.cx - 8} y={props.cy - 8} width={16} height={16}>
                      <div className={cn("h-4 w-4 flex items-center justify-center", m.color)}>
                        <Icon size={14} />
                      </div>
                    </foreignObject>
                  </g>
                );
              }}
              activeDot={{ r: 16, fill: "white", stroke: "hsl(var(--primary))", strokeWidth: 2.5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ---------- Stage Detail Panel (the 4-section card) ----------
function SectionList({
  title,
  Icon,
  items,
  onAdd,
  onUpdate,
  onDelete,
  tone,
}: {
  title: string;
  Icon: any;
  items: StageItem[];
  onAdd: () => void;
  onUpdate: (id: string, patch: Partial<StageItem>) => void;
  onDelete: (id: string) => void;
  tone: "teal" | "amber" | "blue" | "green";
}) {
  const { editMode } = useJourneys();
  const { t } = useLocale();
  const toneClasses: Record<string, string> = {
    teal: "bg-primary/10 text-primary",
    amber: "bg-amber-100 text-amber-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-emerald-100 text-emerald-700",
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={cn("h-7 w-7 rounded-md flex items-center justify-center", toneClasses[tone])}>
            <Icon size={15} />
          </span>
          <h4 className="text-[13px] font-semibold">{title}</h4>
        </div>
        {editMode && (
          <Button size="sm" variant="ghost" className="h-7 px-2 gap-1 text-xs" onClick={onAdd}>
            <Plus size={12} /> {t("journeys.addItem")}
          </Button>
        )}
      </div>
      {items.length === 0 ? (
        <p className="text-[12px] text-muted-foreground italic">{t("journeys.empty")}</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((it) => (
            <li key={it.id} className="group flex items-start gap-2 rounded-md py-1 px-1.5 -mx-1.5 hover:bg-muted/50">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
              <div className="min-w-0 flex-1 text-[13px] leading-snug">
                <BiInlineEdit
                  value={it.label}
                  onSave={(v) => onUpdate(it.id, { label: v })}
                />
              </div>
              {editMode && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100"
                  onClick={() => onDelete(it.id)}
                  title={t("journeys.removeItem")}
                >
                  <X size={12} />
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function StageDetailPanel({ journey, stage, stageIdx }: { journey: Journey; stage: Stage; stageIdx: number }) {
  const { t, pick, lang } = useLocale();
  const { editMode, updateStage, addItem, updateItem, deleteItem } = useJourneys();
  const meta = SENTIMENT_META[stage.sentiment];

  return (
    <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/[0.03] to-transparent p-5 space-y-4">
      {/* Stage header */}
      <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-start gap-3 min-w-0">
          <span className="h-12 w-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0">
            <LucideIcon name={stage.icon} size={24} />
          </span>
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t("journeys.stage")} {stageIdx + 1}
            </div>
            <div className="text-base font-semibold mt-0.5">
              <BiInlineEdit value={stage.name} onSave={(v) => updateStage(journey.id, stage.id, { name: v })} />
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                <span className="font-medium">{t("journeys.sla")}:</span>
                <span><BiInlineEdit value={stage.sla} onSave={(v) => updateStage(journey.id, stage.id, { sla: v })} /></span>
              </span>
              <span className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
                meta.bg, meta.color, meta.ring,
              )}>
                <meta.Icon size={12} />
                {t(meta.key)}
              </span>
            </div>
          </div>
        </div>

        {editMode && (
          <div className="flex items-center gap-2">
            <select
              value={stage.sentiment}
              onChange={(e) => {
                const s = e.target.value as Sentiment;
                updateStage(journey.id, stage.id, { sentiment: s, emotionScore: SENTIMENT_META[s].score });
              }}
              className="h-8 rounded-md border border-input bg-background text-xs px-2"
            >
              {SENTIMENT_OPTIONS.map((s) => (
                <option key={s} value={s}>{t(SENTIMENT_META[s].key)}</option>
              ))}
            </select>
            <select
              value={stage.icon}
              onChange={(e) => updateStage(journey.id, stage.id, { icon: e.target.value })}
              className="h-8 rounded-md border border-input bg-background text-xs px-2 max-w-[140px]"
            >
              {ICON_CHOICES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* 4 sections in a 2x2 grid (or single column on mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionList
          title={t("journeys.touchpoints")}
          Icon={Icons.Radio}
          items={stage.touchpoints}
          onAdd={() => addItem(journey.id, stage.id, "touchpoints")}
          onUpdate={(id, patch) => updateItem(journey.id, stage.id, "touchpoints", id, patch)}
          onDelete={(id) => deleteItem(journey.id, stage.id, "touchpoints", id)}
          tone="teal"
        />
        <SectionList
          title={t("journeys.customerActions")}
          Icon={Icons.MousePointerClick}
          items={stage.actions}
          onAdd={() => addItem(journey.id, stage.id, "actions")}
          onUpdate={(id, patch) => updateItem(journey.id, stage.id, "actions", id, patch)}
          onDelete={(id) => deleteItem(journey.id, stage.id, "actions", id)}
          tone="blue"
        />
        <SectionList
          title={t("journeys.involvedEntities")}
          Icon={Icons.Building}
          items={stage.entities}
          onAdd={() => addItem(journey.id, stage.id, "entities")}
          onUpdate={(id, patch) => updateItem(journey.id, stage.id, "entities", id, patch)}
          onDelete={(id) => deleteItem(journey.id, stage.id, "entities", id)}
          tone="green"
        />
        <SectionList
          title={t("journeys.opportunities")}
          Icon={Icons.Lightbulb}
          items={stage.opportunities}
          onAdd={() => addItem(journey.id, stage.id, "opportunities")}
          onUpdate={(id, patch) => updateItem(journey.id, stage.id, "opportunities", id, patch)}
          onDelete={(id) => deleteItem(journey.id, stage.id, "opportunities", id)}
          tone="amber"
        />
      </div>
    </div>
  );
}

// ---------- New Journey dialog ----------
export function NewJourneyDialog({
  trigger,
  onCreated,
}: {
  trigger: ReactNode;
  onCreated?: (id: string) => void;
}) {
  const { t } = useLocale();
  const { addJourney } = useJourneys();
  const [open, setOpen] = useState(false);
  const [titleAr, setTitleAr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [subAr, setSubAr] = useState("");
  const [subEn, setSubEn] = useState("");
  const [ownerAr, setOwnerAr] = useState("");
  const [ownerEn, setOwnerEn] = useState("");
  const [icon, setIcon] = useState("Sparkles");

  const reset = () => {
    setTitleAr(""); setTitleEn(""); setSubAr(""); setSubEn(""); setOwnerAr(""); setOwnerEn(""); setIcon("Sparkles");
  };

  const submit = () => {
    const id = addJourney({
      icon,
      title: { ar: titleAr || "رحلة جديدة", en: titleEn || "New journey" },
      subtitle: { ar: subAr, en: subEn },
      owner: { ar: ownerAr, en: ownerEn },
      types: [],
      outcomes: [],
      stages: [],
    });
    reset();
    setOpen(false);
    onCreated?.(id);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("journeys.newJourney")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">{t("journeys.title.ar")}</Label>
              <Input value={titleAr} dir="rtl" onChange={(e) => setTitleAr(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">{t("journeys.title.en")}</Label>
              <Input value={titleEn} dir="ltr" onChange={(e) => setTitleEn(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">{t("journeys.subtitle.ar")}</Label>
              <Input value={subAr} dir="rtl" onChange={(e) => setSubAr(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">{t("journeys.subtitle.en")}</Label>
              <Input value={subEn} dir="ltr" onChange={(e) => setSubEn(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">{t("journeys.owner.ar")}</Label>
              <Input value={ownerAr} dir="rtl" onChange={(e) => setOwnerAr(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">{t("journeys.owner.en")}</Label>
              <Input value={ownerEn} dir="ltr" onChange={(e) => setOwnerEn(e.target.value)} />
            </div>
          </div>
          <div>
            <Label className="text-xs">{t("journeys.icon")}</Label>
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-background text-sm px-2"
            >
              {ICON_CHOICES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => { reset(); setOpen(false); }}>{t("common.cancel")}</Button>
          <Button onClick={submit} data-testid="button-create-journey">{t("common.submit")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
