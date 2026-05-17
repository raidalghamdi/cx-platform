import { useMemo, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { PageHeader } from "@/components/brand/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  VISION_2030_THEMES,
  DGA_MATURITY,
  EFQM_CRITERIA,
  ISO_FAMILIES,
  COMPLIANCE_STANDARDS,
  GOVERNANCE_FORUMS,
  RACI_ROLES,
  RACI_ACTIVITIES,
  DECISION_RIGHTS,
  type ComplianceStandard,
} from "@/lib/governanceData";
import { NFR_HEADLINE, PERFORMANCE_BUDGET, SECURITY_POSTURE, WCAG_PRINCIPLES, DR_TIERS } from "@/lib/nfrData";
import { INTEGRATIONS, type Integration } from "@/lib/integrationsData";
import { REQUIREMENTS, type Requirement, type Priority, type ReqStatus } from "@/lib/requirementsCatalog";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  Target,
  Map,
  ShieldCheck,
  Users,
  Activity,
  Network,
  Search,
  Filter,
  Clock,
  Calendar,
  FileCheck2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  GitBranch,
  Briefcase,
  Cog,
  Building2,
  Database,
  Wrench,
  Brain,
  type LucideIcon,
} from "lucide-react";

const FORUM_ICONS: Record<string, LucideIcon> = {
  steering: Briefcase,
  ops: Cog,
  arch: Building2,
  data: Database,
  cab: Wrench,
  ai: Brain,
};

// Category → lucide icon (matches both EN + AR labels)
import { Fingerprint, CreditCard, MessageSquare, HeartPulse, Landmark, Server } from "lucide-react";
const INTEGRATION_CATEGORY_ICONS: Record<string, LucideIcon> = {
  Identity: Fingerprint, "الهوية": Fingerprint,
  Payments: CreditCard, "المدفوعات": CreditCard,
  Communications: MessageSquare, "الاتصالات": MessageSquare,
  Health: HeartPulse, "الصحة": HeartPulse,
  Civic: Landmark, "خدمات حكومية": Landmark,
  Internal: Server, "أنظمة داخلية": Server,
};

