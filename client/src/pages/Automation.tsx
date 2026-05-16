import { useMemo, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { PageHeader } from "@/components/brand/PageHeader";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Bot, Zap, PlayCircle } from "lucide-react";
import {
  DEFAULT_RULES,
  runRules,
  TRIGGER_LABELS,
  ACTION_LABELS,
  type AutomationRule,
} from "@/lib/automation";
import { InitialsAvatar } from "@/components/brand/InitialsAvatar";

export default function Automation() {
  const { lang, pick } = useLocale();
  const [rules, setRules] = useState<AutomationRule[]>(DEFAULT_RULES);

  const log = useMemo(() => runRules(rules), [rules]);

  const enabledCount = rules.filter((r) => r.enabled).length;
  const totalRuns = log.length;
  const uniqueTickets = new Set(log.map((l) => l.ticketRef)).size;

  function toggle(id: string) {
    setRules((rs) => rs.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  }

  return (
    <div>
      <PageHeader
        Icon={Bot}
        title={lang === "ar" ? "الأتمتة الذكية (RPA)" : "Smart Automation (RPA)"}
        subtitle={
          lang === "ar"
            ? "محرك أتمتة العمليات الروبوتية — قواعد تُنفّذ إجراءات على الحالات بدون تدخل بشري"
            : "Robotic Process Automation engine — rules that act on tickets without human intervention"
        }
      />

      {/* KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <Card className="p-4 shadow-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            {lang === "ar" ? "قواعد مفعّلة" : "Active rules"}
          </div>
          <div className="mt-1 text-2xl font-semibold text-[#25935F]">
            {enabledCount}
            <span className="text-base text-muted-foreground"> / {rules.length}</span>
          </div>
        </Card>
        <Card className="p-4 shadow-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            {lang === "ar" ? "إجراءات منفّذة" : "Actions executed"}
          </div>
          <div className="mt-1 text-2xl font-semibold text-[#25935F]">{totalRuns}</div>
        </Card>
        <Card className="p-4 shadow-card">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            {lang === "ar" ? "حالات معالَجة" : "Tickets touched"}
          </div>
          <div className="mt-1 text-2xl font-semibold text-[#25935F]">{uniqueTickets}</div>
        </Card>
      </div>

      {/* Rules */}
      <Card className="mb-4 shadow-card overflow-hidden">
        <div className="px-4 sm:px-5 py-3 border-b bg-muted/30 flex items-center gap-2">
          <Zap className="h-4 w-4 text-[#25935F]" />
          <h2 className="text-sm font-semibold">
            {lang === "ar" ? "قواعد الأتمتة" : "Automation rules"}
          </h2>
        </div>
        <div className="divide-y divide-border">
          {rules.map((r) => (
            <div
              key={r.id}
              className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 px-4 sm:px-5 py-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[11px] text-muted-foreground">{r.id}</span>
                  <span className="font-medium text-sm">{pick(r.name)}</span>
                  {r.enabled ? (
                    <Badge className="bg-[#25935F]/10 text-[#25935F] border-[#25935F]/30 hover:bg-[#25935F]/10">
                      {lang === "ar" ? "مفعّلة" : "Active"}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      {lang === "ar" ? "متوقفة" : "Paused"}
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {pick(r.description)}
                </div>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground flex-wrap">
                  <Badge variant="outline" className="font-normal">
                    {lang === "ar" ? "المحفّز" : "Trigger"}: {pick(TRIGGER_LABELS[r.trigger])}
                  </Badge>
                  <span aria-hidden>→</span>
                  <Badge variant="outline" className="font-normal">
                    {lang === "ar" ? "الإجراء" : "Action"}: {pick(ACTION_LABELS[r.action])}
                  </Badge>
                </div>
              </div>
              <div className="shrink-0">
                <Switch
                  checked={r.enabled}
                  onCheckedChange={() => toggle(r.id)}
                  aria-label={pick(r.name)}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Execution log */}
      <Card className="shadow-card overflow-hidden">
        <div className="px-4 sm:px-5 py-3 border-b bg-muted/30 flex items-center gap-2">
          <PlayCircle className="h-4 w-4 text-[#25935F]" />
          <h2 className="text-sm font-semibold">
            {lang === "ar" ? "سجل تنفيذ الأتمتة" : "Automation execution log"}
          </h2>
          <span className="ms-auto text-xs text-muted-foreground tabular-nums">
            {log.length} {lang === "ar" ? "إجراء" : "actions"}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/20">
              <tr>
                <th className="text-start px-4 py-3 font-medium">
                  {lang === "ar" ? "الوقت" : "Timestamp"}
                </th>
                <th className="text-start px-4 py-3 font-medium">
                  {lang === "ar" ? "المرجع" : "Ticket"}
                </th>
                <th className="text-start px-4 py-3 font-medium">
                  {lang === "ar" ? "القاعدة" : "Rule"}
                </th>
                <th className="text-start px-4 py-3 font-medium">
                  {lang === "ar" ? "الإجراء" : "Action"}
                </th>
                <th className="text-start px-4 py-3 font-medium">
                  {lang === "ar" ? "النتيجة" : "Outcome"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {log.map((e) => (
                <tr key={e.id} className="hover:bg-muted/40">
                  <td
                    className="px-4 py-2.5 font-mono text-[12px] text-muted-foreground tabular-nums"
                    dir="ltr"
                  >
                    {e.at}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[12px]">{e.ticketRef}</td>
                  <td className="px-4 py-2.5">
                    <span className="inline-flex items-center gap-2">
                      <InitialsAvatar name={pick(e.ruleName)} size={20} />
                      <span className="truncate">{pick(e.ruleName)}</span>
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {pick(ACTION_LABELS[e.action])}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{pick(e.outcome)}</td>
                </tr>
              ))}
              {log.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    {lang === "ar"
                      ? "لا توجد قواعد مفعّلة — قم بتفعيل قاعدة لرؤية النشاط."
                      : "No active rules — enable a rule to see activity."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
