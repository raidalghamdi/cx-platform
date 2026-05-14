import { useMemo, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
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
  COMPLAINTS,
  type Complaint,
  type ComplaintStatus,
  type SlaStatus,
} from "@/lib/seed";
import { Filter, Search, Plus, MessageSquareWarning } from "lucide-react";

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
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [sla, setSla] = useState("all");
  const [open, setOpen] = useState<Complaint | null>(null);

  const rows = useMemo(() => {
    return COMPLAINTS.filter((c) => {
      if (status !== "all" && c.status !== status) return false;
      if (sla !== "all" && c.sla !== sla) return false;
      if (q) {
        const hay = `${c.ref} ${c.subject.ar} ${c.subject.en} ${c.customer.name.ar} ${c.customer.name.en}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [q, status, sla]);

  return (
    <div>
      <PageHeader
        Icon={MessageSquareWarning}
        title={t("nav.complaints")}
        subtitle={
          lang === "ar"
            ? `${rows.length} شكاوى ضمن نتائج البحث الحالية`
            : `${rows.length} complaints in current view`
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
                <th className="text-start px-4 py-3 font-medium">{t("common.status")}</th>
                <th className="text-start px-4 py-3 font-medium">SLA</th>
                <th className="text-start px-4 py-3 font-medium">{t("common.owner")}</th>
                <th className="text-start px-4 py-3 font-medium">{t("common.opened")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((c) => (
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
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3"><SlaBadge sla={c.sla} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{pick(c.owner)}</td>
                  <td className="px-4 py-3 text-muted-foreground tabular-nums whitespace-nowrap">{c.opened}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">
                    {t("table.empty")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail sheet */}
      <Sheet open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <SheetContent side={isRTL ? "left" : "right"} className="w-full sm:max-w-[640px] p-0 flex flex-col">
          {open && (
            <>
              <SheetHeader className="px-4 sm:px-6 pt-6 pb-4 border-b border-border">
                <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
                  {open.ref}
                  <span>·</span>
                  <PriorityBadge p={open.priority} />
                  <span className="ms-auto"><SentimentChip s={open.sentiment} /></span>
                </div>
                <SheetTitle className="text-lg font-semibold leading-snug pt-1.5">
                  {pick(open.subject)}
                </SheetTitle>
                <SheetDescription className="text-sm">
                  {pick(open.agency)} · {pick(open.category)}
                </SheetDescription>
                <div className="flex items-center gap-2 pt-2">
                  <StatusBadge status={open.status} />
                  <SlaBadge sla={open.sla} />
                  <ChannelChip ch={open.channel} />
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
                      <p className="text-sm leading-relaxed">{pick(open.description)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><p className="text-[11px] text-muted-foreground mb-0.5">{t("common.owner")}</p><p>{pick(open.owner)}</p></div>
                      <div><p className="text-[11px] text-muted-foreground mb-0.5">{t("common.opened")}</p><p>{open.opened}</p></div>
                      <div><p className="text-[11px] text-muted-foreground mb-0.5">{t("common.updated")}</p><p>{open.updated}</p></div>
                      <div><p className="text-[11px] text-muted-foreground mb-0.5">{t("common.priority")}</p><p>{t("priority." + open.priority)}</p></div>
                    </div>
                  </TabsContent>

                  <TabsContent value="timeline" className="mt-5">
                    <ol className="relative ms-3 border-s border-border space-y-4">
                      {open.timeline.map((ev, i) => (
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
                        {open.customer.initials}
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{pick(open.customer.name)}</p>
                        <p className="text-[11px] text-muted-foreground" dir="ltr">ID · {open.customer.nationalId}</p>
                      </div>
                    </div>
                    <dl className="grid grid-cols-3 gap-3 text-sm">
                      <div className="rounded-lg border border-border p-3">
                        <dt className="text-[11px] text-muted-foreground">{lang === "ar" ? "تفاعلات" : "Interactions"}</dt>
                        <dd className="font-semibold mt-0.5 tabular-nums">{open.customer.interactions}</dd>
                      </div>
                      <div className="rounded-lg border border-border p-3">
                        <dt className="text-[11px] text-muted-foreground">CSAT</dt>
                        <dd className="font-semibold mt-0.5 tabular-nums">{open.customer.csat.toFixed(1)} / 5</dd>
                      </div>
                      <div className="rounded-lg border border-border p-3">
                        <dt className="text-[11px] text-muted-foreground">{lang === "ar" ? "منذ" : "Joined"}</dt>
                        <dd className="font-semibold mt-0.5 text-sm tabular-nums">{open.customer.joined}</dd>
                      </div>
                    </dl>
                    <p className="text-[11px] text-muted-foreground">{pick(open.customer.segment)}</p>
                  </TabsContent>

                  <TabsContent value="actions" className="mt-5 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm">{t("common.assign")}</Button>
                      <Button variant="outline" size="sm">{t("common.escalate")}</Button>
                      <Button variant="outline" size="sm">{t("common.addNote")}</Button>
                      <Button variant="outline" size="sm">{t("common.reopen")}</Button>
                    </div>
                    <Button className="w-full">{t("common.resolve")}</Button>
                  </TabsContent>

                  <TabsContent value="audit" className="mt-5">
                    <ul className="text-xs space-y-2 font-mono text-muted-foreground">
                      <li>{open.opened} · system.create · {open.ref}</li>
                      <li>{open.timeline[0]?.at} · system.notify · channel/{open.channel}</li>
                      <li>{open.updated} · agent.update · status={open.status}</li>
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
