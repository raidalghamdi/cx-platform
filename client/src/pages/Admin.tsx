import { useLocale } from "@/contexts/LocaleContext";
import { PageHeader } from "@/components/brand/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ADMIN_USERS,
  SLA_POLICIES,
  ESCALATION_MATRIX,
  PERMISSIONS_MATRIX,
} from "@/lib/seed";
import { Plus, Mail, Globe, MessageCircle, Phone, Twitter, Smartphone, MapPin, Settings, Fingerprint, CreditCard, MessageSquare, HeartPulse, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Admin() {
  const { t, lang } = useLocale();

  return (
    <div>
      <PageHeader
        Icon={Settings}
        title={t("nav.admin")}
        subtitle={lang === "ar" ? "إدارة المستخدمين والصلاحيات والسياسات" : "Manage users, permissions, and policies"}
      />

      <Tabs defaultValue="users">
        <TabsList className="h-auto w-full justify-start overflow-x-auto no-scrollbar p-1">
          <TabsTrigger value="users" className="whitespace-nowrap shrink-0">{t("admin.tab.users")}</TabsTrigger>
          <TabsTrigger value="roles" className="whitespace-nowrap shrink-0">{t("admin.tab.roles")}</TabsTrigger>
          <TabsTrigger value="channels" className="whitespace-nowrap shrink-0">{t("admin.tab.channels")}</TabsTrigger>
          <TabsTrigger value="sla" className="whitespace-nowrap shrink-0">{t("admin.tab.sla")}</TabsTrigger>
          <TabsTrigger value="escalation" className="whitespace-nowrap shrink-0">{t("admin.tab.escalation")}</TabsTrigger>
          <TabsTrigger value="lookups" className="whitespace-nowrap shrink-0">{t("admin.tab.lookups")}</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <Card className="shadow-card overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold">{ADMIN_USERS.length} {lang === "ar" ? "مستخدمون" : "users"}</h3>
              <Button size="sm"><Plus size={14} className="me-1.5" />{lang === "ar" ? "مستخدم جديد" : "New user"}</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/40">
                  <tr>
                    <th className="text-start px-4 py-3 font-medium">{lang === "ar" ? "الاسم" : "Name"}</th>
                    <th className="text-start px-4 py-3 font-medium">{t("common.role")}</th>
                    <th className="text-start px-4 py-3 font-medium">{lang === "ar" ? "الوظيفة" : "Function"}</th>
                    <th className="text-start px-4 py-3 font-medium">{t("common.status")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {ADMIN_USERS.map((u) => (
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
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
                    {c.on
                      ? (lang === "ar" ? "متصل" : "Connected")
                      : (lang === "ar" ? "غير متصل" : "Not connected")}
                  </p>
                </div>
                <span className={cn(
                  "inline-flex h-5 w-9 rounded-full transition-colors p-0.5 items-center",
                  c.on ? "bg-emerald-500" : "bg-muted"
                )}>
                  <span className={cn(
                    "h-4 w-4 bg-white rounded-full shadow transition-transform",
                    c.on ? "translate-x-4" : ""
                  )} />
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
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {lang === "ar" ? `المستوى ${tier.tier}` : `Tier ${tier.tier}`}
                      </p>
                      <p className="text-sm font-semibold mt-1">{lang === "ar" ? tier.role_ar : tier.role_en}</p>
                      <p className="text-[11px] text-muted-foreground mt-2 font-mono" dir="ltr">{lang === "ar" ? tier.threshold_ar : tier.threshold_en}</p>
                    </div>
                    {i < ESCALATION_MATRIX.length - 1 && <span className="text-muted-foreground hidden sm:inline">→</span>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lookups" className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-5">
              <p className="text-sm font-semibold mb-3">{lang === "ar" ? "فئات الشكاوى" : "Complaint categories"}</p>
              <div className="flex flex-wrap gap-1.5">
                {["خدمات المرور", "المواعيد الطبية", "الرسوم والمدفوعات", "الهوية الرقمية", "التسجيل الإلكتروني", "تجربة الفروع", "سلوك الموظفين"].map((c) => (
                  <span key={c} className="text-[12px] rounded-full bg-muted px-2.5 py-1">{c}</span>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-5">
              <p className="text-sm font-semibold mb-3">{lang === "ar" ? "الجهات" : "Agencies"}</p>
              <div className="flex flex-wrap gap-1.5">
                {["وزارة الصحة", "وزارة الداخلية", "وزارة التعليم", "هيئة الزكاة والضريبة", "وزارة النقل"].map((c) => (
                  <span key={c} className="text-[12px] rounded-full bg-muted px-2.5 py-1">{c}</span>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
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
