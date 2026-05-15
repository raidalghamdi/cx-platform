import { Lightbulb, Users, FlaskConical, Sparkles, CheckCircle2 } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { RequirementBadge } from "@/components/brand/RequirementBadge";
import { cn } from "@/lib/utils";

// Co-Design lifecycle tracker — DGA 5.18.3: beneficiaries participate across
// Discover → Co-Design → Prototype → Pilot → Adopt for each service journey.
type Stage = "discover" | "co-design" | "prototype" | "pilot" | "adopt";

type JourneyStage = {
  id: string;          // journey id
  title: { ar: string; en: string };
  stage: Stage;
  participants: number;
  lastUpdate: { ar: string; en: string };
};

const SAMPLE: JourneyStage[] = [
  {
    id: "J-001",
    title: { ar: "إصدار رخصة جديدة", en: "Issue a new licence" },
    stage: "pilot",
    participants: 42,
    lastUpdate: { ar: "تجربة المستفيد — تشغيلية تجريبية", en: "Beneficiary trial — limited live pilot" },
  },
  {
    id: "J-002",
    title: { ar: "تحديث البيانات الشخصية", en: "Update personal information" },
    stage: "co-design",
    participants: 28,
    lastUpdate: { ar: "ورشة تصميم مشترك مع ١٢ مستفيداً", en: "Co-design workshop with 12 beneficiaries" },
  },
  {
    id: "J-003",
    title: { ar: "تقديم شكوى", en: "Submit a complaint" },
    stage: "adopt",
    participants: 124,
    lastUpdate: { ar: "تم تبني التصميم رسمياً", en: "Design formally adopted" },
  },
  {
    id: "J-004",
    title: { ar: "طلب موعد للخدمة", en: "Request a service appointment" },
    stage: "discover",
    participants: 18,
    lastUpdate: { ar: "مقابلات استكشافية", en: "Discovery interviews underway" },
  },
  {
    id: "J-005",
    title: { ar: "طلب الدعم الاجتماعي", en: "Apply for social support" },
    stage: "prototype",
    participants: 36,
    lastUpdate: { ar: "نموذج أولي للاختبار", en: "Clickable prototype in testing" },
  },
];

const STAGES: { key: Stage; ar: string; en: string; Icon: typeof Lightbulb; tint: string }[] = [
  { key: "discover", ar: "الاستكشاف", en: "Discover", Icon: Lightbulb, tint: "amber" },
  { key: "co-design", ar: "التصميم المشترك", en: "Co-Design", Icon: Users, tint: "primary" },
  { key: "prototype", ar: "النموذج الأولي", en: "Prototype", Icon: FlaskConical, tint: "violet" },
  { key: "pilot", ar: "التجربة", en: "Pilot", Icon: Sparkles, tint: "sky" },
  { key: "adopt", ar: "التبني", en: "Adopt", Icon: CheckCircle2, tint: "emerald" },
];

const TINT_CLS: Record<string, string> = {
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  primary: "bg-primary/10 text-primary border-primary/20",
  violet: "bg-violet-50 text-violet-700 border-violet-200",
  sky: "bg-sky-50 text-sky-700 border-sky-200",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export function CoDesignTracker() {
  const { lang } = useLocale();

  const stageCounts = STAGES.map((s) => ({
    ...s,
    count: SAMPLE.filter((j) => j.stage === s.key).length,
    participants: SAMPLE.filter((j) => j.stage === s.key).reduce((a, b) => a + b.participants, 0),
  }));

  return (
    <div className="rounded-xl border border-border bg-card shadow-card mb-6">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Users size={16} />
          </span>
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2 flex-wrap">
              {lang === "ar" ? "متتبّع التصميم المشترك" : "Co-Design lifecycle tracker"}
              <RequirementBadge
                ids={["FR-72", "FR-73"]}
                standards={["DGA 5.18.3", "ISO 9001 §8.3", "EFQM 2025 — Stakeholder Engagement"]}
              />
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {lang === "ar"
                ? "متابعة مشاركة المستفيدين في كل مرحلة من مراحل تطوير الخدمة."
                : "Tracks beneficiary participation across every stage of service design."}
            </p>
          </div>
        </div>
      </div>

      {/* Lifecycle bar */}
      <div className="px-5 pt-5 pb-3">
        <div className="grid grid-cols-5 gap-2">
          {stageCounts.map((s, i) => (
            <div
              key={s.key}
              className={cn(
                "relative rounded-lg border p-3 transition-shadow hover:shadow-sm",
                TINT_CLS[s.tint],
              )}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <s.Icon size={13} />
                <span className="text-[10px] font-semibold uppercase tracking-wider">
                  {`${i + 1}.`} {lang === "ar" ? s.ar : s.en}
                </span>
              </div>
              <p className="text-lg font-semibold leading-none">{s.count}</p>
              <p className="text-[10px] mt-1 opacity-80">
                {s.participants} {lang === "ar" ? "مشاركاً" : "participants"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Per-journey list */}
      <ul className="px-5 pb-4 space-y-2">
        {SAMPLE.map((j) => {
          const stage = STAGES.find((s) => s.key === j.stage)!;
          return (
            <li
              key={j.id}
              className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-border bg-background hover:bg-muted/40 transition-colors"
              data-testid={`codesign-${j.id}`}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="font-mono text-[10px] text-muted-foreground shrink-0">{j.id}</span>
                <span className="text-[13px] font-medium truncate">
                  {lang === "ar" ? j.title.ar : j.title.en}
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground hidden md:inline truncate max-w-[200px]">
                {lang === "ar" ? j.lastUpdate.ar : j.lastUpdate.en}
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-semibold shrink-0",
                  TINT_CLS[stage.tint],
                )}
              >
                <stage.Icon size={10} />
                {lang === "ar" ? stage.ar : stage.en}
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-muted text-[10px] font-mono shrink-0">
                <Users size={10} />
                {j.participants}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
