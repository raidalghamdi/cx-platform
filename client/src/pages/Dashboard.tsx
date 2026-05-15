import { useLocale } from "@/contexts/LocaleContext";
import { PageHeader } from "@/components/brand/PageHeader";
import { UsabilityPanel } from "@/components/brand/UsabilityPanel";
import { BeforeAfterImpact } from "@/components/brand/BeforeAfterImpact";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SentimentChip } from "@/components/brand/StatusChips";
import {
  CSAT_TREND,
  SLA_BREACH_TREND,
  CHANNEL_MIX,
  CATEGORY_VOLUME,
  TOP_THEMES,
  ESCALATIONS,
  KPI,
} from "@/lib/seed";
import {
  AreaChart,
  Area,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";
import {
  ArrowDown,
  ArrowUp,
  Download,
  Smile,
  Gauge,
  Activity,
  CheckCircle2,
  Timer,
  AlertCircle,
  LayoutDashboard,
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart3,
  AlertTriangle,
  Sparkles,
  Flame,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CountUp } from "@/components/brand/CountUp";
import { Sparkline } from "@/components/brand/Sparkline";
import { InitialsAvatar } from "@/components/brand/InitialsAvatar";

const CHART_COLORS = ["#25935F", "#F8BD02", "#2E90FA", "#80519F", "#F79009", "#17B26A"];

function delta(d: number, inverted = false) {
  const positive = inverted ? d < 0 : d > 0;
  const Icon = d > 0 ? ArrowUp : ArrowDown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-[11px] font-medium",
        positive ? "text-emerald-600" : "text-rose-600",
      )}
    >
      <Icon size={11} />
      {Math.abs(d).toFixed(1)}
    </span>
  );
}

