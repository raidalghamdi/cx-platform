import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LabelList } from "recharts";
import { TrendingUp, ArrowRight, ArrowLeft } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { RequirementBadge } from "@/components/brand/RequirementBadge";

// Before/After improvement comparison — DGA 5.20.4: organisations must
// demonstrate that beneficiary feedback led to measurable improvement.
type Metric = {
  key: string;
  label: { ar: string; en: string };
  unit: string;
  before: number;
  after: number;
  inverted?: boolean;  // true when lower is better (e.g. CES, breach %)
};

const METRICS: Metric[] = [
  { key: "csat",  label: { ar: "رضا المستفيد",   en: "CSAT" },              unit: "%",  before: 78.2, after: 86.1 },
  { key: "nps",   label: { ar: "صافي الترشيح",   en: "NPS" },               unit: "",   before: 28,   after: 42 },
  { key: "fcr",   label: { ar: "الحل من أول مرة", en: "FCR" },              unit: "%",  before: 62.5, after: 71.3 },
  { key: "ces",   label: { ar: "جهد المستفيد",    en: "CES" },               unit: "/5", before: 3.4,  after: 2.8, inverted: true },
  { key: "sla",   label: { ar: "الالتزام بالSLA", en: "SLA adherence" },     unit: "%",  before: 86.4, after: 91.2 },
  { key: "tat",   label: { ar: "متوسط زمن الحل",  en: "Avg resolution" },    unit: "h",  before: 18.6, after: 11.4, inverted: true },
];

export function BeforeAfterImpact() {
  const { lang, isRTL } = useLocale();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const data = METRICS.map((m) => {
    const delta = m.after - m.before;
    const improved = m.inverted ? delta < 0 : delta > 0;
    return {
      name: lang === "ar" ? m.label.ar : m.label.en,
      before: m.before,
      after: m.after,
      unit: m.unit,
      improved,
      deltaPct: m.before === 0 ? 0 : ((delta / m.before) * 100),
    };
  });

  return (
    <Card className="shadow-card mb-6">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 flex-wrap">
              <TrendingUp size={14} className="text-primary" />
              {lang === "ar" ? "أثر التحسين — قبل / بعد" : "Improvement impact — Before / After"}
              <RequirementBadge
                ids={["FR-104", "FR-105"]}
                standards={["DGA 5.20.4", "ISO 10002 §8.3", "EFQM 2025 — Results"]}
              />
            </CardTitle>
            <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
              {lang === "ar"
                ? "أثر مبادرات التحسين المنفذة بناءً على «صوت المستفيد» خلال الستة أشهر الأخيرة."
                : "Impact of improvement initiatives executed from Voice-of-Beneficiary input over the last 6 months."}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-700">
            <Arrow size={12} />
            {lang === "ar" ? "تحسّن في ٦/٦ مؤشرات" : "Improved on 6 / 6 KPIs"}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 16, right: 12, left: -12, bottom: 4 }} barCategoryGap="22%">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} stroke="#94A3B8" reversed={isRTL} />
              <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="#94A3B8" orientation={isRTL ? "right" : "left"} />
              <Tooltip
                contentStyle={{ background: "white", borderRadius: 10, border: "1px solid #E5E7EB", fontSize: 12 }}
                formatter={(v: number, key: string) => {
                  const lbl = lang === "ar" ? (key === "before" ? "قبل" : "بعد") : key === "before" ? "Before" : "After";
                  return [v, lbl];
                }}
              />
              <Bar dataKey="before" name={lang === "ar" ? "قبل" : "Before"} radius={[6, 6, 0, 0]} fill="#CBD5E1">
                <LabelList dataKey="before" position="top" fontSize={10} fill="#475569" />
              </Bar>
              <Bar dataKey="after" name={lang === "ar" ? "بعد" : "After"} radius={[6, 6, 0, 0]}>
                {data.map((d, i) => (
                  <Cell key={i} fill={d.improved ? "#25935F" : "#F04438"} />
                ))}
                <LabelList dataKey="after" position="top" fontSize={10} fill="#0F172A" fontWeight={600} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Delta strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mt-3">
          {data.map((d) => (
            <div
              key={d.name}
              className="rounded-lg border border-border bg-background p-2 text-center"
            >
              <p className="text-[10px] text-muted-foreground truncate">{d.name}</p>
              <p className={`text-[13px] font-semibold ${d.improved ? "text-emerald-600" : "text-destructive"}`}>
                {d.improved ? "▲" : "▼"} {Math.abs(d.deltaPct).toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
