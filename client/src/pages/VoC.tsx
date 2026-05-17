import { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/brand/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { TOP_THEMES, SENTIMENT_BREAKDOWN, CLOSED_LOOP } from "@/lib/seed";
import { useSurveys, addSurvey, editSurvey, deleteSurvey, toggleActive, type EditableSurvey, type SurveyChannel } from "@/lib/surveysStore";
import { SentimentChip } from "@/components/brand/StatusChips";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Plus, HeartHandshake, Pencil, Trash2, Settings2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SENT_COLOR: Record<string, string> = {
  positive: "#17B26A",
  neutral: "#F79009",
  negative: "#F04438",
};

export default function VoC() {
  const { t, lang, pick } = useLocale();
  const { user } = useAuth();
  const { toast } = useToast();
  const surveys = useSurveys();
  const [manageOpen, setManageOpen] = useState(false);
  const [editing, setEditing] = useState<EditableSurvey | null>(null);
  const canManage = user?.role === "admin" || user?.role === "quality";

  return (
    <div>
      <PageHeader
        Icon={HeartHandshake}
        title={t("nav.voc")}
        subtitle={lang === "ar" ? "اقرأ صوت المستفيدين وأغلق الحلقات" : "Listen to your customers and close the loop"}
        actions={
          <>
            {canManage && (
              <Button size="sm" variant="outline" onClick={() => setManageOpen(true)} data-testid="button-manage-surveys">
                <Settings2 size={14} className="me-1.5" />
                {t("voc.manage")}
              </Button>
            )}
            <Button size="sm" onClick={() => { addSurvey(); toast({ title: t("voc.new") }); setManageOpen(true); }}>
              <Plus size={14} className="me-1.5" />
              {lang === "ar" ? "استبيان جديد" : "New survey"}
            </Button>
          </>
        }
      />

      <Tabs defaultValue="surveys">
        <TabsList className="w-full justify-start overflow-x-auto no-scrollbar">
          <TabsTrigger value="surveys" className="whitespace-nowrap shrink-0">{t("tab.surveys")}</TabsTrigger>
          <TabsTrigger value="sentiment" className="whitespace-nowrap shrink-0">{t("tab.sentiment")}</TabsTrigger>
          <TabsTrigger value="themes" className="whitespace-nowrap shrink-0">{t("tab.themes")}</TabsTrigger>
          <TabsTrigger value="closed" className="whitespace-nowrap shrink-0">{t("tab.closedLoop")}</TabsTrigger>
        </TabsList>

        <TabsContent value="surveys" className="mt-6">
          <Card className="shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/40">
                  <tr>
                    <th className="text-start px-4 py-3 font-medium">{lang === "ar" ? "الاستبيان" : "Survey"}</th>
                    <th className="text-start px-4 py-3 font-medium">{lang === "ar" ? "النوع" : "Type"}</th>
                    <th className="text-start px-4 py-3 font-medium">{lang === "ar" ? "الفئة" : "Audience"}</th>
                    <th className="text-start px-4 py-3 font-medium">{lang === "ar" ? "الردود" : "Responses"}</th>
                    <th className="text-start px-4 py-3 font-medium">{lang === "ar" ? "معدل الرد" : "Response rate"}</th>
                    <th className="text-start px-4 py-3 font-medium">{lang === "ar" ? "النتيجة" : "Score"}</th>
                    <th className="text-start px-4 py-3 font-medium">{t("common.status")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {surveys.map((s) => (
                    <tr key={s.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3 font-medium">{pick(s.name)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.type}</td>
                      <td className="px-4 py-3 text-muted-foreground">{pick(s.audience)}</td>
                      <td className="px-4 py-3 tabular-nums">{s.responses.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden flex-1">
                            <div className="h-full bg-primary" style={{ width: `${s.responseRate}%` }} />
                          </div>
                          <span className="text-[11px] tabular-nums text-muted-foreground">{s.responseRate.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold tabular-nums">{s.score}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${s.isActive ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-slate-50 text-slate-600 ring-slate-200"}`}>
                          {pick(s.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment" className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="shadow-card">
            <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold">{t("chart.sentiment")}</CardTitle></CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={SENTIMENT_BREAKDOWN} dataKey="value" nameKey="key" innerRadius={50} outerRadius={84} stroke="white" strokeWidth={2} paddingAngle={2}>
                      {SENTIMENT_BREAKDOWN.map((d) => (
                        <Cell key={d.key} fill={SENT_COLOR[d.key]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: number, _: any, p: any) => [`${v}%`, t("sentiment." + p.payload.key)]}
                      contentStyle={{ background: "white", borderRadius: 10, border: "1px solid #E5E7EB", fontSize: 12 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {SENTIMENT_BREAKDOWN.map((d) => (
                  <div key={d.key} className="text-center">
                    <p className="text-lg font-semibold tabular-nums">{d.value}%</p>
                    <p className="text-[11px] text-muted-foreground">{t("sentiment." + d.key)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card lg:col-span-2">
            <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold">{lang === "ar" ? "اتجاه المشاعر — ١٢ أسبوعاً" : "Sentiment trend — 12 weeks"}</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-12 gap-1 h-56 items-end">
                {Array.from({ length: 12 }).map((_, i) => {
                  const pos = 50 + Math.sin(i * 0.6) * 8 + i;
                  const neu = 25 + Math.cos(i * 0.4) * 6;
                  const neg = 100 - pos - neu;
                  return (
                    <div key={i} className="flex flex-col h-full justify-end gap-0">
                      <div className="bg-rose-400" style={{ height: `${neg}%` }} />
                      <div className="bg-amber-400" style={{ height: `${neu}%` }} />
                      <div className="bg-emerald-500 rounded-t-sm" style={{ height: `${pos}%` }} />
                      <p className="text-[9px] text-muted-foreground text-center mt-1">W{i + 1}</p>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-3 mt-3 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> {t("sentiment.positive")}</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400" /> {t("sentiment.neutral")}</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-400" /> {t("sentiment.negative")}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="themes" className="mt-6">
          <Card className="shadow-card">
            <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold">{t("chart.themes")}</CardTitle></CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {TOP_THEMES.map((th) => (
                  <li key={th.theme.en} className="flex items-center gap-3 py-1">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{pick(th.theme)}</p>
                      <div className="mt-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            background: SENT_COLOR[th.sentiment],
                            width: `${Math.min(100, (th.mentions / 124) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                    <SentimentChip s={th.sentiment} />
                    <span className="text-[11px] text-muted-foreground tabular-nums w-10 text-end">{th.mentions}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="closed" className="mt-6">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">
                {lang === "ar" ? "متابعة الحلقة المغلقة — ردود سلبية تحتاج إجراء" : "Closed-loop queue — detractors needing action"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-border">
                {CLOSED_LOOP.map((cl) => (
                  <li key={cl.id} className="py-3 flex items-start gap-3">
                    <span className="h-9 w-9 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center text-[11px] font-semibold ring-1 ring-rose-200">
                      {cl.score}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{pick(cl.customer.name)}</p>
                      <p className="text-[12px] text-muted-foreground mt-0.5 line-clamp-2">{pick(cl.comment)}</p>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        {lang === "ar" ? "موعد المتابعة" : "Due"}: {cl.due} · {pick(cl.owner)}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">{lang === "ar" ? "تواصل" : "Reach out"}</Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Manage surveys dialog */}
      <Dialog open={manageOpen} onOpenChange={setManageOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t("voc.editor.title")}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted-foreground">{surveys.length} {lang === "ar" ? "استبيانات" : "surveys"}</p>
            <Button size="sm" onClick={() => { addSurvey(); toast({ title: t("voc.new") }); }} data-testid="button-add-survey">
              <Plus size={14} className="me-1.5" />
              {t("voc.new")}
            </Button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto rounded-md border border-border">
            <table className="w-full text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/40">
                <tr>
                  <th className="text-start px-3 py-2">{lang === "ar" ? "الاسم" : "Name"}</th>
                  <th className="text-start px-3 py-2">{t("voc.survey.channel")}</th>
                  <th className="text-center px-3 py-2">{t("voc.survey.questions")}</th>
                  <th className="text-center px-3 py-2">{t("voc.survey.active")}</th>
                  <th className="text-end px-3 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {surveys.map((s) => (
                  <tr key={s.id}>
                    <td className="px-3 py-2">
                      <div className="font-medium">{pick(s.name)}</div>
                      <div className="text-[11px] text-muted-foreground">{pick(s.audience)}</div>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{s.channel}</td>
                    <td className="px-3 py-2 text-center tabular-nums">{s.questions.length}</td>
                    <td className="px-3 py-2 text-center">
                      <Switch checked={s.isActive} onCheckedChange={() => toggleActive(s.id)} />
                    </td>
                    <td className="px-3 py-2 text-end">
                      <Button size="sm" variant="ghost" onClick={() => setEditing(s)}><Pencil size={14} /></Button>
                      <Button size="sm" variant="ghost" onClick={() => { if (confirm(lang === "ar" ? "حذف الاستبيان؟" : "Delete survey?")) deleteSurvey(s.id); }}>
                        <Trash2 size={14} className="text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setManageOpen(false)}>{t("common.close")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit a single survey */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{lang === "ar" ? "تحرير الاستبيان" : "Edit survey"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">{lang === "ar" ? "الاسم (EN)" : "Name (EN)"}</Label>
                <Input value={editing.name.en} onChange={(e) => setEditing({ ...editing, name: { ...editing.name, en: e.target.value } })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{lang === "ar" ? "الاسم (AR)" : "Name (AR)"}</Label>
                <Input dir="rtl" value={editing.name.ar} onChange={(e) => setEditing({ ...editing, name: { ...editing.name, ar: e.target.value } })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{t("voc.survey.channel")}</Label>
                <Select value={editing.channel} onValueChange={(v) => setEditing({ ...editing, channel: v as SurveyChannel })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="in-app">In-app</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{lang === "ar" ? "النوع" : "Type"}</Label>
                <Select value={editing.type} onValueChange={(v) => setEditing({ ...editing, type: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CSAT">CSAT</SelectItem>
                    <SelectItem value="NPS">NPS</SelectItem>
                    <SelectItem value="CES">CES</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>{t("common.cancel")}</Button>
            <Button onClick={() => { if (editing) { editSurvey(editing.id, editing); toast({ title: t("common.save") }); setEditing(null); } }}>{t("common.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