// ─────────────────────────────────────────────────────────────────────
// Tab 1: Strategic Alignment
// ─────────────────────────────────────────────────────────────────────
function StrategicAlignment() {
  const { t, lang, isRTL } = useLocale();

  const radarData = DGA_MATURITY.map((d) => ({
    dimension: lang === "ar" ? d.dimension.ar : d.dimension.en,
    current: d.current,
    target: d.target,
    fullMark: d.fullMark,
  }));

  return (
    <div className="space-y-6">
      {/* Vision 2030 */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Target size={14} className="text-primary" />
            {t("gov.vision2030Title")}
          </CardTitle>
          <p className="text-xs text-muted-foreground">{t("gov.vision2030Sub")}</p>
        </CardHeader>
        <CardContent className="grid lg:grid-cols-3 gap-4">
          {VISION_2030_THEMES.map((th) => (
            <div key={th.id} className="rounded-lg border border-border p-4 bg-card">
              <Badge variant="outline" className="text-[10px] border-primary/40 text-primary mb-2">
                {lang === "ar" ? th.title.ar : th.title.en}
              </Badge>
              <p className={cn("text-xs text-muted-foreground mb-3", isRTL && "text-right")}>
                {lang === "ar" ? th.description.ar : th.description.en}
              </p>
              <p className={cn("text-xs text-foreground leading-relaxed", isRTL && "text-right")}>
                {lang === "ar" ? th.contribution.ar : th.contribution.en}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* DGA Maturity radar */}
      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="shadow-card lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">{t("gov.dgaMaturityTitle")}</CardTitle>
            <p className="text-xs text-muted-foreground">{t("gov.dgaMaturitySub")}</p>
          </CardHeader>
          <CardContent className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="dimension" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <PolarRadiusAxis angle={isRTL ? 60 : 30} domain={[0, 5]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                <Radar name={t("gov.current")} dataKey="current" stroke="#0069A7" fill="#0069A7" fillOpacity={0.35} />
                <Radar name={t("gov.target")} dataKey="target" stroke="#FAC126" fill="#FAC126" fillOpacity={0.15} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">{t("gov.isoTitle")}</CardTitle>
            <p className="text-xs text-muted-foreground">{t("gov.isoSub")}</p>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {ISO_FAMILIES.map((iso) => (
              <div key={iso.code} className={cn("flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2.5", isRTL && "flex-row-reverse")}>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground">{iso.code}</p>
                  <p className={cn("text-[10px] text-muted-foreground truncate", isRTL && "text-right")}>
                    {lang === "ar" ? iso.title.ar : iso.title.en}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] shrink-0",
                    iso.status === "compliant" && "border-emerald-500/40 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30",
                    iso.status === "in-progress" && "border-amber-500/40 text-amber-700 bg-amber-50 dark:bg-amber-950/30",
                    iso.status === "planned" && "border-muted-foreground/30 text-muted-foreground",
                  )}
                >
                  {t(`gov.iso.${iso.status}`)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* EFQM */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">{t("gov.efqmTitle")}</CardTitle>
          <p className="text-xs text-muted-foreground">{t("gov.efqmSub")}</p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {EFQM_CRITERIA.map((c) => (
              <div key={c.id} className="rounded-lg border border-border p-3.5">
                <p className={cn("text-xs font-semibold text-foreground mb-1", isRTL && "text-right")}>
                  {lang === "ar" ? c.title.ar : c.title.en}
                </p>
                <p className={cn("text-[11px] text-muted-foreground mb-2.5 leading-relaxed line-clamp-2", isRTL && "text-right")}>
                  {lang === "ar" ? c.description.ar : c.description.en}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${c.score}%` }} />
                  </div>
                  <span className="text-xs font-semibold tabular-nums text-foreground">{c.score}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Tab 2: Standards Traceability
// ─────────────────────────────────────────────────────────────────────
const PRIORITY_LABELS: Record<Priority, { en: string; ar: string }> = {
  must: { en: "Must", ar: "أساسي" },
  should: { en: "Should", ar: "ينبغي" },
  could: { en: "Could", ar: "يمكن" },
  wont: { en: "Won't", ar: "مؤجل" },
};
const STATUS_LABELS: Record<ReqStatus, { en: string; ar: string }> = {
  met: { en: "Met", ar: "مُحقق" },
  "in-progress": { en: "In Progress", ar: "قيد التنفيذ" },
  planned: { en: "Planned", ar: "مُخطط" },
  gap: { en: "Gap", ar: "فجوة" },
};

function StandardsTraceability() {
  const { t, lang, isRTL } = useLocale();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [std, setStd] = useState("all");
  const [prio, setPrio] = useState("all");
  const [stat, setStat] = useState("all");
  const [selected, setSelected] = useState<Requirement | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(REQUIREMENTS.map((r) => (lang === "ar" ? r.category.ar : r.category.en)))).sort(),
    [lang],
  );
  const standards = useMemo(() => Array.from(new Set(REQUIREMENTS.flatMap((r) => r.standards))).sort(), []);

  const filtered = REQUIREMENTS.filter((r) => {
    if (q && !`${r.id} ${r.title.en} ${r.title.ar}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (cat !== "all" && (lang === "ar" ? r.category.ar : r.category.en) !== cat) return false;
    if (std !== "all" && !r.standards.includes(std)) return false;
    if (prio !== "all" && r.priority !== prio) return false;
    if (stat !== "all" && r.status !== stat) return false;
    return true;
  });

  const total = REQUIREMENTS.length;
  const met = REQUIREMENTS.filter((r) => r.status === "met").length;
  const gaps = REQUIREMENTS.filter((r) => r.status === "gap").length;
  const inProgress = REQUIREMENTS.filter((r) => r.status === "in-progress").length;
  const planned = REQUIREMENTS.filter((r) => r.status === "planned").length;

  return (
    <div className="space-y-6">
      {/* Top stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {[
          { label: t("gov.req.total"), value: String(total), tone: "neutral" },
          { label: t("gov.req.met"), value: `${Math.round((met / total) * 100)}%`, sub: `${met}/${total}`, tone: "ok" },
          { label: t("gov.req.inProgress"), value: String(inProgress), tone: "warn" },
          { label: t("gov.req.planned"), value: String(planned), tone: "neutral" },
          { label: t("gov.req.gaps"), value: String(gaps), tone: "alert" },
        ].map((s, i) => (
          <Card key={i} className="shadow-card">
            <CardContent className="p-4">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{s.label}</p>
              <p className={cn("text-xl font-semibold mt-1 tabular-nums", s.tone === "ok" && "text-emerald-600", s.tone === "alert" && "text-rose-600", s.tone === "warn" && "text-amber-600")}>{s.value}</p>
              {s.sub && <p className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[180px]">
              <Search size={14} className={cn("absolute top-1/2 -translate-y-1/2 text-muted-foreground", isRTL ? "right-2.5" : "left-2.5")} />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("gov.req.search") + "…"} className={cn("h-9 text-sm", isRTL ? "pr-8" : "pl-8")} />
            </div>
            <select className="h-9 text-xs rounded-md border border-border bg-background px-2.5" value={cat} onChange={(e) => setCat(e.target.value)}>
              <option value="all">{t("common.category")}: {t("common.all")}</option>
              {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
            <select className="h-9 text-xs rounded-md border border-border bg-background px-2.5" value={std} onChange={(e) => setStd(e.target.value)}>
              <option value="all">{t("gov.standard")}: {t("common.all")}</option>
              {standards.map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>
            <select className="h-9 text-xs rounded-md border border-border bg-background px-2.5" value={prio} onChange={(e) => setPrio(e.target.value)}>
              <option value="all">{t("common.priority")}: {t("common.all")}</option>
              {Object.entries(PRIORITY_LABELS).map(([k, v]) => (<option key={k} value={k}>{lang === "ar" ? v.ar : v.en}</option>))}
            </select>
            <select className="h-9 text-xs rounded-md border border-border bg-background px-2.5" value={stat} onChange={(e) => setStat(e.target.value)}>
              <option value="all">{t("common.status")}: {t("common.all")}</option>
              {Object.entries(STATUS_LABELS).map(([k, v]) => (<option key={k} value={k}>{lang === "ar" ? v.ar : v.en}</option>))}
            </select>
            <span className="text-[11px] text-muted-foreground ms-auto">{filtered.length} / {total}</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Table */}
        <Card className="shadow-card lg:col-span-2">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[640px]">
                <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>ID</th>
                    <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("common.category")}</th>
                    <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("gov.req.title")}</th>
                    <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("gov.standards")}</th>
                    <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("common.priority")}</th>
                    <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("common.status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => {
                    const active = selected?.id === r.id;
                    return (
                      <tr
                        key={r.id}
                        onClick={() => setSelected(r)}
                        className={cn("border-t border-border hover:bg-muted/30 cursor-pointer", active && "bg-primary/5")}
                      >
                        <td className="px-3 py-2.5 font-mono text-[11px] text-primary">{r.id}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{lang === "ar" ? r.category.ar : r.category.en}</td>
                        <td className={cn("px-3 py-2.5 font-medium text-foreground max-w-[260px] truncate", isRTL && "text-right")}>{lang === "ar" ? r.title.ar : r.title.en}</td>
                        <td className="px-3 py-2.5">
                          <div className="flex flex-wrap gap-1">
                            {r.standards.slice(0, 2).map((s) => (
                              <Badge key={s} variant="outline" className="text-[9px] px-1.5 py-0">{s}</Badge>
                            ))}
                            {r.standards.length > 2 && <span className="text-[10px] text-muted-foreground">+{r.standards.length - 2}</span>}
                          </div>
                        </td>
                        <td className="px-3 py-2.5"><Badge variant="secondary" className="text-[10px]">{lang === "ar" ? PRIORITY_LABELS[r.priority].ar : PRIORITY_LABELS[r.priority].en}</Badge></td>
                        <td className="px-3 py-2.5">
                          <Badge variant="outline" className={cn(
                            "text-[10px]",
                            r.status === "met" && "border-emerald-500/40 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30",
                            r.status === "in-progress" && "border-amber-500/40 text-amber-700 bg-amber-50 dark:bg-amber-950/30",
                            r.status === "gap" && "border-rose-500/40 text-rose-700 bg-rose-50 dark:bg-rose-950/30",
                            r.status === "planned" && "border-muted-foreground/30 text-muted-foreground",
                          )}>
                            {lang === "ar" ? STATUS_LABELS[r.status].ar : STATUS_LABELS[r.status].en}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} className="px-3 py-10 text-center text-muted-foreground">{t("table.empty")}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Detail */}
        <Card className="shadow-card lg:sticky lg:top-20 self-start">
          <CardHeader>
            <CardTitle className="text-xs font-semibold">{selected ? selected.id : t("gov.req.selectPrompt")}</CardTitle>
            {selected && <p className={cn("text-sm font-medium text-foreground", isRTL && "text-right")}>{lang === "ar" ? selected.title.ar : selected.title.en}</p>}
          </CardHeader>
          <CardContent>
            {!selected ? (
              <p className="text-xs text-muted-foreground">{t("gov.req.selectHint")}</p>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <p className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground mb-1">{t("gov.req.shall")}</p>
                  <p className={cn("text-foreground leading-relaxed", isRTL && "text-right")}>{lang === "ar" ? selected.shall.ar : selected.shall.en}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground mb-1">{t("gov.req.acceptance")}</p>
                  <p className={cn("text-foreground", isRTL && "text-right")}>{lang === "ar" ? selected.acceptance.ar : selected.acceptance.en}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selected.standards.map((s) => (<Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>))}
                </div>
                <div className="rounded-md bg-muted/40 px-2.5 py-2">
                  <p className="text-[10px] text-muted-foreground">{t("gov.req.module")}: <span className="font-mono text-primary">{selected.module}</span></p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Tab 3: Compliance Status
// ─────────────────────────────────────────────────────────────────────
function ComplianceGauge({ value }: { value: number }) {
  const tone = value >= 90 ? "#16a34a" : value >= 75 ? "#FAC126" : "#dc2626";
  const r = 36;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <svg width="88" height="88" viewBox="0 0 88 88" className="-mt-1">
      <circle cx="44" cy="44" r={r} stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
      <circle
        cx="44" cy="44" r={r} stroke={tone} strokeWidth="8" fill="none"
        strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
        transform="rotate(-90 44 44)"
      />
      <text x="44" y="44" textAnchor="middle" dominantBaseline="central" className="text-base font-semibold fill-foreground tabular-nums">
        {value}%
      </text>
    </svg>
  );
}

function ComplianceStatusTab() {
  const { t, lang, isRTL } = useLocale();
  const [open, setOpen] = useState<ComplianceStandard | null>(null);

  const allFindings = COMPLIANCE_STANDARDS.flatMap((s) => s.findings.map((f) => ({ ...f, standard: s.code })));
  allFindings.sort((a, b) => ({ high: 0, medium: 1, low: 2 } as any)[a.severity] - ({ high: 0, medium: 1, low: 2 } as any)[b.severity]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COMPLIANCE_STANDARDS.map((s) => (
          <Card key={s.id} onClick={() => setOpen(s)} className={cn("shadow-card cursor-pointer hover:shadow-card-hover transition", open?.id === s.id && "ring-2 ring-primary/40")}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{s.version}</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{s.code}</p>
                  <p className={cn("text-[11px] text-muted-foreground mt-0.5 line-clamp-2", isRTL && "text-right")}>
                    {lang === "ar" ? s.title.ar : s.title.en}
                  </p>
                </div>
                <ComplianceGauge value={s.compliance} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
                <div className="rounded-md bg-muted/40 px-2 py-1.5">
                  <p className="text-muted-foreground">{t("gov.compliance.lastAudit")}</p>
                  <p className="font-medium text-foreground mt-0.5">{s.lastAudit}</p>
                </div>
                <div className="rounded-md bg-muted/40 px-2 py-1.5">
                  <p className="text-muted-foreground">{t("gov.compliance.evidence")}</p>
                  <p className="font-medium text-foreground mt-0.5 tabular-nums">{s.evidence}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {open && (
        <Card className="shadow-card border-primary/30">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <FileCheck2 size={14} className="text-primary" />
              {open.code} · {lang === "ar" ? open.title.ar : open.title.en}
            </CardTitle>
            <p className="text-xs text-muted-foreground">{lang === "ar" ? open.scope.ar : open.scope.en}</p>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-2">
              <p className="text-muted-foreground"><Calendar size={11} className="inline me-1" /> {t("gov.compliance.lastAudit")}: <span className="text-foreground font-medium">{open.lastAudit}</span></p>
              <p className="text-muted-foreground"><Clock size={11} className="inline me-1" /> {t("gov.compliance.nextReview")}: <span className="text-foreground font-medium">{open.nextReview}</span></p>
              <p className="text-muted-foreground"><Users size={11} className="inline me-1" /> {t("common.owner")}: <span className="text-foreground font-medium">{lang === "ar" ? open.owner.ar : open.owner.en}</span></p>
            </div>
            <div className="md:col-span-2">
              <p className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground mb-1.5">{t("gov.compliance.findings")}</p>
              {open.findings.length === 0 ? (
                <p className="text-emerald-600 text-xs">✓ {t("gov.compliance.noFindings")}</p>
              ) : (
                <ul className="space-y-1.5">
                  {open.findings.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs">
                      <Badge variant="outline" className={cn(
                        "text-[9px] shrink-0",
                        f.severity === "high" && "border-rose-500/40 text-rose-700 bg-rose-50 dark:bg-rose-950/30",
                        f.severity === "medium" && "border-amber-500/40 text-amber-700 bg-amber-50 dark:bg-amber-950/30",
                        f.severity === "low" && "border-muted-foreground/30 text-muted-foreground",
                      )}>{f.severity}</Badge>
                      <span className={cn("text-foreground", isRTL && "text-right")}>{lang === "ar" ? f.title.ar : f.title.en}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2"><AlertTriangle size={14} className="text-amber-600" />{t("gov.compliance.openFindings")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {allFindings.map((f, i) => (
              <li key={i} className={cn("flex items-center gap-3 rounded-md border border-border px-3 py-2.5 text-xs", isRTL && "flex-row-reverse")}>
                <Badge variant="outline" className={cn(
                  "text-[9px] shrink-0 w-16 justify-center",
                  f.severity === "high" && "border-rose-500/40 text-rose-700 bg-rose-50 dark:bg-rose-950/30",
                  f.severity === "medium" && "border-amber-500/40 text-amber-700 bg-amber-50 dark:bg-amber-950/30",
                  f.severity === "low" && "border-muted-foreground/30 text-muted-foreground",
                )}>{f.severity}</Badge>
                <span className="font-mono text-[10px] text-muted-foreground shrink-0">{f.standard}</span>
                <span className={cn("text-foreground flex-1", isRTL && "text-right")}>{lang === "ar" ? f.title.ar : f.title.en}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Tab 4: Governance & RACI
// ─────────────────────────────────────────────────────────────────────
function GovernanceRACI() {
  const { t, lang, isRTL } = useLocale();

  const cellClass = (v: string) =>
    v === "A" ? "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300" :
    v === "R" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300" :
    v === "C" ? "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300" :
    v === "I" ? "bg-sky-100 text-sky-800 dark:bg-sky-950/40 dark:text-sky-300" :
    "bg-muted/30 text-muted-foreground";

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2"><Users size={14} className="text-primary" />{t("gov.forumsTitle")}</CardTitle>
          <p className="text-xs text-muted-foreground">{t("gov.forumsSub")}</p>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GOVERNANCE_FORUMS.map((f) => {
            const FIcon = FORUM_ICONS[f.id] ?? Briefcase;
            return (
            <div key={f.id} className="relative rounded-lg border border-border p-4 bg-card card-lift overflow-hidden accent-stripe ps-5">
              <div className="flex items-start gap-2.5">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/15">
                  <FIcon size={16} />
                </span>
                <p className={cn("text-sm font-semibold text-foreground", isRTL && "text-right")}>{lang === "ar" ? f.name.ar : f.name.en}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2 text-[10px]">
                <Badge variant="outline" className="border-primary/30 text-primary">{lang === "ar" ? f.cadence.ar : f.cadence.en}</Badge>
              </div>
              <p className={cn("text-[11px] text-muted-foreground mt-3", isRTL && "text-right")}>
                <span className="font-semibold">{t("gov.chair")}: </span>{lang === "ar" ? f.chair.ar : f.chair.en}
              </p>
              <p className={cn("text-[11px] text-muted-foreground mt-1", isRTL && "text-right")}>
                <span className="font-semibold">{t("gov.members")}: </span>{lang === "ar" ? f.members.ar : f.members.en}
              </p>
              <p className={cn("text-[11px] text-foreground mt-2 leading-relaxed", isRTL && "text-right")}>
                <span className="font-semibold">{t("gov.mandate")}: </span>{lang === "ar" ? f.mandate.ar : f.mandate.en}
              </p>
            </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">{t("gov.raciTitle")}</CardTitle>
          <p className="text-xs text-muted-foreground">{t("gov.raciSub")}</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  <th className={cn("px-2 py-2 text-[10px] uppercase tracking-wider text-muted-foreground sticky bg-card border-b border-border min-w-[220px]", isRTL ? "right-0 text-right" : "left-0 text-left")}>{t("gov.activity")}</th>
                  {RACI_ROLES.map((r, i) => (
                    <th key={i} className="px-1.5 py-2 text-[9px] uppercase tracking-wider text-muted-foreground text-center border-b border-border min-w-[78px]">
                      {lang === "ar" ? r.ar : r.en}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RACI_ACTIVITIES.map((a, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className={cn("px-2 py-2 font-medium text-foreground sticky bg-card", isRTL ? "right-0 text-right" : "left-0 text-left")}>
                      {lang === "ar" ? a.activity.ar : a.activity.en}
                    </td>
                    {a.cells.map((c, j) => (
                      <td key={j} className="px-1.5 py-2 text-center">
                        {c && <span className={cn("inline-flex items-center justify-center h-6 w-6 rounded text-[10px] font-bold", cellClass(c))}>{c}</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-[10px]">
            <span className="flex items-center gap-1.5"><span className={cn("h-3.5 w-3.5 rounded flex items-center justify-center text-[9px] font-bold", cellClass("R"))}>R</span>{t("gov.raci.r")}</span>
            <span className="flex items-center gap-1.5"><span className={cn("h-3.5 w-3.5 rounded flex items-center justify-center text-[9px] font-bold", cellClass("A"))}>A</span>{t("gov.raci.a")}</span>
            <span className="flex items-center gap-1.5"><span className={cn("h-3.5 w-3.5 rounded flex items-center justify-center text-[9px] font-bold", cellClass("C"))}>C</span>{t("gov.raci.c")}</span>
            <span className="flex items-center gap-1.5"><span className={cn("h-3.5 w-3.5 rounded flex items-center justify-center text-[9px] font-bold", cellClass("I"))}>I</span>{t("gov.raci.i")}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">{t("gov.decisionsTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[640px]">
              <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("gov.decision")}</th>
                  <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("gov.decider")}</th>
                  <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("gov.escalation")}</th>
                </tr>
              </thead>
              <tbody>
                {DECISION_RIGHTS.map((d, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className={cn("px-3 py-2.5 font-medium text-foreground", isRTL && "text-right")}>{lang === "ar" ? d.decision.ar : d.decision.en}</td>
                    <td className={cn("px-3 py-2.5 text-foreground", isRTL && "text-right")}>{lang === "ar" ? d.decider.ar : d.decider.en}</td>
                    <td className={cn("px-3 py-2.5 text-muted-foreground", isRTL && "text-right")}>{lang === "ar" ? d.escalation.ar : d.escalation.en}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Tab 5: Non-Functional Requirements
// ─────────────────────────────────────────────────────────────────────
function NFRTab() {
  const { t, lang, isRTL } = useLocale();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {NFR_HEADLINE.map((n) => (
          <Card key={n.id} className="shadow-card">
            <CardContent className="p-4">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{lang === "ar" ? n.label.ar : n.label.en}</p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-xl font-semibold tabular-nums text-foreground">{n.value}</span>
                {n.unit.en && <span className="text-xs text-muted-foreground">{lang === "ar" ? n.unit.ar : n.unit.en}</span>}
              </div>
              <p className={cn("text-[10px] text-muted-foreground mt-1.5", isRTL && "text-right")}>{lang === "ar" ? n.sub.ar : n.sub.en}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">{t("gov.nfr.perfBudget")}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[480px]">
              <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("gov.nfr.area")}</th>
                  <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("gov.nfr.budget")}</th>
                  <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("gov.nfr.current")}</th>
                </tr>
              </thead>
              <tbody>
                {PERFORMANCE_BUDGET.map((p, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className={cn("px-3 py-2.5 font-medium text-foreground", isRTL && "text-right")}>{lang === "ar" ? p.area.ar : p.area.en}</td>
                    <td className={cn("px-3 py-2.5 text-muted-foreground tabular-nums", isRTL && "text-right")}>{lang === "ar" ? p.budget.ar : p.budget.en}</td>
                    <td className={cn("px-3 py-2.5 tabular-nums", isRTL && "text-right", p.status === "ok" && "text-emerald-700", p.status === "warn" && "text-amber-700", p.status === "fail" && "text-rose-700")}>
                      {lang === "ar" ? p.current.ar : p.current.en}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2"><ShieldCheck size={14} className="text-primary" />{t("gov.nfr.security")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {SECURITY_POSTURE.map((s, i) => (
                <li key={i} className={cn("flex items-start gap-3 text-xs", isRTL && "flex-row-reverse text-right")}>
                  <span className="font-mono text-[10px] text-muted-foreground shrink-0 w-24 mt-0.5">{s.standard}</span>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{lang === "ar" ? s.control.ar : s.control.en}</p>
                    <p className="text-muted-foreground mt-0.5">{lang === "ar" ? s.status.ar : s.status.en}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">{t("gov.nfr.wcag")}</CardTitle>
          <p className="text-xs text-muted-foreground">WCAG 2.2 AA</p>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {WCAG_PRINCIPLES.map((p) => (
            <div key={p.id} className="rounded-lg border border-border p-3.5">
              <p className={cn("text-sm font-semibold text-foreground", isRTL && "text-right")}>{lang === "ar" ? p.title.ar : p.title.en}</p>
              <p className={cn("text-[11px] text-muted-foreground mt-1 leading-relaxed", isRTL && "text-right")}>{lang === "ar" ? p.description.ar : p.description.en}</p>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${p.conformance}%` }} />
                </div>
                <span className="text-xs font-semibold tabular-nums">{p.conformance}%</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2"><Activity size={14} className="text-primary" />{t("gov.nfr.dr")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-3">
            {DR_TIERS.map((t2, i) => (
              <div key={i} className="rounded-lg border border-border p-4">
                <p className={cn("text-sm font-semibold text-foreground", isRTL && "text-right")}>{lang === "ar" ? t2.tier.ar : t2.tier.en}</p>
                <p className={cn("text-[11px] text-muted-foreground mt-1", isRTL && "text-right")}>{lang === "ar" ? t2.systems.ar : t2.systems.en}</p>
                <div className="mt-3 flex gap-3 text-[11px]">
                  <span className="rounded-md bg-muted/40 px-2 py-1"><span className="text-muted-foreground">RTO</span> <span className="font-mono font-semibold ms-1">{t2.rto}</span></span>
                  <span className="rounded-md bg-muted/40 px-2 py-1"><span className="text-muted-foreground">RPO</span> <span className="font-mono font-semibold ms-1">{t2.rpo}</span></span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Tab 6: Integrations Registry
// ─────────────────────────────────────────────────────────────────────
function IntegrationsTab() {
  const { t, lang, isRTL } = useLocale();
  const [filter, setFilter] = useState<string>("all");
  const categories = Array.from(new Set(INTEGRATIONS.map((i) => (lang === "ar" ? i.category.ar : i.category.en))));
  const filtered = filter === "all" ? INTEGRATIONS : INTEGRATIONS.filter((i) => (lang === "ar" ? i.category.ar : i.category.en) === filter);

  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const typeIcon = (typ: Integration["type"]) =>
    typ === "bi" ? "↔" : typ === "inbound" ? (isRTL ? "→" : "←") : isRTL ? "←" : "→";

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2"><Network size={14} className="text-primary" />{t("gov.integrations.hub")}</CardTitle>
          <p className="text-xs text-muted-foreground">{t("gov.integrations.hubSub")}</p>
        </CardHeader>
        <CardContent>
          <div className="relative rounded-lg bg-muted/20 border border-border p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 items-center">
              {categories.map((c, i) => {
                const sample = INTEGRATIONS.filter((it) => (lang === "ar" ? it.category.ar : it.category.en) === c).slice(0, 3);
                const CIcon = INTEGRATION_CATEGORY_ICONS[c] ?? Network;
                return (
                  <div key={i} className="rounded-md border border-border bg-card p-3 card-lift">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <CIcon size={12} className="text-primary" />
                      <p className="text-[11px] font-semibold text-primary uppercase tracking-wider">{c}</p>
                    </div>
                    <ul className="space-y-0.5">
                      {sample.map((s) => (<li key={s.id} className="text-[10px] text-muted-foreground truncate">{lang === "ar" ? s.name.ar : s.name.en}</li>))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <div className={cn("flex items-center justify-between gap-3 flex-wrap", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-semibold">{t("gov.integrations.registry")}</CardTitle>
            <div className="flex items-center gap-1.5">
              <Filter size={12} className="text-muted-foreground" />
              <select className="h-8 text-xs rounded-md border border-border bg-background px-2.5" value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">{t("common.all")}</option>
                {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[640px]">
              <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("gov.integrations.name")}</th>
                  <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("common.category")}</th>
                  <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("gov.integrations.dir")}</th>
                  <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("gov.integrations.protocol")}</th>
                  <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("gov.integrations.auth")}</th>
                  <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("common.owner")}</th>
                  <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("common.status")}</th>
                  <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>SLA</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((i) => (
                  <tr key={i.id} className="border-t border-border hover:bg-muted/30">
                    <td className={cn("px-3 py-2.5 font-medium text-foreground", isRTL && "text-right")}>{lang === "ar" ? i.name.ar : i.name.en}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">
                      {(() => { const CIcon = INTEGRATION_CATEGORY_ICONS[lang === "ar" ? i.category.ar : i.category.en] ?? Network; return (
                        <span className="inline-flex items-center gap-1.5"><CIcon size={12} className="text-primary shrink-0" /><span>{lang === "ar" ? i.category.ar : i.category.en}</span></span>
                      ); })()}
                    </td>
                    <td className="px-3 py-2.5 text-center"><span className="text-primary font-mono text-base">{typeIcon(i.type)}</span></td>
                    <td className="px-3 py-2.5 text-foreground font-mono text-[10px]">{i.protocol}</td>
                    <td className="px-3 py-2.5 text-muted-foreground text-[10px]">{i.auth}</td>
                    <td className="px-3 py-2.5 text-muted-foreground text-[11px]">{lang === "ar" ? i.owner.ar : i.owner.en}</td>
                    <td className="px-3 py-2.5">
                      <Badge variant="outline" className={cn(
                        "text-[9px]",
                        i.status === "live" && "border-emerald-500/40 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30",
                        i.status === "in-dev" && "border-amber-500/40 text-amber-700 bg-amber-50 dark:bg-amber-950/30",
                        i.status === "planned" && "border-muted-foreground/30 text-muted-foreground",
                        i.status === "deprecated" && "border-rose-500/40 text-rose-700 bg-rose-50",
                      )}>{t(`gov.integrations.${i.status}`)}</Badge>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground text-[10px]">{lang === "ar" ? i.sla.ar : i.sla.en}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
export default function Governance() {
  const { t } = useLocale();

  return (
    <>
      <PageHeader Icon={GitBranch} title={t("gov.title")} subtitle={t("gov.subtitle")} />

      <Tabs defaultValue="strategy">
        <TabsList className="h-auto w-full justify-start overflow-x-auto no-scrollbar p-1">
          <TabsTrigger value="strategy" className="gap-1.5 whitespace-nowrap shrink-0"><Target size={13} />{t("gov.tab.strategy")}</TabsTrigger>
          <TabsTrigger value="traceability" className="gap-1.5 whitespace-nowrap shrink-0"><Map size={13} />{t("gov.tab.traceability")}</TabsTrigger>
          <TabsTrigger value="compliance" className="gap-1.5 whitespace-nowrap shrink-0"><ShieldCheck size={13} />{t("gov.tab.compliance")}</TabsTrigger>
          <TabsTrigger value="raci" className="gap-1.5 whitespace-nowrap shrink-0"><Users size={13} />{t("gov.tab.raci")}</TabsTrigger>
          <TabsTrigger value="nfr" className="gap-1.5 whitespace-nowrap shrink-0"><Activity size={13} />{t("gov.tab.nfr")}</TabsTrigger>
          <TabsTrigger value="integrations" className="gap-1.5 whitespace-nowrap shrink-0"><Network size={13} />{t("gov.tab.integrations")}</TabsTrigger>
        </TabsList>
        <TabsContent value="strategy" className="mt-6"><StrategicAlignment /></TabsContent>
        <TabsContent value="traceability" className="mt-6"><StandardsTraceability /></TabsContent>
        <TabsContent value="compliance" className="mt-6"><ComplianceStatusTab /></TabsContent>
        <TabsContent value="raci" className="mt-6"><GovernanceRACI /></TabsContent>
        <TabsContent value="nfr" className="mt-6"><NFRTab /></TabsContent>
        <TabsContent value="integrations" className="mt-6"><IntegrationsTab /></TabsContent>
      </Tabs>
    </>
  );
}
