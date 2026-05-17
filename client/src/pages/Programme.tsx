import { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { PageHeader } from "@/components/brand/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ROADMAP_PHASES,
  WORKSTREAMS,
  RISKS,
  ASSUMPTIONS,
  ISSUES,
  DEPENDENCIES,
  TCO_YEARLY,
  COST_LINES,
  BENEFITS,
  ADKAR_GROUPS,
  TRAINING_CATALOGUE,
  COMMS_PLAN,
  ADOPTION_METRICS,
  type Risk,
} from "@/lib/programmeData";
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { CalendarRange, AlertCircle, DollarSign, GraduationCap, ArrowUp, CheckCircle2, AlertTriangle, XCircle, ClipboardList, Upload, Download } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  useProgrammeTasks,
  setTasks as setProgrammeTasks,
  parseMspXml,
  parseCsv,
  serialiseMspXml,
} from "@/lib/programmeStore";

// Compute month index for gantt positioning.
const MONTHS = (() => {
  const out: { ym: string; label: string }[] = [];
  let y = 2025, m = 4; // Apr 2025
  for (let i = 0; i < 24; i++) {
    out.push({ ym: `${y}-${String(m).padStart(2, "0")}`, label: `${y.toString().slice(2)}·${String(m).padStart(2, "0")}` });
    m++;
    if (m > 12) { m = 1; y++; }
  }
  return out;
})();
const ymIndex = (s: string) => MONTHS.findIndex((m) => m.ym === s);