function Kpi({
  label,
  value,
  numeric,
  decimals = 0,
  unit,
  delta: d,
  inverted = false,
  sub,
  Icon,
  tint = "emerald",
  trend,
}: {
  label: string;
  value: string;
  numeric: number;
  decimals?: number;
  unit?: string;
  delta: number;
  inverted?: boolean;
  sub?: string;
  Icon: LucideIcon;
  tint?: "emerald" | "amber" | "sky" | "violet" | "rose";
  trend?: number[];
}) {
  const { t } = useLocale();
  const tintMap: Record<string, { chip: string; spark: string }> = {
    emerald: { chip: "bg-emerald-100 text-emerald-700 ring-emerald-200", spark: "#25935F" },
    amber: { chip: "bg-amber-100 text-amber-800 ring-amber-200", spark: "#F8BD02" },
    sky: { chip: "bg-sky-100 text-sky-700 ring-sky-200", spark: "#2E90FA" },
    violet: { chip: "bg-violet-100 text-violet-700 ring-violet-200", spark: "#80519F" },
    rose: { chip: "bg-rose-100 text-rose-700 ring-rose-200", spark: "#E76F51" },
  };
  const tk = tintMap[tint];
  return (
    <Card className="shadow-card card-lift">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
          <span
            className={cn(
              "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md ring-1",
              tk.chip,
            )}
          >
            <Icon size={14} strokeWidth={2.2} />
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-semibold text-foreground tabular-nums">
            <CountUp value={numeric} decimals={decimals} />
          </span>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
        {trend && trend.length > 1 && (
          <div className="mt-1.5 -mx-1">
            <Sparkline data={trend} color={tk.spark} height={28} />
          </div>
        )}
        <div className="mt-1 flex items-center gap-2">
          {delta(d, inverted)}
          <span className="text-[11px] text-muted-foreground">{sub ?? t("common.vsLast")}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { t, lang, pick, isRTL } = useLocale();

  const channelData = CHANNEL_MIX.map((c, i) => ({
    name: t("channel." + c.key),
    value: c.value,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));

  const categoryData = CATEGORY_VOLUME.map((c) => ({ name: pick(c.key), value: c.v }));

  return (
    <div>
      <PageHeader
        Icon={LayoutDashboard}
        title={t("nav.dashboard")}
        requirementIds={["FR-11", "FR-12", "NFR-21", "NFR-22"]}
        standards={["ISO 9001 §9.1", "ISO 9241-11", "EFQM 2025 — Results", "DGA 5.20"]}
        subtitle={lang === "ar" ? "نظرة شاملة على أداء تجربة المستفيد هذا الشهر" : "A holistic view of customer experience performance this month"}
        actions={
          <>
            <Button variant="outline" size="sm" data-testid="button-export">
              <Download size={14} className="me-1.5" />
              {lang === "ar" ? "تصدير" : "Export"}
            </Button>
          </>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <Kpi label={t("kpi.csat.full")} value={KPI.csat.value.toFixed(1)} numeric={KPI.csat.value} decimals={1} unit="%" delta={KPI.csat.delta} Icon={Smile} tint="emerald" trend={CSAT_TREND.map(d=>d.v)} />
        <Kpi label={t("kpi.nps")} value={String(KPI.nps.value)} numeric={KPI.nps.value} delta={KPI.nps.delta} Icon={Gauge} tint="sky" trend={[28,30,33,35,36,38,40,41,42]} />
        <Kpi label={t("kpi.ces.full")} value={KPI.ces.value.toFixed(1)} numeric={KPI.ces.value} decimals={1} unit="/ 5" delta={KPI.ces.delta} inverted Icon={Activity} tint="amber" trend={[3.4,3.3,3.2,3.1,3.0,3.0,2.9,2.9,2.8]} />
        <Kpi label={t("kpi.fcr.full")} value={KPI.fcr.value.toFixed(1)} numeric={KPI.fcr.value} decimals={1} unit="%" delta={KPI.fcr.delta} Icon={CheckCircle2} tint="emerald" trend={[64,65,66,67,68,69,70,70,71.3]} />
        <Kpi label={t("kpi.sla")} value={KPI.sla.value.toFixed(1)} numeric={KPI.sla.value} decimals={1} unit="%" delta={KPI.sla.delta} Icon={Timer} tint="violet" trend={[92,91.8,92.1,91.6,91.4,91.5,91.3,91.0,91.2]} />
        <Kpi label={t("kpi.open")} value={String(KPI.open.value)} numeric={KPI.open.value} delta={KPI.open.delta} inverted Icon={AlertCircle} tint="rose" trend={SLA_BREACH_TREND.map(d=>d.v)} />
      </div>

      <UsabilityPanel />

      <BeforeAfterImpact />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2"><TrendingUp size={14} className="text-primary" />{t("chart.csatTrend")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer>
                <AreaChart data={CSAT_TREND} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="csatFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#25935F" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="#25935F" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis dataKey="m" tickLine={false} axisLine={false} fontSize={11} stroke="#94A3B8" reversed={isRTL} />
                  <YAxis domain={[78, 92]} tickLine={false} axisLine={false} fontSize={11} stroke="#94A3B8" orientation={isRTL ? "right" : "left"} />
                  <Tooltip
                    contentStyle={{ background: "white", borderRadius: 10, border: "1px solid #E5E7EB", fontSize: 12 }}
                    formatter={(v: number) => [`${v}%`, t("kpi.csat")]}
                  />
                  <Area type="monotone" dataKey="v" stroke="#25935F" strokeWidth={2.2} fill="url(#csatFill)" dot={{ r: 3 }} activeDot={{ r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2"><PieChartIcon size={14} className="text-primary" />{t("chart.channelMix")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex">
              <div className="flex-1">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={channelData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={80} paddingAngle={2} stroke="white" strokeWidth={2}>
                      {channelData.map((d, i) => (
                        <Cell key={i} fill={d.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "white", borderRadius: 10, border: "1px solid #E5E7EB", fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
              {channelData.map((c) => (
                <li key={c.name} className="flex items-center gap-2 min-w-0">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ background: c.fill }} />
                  <span className="truncate text-muted-foreground">{c.name}</span>
                  <span className="ms-auto font-medium tabular-nums">{c.value}%</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2"><BarChart3 size={14} className="text-primary" />{t("chart.complaintsByCategory")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={categoryData} layout="vertical" margin={{ left: isRTL ? 0 : 20, right: isRTL ? 20 : 0, top: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
                  <XAxis type="number" tickLine={false} axisLine={false} fontSize={11} stroke="#94A3B8" reversed={isRTL} />
                  <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={140} fontSize={11} stroke="#475569" orientation={isRTL ? "right" : "left"} />
                  <Tooltip contentStyle={{ background: "white", borderRadius: 10, border: "1px solid #E5E7EB", fontSize: 12 }} />
                  <Bar dataKey="value" fill="#25935F" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2"><AlertTriangle size={14} className="text-amber-600" />{t("chart.slaBreach")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer>
                <LineChart data={SLA_BREACH_TREND} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis dataKey="m" tickLine={false} axisLine={false} fontSize={11} stroke="#94A3B8" reversed={isRTL} />
                  <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="#94A3B8" orientation={isRTL ? "right" : "left"} />
                  <Tooltip contentStyle={{ background: "white", borderRadius: 10, border: "1px solid #E5E7EB", fontSize: 12 }} />
                  <Line type="monotone" dataKey="v" stroke="#E76F51" strokeWidth={2.2} dot={{ r: 3, fill: "#E76F51" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Themes + Escalations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2"><Sparkles size={14} className="text-primary" />{t("chart.themes")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {TOP_THEMES.map((th) => (
                <li key={th.theme.en} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{pick(th.theme)}</p>
                    <div className="mt-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          th.sentiment === "positive" && "bg-emerald-500",
                          th.sentiment === "neutral" && "bg-amber-500",
                          th.sentiment === "negative" && "bg-rose-500",
                        )}
                        style={{ width: `${Math.min(100, (th.mentions / 124) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <SentimentChip s={th.sentiment} />
                  <span className="text-[11px] text-muted-foreground tabular-nums w-10 text-end">
                    {th.mentions}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2"><Flame size={14} className="text-rose-600" />
              {lang === "ar" ? "تصعيدات مفتوحة" : "Open escalations"}
            </CardTitle>
            <span className="text-[11px] text-muted-foreground">{ESCALATIONS.length} {lang === "ar" ? "حالات" : "cases"}</span>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {ESCALATIONS.map((e) => (
                <li key={e.id} className="flex items-center gap-3 p-2.5 rounded-md border border-border hover:bg-muted/40 transition-colors">
                  <span className="h-9 w-9 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center text-[11px] font-semibold ring-1 ring-rose-200 shrink-0">
                    T{e.tier}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{pick(e.subject)}</p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono">{e.ref}</span>
                      <span>·</span>
                      <InitialsAvatar name={pick(e.owner)} size={16} />
                      <span className="truncate">{pick(e.owner)}</span>
                      <span>·</span>
                      <span>{e.age} {lang === "ar" ? "يوم" : "d"}</span>
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="shrink-0">
                    {lang === "ar" ? "فتح" : "Open"}
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
