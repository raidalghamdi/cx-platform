import { useMemo, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/brand/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  StatusBadge,
  SlaBadge,
  ChannelChip,
  SentimentChip,
  PriorityBadge,
} from "@/components/brand/StatusChips";
import {
  type ComplaintStatus,
  type SlaStatus,
} from "@/lib/seed";
import {
  useComplaints,
  updateStatus,
  addNote,
  type ComplaintExt,
} from "@/lib/complaintsStore";
import { useToast } from "@/hooks/use-toast";
import { Filter, Search, Plus, MessageSquareWarning, Database, TrendingDown } from "lucide-react";
import { BalaghBanner } from "@/components/brand/BalaghBanner";

const STATUS_OPTIONS: ComplaintStatus[] = [
  "new",
  "acknowledged",
  "investigating",
  "awaiting",
  "resolved",
  "closed",
  "escalated",
];
const SLA_OPTIONS: SlaStatus[] = ["onTrack", "atRisk", "breached"];

export default function Complaints() {
  const { t, lang, pick, isRTL } = useLocale();
  const { user } = useAuth();
  const { toast } = useToast();
  const complaints = useComplaints();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [sla, setSla] = useState("all");
  const [open, setOpen] = useState<ComplaintExt | null>(null);
  const [view, setView] = useState<"all" | "down">("all");
  const [note, setNote] = useState("");

  const actor = user
    ? { en: user.name_en, ar: user.name_ar }
    : { en: "System", ar: "النظام" };

  const filteredBase = useMemo(() => {
    return complaints.filter((c) => {
      if (view === "down" && !c.downJourney) return false;
      if (status !== "all" && c.status !== status) return false;
      if (sla !== "all" && c.sla !== sla) return false;
      if (q) {
        const hay = `${c.ref} ${c.subject.ar} ${c.subject.en} ${c.customer.name.ar} ${c.customer.name.en}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [q, status, sla, view, complaints]);

  // Refresh selected complaint after a mutation so the drawer shows updated data
  const current = open ? complaints.find((c) => c.id === open.id) ?? null : null;

  function doStatus(s: ComplaintStatus) {
    if (!current) return;
    updateStatus(current.id, s, actor);
    toast({
      title: lang === "ar" ? t("complaints.statusChanged") : "Status changed",
      description: `${current.ref} → ${t("status." + s)}`,
    });
  }

  function doAddNote() {
    if (!current || !note.trim()) return;
    addNote(current.id, note.trim(), actor);
    setNote("");
    toast({ title: lang === "ar" ? "تمت إضافة الملاحظة" : "Note added" });
  }

  // Stage breakdown for Down Journey view
  const stageBreakdown = useMemo(() => {
    const counts: Record<string, { ar: string; en: string; n: number }> = {};
    for (const c of complaints) {
      if (!c.downJourney || !c.journeyStage) continue;
      const k = c.journeyStage.en;
      if (!counts[k]) counts[k] = { ...c.journeyStage, n: 0 };
      counts[k].n += 1;
    }
    return Object.values(counts);
  }, [complaints]);
  const stageMax = Math.max(1, ...stageBreakdown.map((s) => s.n));

  return (
    <div>
      <PageHeader
        Icon={MessageSquareWarning}
        title={t("nav.complaints")}
        requirementIds={["FR-61", "FR-62", "FR-67", "FR-68"]}
        standards={["ISO 10002 §7.5", "DGA 5.18.2", "Vision 2030 — Service Excellence"]}
        subtitle={
          lang === "ar"
            ? `${filteredBase.length} شكاوى ضمن نتائج البحث الحالية`
            : `${filteredBase.length} complaints in current view`
        }
        actions={
          <>
            <Button variant="outline" size="sm">
              <Filter size={14} className="me-1.5" />
              {t("common.filters")}
            </Button>
            <Button size="sm">
              <Plus size={14} className="me-1.5" />
              {lang === "ar" ? "شكوى جديدة" : "New complaint"}
            </Button>
          </>
        }
      />

      <div className="mb-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/60 ring-1 ring-border text-[11px] font-medium text-muted-foreground">
          <Database size={11} />
          {t("source.complaintsPage")}
        </span>
      </div>

      <BalaghBanner />

      <Tabs value={view} onValueChange={(v) => setView(v as "all" | "down")} className="mb-4">
        <TabsList>
          <TabsTrigger value="all">{t("complaints.tab.all")}</TabsTrigger>
          <TabsTrigger value="down" className="gap-1.5">
            <TrendingDown size={13} />
            {t("complaints.tab.downJourney")}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {view === "down" && (
        <>
          <Card className="shadow-card mb-4 border-rose-200 bg-rose-50/40">
            <CardContent className="p-4">
              <p className="text-sm text-rose-900 leading-relaxed">{t("complaints.downBanner")}</p>
            </CardContent>
          </Card>
          <Card className="shadow-card mb-4">
            <CardContent className="p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                {t("complaints.stageBreakdown")}
              </p>
              <ul className="space-y-2.5">
                {stageBreakdown.map((s) => (
                  <li key={s.en} className="flex items-center gap-3">
                    <span className="text-xs font-medium min-w-[160px]">{pick(s)}</span>
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-rose-500" style={{ width: `${(s.n / stageMax) * 100}%` }} />
                    </div>
                    <span className="text-[11px] tabular-nums w-6 text-end">{s.n}</span>
                  </li>
                ))}
                {stageBreakdown.length === 0 && (
                  <li className="text-xs text-muted-foreground">{t("table.empty")}</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </>
      )}

      <Card className="shadow-card mb-4">
        <CardContent className="p-3 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={14} className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "right-3" : "left-3"} text-muted-foreground`} />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={lang === "ar" ? "ابحث بالمرجع أو الموضوع…" : "Search ref or subject…"}
              className={isRTL ? "pr-9" : "pl-9"}
              data-testid="input-search-complaints"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder={t("common.status")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.all")} · {t("common.status")}</SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>{t("status." + s)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sla} onValueChange={setSla}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder={lang === "ar" ? "مستوى الخدمة" : "SLA"} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.all")} · SLA</SelectItem>
              {SLA_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>{t("sla." + s)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/40">
              <tr>
                <th className="text-start px-4 py-3 font-medium">{t("ref")}</th>
                <th className="text-start px-4 py-3 font-medium">{t("common.subject")}</th>
                <th className="text-start px-4 py-3 font-medium">{t("common.customer")}</th>
                <th className="text-start px-4 py-3 font-medium">{t("common.channel")}</th>
                <th className="text-start px-4 py-3 font-medium">{t("common.category")}</th>
                {view === "down" && (
                  <th className="text-start px-4 py-3 font-medium">{t("complaints.stageColumn")}</th>
                )}
                <th className="text-start px-4 py-3 font-medium">{t("common.status")}</th>
                <th className="text-start px-4 py-3 font-medium">SLA</th>
                <th className="text-start px-4 py-3 font-medium">{t("common.owner")}</th>
                <th className="text-start px-4 py-3 font-medium">{t("common.opened")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredBase.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setOpen(c)}
                  data-testid={`row-complaint-${c.id}`}
                  className="cursor-pointer hover:bg-muted/40 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-[12px] text-muted-foreground">{c.ref}</td>
                  <td className="px-4 py-3 font-medium max-w-[280px]">
                    <span className="block truncate">{pick(c.subject)}</span>
                    <span className="block text-[11px] text-muted-foreground truncate">
                      {pick(c.agency)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="h-7 w-7 rounded-full bg-muted text-foreground/70 flex items-center justify-center text-[10px] font-semibold shrink-0">
                        {c.customer.initials}
                      </span>
                      <span className="truncate">{pick(c.customer.name)}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3"><ChannelChip ch={c.channel} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{pick(c.category)}</td>
                  {view === "down" && (
                    <td className="px-4 py-3 text-rose-700 font-medium text-[12px]">
                      {c.journeyStage ? pick(c.journeyStage) : "—"}
                    </td>
                  )}
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3"><SlaBadge sla={c.sla} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{pick(c.owner)}</td>
                  <td className="px-4 py-3 text-muted-foreground tabular-nums whitespace-nowrap">{c.opened}</td>
                </tr>
              ))}
              {filteredBase.length === 0 && (
                <tr>
                  <td colSpan={view === "down" ? 10 : 9} className="px-4 py-12 text-center text-muted-foreground">
                    {t("table.empty")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail sheet */}
      <Sheet open={!!current} onOpenChange={(o) => !o && setOpen(null)}>
        <SheetContent side={isRTL ? "left" : "right"} className="w-full sm:max-w-[640px] p-0 flex flex-col">
          {current && (
            <>
              <SheetHeader className="px-4 sm:px-6 pt-6 pb-4 border-b border-border">
                <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
                  {current.ref}
                  <span>·</span>
                  <PriorityBadge p={current.priority} />
                  <span className="ms-auto"><SentimentChip s={current.sentiment} /></span>
                </div>
                <SheetTitle className="text-lg font-semibold leading-snug pt-1.5">
                  {pick(current.subject)}
                </SheetTitle>
                <SheetDescription className="text-sm">
                  {pick(current.agency)} · {pick(current.category)}
                </SheetDescription>
                <div className="flex items-center gap-2 pt-2">
                  <StatusBadge status={current.status} />
                  <SlaBadge sla={current.sla} />
                  <ChannelChip ch={current.channel} />
                  {current.downJourney && current.journeyStage && (
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-medium px-1.5 py-0.5 rounded bg-rose-50 ring-1 ring-rose-200 text-rose-700">
                      <TrendingDown size={10} />
                      {pick(current.journeyStage)}
                    </span>
                  )}
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto">
                <Tabs defaultValue="details" className="p-4 sm:p-6">
                  <TabsList className="w-full justify-start overflow-x-auto no-scrollbar">
                    <TabsTrigger value="details" className="text-xs whitespace-nowrap shrink-0">{t("tab.details")}</TabsTrigger>
                    <TabsTrigger value="timeline" className="text-xs whitespace-nowrap shrink-0">{t("tab.timeline")}</TabsTrigger>
                    <TabsTrigger value="customer" className="text-xs whitespace-nowrap shrink-0">{t("tab.customer360")}</TabsTrigger>
                    <TabsTrigger value="actions" className="text-xs whitespace-nowrap shrink-0">{t("tab.actions")}</TabsTrigger>
                    <TabsTrigger value="audit" className="text-xs whitespace-nowrap shrink-0">{t("tab.audit")}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-4 mt-5">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        {t("common.description")}
                      </p>
                      <p className="text-sm leading-relaxed">{pick(current.description)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><p className="text-[11px] text-muted-foreground mb-0.5">{t("common.owner")}</p><p>{pick(current.owner)}</p></div>
                      <div><p className="text-[11px] text-muted-foreground mb-0.5">{t("common.opened")}</p><p>{current.opened}</p></div>
                      <div><p className="text-[11px] text-muted-foreground mb-0.5">{t("common.updated")}</p><p>{current.updated}</p></div>
                      <div><p className="text-[11px] text-muted-foreground mb-0.5">{t("common.priority")}</p><p>{t("priority." + current.priority)}</p></div>
                    </div>
                  </TabsContent>

                  <TabsContent value="timeline" className="mt-5">
                    <ol className="relative ms-3 border-s border-border space-y-4">
                      {current.timeline.map((ev, i) => (
                        <li key={i} className="ps-4">
                          <span className={`absolute ${isRTL ? "right-[-5px]" : "left-[-5px]"} mt-1 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-card`} />
                          <p className="text-[11px] text-muted-foreground tabular-nums font-mono">{ev.at}</p>
                          <p className="text-sm font-medium">{pick(ev.action)}</p>
                          <p className="text-[11px] text-muted-foreground">{pick(ev.actor)}</p>
                        </li>
                      ))}
                    </ol>
                  </TabsContent>

                  <TabsContent value="customer" className="mt-5 space-y-4">
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/40">
                      <span className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                        {current.customer.initials}
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{pick(current.customer.name)}</p>
                        <p className="text-[11px] text-muted-foreground" dir="ltr">ID · {current.customer.nationalId}</p>
                      </div>
                    </div>
                    <dl className="grid grid-cols-3 gap-3 text-sm">
                      <div className="rounded-lg border border-border p-3">
                        <dt className="text-[11px] text-muted-foreground">{lang === "ar" ? "تفاعلات" : "Interactions"}</dt>
                        <dd className="font-semibold mt-0.5 tabular-nums">{current.customer.interactions}</dd>
                      </div>
                      <div className="rounded-lg border border-border p-3">
                        <dt className="text-[11px] text-muted-foreground">CSAT</dt>
                        <dd className="font-semibold mt-0.5 tabular-nums">{current.customer.csat.toFixed(1)} / 5</dd>
                      </div>
                      <div className="rounded-lg border border-border p-3">
                        <dt className="text-[11px] text-muted-foreground">{lang === "ar" ? "منذ" : "Joined"}</dt>
                        <dd className="font-semibold mt-0.5 text-sm tabular-nums">{current.customer.joined}</dd>
                      </div>
                    </dl>
                    <p className="text-[11px] text-muted-foreground">{pick(current.customer.segment)}</p>
                  </TabsContent>

                  <TabsContent value="actions" className="mt-5 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" onClick={() => doStatus("acknowledged")}>{t("status.acknowledged")}</Button>
                      <Button variant="outline" size="sm" onClick={() => doStatus("investigating")}>{t("status.investigating")}</Button>
                      <Button variant="outline" size="sm" onClick={() => doStatus("awaiting")}>{t("status.awaiting")}</Button>
                      <Button variant="outline" size="sm" onClick={() => doStatus("escalated")}>{t("common.escalate")}</Button>
                      <Button variant="outline" size="sm" onClick={() => doStatus("new")}>{t("common.reopen")}</Button>
                      <Button variant="outline" size="sm" onClick={() => doStatus("closed")}>{lang === "ar" ? "إغلاق" : "Close"}</Button>
                    </div>
                    <div className="space-y-2">
                      <Input
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder={lang === "ar" ? "أضف ملاحظة سريعة…" : "Add a quick note…"}
                        data-testid="input-complaint-note"
                      />
                      <Button variant="outline" size="sm" className="w-full" onClick={doAddNote} disabled={!note.trim()}>
                        {t("common.addNote")}
                      </Button>
                    </div>
                    <Button className="w-full" onClick={() => doStatus("resolved")} data-testid="button-resolve-complaint">
                      {t("common.resolve")}
                    </Button>
                  </TabsContent>

                  <TabsContent value="audit" className="mt-5">
                    <ul className="text-xs space-y-2 font-mono text-muted-foreground">
                      <li>{current.opened} · system.create · {current.ref}</li>
                      <li>{current.timeline[0]?.at} · system.notify · channel/{current.channel}</li>
                      <li>{current.updated} · agent.update · status={current.status}</li>
                    </ul>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
