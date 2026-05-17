import { useState, useMemo } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useJourneys } from "@/contexts/JourneyContext";
import { PageHeader } from "@/components/brand/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ADMIN_USERS,
  SLA_POLICIES,
  ESCALATION_MATRIX,
  PERMISSIONS_MATRIX,
} from "@/lib/seed";
import { useChannels, setChannels } from "@/lib/channelsStore";
import {
  useRolePerms,
  setRolePerms,
  resetRolePerms,
  PAGES,
  ROLES,
  type Page,
} from "@/lib/rolePermissionsStore";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Mail,
  Globe,
  MessageCircle,
  Phone,
  Twitter,
  Smartphone,
  MapPin,
  Settings,
  Pencil,
  Trash2,
  Upload,
  Download,
  Route as RouteIcon,
  Gauge,
  Megaphone,
  ArrowLeftRight,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─────────────────────────── Page ─────────────────────────── */
export default function Admin() {
  const { t, lang } = useLocale();

  return (
    <div>
      <PageHeader
        Icon={Settings}
        title={t("nav.admin")}
        eyebrow={lang === "ar" ? "إدارة المنصة" : "Platform Administration"}
        subtitle={
          lang === "ar"
            ? "إدارة الرحلات والمؤشرات والاستشارات والمبادرات والمستخدمين — جميع التغييرات تُحفظ في قاعدة البيانات."
            : "Manage journeys, KPIs, consultations, initiatives & users — every change persists to the database."
        }
      />

      <Tabs defaultValue="journeys">
        <TabsList className="h-auto w-full justify-start overflow-x-auto no-scrollbar p-1">
          <TabsTrigger value="journeys" className="whitespace-nowrap shrink-0">
            {lang === "ar" ? "الرحلات" : "Journeys"}
          </TabsTrigger>
          <TabsTrigger value="kpis" className="whitespace-nowrap shrink-0">
            {lang === "ar" ? "المؤشرات" : "KPIs"}
          </TabsTrigger>
          <TabsTrigger value="consultations" className="whitespace-nowrap shrink-0">
            {lang === "ar" ? "الاستشارات العامة" : "Consultations"}
          </TabsTrigger>
          <TabsTrigger value="initiatives" className="whitespace-nowrap shrink-0">
            {lang === "ar" ? "المبادرات" : "Initiatives"}
          </TabsTrigger>
          <TabsTrigger value="beforeafter" className="whitespace-nowrap shrink-0">
            {lang === "ar" ? "قبل / بعد" : "Before / After"}
          </TabsTrigger>
          <TabsTrigger value="users" className="whitespace-nowrap shrink-0">
            {t("admin.tab.users")}
          </TabsTrigger>
          <TabsTrigger value="roles" className="whitespace-nowrap shrink-0">{t("admin.tab.roles")}</TabsTrigger>
          <TabsTrigger value="rolePerms" className="whitespace-nowrap shrink-0">{t("admin.tab.rolePerms")}</TabsTrigger>
          <TabsTrigger value="channels" className="whitespace-nowrap shrink-0">{t("admin.tab.channels")}</TabsTrigger>
          <TabsTrigger value="contact" className="whitespace-nowrap shrink-0">{t("admin.tab.contact")}</TabsTrigger>
          <TabsTrigger value="sla" className="whitespace-nowrap shrink-0">{t("admin.tab.sla")}</TabsTrigger>
          <TabsTrigger value="escalation" className="whitespace-nowrap shrink-0">{t("admin.tab.escalation")}</TabsTrigger>
        </TabsList>

        <TabsContent value="journeys" className="mt-6">
          <JourneysAdmin />
        </TabsContent>
        <TabsContent value="kpis" className="mt-6">
          <KpisAdmin />
        </TabsContent>
        <TabsContent value="consultations" className="mt-6">
          <ConsultationsAdmin />
        </TabsContent>
        <TabsContent value="initiatives" className="mt-6">
          <InitiativesAdmin />
        </TabsContent>
        <TabsContent value="beforeafter" className="mt-6">
          <BeforeAfterAdmin />
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <UsersAdmin />
        </TabsContent>

        <TabsContent value="roles" className="mt-6">
          <Card className="shadow-card overflow-x-auto">
            <CardContent className="p-0">
              <table className="w-full text-sm min-w-[640px]">
                <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/40">
                  <tr>
                    <th className="text-start px-4 py-3 font-medium">{lang === "ar" ? "الوحدة" : "Module"}</th>
                    <th className="text-center px-4 py-3 font-medium">{t("role.executive")}</th>
                    <th className="text-center px-4 py-3 font-medium">{t("role.supervisor")}</th>
                    <th className="text-center px-4 py-3 font-medium">{t("role.agent")}</th>
                    <th className="text-center px-4 py-3 font-medium">{t("role.quality")}</th>
                    <th className="text-center px-4 py-3 font-medium">{t("role.customer")}</th>
                    <th className="text-center px-4 py-3 font-medium">{t("role.admin")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {PERMISSIONS_MATRIX.map((r) => (
                    <tr key={r.module}>
                      <td className="px-4 py-2.5 font-medium">{t("nav." + r.module)}</td>
                      {["executive", "supervisor", "agent", "quality", "customer", "admin"].map((role) => (
                        <td key={role} className="px-4 py-2.5 text-center">
                          <PermPill value={(r as any)[role]} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rolePerms" className="mt-6">
          <RolePermissionsAdmin />
        </TabsContent>

        <TabsContent value="contact" className="mt-6">
          <ContactChannelsAdmin />
        </TabsContent>

        <TabsContent value="channels" className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { Icon: Globe, key: "channel.web", on: true },
            { Icon: Mail, key: "channel.email", on: true },
            { Icon: MessageCircle, key: "channel.whatsapp", on: true },
            { Icon: Phone, key: "channel.phone", on: true },
            { Icon: Twitter, key: "channel.twitter", on: true },
            { Icon: Smartphone, key: "channel.app", on: true },
            { Icon: MapPin, key: "channel.walkin", on: false },
          ].map((c) => (
            <Card key={c.key} className="shadow-card">
              <CardContent className="p-4 flex items-center gap-3">
                <span className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <c.Icon size={16} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{t(c.key)}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {c.on ? (lang === "ar" ? "متصل" : "Connected") : (lang === "ar" ? "غير متصل" : "Not connected")}
                  </p>
                </div>
                <span className={cn("inline-flex h-5 w-9 rounded-full transition-colors p-0.5 items-center", c.on ? "bg-emerald-500" : "bg-muted")}>
                  <span className={cn("h-4 w-4 bg-white rounded-full shadow transition-transform", c.on ? "translate-x-4" : "")} />
                </span>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="sla" className="mt-6">
          <Card className="shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/40">
                  <tr>
                    <th className="text-start px-4 py-3 font-medium">{lang === "ar" ? "السياسة" : "Policy"}</th>
                    <th className="text-start px-4 py-3 font-medium">{t("priority.low")}</th>
                    <th className="text-start px-4 py-3 font-medium">{t("priority.medium")}</th>
                    <th className="text-start px-4 py-3 font-medium">{t("priority.high")}</th>
                    <th className="text-start px-4 py-3 font-medium">{t("priority.urgent")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {SLA_POLICIES.map((p) => (
                    <tr key={p.id}>
                      <td className="px-4 py-3 font-medium">{lang === "ar" ? p.name_ar : p.name_en}</td>
                      <td className="px-4 py-3 tabular-nums">{p.low} h</td>
                      <td className="px-4 py-3 tabular-nums">{p.medium} h</td>
                      <td className="px-4 py-3 tabular-nums">{p.high} h</td>
                      <td className="px-4 py-3 tabular-nums text-rose-600 font-semibold">{p.urgent} h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="escalation" className="mt-6">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                {ESCALATION_MATRIX.map((tier, i) => (
                  <div key={tier.tier} className="flex items-center gap-3 flex-1 min-w-[220px]">
                    <div className="flex-1 rounded-xl border border-border p-4 bg-card">
                      <p className="eyebrow text-muted-foreground">
                        {lang === "ar" ? `المستوى ${tier.tier}` : `Tier ${tier.tier}`}
                      </p>
                      <p className="text-sm font-semibold mt-1">{lang === "ar" ? tier.role_ar : tier.role_en}</p>
                      <p className="text-[11px] text-muted-foreground mt-2 font-mono" dir="ltr">
                        {lang === "ar" ? tier.threshold_ar : tier.threshold_en}
                      </p>
                    </div>
                    {i < ESCALATION_MATRIX.length - 1 && <span className="text-muted-foreground hidden sm:inline">→</span>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ─────────────────────────── Journeys Admin ─────────────────────────── */
function JourneysAdmin() {
  const { lang } = useLocale();
  const { journeys, updateJourney, deleteJourney, addJourney } = useJourneys();
  const { toast } = useToast();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title_en: "", title_ar: "", subtitle_en: "", subtitle_ar: "", owner_en: "", owner_ar: "" });

  function openNew() {
    setEditing("__new__");
    setForm({ title_en: "", title_ar: "", subtitle_en: "", subtitle_ar: "", owner_en: "General Authority for Competition", owner_ar: "الهيئة العامة للمنافسة" });
  }
  function openEdit(id: string) {
    const j = journeys.find((x) => x.id === id);
    if (!j) return;
    setEditing(id);
    setForm({
      title_en: j.title.en, title_ar: j.title.ar,
      subtitle_en: j.subtitle.en, subtitle_ar: j.subtitle.ar,
      owner_en: j.owner.en, owner_ar: j.owner.ar,
    });
  }
  function save() {
    const patch = {
      title: { en: form.title_en, ar: form.title_ar },
      subtitle: { en: form.subtitle_en, ar: form.subtitle_ar },
      owner: { en: form.owner_en, ar: form.owner_ar },
    };
    if (editing === "__new__") {
      addJourney({
        icon: "Sparkles",
        ...patch,
        types: [{ ar: "خدمة", en: "Service" }],
        outcomes: [{ ar: "إنجاز", en: "Completed" }],
        stages: [],
      } as any);
      toast({ title: lang === "ar" ? "تمت إضافة الرحلة" : "Journey added" });
    } else if (editing) {
      updateJourney(editing, patch as any);
      toast({ title: lang === "ar" ? "تم الحفظ" : "Saved" });
    }
    setEditing(null);
  }
  function remove(id: string) {
    if (!confirm(lang === "ar" ? "حذف الرحلة؟" : "Delete journey?")) return;
    deleteJourney(id);
    toast({ title: lang === "ar" ? "تم الحذف" : "Deleted" });
  }

  function exportCsv() {
    const rows = [["id", "title_en", "title_ar", "subtitle_en", "subtitle_ar", "owner_en", "owner_ar", "stages"]];
    for (const j of journeys) {
      rows.push([j.id, j.title.en, j.title.ar, j.subtitle.en, j.subtitle.ar, j.owner.en, j.owner.ar, String(j.stages.length)]);
    }
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "journeys.csv";
    a.click();
  }

  return (
    <Card className="shadow-card overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="eyebrow text-muted-foreground">{lang === "ar" ? "إدارة" : "Manage"}</p>
          <h3 className="text-base font-semibold tracking-tight">
            {journeys.length} {lang === "ar" ? "رحلة خدمة" : "service journeys"}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={exportCsv} data-testid="button-export-journeys-csv">
            <Download size={14} className="me-1.5" />
            {lang === "ar" ? "تصدير CSV" : "Export CSV"}
          </Button>
          <Button size="sm" onClick={openNew} data-testid="button-new-journey">
            <Plus size={14} className="me-1.5" />
            {lang === "ar" ? "رحلة جديدة" : "New journey"}
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/40">
            <tr>
              <th className="text-start px-4 py-3 font-medium">{lang === "ar" ? "العنوان" : "Title"}</th>
              <th className="text-start px-4 py-3 font-medium">{lang === "ar" ? "الجهة" : "Owner"}</th>
              <th className="text-center px-4 py-3 font-medium">{lang === "ar" ? "المراحل" : "Stages"}</th>
              <th className="text-center px-4 py-3 font-medium">{lang === "ar" ? "الأنواع" : "Types"}</th>
              <th className="text-end px-4 py-3 font-medium">{lang === "ar" ? "إجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {journeys.map((j) => (
              <tr key={j.id} className="hover:bg-muted/30">
                <td className="px-4 py-2.5">
                  <div className="font-medium">{lang === "ar" ? j.title.ar : j.title.en}</div>
                  <div className="text-[11px] text-muted-foreground truncate max-w-md">{lang === "ar" ? j.subtitle.ar : j.subtitle.en}</div>
                </td>
                <td className="px-4 py-2.5 text-muted-foreground text-[12px]">{lang === "ar" ? j.owner.ar : j.owner.en}</td>
                <td className="px-4 py-2.5 text-center tabular-nums">{j.stages.length}</td>
                <td className="px-4 py-2.5 text-center tabular-nums">{j.types.length}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center justify-end gap-1">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(j.id)} data-testid={`button-edit-journey-${j.id}`}>
                      <Pencil size={14} />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => remove(j.id)} data-testid={`button-delete-journey-${j.id}`}>
                      <Trash2 size={14} className="text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editing === "__new__"
                ? (lang === "ar" ? "رحلة جديدة" : "New journey")
                : (lang === "ar" ? "تعديل رحلة" : "Edit journey")}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <BiField label_en="Title (EN)" label_ar="العنوان (EN)" lang={lang}>
              <Input value={form.title_en} onChange={(e) => setForm((f) => ({ ...f, title_en: e.target.value }))} data-testid="input-journey-title-en" />
            </BiField>
            <BiField label_en="Title (AR)" label_ar="العنوان (AR)" lang={lang}>
              <Input value={form.title_ar} dir="rtl" onChange={(e) => setForm((f) => ({ ...f, title_ar: e.target.value }))} data-testid="input-journey-title-ar" />
            </BiField>
            <BiField label_en="Subtitle (EN)" label_ar="الوصف (EN)" lang={lang}>
              <Textarea rows={2} value={form.subtitle_en} onChange={(e) => setForm((f) => ({ ...f, subtitle_en: e.target.value }))} data-testid="input-journey-subtitle-en" />
            </BiField>
            <BiField label_en="Subtitle (AR)" label_ar="الوصف (AR)" lang={lang}>
              <Textarea rows={2} dir="rtl" value={form.subtitle_ar} onChange={(e) => setForm((f) => ({ ...f, subtitle_ar: e.target.value }))} data-testid="input-journey-subtitle-ar" />
            </BiField>
            <BiField label_en="Owner (EN)" label_ar="الجهة (EN)" lang={lang}>
              <Input value={form.owner_en} onChange={(e) => setForm((f) => ({ ...f, owner_en: e.target.value }))} />
            </BiField>
            <BiField label_en="Owner (AR)" label_ar="الجهة (AR)" lang={lang}>
              <Input dir="rtl" value={form.owner_ar} onChange={(e) => setForm((f) => ({ ...f, owner_ar: e.target.value }))} />
            </BiField>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>{lang === "ar" ? "إلغاء" : "Cancel"}</Button>
            <Button onClick={save} data-testid="button-save-journey">{lang === "ar" ? "حفظ" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

/* ─────────────────────────── KPIs Admin ─────────────────────────── */
type KpiRow = {
  id: string; label_en: string; label_ar: string; value: string;
  delta: string; unit: string; target: string; inverted: boolean; category: string;
};

function KpisAdmin() {
  const { lang } = useLocale();
  const { toast } = useToast();
  const { data: kpis = [], isLoading } = useQuery<KpiRow[]>({ queryKey: ["/api/kpis"] });
  const [editing, setEditing] = useState<KpiRow | null>(null);

  const upsert = useMutation({
    mutationFn: async (k: KpiRow) => (await apiRequest("POST", "/api/kpis", k)).json(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/kpis"] });
      toast({ title: lang === "ar" ? "تم الحفظ" : "Saved" });
      setEditing(null);
    },
  });
  const del = useMutation({
    mutationFn: async (id: string) => (await apiRequest("DELETE", `/api/kpis/${id}`)).json(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/kpis"] }),
  });

  function openNew() {
    setEditing({ id: "", label_en: "", label_ar: "", value: "", delta: "", unit: "", target: "", inverted: false, category: "experience" });
  }

  return (
    <Card className="shadow-card overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <div>
          <p className="eyebrow text-muted-foreground">{lang === "ar" ? "إدارة" : "Manage"}</p>
          <h3 className="text-base font-semibold tracking-tight">
            {kpis.length} {lang === "ar" ? "مؤشر أداء" : "KPIs"}
          </h3>
        </div>
        <Button size="sm" onClick={openNew} data-testid="button-new-kpi">
          <Plus size={14} className="me-1.5" />
          {lang === "ar" ? "مؤشر جديد" : "New KPI"}
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/40">
            <tr>
              <th className="text-start px-4 py-3 font-medium">ID</th>
              <th className="text-start px-4 py-3 font-medium">{lang === "ar" ? "الوصف" : "Label"}</th>
              <th className="text-start px-4 py-3 font-medium">{lang === "ar" ? "القيمة" : "Value"}</th>
              <th className="text-start px-4 py-3 font-medium">Δ</th>
              <th className="text-start px-4 py-3 font-medium">{lang === "ar" ? "الهدف" : "Target"}</th>
              <th className="text-end px-4 py-3 font-medium">{lang === "ar" ? "إجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && <tr><td colSpan={6} className="px-4 py-6 text-center text-muted-foreground text-[12px]">…</td></tr>}
            {!isLoading && kpis.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-muted-foreground text-[12px]">
                {lang === "ar" ? "لا توجد مؤشرات بعد. أضف أول مؤشر." : "No KPIs yet. Add your first one."}
              </td></tr>
            )}
            {kpis.map((k) => (
              <tr key={k.id} className="hover:bg-muted/30">
                <td className="px-4 py-2.5 font-mono text-[11px]">{k.id}</td>
                <td className="px-4 py-2.5">{lang === "ar" ? k.label_ar : k.label_en}</td>
                <td className="px-4 py-2.5 tabular-nums">{k.value}{k.unit}</td>
                <td className="px-4 py-2.5 tabular-nums">{k.delta}</td>
                <td className="px-4 py-2.5 tabular-nums text-muted-foreground">{k.target}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center justify-end gap-1">
                    <Button size="sm" variant="ghost" onClick={() => setEditing(k)}><Pencil size={14} /></Button>
                    <Button size="sm" variant="ghost" onClick={() => confirm("Delete?") && del.mutate(k.id)}>
                      <Trash2 size={14} className="text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{lang === "ar" ? "مؤشر أداء" : "KPI"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="grid grid-cols-2 gap-3">
              <BiField label_en="ID (e.g. csat)" label_ar="المعرّف" lang={lang}>
                <Input value={editing.id} onChange={(e) => setEditing({ ...editing, id: e.target.value })} />
              </BiField>
              <BiField label_en="Category" label_ar="الفئة" lang={lang}>
                <Input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
              </BiField>
              <BiField label_en="Label (EN)" label_ar="الوصف (EN)" lang={lang}>
                <Input value={editing.label_en} onChange={(e) => setEditing({ ...editing, label_en: e.target.value })} />
              </BiField>
              <BiField label_en="Label (AR)" label_ar="الوصف (AR)" lang={lang}>
                <Input dir="rtl" value={editing.label_ar} onChange={(e) => setEditing({ ...editing, label_ar: e.target.value })} />
              </BiField>
              <BiField label_en="Value" label_ar="القيمة" lang={lang}>
                <Input value={editing.value} onChange={(e) => setEditing({ ...editing, value: e.target.value })} />
              </BiField>
              <BiField label_en="Unit" label_ar="الوحدة" lang={lang}>
                <Input value={editing.unit} onChange={(e) => setEditing({ ...editing, unit: e.target.value })} />
              </BiField>
              <BiField label_en="Delta" label_ar="التغير" lang={lang}>
                <Input value={editing.delta} onChange={(e) => setEditing({ ...editing, delta: e.target.value })} />
              </BiField>
              <BiField label_en="Target" label_ar="الهدف" lang={lang}>
                <Input value={editing.target} onChange={(e) => setEditing({ ...editing, target: e.target.value })} />
              </BiField>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>{lang === "ar" ? "إلغاء" : "Cancel"}</Button>
            <Button onClick={() => editing && upsert.mutate(editing)} disabled={!editing?.id}>
              {lang === "ar" ? "حفظ" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

/* ─────────────────────────── Consultations Admin ─────────────────────────── */
type ConsultationRow = {
  id: string; title_en: string; title_ar: string; summary_en: string; summary_ar: string;
  status: string; opensAt: string; closesAt: string; participants: number; responses: number; url: string;
};

function ConsultationsAdmin() {
  const { lang } = useLocale();
  const { toast } = useToast();
  const { data: rows = [], isLoading } = useQuery<ConsultationRow[]>({ queryKey: ["/api/consultations"] });
  const [editing, setEditing] = useState<ConsultationRow | null>(null);

  const upsert = useMutation({
    mutationFn: async (r: ConsultationRow) => (await apiRequest("POST", "/api/consultations", r)).json(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/consultations"] });
      toast({ title: lang === "ar" ? "تم الحفظ" : "Saved" });
      setEditing(null);
    },
  });
  const del = useMutation({
    mutationFn: async (id: string) => (await apiRequest("DELETE", `/api/consultations/${id}`)).json(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/consultations"] }),
  });

  function openNew() {
    setEditing({
      id: `c-${Date.now().toString(36)}`,
      title_en: "", title_ar: "", summary_en: "", summary_ar: "",
      status: "open", opensAt: "", closesAt: "", participants: 0, responses: 0, url: "",
    });
  }

  return (
    <Card className="shadow-card overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <div>
          <p className="eyebrow text-muted-foreground">{lang === "ar" ? "إدارة" : "Manage"}</p>
          <h3 className="text-base font-semibold tracking-tight">
            {rows.length} {lang === "ar" ? "استشارة عامة" : "public consultations"}
          </h3>
        </div>
        <Button size="sm" onClick={openNew}><Plus size={14} className="me-1.5" />{lang === "ar" ? "استشارة جديدة" : "New consultation"}</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/40">
            <tr>
              <th className="text-start px-4 py-3 font-medium">{lang === "ar" ? "العنوان" : "Title"}</th>
              <th className="text-start px-4 py-3 font-medium">{lang === "ar" ? "الحالة" : "Status"}</th>
              <th className="text-center px-4 py-3 font-medium">{lang === "ar" ? "مشاركون" : "Participants"}</th>
              <th className="text-end px-4 py-3 font-medium">{lang === "ar" ? "إجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {!isLoading && rows.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-muted-foreground text-[12px]">
                {lang === "ar" ? "لا توجد استشارات." : "No consultations yet."}
              </td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-muted/30">
                <td className="px-4 py-2.5 font-medium">{lang === "ar" ? r.title_ar : r.title_en}</td>
                <td className="px-4 py-2.5"><StatusPill v={r.status} /></td>
                <td className="px-4 py-2.5 text-center tabular-nums">{r.participants}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center justify-end gap-1">
                    <Button size="sm" variant="ghost" onClick={() => setEditing(r)}><Pencil size={14} /></Button>
                    <Button size="sm" variant="ghost" onClick={() => confirm("Delete?") && del.mutate(r.id)}>
                      <Trash2 size={14} className="text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>{lang === "ar" ? "استشارة" : "Consultation"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="grid grid-cols-2 gap-3">
              <BiField label_en="Title (EN)" label_ar="العنوان (EN)" lang={lang}>
                <Input value={editing.title_en} onChange={(e) => setEditing({ ...editing, title_en: e.target.value })} />
              </BiField>
              <BiField label_en="Title (AR)" label_ar="العنوان (AR)" lang={lang}>
                <Input dir="rtl" value={editing.title_ar} onChange={(e) => setEditing({ ...editing, title_ar: e.target.value })} />
              </BiField>
              <BiField label_en="Status" label_ar="الحالة" lang={lang}>
                <Select value={editing.status} onValueChange={(v) => setEditing({ ...editing, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">{lang === "ar" ? "مفتوحة" : "Open"}</SelectItem>
                    <SelectItem value="closed">{lang === "ar" ? "مغلقة" : "Closed"}</SelectItem>
                    <SelectItem value="published">{lang === "ar" ? "منشورة" : "Published"}</SelectItem>
                  </SelectContent>
                </Select>
              </BiField>
              <BiField label_en="Closes at" label_ar="تاريخ الإغلاق" lang={lang}>
                <Input type="date" value={editing.closesAt} onChange={(e) => setEditing({ ...editing, closesAt: e.target.value })} />
              </BiField>
              <BiField label_en="Participants" label_ar="عدد المشاركين" lang={lang}>
                <Input type="number" value={editing.participants} onChange={(e) => setEditing({ ...editing, participants: Number(e.target.value) })} />
              </BiField>
              <BiField label_en="Responses" label_ar="عدد الردود" lang={lang}>
                <Input type="number" value={editing.responses} onChange={(e) => setEditing({ ...editing, responses: Number(e.target.value) })} />
              </BiField>
              <BiField label_en="Summary (EN)" label_ar="الملخّص (EN)" lang={lang}>
                <Textarea rows={2} value={editing.summary_en} onChange={(e) => setEditing({ ...editing, summary_en: e.target.value })} />
              </BiField>
              <BiField label_en="Summary (AR)" label_ar="الملخّص (AR)" lang={lang}>
                <Textarea rows={2} dir="rtl" value={editing.summary_ar} onChange={(e) => setEditing({ ...editing, summary_ar: e.target.value })} />
              </BiField>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>{lang === "ar" ? "إلغاء" : "Cancel"}</Button>
            <Button onClick={() => editing && upsert.mutate(editing)} disabled={!editing?.id || !editing?.title_en}>
              {lang === "ar" ? "حفظ" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

/* ─────────────────────────── Initiatives Admin ─────────────────────────── */
type InitiativeRow = {
  id: string; title_en: string; title_ar: string; owner_en: string; owner_ar: string;
  status: string; priority: string; progress: number; startDate: string; endDate: string;
};

function InitiativesAdmin() {
  const { lang } = useLocale();
  const { toast } = useToast();
  const { data: rows = [], isLoading } = useQuery<InitiativeRow[]>({ queryKey: ["/api/initiatives"] });
  const [editing, setEditing] = useState<InitiativeRow | null>(null);

  const upsert = useMutation({
    mutationFn: async (r: InitiativeRow) => (await apiRequest("POST", "/api/initiatives", r)).json(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/initiatives"] });
      toast({ title: lang === "ar" ? "تم الحفظ" : "Saved" });
      setEditing(null);
    },
  });
  const del = useMutation({
    mutationFn: async (id: string) => (await apiRequest("DELETE", `/api/initiatives/${id}`)).json(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/initiatives"] }),
  });

  function openNew() {
    setEditing({
      id: `i-${Date.now().toString(36)}`, title_en: "", title_ar: "", owner_en: "", owner_ar: "",
      status: "planned", priority: "medium", progress: 0, startDate: "", endDate: "",
    });
  }

  return (
    <Card className="shadow-card overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <div>
          <p className="eyebrow text-muted-foreground">{lang === "ar" ? "إدارة" : "Manage"}</p>
          <h3 className="text-base font-semibold tracking-tight">
            {rows.length} {lang === "ar" ? "مبادرة تحسين" : "improvement initiatives"}
          </h3>
        </div>
        <Button size="sm" onClick={openNew}><Plus size={14} className="me-1.5" />{lang === "ar" ? "مبادرة جديدة" : "New initiative"}</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/40">
            <tr>
              <th className="text-start px-4 py-3 font-medium">{lang === "ar" ? "العنوان" : "Title"}</th>
              <th className="text-start px-4 py-3 font-medium">{lang === "ar" ? "الجهة" : "Owner"}</th>
              <th className="text-start px-4 py-3 font-medium">{lang === "ar" ? "الأولوية" : "Priority"}</th>
              <th className="text-start px-4 py-3 font-medium">{lang === "ar" ? "الحالة" : "Status"}</th>
              <th className="text-center px-4 py-3 font-medium">{lang === "ar" ? "التقدم" : "Progress"}</th>
              <th className="text-end px-4 py-3 font-medium">{lang === "ar" ? "إجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {!isLoading && rows.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-muted-foreground text-[12px]">
                {lang === "ar" ? "لا توجد مبادرات بعد." : "No initiatives yet."}
              </td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-muted/30">
                <td className="px-4 py-2.5 font-medium">{lang === "ar" ? r.title_ar : r.title_en}</td>
                <td className="px-4 py-2.5 text-muted-foreground text-[12px]">{lang === "ar" ? r.owner_ar : r.owner_en}</td>
                <td className="px-4 py-2.5"><StatusPill v={r.priority} /></td>
                <td className="px-4 py-2.5"><StatusPill v={r.status} /></td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden min-w-[60px]">
                      <div className="h-full bg-primary" style={{ width: `${r.progress}%` }} />
                    </div>
                    <span className="text-[11px] tabular-nums text-muted-foreground">{r.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center justify-end gap-1">
                    <Button size="sm" variant="ghost" onClick={() => setEditing(r)}><Pencil size={14} /></Button>
                    <Button size="sm" variant="ghost" onClick={() => confirm("Delete?") && del.mutate(r.id)}>
                      <Trash2 size={14} className="text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{lang === "ar" ? "مبادرة" : "Initiative"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="grid grid-cols-2 gap-3">
              <BiField label_en="Title (EN)" label_ar="العنوان (EN)" lang={lang}>
                <Input value={editing.title_en} onChange={(e) => setEditing({ ...editing, title_en: e.target.value })} />
              </BiField>
              <BiField label_en="Title (AR)" label_ar="العنوان (AR)" lang={lang}>
                <Input dir="rtl" value={editing.title_ar} onChange={(e) => setEditing({ ...editing, title_ar: e.target.value })} />
              </BiField>
              <BiField label_en="Owner (EN)" label_ar="الجهة (EN)" lang={lang}>
                <Input value={editing.owner_en} onChange={(e) => setEditing({ ...editing, owner_en: e.target.value })} />
              </BiField>
              <BiField label_en="Owner (AR)" label_ar="الجهة (AR)" lang={lang}>
                <Input dir="rtl" value={editing.owner_ar} onChange={(e) => setEditing({ ...editing, owner_ar: e.target.value })} />
              </BiField>
              <BiField label_en="Status" label_ar="الحالة" lang={lang}>
                <Select value={editing.status} onValueChange={(v) => setEditing({ ...editing, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">{lang === "ar" ? "مخططة" : "Planned"}</SelectItem>
                    <SelectItem value="in-progress">{lang === "ar" ? "قيد التنفيذ" : "In progress"}</SelectItem>
                    <SelectItem value="completed">{lang === "ar" ? "مكتملة" : "Completed"}</SelectItem>
                    <SelectItem value="on-hold">{lang === "ar" ? "متوقفة" : "On hold"}</SelectItem>
                  </SelectContent>
                </Select>
              </BiField>
              <BiField label_en="Priority" label_ar="الأولوية" lang={lang}>
                <Select value={editing.priority} onValueChange={(v) => setEditing({ ...editing, priority: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{lang === "ar" ? "منخفضة" : "Low"}</SelectItem>
                    <SelectItem value="medium">{lang === "ar" ? "متوسطة" : "Medium"}</SelectItem>
                    <SelectItem value="high">{lang === "ar" ? "عالية" : "High"}</SelectItem>
                    <SelectItem value="urgent">{lang === "ar" ? "عاجلة" : "Urgent"}</SelectItem>
                  </SelectContent>
                </Select>
              </BiField>
              <BiField label_en="Progress %" label_ar="نسبة التقدم" lang={lang}>
                <Input type="number" min={0} max={100} value={editing.progress} onChange={(e) => setEditing({ ...editing, progress: Math.max(0, Math.min(100, Number(e.target.value))) })} />
              </BiField>
              <BiField label_en="End date" label_ar="تاريخ الانتهاء" lang={lang}>
                <Input type="date" value={editing.endDate} onChange={(e) => setEditing({ ...editing, endDate: e.target.value })} />
              </BiField>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>{lang === "ar" ? "إلغاء" : "Cancel"}</Button>
            <Button onClick={() => editing && upsert.mutate(editing)} disabled={!editing?.id || !editing?.title_en}>
              {lang === "ar" ? "حفظ" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

/* ─────────────────────────── Before / After Admin ─────────────────────────── */
type BeforeAfterRow = {
  id: string; service_en: string; service_ar: string;
  before_en: string; before_ar: string; after_en: string; after_ar: string;
  improvementPct: string; metric_en: string; metric_ar: string;
};

function BeforeAfterAdmin() {
  const { lang } = useLocale();
  const { toast } = useToast();
  const { data: rows = [], isLoading } = useQuery<BeforeAfterRow[]>({ queryKey: ["/api/before-after"] });
  const [editing, setEditing] = useState<BeforeAfterRow | null>(null);

  const upsert = useMutation({
    mutationFn: async (r: BeforeAfterRow) => (await apiRequest("POST", "/api/before-after", r)).json(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/before-after"] });
      toast({ title: lang === "ar" ? "تم الحفظ" : "Saved" });
      setEditing(null);
    },
  });
  const del = useMutation({
    mutationFn: async (id: string) => (await apiRequest("DELETE", `/api/before-after/${id}`)).json(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/before-after"] }),
  });

  function openNew() {
    setEditing({
      id: `ba-${Date.now().toString(36)}`,
      service_en: "", service_ar: "", before_en: "", before_ar: "", after_en: "", after_ar: "",
      improvementPct: "", metric_en: "", metric_ar: "",
    });
  }

  return (
    <Card className="shadow-card overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <div>
          <p className="eyebrow text-muted-foreground">{lang === "ar" ? "إدارة" : "Manage"}</p>
          <h3 className="text-base font-semibold tracking-tight">
            {rows.length} {lang === "ar" ? "حالة قبل / بعد" : "before / after cases"}
          </h3>
        </div>
        <Button size="sm" onClick={openNew}><Plus size={14} className="me-1.5" />{lang === "ar" ? "حالة جديدة" : "New case"}</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/40">
            <tr>
              <th className="text-start px-4 py-3 font-medium">{lang === "ar" ? "الخدمة" : "Service"}</th>
              <th className="text-start px-4 py-3 font-medium">{lang === "ar" ? "المقياس" : "Metric"}</th>
              <th className="text-center px-4 py-3 font-medium">{lang === "ar" ? "التحسّن" : "Improvement"}</th>
              <th className="text-end px-4 py-3 font-medium">{lang === "ar" ? "إجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {!isLoading && rows.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-muted-foreground text-[12px]">
                {lang === "ar" ? "لا توجد حالات بعد." : "No cases yet."}
              </td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-muted/30">
                <td className="px-4 py-2.5 font-medium">{lang === "ar" ? r.service_ar : r.service_en}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{lang === "ar" ? r.metric_ar : r.metric_en}</td>
                <td className="px-4 py-2.5 text-center font-semibold text-primary">{r.improvementPct}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center justify-end gap-1">
                    <Button size="sm" variant="ghost" onClick={() => setEditing(r)}><Pencil size={14} /></Button>
                    <Button size="sm" variant="ghost" onClick={() => confirm("Delete?") && del.mutate(r.id)}>
                      <Trash2 size={14} className="text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>{lang === "ar" ? "حالة قبل / بعد" : "Before / After case"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="grid grid-cols-2 gap-3">
              <BiField label_en="Service (EN)" label_ar="الخدمة (EN)" lang={lang}>
                <Input value={editing.service_en} onChange={(e) => setEditing({ ...editing, service_en: e.target.value })} />
              </BiField>
              <BiField label_en="Service (AR)" label_ar="الخدمة (AR)" lang={lang}>
                <Input dir="rtl" value={editing.service_ar} onChange={(e) => setEditing({ ...editing, service_ar: e.target.value })} />
              </BiField>
              <BiField label_en="Before (EN)" label_ar="قبل (EN)" lang={lang}>
                <Textarea rows={2} value={editing.before_en} onChange={(e) => setEditing({ ...editing, before_en: e.target.value })} />
              </BiField>
              <BiField label_en="After (EN)" label_ar="بعد (EN)" lang={lang}>
                <Textarea rows={2} value={editing.after_en} onChange={(e) => setEditing({ ...editing, after_en: e.target.value })} />
              </BiField>
              <BiField label_en="Improvement %" label_ar="نسبة التحسّن" lang={lang}>
                <Input value={editing.improvementPct} placeholder="e.g. -68%" onChange={(e) => setEditing({ ...editing, improvementPct: e.target.value })} />
              </BiField>
              <BiField label_en="Metric (EN)" label_ar="المقياس (EN)" lang={lang}>
                <Input value={editing.metric_en} onChange={(e) => setEditing({ ...editing, metric_en: e.target.value })} />
              </BiField>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>{lang === "ar" ? "إلغاء" : "Cancel"}</Button>
            <Button onClick={() => editing && upsert.mutate(editing)} disabled={!editing?.id || !editing?.service_en}>
              {lang === "ar" ? "حفظ" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

/* ─────────────────────────── Users Admin (hybrid: seed + API) ─────────────────────────── */
type AdminUserRow = {
  id: string; name_en: string; name_ar: string; email: string;
  role: string; function_en: string; function_ar: string; status: string;
};

function UsersAdmin() {
  const { t, lang } = useLocale();
  const { toast } = useToast();
  const { data: apiUsers = [] } = useQuery<AdminUserRow[]>({ queryKey: ["/api/admin-users"] });
  const [editing, setEditing] = useState<AdminUserRow | null>(null);

  // Merge seed + API users so we always see something useful out of the box.
  const merged = useMemo(() => {
    const seedRows: AdminUserRow[] = ADMIN_USERS.map((u: any) => ({
      id: u.id,
      name_en: u.name_en, name_ar: u.name_ar, email: u.email ?? "",
      role: u.role, function_en: u.function_en ?? "", function_ar: u.function_ar ?? "",
      status: u.status ?? "active",
    }));
    const map = new Map<string, AdminUserRow>();
    for (const r of seedRows) map.set(r.id, r);
    for (const r of apiUsers) map.set(r.id, r);
    return Array.from(map.values());
  }, [apiUsers]);

  const upsert = useMutation({
    mutationFn: async (r: AdminUserRow) => (await apiRequest("POST", "/api/admin-users", r)).json(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin-users"] });
      toast({ title: lang === "ar" ? "تم الحفظ" : "Saved" });
      setEditing(null);
    },
  });
  const del = useMutation({
    mutationFn: async (id: string) => (await apiRequest("DELETE", `/api/admin-users/${id}`)).json(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin-users"] }),
  });

  function openNew() {
    setEditing({
      id: `u-${Date.now().toString(36)}`, name_en: "", name_ar: "", email: "",
      role: "agent", function_en: "", function_ar: "", status: "active",
    });
  }

  return (
    <Card className="shadow-card overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <h3 className="text-base font-semibold tracking-tight">
          {merged.length} {lang === "ar" ? "مستخدمون" : "users"}
        </h3>
        <Button size="sm" onClick={openNew}><Plus size={14} className="me-1.5" />{lang === "ar" ? "مستخدم جديد" : "New user"}</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/40">
            <tr>
              <th className="text-start px-4 py-3 font-medium">{lang === "ar" ? "الاسم" : "Name"}</th>
              <th className="text-start px-4 py-3 font-medium">{t("common.role")}</th>
              <th className="text-start px-4 py-3 font-medium">{lang === "ar" ? "الوظيفة" : "Function"}</th>
              <th className="text-start px-4 py-3 font-medium">{t("common.status")}</th>
              <th className="text-end px-4 py-3 font-medium">{lang === "ar" ? "إجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {merged.map((u) => (
              <tr key={u.id} className="hover:bg-muted/40">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-semibold">
                      {(lang === "ar" ? u.name_ar : u.name_en).slice(0, 2)}
                    </span>
                    <span className="font-medium">{lang === "ar" ? u.name_ar : u.name_en}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5">{t("role." + u.role)}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{lang === "ar" ? u.function_ar : u.function_en}</td>
                <td className="px-4 py-2.5">
                  <span className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
                    u.status === "active" ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-amber-50 text-amber-700 ring-amber-200"
                  )}>
                    {u.status === "active"
                      ? (lang === "ar" ? "نشط" : "Active")
                      : (lang === "ar" ? "إجازة" : "On leave")}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center justify-end gap-1">
                    <Button size="sm" variant="ghost" onClick={() => setEditing(u)}><Pencil size={14} /></Button>
                    <Button size="sm" variant="ghost" onClick={() => confirm("Delete?") && del.mutate(u.id)}>
                      <Trash2 size={14} className="text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{lang === "ar" ? "مستخدم" : "User"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="grid grid-cols-2 gap-3">
              <BiField label_en="Name (EN)" label_ar="الاسم (EN)" lang={lang}>
                <Input value={editing.name_en} onChange={(e) => setEditing({ ...editing, name_en: e.target.value })} />
              </BiField>
              <BiField label_en="Name (AR)" label_ar="الاسم (AR)" lang={lang}>
                <Input dir="rtl" value={editing.name_ar} onChange={(e) => setEditing({ ...editing, name_ar: e.target.value })} />
              </BiField>
              <BiField label_en="Email" label_ar="البريد" lang={lang}>
                <Input type="email" value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} />
              </BiField>
              <BiField label_en="Role" label_ar="الدور" lang={lang}>
                <Select value={editing.role} onValueChange={(v) => setEditing({ ...editing, role: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["executive", "supervisor", "agent", "quality", "customer", "admin"].map((r) => (
                      <SelectItem key={r} value={r}>{t("role." + r)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </BiField>
              <BiField label_en="Function (EN)" label_ar="الوظيفة (EN)" lang={lang}>
                <Input value={editing.function_en} onChange={(e) => setEditing({ ...editing, function_en: e.target.value })} />
              </BiField>
              <BiField label_en="Function (AR)" label_ar="الوظيفة (AR)" lang={lang}>
                <Input dir="rtl" value={editing.function_ar} onChange={(e) => setEditing({ ...editing, function_ar: e.target.value })} />
              </BiField>
              <BiField label_en="Status" label_ar="الحالة" lang={lang}>
                <Select value={editing.status} onValueChange={(v) => setEditing({ ...editing, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{lang === "ar" ? "نشط" : "Active"}</SelectItem>
                    <SelectItem value="leave">{lang === "ar" ? "إجازة" : "On leave"}</SelectItem>
                  </SelectContent>
                </Select>
              </BiField>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>{lang === "ar" ? "إلغاء" : "Cancel"}</Button>
            <Button onClick={() => editing && upsert.mutate(editing)} disabled={!editing?.name_en}>
              {lang === "ar" ? "حفظ" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

/* ─────────────────────────── Small helpers ─────────────────────────── */
function BiField({ children, label_en, label_ar, lang }: { children: React.ReactNode; label_en: string; label_ar: string; lang: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] font-medium text-muted-foreground">
        {lang === "ar" ? label_ar : label_en}
      </Label>
      {children}
    </div>
  );
}

function StatusPill({ v }: { v: string }) {
  const tones: Record<string, string> = {
    open: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    closed: "bg-slate-50 text-slate-700 ring-slate-200",
    published: "bg-sky-50 text-sky-700 ring-sky-200",
    planned: "bg-slate-50 text-slate-700 ring-slate-200",
    "in-progress": "bg-amber-50 text-amber-700 ring-amber-200",
    completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    "on-hold": "bg-rose-50 text-rose-700 ring-rose-200",
    low: "bg-slate-50 text-slate-700 ring-slate-200",
    medium: "bg-sky-50 text-sky-700 ring-sky-200",
    high: "bg-amber-50 text-amber-700 ring-amber-200",
    urgent: "bg-rose-50 text-rose-700 ring-rose-200",
  };
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset capitalize",
      tones[v] || "bg-muted text-muted-foreground ring-border",
    )}>{v}</span>
  );
}

function PermPill({ value }: { value: string }) {
  const map: Record<string, string> = {
    admin: "bg-primary/15 text-primary ring-primary/20",
    write: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    read: "bg-muted text-muted-foreground ring-border",
    "—": "text-muted-foreground",
  };
  return (
    <span className={cn("inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset min-w-[58px]", map[value] || "")}>
      {value === "—" ? "—" : value}
    </span>
  );
}

/* ──────────── Contact Channels Admin (Round-2 #4b) ──────────── */
function ContactChannelsAdmin() {
  const { t, lang } = useLocale();
  const channels = useChannels();
  const { toast } = useToast();
  const [form, setForm] = useState(channels);

  return (
    <Card className="shadow-card">
      <CardContent className="p-6 space-y-4 max-w-xl">
        <div className="space-y-1.5">
          <Label className="text-xs">{t("admin.contact.whatsapp")}</Label>
          <Input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} dir="ltr" data-testid="input-contact-whatsapp" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">{t("admin.contact.email")}</Label>
          <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} dir="ltr" data-testid="input-contact-email" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">{t("admin.contact.hours")}</Label>
          <Input value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} data-testid="input-contact-hours" />
        </div>
        <div className="pt-2">
          <Button onClick={() => { setChannels(form); toast({ title: t("admin.contact.save") }); }} data-testid="button-save-contact">
            {t("admin.contact.save")}
          </Button>
        </div>
        <p className="text-[11px] text-muted-foreground pt-2">
          {lang === "ar"
            ? "تظهر هذه القيم في شريط مصادر صندوق الموظف."
            : "These values appear in the Inbox source banner."}
        </p>
      </CardContent>
    </Card>
  );
}

/* ──────────── Role Permissions Matrix (Round-2 #9) ──────────── */
function RolePermissionsAdmin() {
  const { t, lang } = useLocale();
  const { toast } = useToast();
  const perms = useRolePerms();
  const [draft, setDraft] = useState(perms);

  function toggle(role: typeof ROLES[number], page: Page) {
    if (role === "admin") return; // always allowed
    setDraft({
      ...draft,
      [role]: { ...draft[role], [page]: !draft[role][page] },
    });
  }

  return (
    <Card className="shadow-card">
      <CardContent className="p-0">
        <div className="px-5 py-3 border-b border-border flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold">{t("admin.tab.rolePerms")}</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">{t("admin.rolePerms.intro")}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => { resetRolePerms(); setDraft({ ...perms }); toast({ title: t("admin.rolePerms.reset") }); }}>
              {t("admin.rolePerms.reset")}
            </Button>
            <Button size="sm" onClick={() => { setRolePerms(draft); toast({ title: t("admin.rolePerms.save") }); }} data-testid="button-save-role-perms">
              {t("admin.rolePerms.save")}
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/40">
              <tr>
                <th className="text-start px-3 py-2 font-medium">{t("admin.rolePerms.role")}</th>
                {PAGES.map((p) => (
                  <th key={p} className="text-center px-2 py-2 font-medium whitespace-nowrap">{t("nav." + p.slice(1))}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ROLES.map((role) => (
                <tr key={role}>
                  <td className="px-3 py-2 font-medium whitespace-nowrap">{t("role." + role)}</td>
                  {PAGES.map((p) => {
                    const v = role === "admin" ? true : !!draft[role][p];
                    return (
                      <td key={p} className="px-2 py-2 text-center">
                        <Checkbox
                          checked={v}
                          disabled={role === "admin"}
                          onCheckedChange={() => toggle(role, p)}
                          data-testid={`perm-${role}-${p.slice(1)}`}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-border text-[11px] text-muted-foreground">
          {lang === "ar"
            ? "تتحدث القائمة الجانبية وحراس المسارات فوراً بناءً على هذه الإعدادات."
            : "Sidebar visibility and route guards update live based on these settings."}
        </div>
      </CardContent>
    </Card>
  );
}
