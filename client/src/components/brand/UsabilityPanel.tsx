import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Target, Zap, Smile, Accessibility, ShieldCheck } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { RequirementBadge } from "@/components/brand/RequirementBadge";
import { cn } from "@/lib/utils";

// ISO 9241 usability panel — DGA 5.17 (Channels) + WCAG 2.2 AA.
// Tracks the three ISO 9241-11 usability components: Effectiveness, Efficiency,
// Satisfaction — plus accessibility conformance and trust.
type Tile = {
  key: string;
  Icon: typeof Target;
  label: { ar: string; en: string };
  value: string;
  target: string;
  description: { ar: string; en: string };
  /** 0..100 for the meter */
  percent: number;
  tint: "primary" | "amber" | "violet" | "sky" | "emerald";
};

const TILES: Tile[] = [
  {
    key: "effectiveness",
    Icon: Target,
    label: { ar: "الفعالية", en: "Effectiveness" },
    value: "94.6%",
    target: "≥ 90%",
    description: {
      ar: "نسبة المستفيدين الذين أتموا المهمة بنجاح من المحاولة الأولى.",
      en: "Beneficiaries completing the task successfully on first attempt.",
    },
    percent: 94.6,
    tint: "primary",
  },
  {
    key: "efficiency",
    Icon: Zap,
    label: { ar: "الكفاءة", en: "Efficiency" },
    value: "١:٤٢|1:42",
    target: "≤ 2:00",
    description: {
      ar: "متوسط زمن إكمال المهمة (دقيقة:ثانية).",
      en: "Mean task completion time (mm:ss).",
    },
    percent: 87,
    tint: "sky",
  },
  {
    key: "satisfaction",
    Icon: Smile,
    label: { ar: "الرضا", en: "Satisfaction" },
    value: "4.3 / 5",
    target: "≥ 4.0",
    description: {
      ar: "متوسط تقييم SUS / SUPR-Q بعد إنهاء المهمة.",
      en: "Mean SUS / SUPR-Q score after task completion.",
    },
    percent: 86,
    tint: "amber",
  },
  {
    key: "accessibility",
    Icon: Accessibility,
    label: { ar: "إمكانية الوصول", en: "Accessibility" },
    value: "AA · 0 issues",
    target: "WCAG 2.2 AA",
    description: {
      ar: "نسبة المعايير المُطابقة في تدقيق WCAG 2.2 AA الآلي.",
      en: "Pass rate against automated WCAG 2.2 AA audit.",
    },
    percent: 100,
    tint: "emerald",
  },
  {
    key: "trust",
    Icon: ShieldCheck,
    label: { ar: "الثقة", en: "Trust" },
    value: "92.1%",
    target: "≥ 85%",
    description: {
      ar: "نسبة المستفيدين الذين يعبّرون عن ثقتهم بقنوات الخدمة الرقمية.",
      en: "Beneficiaries who report trust in the digital channels.",
    },
    percent: 92.1,
    tint: "violet",
  },
];

const TINT_CLS: Record<Tile["tint"], { bg: string; bar: string; icon: string; ring: string }> = {
  primary: { bg: "bg-primary/5",    bar: "bg-primary",       icon: "text-primary",       ring: "ring-primary/20" },
  amber:   { bg: "bg-amber-50",     bar: "bg-amber-500",     icon: "text-amber-600",     ring: "ring-amber-200" },
  violet:  { bg: "bg-violet-50",    bar: "bg-violet-500",    icon: "text-violet-600",    ring: "ring-violet-200" },
  sky:     { bg: "bg-sky-50",       bar: "bg-sky-500",       icon: "text-sky-600",       ring: "ring-sky-200" },
  emerald: { bg: "bg-emerald-50",   bar: "bg-emerald-500",   icon: "text-emerald-600",   ring: "ring-emerald-200" },
};

export function UsabilityPanel() {
  const { lang } = useLocale();
  return (
    <Card className="shadow-card mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 flex-wrap">
          <Target size={14} className="text-primary" />
          {lang === "ar" ? "قابلية الاستخدام (ISO 9241)" : "Usability scorecard (ISO 9241)"}
          <RequirementBadge
            ids={["NFR-21", "NFR-22", "NFR-23"]}
            standards={["ISO 9241-11", "ISO 9241-210", "WCAG 2.2 AA", "DGA 5.17"]}
          />
        </CardTitle>
        <p className="text-[11px] text-muted-foreground mt-1">
          {lang === "ar"
            ? "ثلاثية ISO 9241 — الفعالية والكفاءة والرضا — مع إمكانية الوصول والثقة الرقمية."
            : "ISO 9241 triad — effectiveness, efficiency, satisfaction — plus accessibility and digital trust."}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {TILES.map((tile) => {
            const cls = TINT_CLS[tile.tint];
            const value = tile.value.includes("|")
              ? lang === "ar"
                ? tile.value.split("|")[0]
                : tile.value.split("|")[1]
              : tile.value;
            return (
              <div
                key={tile.key}
                className={cn(
                  "rounded-xl border border-border p-3 ring-1",
                  cls.bg,
                  cls.ring,
                )}
                data-testid={`usability-${tile.key}`}
              >
                <div className="flex items-center justify-between">
                  <span className={cn("inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white", cls.icon)}>
                    <tile.Icon size={14} />
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {lang === "ar" ? "الهدف" : "Target"}: {tile.target}
                  </span>
                </div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-foreground/80 mt-3">
                  {lang === "ar" ? tile.label.ar : tile.label.en}
                </p>
                <p className="text-lg font-semibold text-foreground leading-tight mt-0.5">
                  {value}
                </p>
                <div className="h-1.5 rounded-full bg-white/70 overflow-hidden mt-2">
                  <div
                    className={cn("h-full rounded-full", cls.bar)}
                    style={{ width: `${Math.min(100, tile.percent)}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 leading-snug line-clamp-2">
                  {lang === "ar" ? tile.description.ar : tile.description.en}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