function RoadmapTab() {
  const { t, lang, isRTL } = useLocale();

  const cell = (phase: typeof ROADMAP_PHASES[0]) => {
    const s = ymIndex(phase.start);
    const e = ymIndex(phase.end);
    const total = MONTHS.length;
    const leftPct = (s / total) * 100;
    const widthPct = ((e - s + 1) / total) * 100;
    const tone =
      phase.status === "complete" ? "bg-primary/80" :
      phase.status === "in-progress" ? "bg-primary" :
      "bg-muted-foreground/40";
    return (
      <div className="relative h-8 bg-muted/30 rounded-md">
        <div className={cn("absolute top-1 bottom-1 rounded", tone)}
             style={isRTL ? { right: `${leftPct}%`, width: `${widthPct}%` } : { left: `${leftPct}%`, width: `${widthPct}%` }}>
          <div className="px-2 h-full flex items-center text-[10px] font-semibold text-white whitespace-nowrap overflow-hidden">
            {lang === "ar" ? phase.name.ar : phase.name.en}
          </div>
        </div>
      </div>
    );
  };

  const wsBar = (ws: typeof WORKSTREAMS[0]) => {
    const s = ymIndex(ws.start);
    const e = ymIndex(ws.end);
    const total = MONTHS.length;
    const leftPct = (s / total) * 100;
    const widthPct = ((e - s + 1) / total) * 100;
    return (
      <div className="relative h-6 bg-muted/20 rounded">
        <div className="absolute top-1 bottom-1 rounded-sm bg-gradient-to-r from-primary/70 to-primary"
             style={isRTL ? { right: `${leftPct}%`, width: `${widthPct}%` } : { left: `${leftPct}%`, width: `${widthPct}%` }} />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2"><CalendarRange size={14} className="text-primary" />{t("prog.roadmap.phases")}</CardTitle>
          <p className="text-xs text-muted-foreground">{t("prog.roadmap.phasesSub")}</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-2 px-2">
            <div className="min-w-[520px]">
              {/* Timeline header */}
              <div className="text-[9px] text-muted-foreground mb-1 flex" style={isRTL ? { flexDirection: "row-reverse" } : undefined}>
                {MONTHS.filter((_, i) => i % 3 === 0).map((m, i) => (
                  <span key={i} className="flex-1 tabular-nums">{m.label}</span>
                ))}
              </div>
              <div className="space-y-2">
                {ROADMAP_PHASES.map((p) => (
                  <div key={p.id}>{cell(p)}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Phase details */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
            {ROADMAP_PHASES.map((p) => (
              <div key={p.id} className={cn("rounded-lg border p-4",
                p.status === "in-progress" ? "border-primary/40 bg-primary/5" : "border-border")}>
                <div className="flex items-center justify-between gap-2">
                  <p className={cn("text-xs font-semibold text-foreground", isRTL && "text-right")}>{lang === "ar" ? p.name.ar : p.name.en}</p>
                  <Badge variant="outline" className={cn(
                    "text-[9px]",
                    p.status === "complete" && "border-emerald-500/40 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30",
                    p.status === "in-progress" && "border-primary text-primary",
                    p.status === "upcoming" && "border-muted-foreground/30 text-muted-foreground",
                  )}>{t(`prog.roadmap.${p.status}`)}</Badge>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5 tabular-nums">{p.start} → {p.end}</p>
                <div className="mt-3">
                  <p className="text-[9px] uppercase font-semibold tracking-wider text-muted-foreground mb-1">{t("prog.roadmap.deliverables")}</p>
                  <ul className="space-y-0.5">
                    {p.deliverables.slice(0, 4).map((d, i) => (
                      <li key={i} className={cn("text-[10px] text-foreground leading-snug", isRTL && "text-right")}>· {lang === "ar" ? d.ar : d.en}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-2.5">
                  <p className="text-[9px] uppercase font-semibold tracking-wider text-muted-foreground mb-1">{t("prog.roadmap.gates")}</p>
                  <ul className="space-y-0.5">
                    {p.gates.map((g, i) => (
                      <li key={i} className={cn("text-[10px] text-muted-foreground leading-snug", isRTL && "text-right")}>✓ {lang === "ar" ? g.ar : g.en}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">{t("prog.workstreams")}</CardTitle>
          <p className="text-xs text-muted-foreground">{t("prog.workstreamsSub")}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {WORKSTREAMS.map((ws) => (
              <div key={ws.id} className="grid grid-cols-[120px_1fr] sm:grid-cols-[160px_1fr] gap-3 items-center">
                <div className={cn("text-[11px] font-medium text-foreground truncate", isRTL && "text-right")}>{lang === "ar" ? ws.name.ar : ws.name.en}</div>
                {wsBar(ws)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── RAID ───────────────────────────────────────────────────────────
function RiskHeatmap({ risks }: { risks: Risk[] }) {
  const { t, lang } = useLocale();
  // 5x5 grid: rows = impact (5 top → 1 bottom), cols = likelihood (1 → 5)
  const cells: { l: number; i: number; risks: Risk[] }[] = [];
  for (let i = 5; i >= 1; i--) {
    for (let l = 1; l <= 5; l++) {
      cells.push({ l, i, risks: risks.filter((r) => r.likelihood === l && r.impact === i) });
    }
  }
  const tone = (l: number, i: number) => {
    const v = l * i;
    if (v >= 16) return "bg-rose-500/80 text-white";
    if (v >= 9) return "bg-amber-500/70 text-white";
    if (v >= 4) return "bg-amber-200 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200";
    return "bg-emerald-200/60 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200";
  };

  return (
    <div>
      <div className="grid grid-cols-[auto_repeat(5,1fr)] gap-1.5">
        <div />
        {[1, 2, 3, 4, 5].map((l) => (
          <div key={l} className="text-[10px] text-center text-muted-foreground font-semibold">L{l}</div>
        ))}
        {[5, 4, 3, 2, 1].map((imp) => (
          <>
            <div key={`y-${imp}`} className="text-[10px] text-muted-foreground font-semibold flex items-center justify-center">I{imp}</div>
            {[1, 2, 3, 4, 5].map((l) => {
              const cell = cells.find((c) => c.l === l && c.i === imp)!;
              return (
                <div key={`${imp}-${l}`} className={cn("relative aspect-square rounded-md flex items-center justify-center", tone(l, imp))}>
                  {cell.risks.length > 0 && (
                    <span className="text-sm font-bold tabular-nums">{cell.risks.length}</span>
                  )}
                </div>
              );
            })}
          </>
        ))}
      </div>
      <div className="mt-3 text-[10px] text-muted-foreground flex justify-between">
        <span>← {t("prog.raid.likelihood")}</span>
        <span>{t("prog.raid.impactAxis")} ↑</span>
      </div>
    </div>
  );
}

function RAIDTab() {
  const { t, lang, isRTL } = useLocale();
  const topRisks = [...RISKS].sort((a, b) => (b.likelihood * b.impact) - (a.likelihood * a.impact)).slice(0, 5);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="risks">
        <TabsList className="w-full justify-start overflow-x-auto no-scrollbar">
          <TabsTrigger value="risks" className="whitespace-nowrap shrink-0">{t("prog.raid.risks")} <Badge variant="secondary" className="ms-1.5 text-[9px]">{RISKS.length}</Badge></TabsTrigger>
          <TabsTrigger value="assumptions" className="whitespace-nowrap shrink-0">{t("prog.raid.assumptions")} <Badge variant="secondary" className="ms-1.5 text-[9px]">{ASSUMPTIONS.length}</Badge></TabsTrigger>
          <TabsTrigger value="issues" className="whitespace-nowrap shrink-0">{t("prog.raid.issues")} <Badge variant="secondary" className="ms-1.5 text-[9px]">{ISSUES.length}</Badge></TabsTrigger>
          <TabsTrigger value="dependencies" className="whitespace-nowrap shrink-0">{t("prog.raid.dependencies")} <Badge variant="secondary" className="ms-1.5 text-[9px]">{DEPENDENCIES.length}</Badge></TabsTrigger>
        </TabsList>

        <TabsContent value="risks" className="mt-6 space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">{t("prog.raid.heatmap")}</CardTitle>
                <p className="text-xs text-muted-foreground">{t("prog.raid.heatmapSub")}</p>
              </CardHeader>
              <CardContent>
                <RiskHeatmap risks={RISKS} />
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2"><AlertTriangle size={14} className="text-amber-600" />{t("prog.raid.top5")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5">
                  {topRisks.map((r) => (
                    <li key={r.id} className={cn("rounded-md border border-border px-3 py-2.5 text-xs", isRTL && "text-right")}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] text-primary">{r.id}</span>
                        <Badge variant="outline" className="text-[9px]">L{r.likelihood}·I{r.impact}</Badge>
                      </div>
                      <p className="font-medium text-foreground mt-1">{lang === "ar" ? r.title.ar : r.title.en}</p>
                      <p className="text-muted-foreground mt-0.5 text-[11px]">{lang === "ar" ? r.mitigation.ar : r.mitigation.en}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">{t("prog.raid.allRisks")}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[640px]">
                  <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>ID</th>
                      <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("gov.req.title")}</th>
                      <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("common.category")}</th>
                      <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>L×I</th>
                      <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("common.owner")}</th>
                      <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("common.status")}</th>
                      <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("prog.raid.target")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RISKS.map((r) => (
                      <tr key={r.id} className="border-t border-border">
                        <td className="px-3 py-2.5 font-mono text-[10px] text-primary">{r.id}</td>
                        <td className={cn("px-3 py-2.5 font-medium text-foreground", isRTL && "text-right")}>{lang === "ar" ? r.title.ar : r.title.en}</td>
                        <td className={cn("px-3 py-2.5 text-muted-foreground", isRTL && "text-right")}>{lang === "ar" ? r.category.ar : r.category.en}</td>
                        <td className="px-3 py-2.5">
                          <span className={cn("inline-block rounded px-1.5 py-0.5 text-[9px] font-bold",
                            r.likelihood * r.impact >= 16 ? "bg-rose-500/20 text-rose-700" :
                            r.likelihood * r.impact >= 9 ? "bg-amber-500/20 text-amber-700" :
                            "bg-emerald-500/15 text-emerald-700")}>{r.likelihood * r.impact}</span>
                        </td>
                        <td className={cn("px-3 py-2.5 text-muted-foreground", isRTL && "text-right")}>{lang === "ar" ? r.owner.ar : r.owner.en}</td>
                        <td className={cn("px-3 py-2.5 text-muted-foreground", isRTL && "text-right")}>{lang === "ar" ? r.status.ar : r.status.en}</td>
                        <td className="px-3 py-2.5 text-muted-foreground tabular-nums">{r.target}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assumptions" className="mt-6">
          <Card className="shadow-card">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[640px]">
                <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>ID</th>
                    <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("gov.req.title")}</th>
                    <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("common.owner")}</th>
                    <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("common.status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {ASSUMPTIONS.map((a) => (
                    <tr key={a.id} className="border-t border-border">
                      <td className="px-3 py-2.5 font-mono text-[10px] text-primary">{a.id}</td>
                      <td className={cn("px-3 py-2.5 font-medium text-foreground", isRTL && "text-right")}>{lang === "ar" ? a.title.ar : a.title.en}</td>
                      <td className={cn("px-3 py-2.5 text-muted-foreground", isRTL && "text-right")}>{lang === "ar" ? a.owner.ar : a.owner.en}</td>
                      <td className={cn("px-3 py-2.5 text-muted-foreground", isRTL && "text-right")}>{lang === "ar" ? a.status.ar : a.status.en}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues" className="mt-6">
          <Card className="shadow-card">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[640px]">
                <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>ID</th>
                    <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("gov.req.title")}</th>
                    <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("prog.raid.severity")}</th>
                    <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("common.owner")}</th>
                    <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("common.opened")}</th>
                  </tr>
                </thead>
                <tbody>
                  {ISSUES.map((i) => (
                    <tr key={i.id} className="border-t border-border">
                      <td className="px-3 py-2.5 font-mono text-[10px] text-primary">{i.id}</td>
                      <td className={cn("px-3 py-2.5 font-medium text-foreground", isRTL && "text-right")}>{lang === "ar" ? i.title.ar : i.title.en}</td>
                      <td className="px-3 py-2.5">
                        <Badge variant="outline" className={cn(
                          "text-[9px]",
                          i.severity === "high" && "border-rose-500/40 text-rose-700 bg-rose-50",
                          i.severity === "medium" && "border-amber-500/40 text-amber-700 bg-amber-50",
                          i.severity === "low" && "border-muted-foreground/30 text-muted-foreground",
                        )}>{i.severity}</Badge>
                      </td>
                      <td className={cn("px-3 py-2.5 text-muted-foreground", isRTL && "text-right")}>{lang === "ar" ? i.owner.ar : i.owner.en}</td>
                      <td className="px-3 py-2.5 text-muted-foreground tabular-nums">{i.opened}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dependencies" className="mt-6">
          <Card className="shadow-card">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[640px]">
                <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>ID</th>
                    <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("gov.req.title")}</th>
                    <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("prog.raid.dependsOn")}</th>
                    <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("prog.raid.due")}</th>
                    <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("common.status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {DEPENDENCIES.map((d) => (
                    <tr key={d.id} className="border-t border-border">
                      <td className="px-3 py-2.5 font-mono text-[10px] text-primary">{d.id}</td>
                      <td className={cn("px-3 py-2.5 font-medium text-foreground", isRTL && "text-right")}>{lang === "ar" ? d.title.ar : d.title.en}</td>
                      <td className={cn("px-3 py-2.5 text-muted-foreground", isRTL && "text-right")}>{lang === "ar" ? d.on.ar : d.on.en}</td>
                      <td className="px-3 py-2.5 text-muted-foreground tabular-nums">{d.due}</td>
                      <td className="px-3 py-2.5">
                        <Badge variant="outline" className={cn(
                          "text-[9px]",
                          d.status === "on-track" && "border-emerald-500/40 text-emerald-700 bg-emerald-50",
                          d.status === "at-risk" && "border-amber-500/40 text-amber-700 bg-amber-50",
                          d.status === "blocked" && "border-rose-500/40 text-rose-700 bg-rose-50",
                        )}>{t(`prog.raid.${d.status}`)}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ── Cost & Value ───────────────────────────────────────────────────
function CostValueTab() {
  const { t, lang, isRTL } = useLocale();

  const totalY1 = TCO_YEARLY[0].build + TCO_YEARLY[0].license + TCO_YEARLY[0].operate + TCO_YEARLY[0].change + TCO_YEARLY[0].training;
  const total3y = TCO_YEARLY.reduce((acc, y) => acc + y.build + y.license + y.operate + y.change + y.training, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="shadow-card"><CardContent className="p-4"><p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{t("prog.cost.totalY1")}</p><p className="text-2xl font-semibold tabular-nums mt-1">{totalY1.toFixed(1)}<span className="text-xs text-muted-foreground ms-1">{t("prog.cost.mSAR")}</span></p></CardContent></Card>
        <Card className="shadow-card"><CardContent className="p-4"><p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{t("prog.cost.total3y")}</p><p className="text-2xl font-semibold tabular-nums mt-1">{total3y.toFixed(1)}<span className="text-xs text-muted-foreground ms-1">{t("prog.cost.mSAR")}</span></p></CardContent></Card>
        <Card className="shadow-card"><CardContent className="p-4"><p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{t("prog.cost.npv")}</p><p className="text-2xl font-semibold tabular-nums text-primary mt-1">≈ 105<span className="text-xs text-muted-foreground ms-1">{t("prog.cost.mSAR")}</span></p><p className="text-[10px] text-muted-foreground mt-0.5">{t("prog.cost.npvNote")}</p></CardContent></Card>
        <Card className="shadow-card"><CardContent className="p-4"><p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{t("prog.cost.payback")}</p><p className="text-2xl font-semibold tabular-nums mt-1">≈ 22<span className="text-xs text-muted-foreground ms-1">{t("prog.cost.months")}</span></p></CardContent></Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2"><DollarSign size={14} className="text-primary" />{t("prog.cost.tco")}</CardTitle>
          <p className="text-xs text-muted-foreground">{t("prog.cost.tcoSub")}</p>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={TCO_YEARLY} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} reversed={isRTL} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} orientation={isRTL ? "right" : "left"} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="build" stackId="a" fill="#25935F" name={t("prog.cost.build")} />
              <Bar dataKey="license" stackId="a" fill="#F8BD02" name={t("prog.cost.license")} />
              <Bar dataKey="operate" stackId="a" fill="#2E90FA" name={t("prog.cost.operate")} />
              <Bar dataKey="change" stackId="a" fill="#80519F" name={t("prog.cost.change")} />
              <Bar dataKey="training" stackId="a" fill="#F79009" name={t("prog.cost.training")} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">{t("prog.cost.lines")}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[640px]">
              <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("prog.cost.line")}</th>
                  <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("prog.cost.range")}</th>
                  <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("prog.cost.notes")}</th>
                </tr>
              </thead>
              <tbody>
                {COST_LINES.map((l, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className={cn("px-3 py-2.5 font-medium text-foreground", isRTL && "text-right")}>{lang === "ar" ? l.line.ar : l.line.en}</td>
                    <td className={cn("px-3 py-2.5 text-foreground tabular-nums", isRTL && "text-right")}>{lang === "ar" ? l.range.ar : l.range.en}</td>
                    <td className={cn("px-3 py-2.5 text-muted-foreground", isRTL && "text-right")}>{lang === "ar" ? l.notes.ar : l.notes.en}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">{t("prog.benefits.title")}</CardTitle>
            <p className="text-xs text-muted-foreground">{t("prog.benefits.sub")}</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[640px]">
              <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("prog.benefits.kpi")}</th>
                  <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("prog.benefits.baseline")}</th>
                  <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("prog.benefits.target")}</th>
                  <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("prog.benefits.npv")}</th>
                </tr>
              </thead>
              <tbody>
                {BENEFITS.map((b, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className={cn("px-3 py-2.5 font-medium text-foreground", isRTL && "text-right")}>{lang === "ar" ? b.kpi.ar : b.kpi.en}</td>
                    <td className={cn("px-3 py-2.5 text-muted-foreground tabular-nums", isRTL && "text-right")}>{b.baseline}</td>
                    <td className={cn("px-3 py-2.5 text-primary font-semibold tabular-nums", isRTL && "text-right")}>{b.target}</td>
                    <td className={cn("px-3 py-2.5 text-muted-foreground", isRTL && "text-right")}>{lang === "ar" ? b.npv.ar : b.npv.en}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ── Change & Training ───────────────────────────────────────────────
function AdkarGauge({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={cn("h-full", value >= 80 ? "bg-emerald-500" : value >= 60 ? "bg-amber-500" : "bg-rose-500")} style={{ width: `${value}%` }} />
      </div>
      <span className="text-[10px] font-semibold tabular-nums w-7 text-right">{value}</span>
    </div>
  );
}

function ChangeTab() {
  const { t, lang, isRTL } = useLocale();

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2"><GraduationCap size={14} className="text-primary" />{t("prog.change.adkar")}</CardTitle>
          <p className="text-xs text-muted-foreground">{t("prog.change.adkarSub")}</p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[640px]">
              <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("prog.change.group")}</th>
                  <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>A {t("prog.change.awareness")}</th>
                  <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>D {t("prog.change.desire")}</th>
                  <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>K {t("prog.change.knowledge")}</th>
                  <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>A {t("prog.change.ability")}</th>
                  <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>R {t("prog.change.reinforcement")}</th>
                </tr>
              </thead>
              <tbody>
                {ADKAR_GROUPS.map((g, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className={cn("px-3 py-2.5 font-medium text-foreground min-w-[140px]", isRTL && "text-right")}>{lang === "ar" ? g.group.ar : g.group.en}</td>
                    <td className="px-3 py-2.5 min-w-[120px]"><AdkarGauge value={g.awareness} /></td>
                    <td className="px-3 py-2.5 min-w-[120px]"><AdkarGauge value={g.desire} /></td>
                    <td className="px-3 py-2.5 min-w-[120px]"><AdkarGauge value={g.knowledge} /></td>
                    <td className="px-3 py-2.5 min-w-[120px]"><AdkarGauge value={g.ability} /></td>
                    <td className="px-3 py-2.5 min-w-[120px]"><AdkarGauge value={g.reinforcement} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">{t("prog.change.catalogue")}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[640px]">
                <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("prog.change.course")}</th>
                    <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("prog.change.audience")}</th>
                    <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("prog.change.format")}</th>
                    <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("prog.change.duration")}</th>
                    <th className={cn("px-3 py-2.5", isRTL ? "text-right" : "text-left")}>{t("prog.change.completion")}</th>
                  </tr>
                </thead>
                <tbody>
                  {TRAINING_CATALOGUE.map((c, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className={cn("px-3 py-2.5 font-medium text-foreground", isRTL && "text-right")}>{lang === "ar" ? c.course.ar : c.course.en}</td>
                      <td className={cn("px-3 py-2.5 text-muted-foreground", isRTL && "text-right")}>{lang === "ar" ? c.audience.ar : c.audience.en}</td>
                      <td className={cn("px-3 py-2.5 text-muted-foreground", isRTL && "text-right")}>{lang === "ar" ? c.format.ar : c.format.en}</td>
                      <td className={cn("px-3 py-2.5 text-foreground tabular-nums", isRTL && "text-right")}>{lang === "ar" ? c.duration.ar : c.duration.en}</td>
                      <td className="px-3 py-2.5">
                        <AdkarGauge value={c.completion} />
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
            <CardTitle className="text-sm font-semibold">{t("prog.change.adoptionMetrics")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ADOPTION_METRICS.map((m, i) => (
                <div key={i} className="flex items-center justify-between border-b border-border last:border-0 pb-2 last:pb-0">
                  <span className={cn("text-xs text-muted-foreground", isRTL && "text-right")}>{lang === "ar" ? m.metric.ar : m.metric.en}</span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold tabular-nums text-foreground">{m.value}</span>
                    <span className="text-[10px] text-emerald-600 inline-flex items-center"><ArrowUp size={9} />{m.trend}</span>
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">{t("prog.change.commsPlan")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className={cn("relative space-y-3", isRTL ? "border-r-2 border-border pr-4 mr-2" : "border-l-2 border-border pl-4 ml-2")}>
            {COMMS_PLAN.map((c, i) => (
              <li key={i} className="relative">
                <span className={cn("absolute h-2.5 w-2.5 rounded-full bg-primary top-1.5", isRTL ? "-right-[21px]" : "-left-[21px]")} />
                <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground tabular-nums">{c.date}</p>
                <p className={cn("text-xs font-semibold text-foreground", isRTL && "text-right")}>{lang === "ar" ? c.activity.ar : c.activity.en}</p>
                <p className={cn("text-[11px] text-muted-foreground", isRTL && "text-right")}>{lang === "ar" ? c.audience.ar : c.audience.en} · {lang === "ar" ? c.channel.ar : c.channel.en}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
export default function Programme() {
  const { t, lang } = useLocale();
  const { user } = useAuth();
  const { toast } = useToast();
  const tasks = useProgrammeTasks();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const canImport = user?.role === "admin";

  function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const name = f.name.toLowerCase();
    if (name.endsWith(".mpp")) {
      toast({ title: t("prog.importFailed"), description: t("prog.importMpp") });
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || "");
        const parsed = name.endsWith(".csv") ? parseCsv(text) : parseMspXml(text);
        setProgrammeTasks(parsed);
        toast({ title: t("prog.importDone"), description: `${parsed.length} ${lang === "ar" ? "مهمة" : "tasks"}` });
      } catch (err: any) {
        toast({ title: t("prog.importFailed"), description: err?.message ?? "" });
      }
    };
    reader.readAsText(f);
    e.target.value = "";
  }

  function onExport() {
    const xml = serialiseMspXml(tasks);
    const blob = new Blob([xml], { type: "application/xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "cx-programme.xml";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <>
      <PageHeader
        Icon={ClipboardList}
        title={t("prog.title")}
        subtitle={t("prog.subtitle")}
        actions={
          <>
            <input
              ref={fileRef}
              type="file"
              accept=".xml,.mpp,.csv"
              className="hidden"
              onChange={onImport}
              data-testid="input-msp-import"
            />
            {canImport && (
              <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()} data-testid="button-import-msp">
                <Upload size={14} className="me-1.5" />
                {t("prog.importMsp")}
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={onExport} data-testid="button-export-msp">
              <Download size={14} className="me-1.5" />
              {t("prog.exportMsp")}
            </Button>
          </>
        }
      />

      {tasks.length > 0 && (
        <div className="mb-4 rounded-lg border border-border p-3 bg-card">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            {lang === "ar" ? "مهام MS Project الحالية" : "Current MS Project tasks"} · {tasks.length}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-start px-2 py-1">{lang === "ar" ? "المهمة" : "Task"}</th>
                  <th className="text-start px-2 py-1">{lang === "ar" ? "البداية" : "Start"}</th>
                  <th className="text-start px-2 py-1">{lang === "ar" ? "النهاية" : "Finish"}</th>
                  <th className="text-end px-2 py-1">{lang === "ar" ? "أيام" : "Days"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tasks.slice(0, 6).map((tk) => (
                  <tr key={tk.id}>
                    <td className="px-2 py-1 font-medium">{tk.name}</td>
                    <td className="px-2 py-1 tabular-nums text-muted-foreground">{tk.start}</td>
                    <td className="px-2 py-1 tabular-nums text-muted-foreground">{tk.finish}</td>
                    <td className="px-2 py-1 tabular-nums text-end">{tk.durationDays}</td>
                  </tr>
                ))}
                {tasks.length > 6 && (
                  <tr><td colSpan={4} className="px-2 py-1 text-center text-[10px] text-muted-foreground">+ {tasks.length - 6} {lang === "ar" ? "مهام إضافية" : "more tasks"}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Tabs defaultValue="roadmap">
        <TabsList className="h-auto w-full justify-start overflow-x-auto no-scrollbar p-1">
          <TabsTrigger value="roadmap" className="gap-1.5 whitespace-nowrap shrink-0"><CalendarRange size={13} />{t("prog.tab.roadmap")}</TabsTrigger>
          <TabsTrigger value="raid" className="gap-1.5 whitespace-nowrap shrink-0"><AlertCircle size={13} />{t("prog.tab.raid")}</TabsTrigger>
          <TabsTrigger value="cost" className="gap-1.5 whitespace-nowrap shrink-0"><DollarSign size={13} />{t("prog.tab.cost")}</TabsTrigger>
          <TabsTrigger value="change" className="gap-1.5 whitespace-nowrap shrink-0"><GraduationCap size={13} />{t("prog.tab.change")}</TabsTrigger>
        </TabsList>
        <TabsContent value="roadmap" className="mt-6"><RoadmapTab /></TabsContent>
        <TabsContent value="raid" className="mt-6"><RAIDTab /></TabsContent>
        <TabsContent value="cost" className="mt-6"><CostValueTab /></TabsContent>
        <TabsContent value="change" className="mt-6"><ChangeTab /></TabsContent>
      </Tabs>
    </>
  );
}
