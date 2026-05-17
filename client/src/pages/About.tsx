import { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/brand/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useAbout, setAbout, resetAbout } from "@/lib/aboutStore";
import { useToast } from "@/hooks/use-toast";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Users,
  Cpu,
  Activity,
  ShieldCheck,
  HeartHandshake,
  LineChart as LineChartIcon,
  Sparkles,
  CheckCircle2,
  XCircle,
  FileText,
  Info,
  Target,
  Flag,
} from "lucide-react";
import { HeroPattern } from "@/components/brand/HeroPattern";
import { CountUp } from "@/components/brand/CountUp";
import { SectionDivider } from "@/components/brand/SectionDivider";

const STRATEGIC_LENSES = [
  { id: "customer", Icon: HeartHandshake, key: "about.lens.customer" },
  { id: "digital", Icon: Cpu, key: "about.lens.digital" },
  { id: "ops", Icon: Activity, key: "about.lens.ops" },
  { id: "governance", Icon: ShieldCheck, key: "about.lens.governance" },
  { id: "workforce", Icon: Users, key: "about.lens.workforce" },
  { id: "insight", Icon: LineChartIcon, key: "about.lens.insight" },
  { id: "innovation", Icon: Sparkles, key: "about.lens.innovation" },
];

const BUSINESS_OUTCOMES: { key: string; baseline: string; target: string }[] = [
  { key: "about.outcome.fcr", baseline: "62%", target: "+15–25%" },
  { key: "about.outcome.aht", baseline: "7m 40s", target: "−20–30%" },
  { key: "about.outcome.cycle", baseline: "14 days", target: "−30–50%" },
  { key: "about.outcome.csat", baseline: "74", target: "+10–20 pts" },
  { key: "about.outcome.deflection", baseline: "18%", target: "25–45%" },
  { key: "about.outcome.cost", baseline: "31 SAR", target: "−15–25%" },
  { key: "about.outcome.audit", baseline: "82%", target: "≥ 90% on-time" },
  { key: "about.outcome.ai", baseline: "—", target: "≥ 60% adoption" },
];

const CUSTOMER_OUTCOMES = [
  "about.customerOutcome.identity",
  "about.customerOutcome.bilingual",
  "about.customerOutcome.transparent",
  "about.customerOutcome.fair",
  "about.customerOutcome.fast",
];

const IN_SCOPE = ["about.scope.omnichannel", "about.scope.profile", "about.scope.case", "about.scope.selfservice", "about.scope.voc", "about.scope.analytics", "about.scope.wfq", "about.scope.ai", "about.scope.et", "about.scope.governance", "about.scope.bilingual"];

const OUT_OF_SCOPE: { key: string; rationale: string; future: string }[] = [
  { key: "about.outscope.crm", rationale: "about.outscope.crm.r", future: "about.outscope.crm.f" },
  { key: "about.outscope.finance", rationale: "about.outscope.finance.r", future: "about.outscope.finance.f" },
  { key: "about.outscope.idp", rationale: "about.outscope.idp.r", future: "about.outscope.idp.f" },
  { key: "about.outscope.ecm", rationale: "about.outscope.ecm.r", future: "about.outscope.ecm.f" },
  { key: "about.outscope.marketing", rationale: "about.outscope.marketing.r", future: "about.outscope.marketing.f" },
];

export default function About() {
  const { t, lang, isRTL, pick } = useLocale();
  const { user } = useAuth();
  const { toast } = useToast();
  const aboutContent = useAbout();
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState(aboutContent);
  const canEdit = user?.role === "admin";

  return (
    <>
      <PageHeader
        Icon={Info}
        title={t("about.title")}
        subtitle={t("about.subtitle")}
        actions={
          canEdit ? (
            <Button size="sm" variant="outline" onClick={() => { setDraft(aboutContent); setEdit(true); }} data-testid="button-edit-about">
              <Pencil size={14} className="me-1.5" />
              {t("about.edit")}
            </Button>
          ) : undefined
        }
      />

      {/* Hero / Vision */}
      <Card className="shadow-card overflow-hidden mb-8 border-primary/20">
        <div className="relative bg-gradient-to-br from-primary/15 via-primary/5 to-background">
          <HeroPattern variant="hex" opacity={0.05} color="#25935F" />
          <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, var(--primary) 0%, transparent 60%)" }} />
          <CardContent className="relative p-8 lg:p-12">
            <Badge variant="outline" className="mb-4 border-primary/40 text-primary bg-white/60 backdrop-blur-sm">
              <Flag size={11} className="me-1" />
              {t("about.purposeLabel")}
            </Badge>
            <h2 className={cn("text-2xl lg:text-3xl font-semibold text-foreground max-w-3xl leading-snug", isRTL && "text-right")}>
              {t("about.purpose")}
            </h2>
            <p className={cn("mt-4 text-sm lg:text-base text-muted-foreground max-w-3xl leading-relaxed", isRTL && "text-right")}>
              {pick(aboutContent.hero)}
            </p>
            <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-lg border border-border bg-card/85 backdrop-blur-sm px-4 py-3 card-lift">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{t("about.stat.channels")}</p>
                <p className="text-lg font-semibold mt-0.5 tabular-nums text-primary"><CountUp value={9} /></p>
              </div>
              <div className="rounded-lg border border-border bg-card/85 backdrop-blur-sm px-4 py-3 card-lift">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{t("about.stat.languages")}</p>
                <p className="text-lg font-semibold mt-0.5">{lang === "ar" ? "العربية + الإنجليزية" : "AR + EN"}</p>
              </div>
              <div className="rounded-lg border border-border bg-card/85 backdrop-blur-sm px-4 py-3 card-lift">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{t("about.stat.standards")}</p>
                <p className="text-lg font-semibold mt-0.5 tabular-nums text-primary"><CountUp value={8} /></p>
              </div>
              <div className="rounded-lg border border-border bg-card/85 backdrop-blur-sm px-4 py-3 card-lift">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{t("about.stat.uptime")}</p>
                <p className="text-lg font-semibold mt-0.5 tabular-nums text-primary"><CountUp value={99.9} decimals={1} suffix="%" /></p>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Strategic value lenses */}
      <div className="flex items-center gap-2 mb-4">
        <Target size={16} className="text-primary" />
        <h3 className={cn("text-base font-semibold text-foreground", isRTL && "text-right")}>{t("about.lensTitle")}</h3>
      </div>
      <SectionDivider className="mb-5" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
        {STRATEGIC_LENSES.map(({ id, Icon, key }) => (
          <Card key={id} className="shadow-card card-lift">
            <CardContent className="p-5">
              <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                <Icon size={18} />
              </div>
              <h4 className={cn("text-sm font-semibold text-foreground", isRTL && "text-right")}>{t(`${key}.title`)}</h4>
              <p className={cn("mt-1.5 text-xs text-muted-foreground leading-relaxed", isRTL && "text-right")}>{t(`${key}.body`)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Business outcomes */}
      <div className="grid lg:grid-cols-2 gap-6 mb-10">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">{t("about.outcomesTitle")}</CardTitle>
            <p className="text-xs text-muted-foreground">{t("about.outcomesSub")}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {BUSINESS_OUTCOMES.map((o) => (
                <div key={o.key} className={cn("flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2.5", isRTL && "flex-row-reverse")}>
                  <span className={cn("text-xs font-medium text-foreground flex-1", isRTL && "text-right")}>{t(o.key)}</span>
                  <span className="text-[10px] uppercase text-muted-foreground tabular-nums">{o.baseline}</span>
                  <span className="text-xs font-semibold text-primary tabular-nums">{o.target}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">{t("about.customerOutcomesTitle")}</CardTitle>
            <p className="text-xs text-muted-foreground">{t("about.customerOutcomesSub")}</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {CUSTOMER_OUTCOMES.map((c) => (
                <li key={c} className={cn("flex items-start gap-2.5 text-sm text-foreground", isRTL && "flex-row-reverse text-right")}>
                  <CheckCircle2 size={16} className="shrink-0 text-primary mt-0.5" />
                  <span>{t(c)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Why now */}
      <Card className="shadow-card mb-10 border-amber-500/30 bg-amber-50/30 dark:bg-amber-950/10">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">{t("about.whyNowTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={cn("text-sm text-foreground leading-relaxed max-w-4xl", isRTL && "text-right")}>{t("about.whyNowBody")}</p>
        </CardContent>
      </Card>

      {/* In-scope / Out-of-scope */}
      <div className="grid lg:grid-cols-2 gap-6 mb-10">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 size={14} className="text-primary" />
              {t("about.inScopeTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {IN_SCOPE.map((k) => (
                <Badge key={k} variant="secondary" className="text-[11px] font-medium">{t(k)}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <XCircle size={14} className="text-muted-foreground" />
              {t("about.outScopeTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {OUT_OF_SCOPE.map((o) => (
                <li key={o.key} className="text-xs">
                  <p className={cn("font-medium text-foreground", isRTL && "text-right")}>{t(o.key)}</p>
                  <p className={cn("text-muted-foreground mt-0.5", isRTL && "text-right")}>{t(o.rationale)} · <span className="text-primary">{t(o.future)}</span></p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Mission / Vision / Values / Milestones — editable from store */}
      <div className="grid lg:grid-cols-2 gap-6 mb-10">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">{lang === "ar" ? "الرسالة" : "Mission"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={cn("text-sm text-foreground leading-relaxed", isRTL && "text-right")}>{pick(aboutContent.mission)}</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">{lang === "ar" ? "الرؤية" : "Vision"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={cn("text-sm text-foreground leading-relaxed", isRTL && "text-right")}>{pick(aboutContent.vision)}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card mb-10">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">{lang === "ar" ? "القيم" : "Values"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {aboutContent.values.map((v, i) => (
              <Badge key={i} variant="secondary" className="text-[11px] font-medium">{pick(v)}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card mb-10">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">{lang === "ar" ? "محطات" : "Milestones"}</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="relative ms-3 border-s border-border space-y-3">
            {aboutContent.milestones.map((m, i) => (
              <li key={i} className="ps-4 relative">
                <span className={`absolute ${isRTL ? "right-[-5px]" : "left-[-5px]"} mt-1 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-card`} />
                <p className="text-[11px] text-muted-foreground tabular-nums font-mono">{m.year}</p>
                <p className="text-sm font-medium">{pick(m.title)}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* About edit dialog */}
      <Dialog open={edit} onOpenChange={setEdit}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("about.editor.title")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Hero (EN)</Label>
                <Textarea rows={3} value={draft.hero.en} onChange={(e) => setDraft({ ...draft, hero: { ...draft.hero, en: e.target.value } })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Hero (AR)</Label>
                <Textarea rows={3} dir="rtl" value={draft.hero.ar} onChange={(e) => setDraft({ ...draft, hero: { ...draft.hero, ar: e.target.value } })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Mission (EN)</Label>
                <Textarea rows={2} value={draft.mission.en} onChange={(e) => setDraft({ ...draft, mission: { ...draft.mission, en: e.target.value } })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Mission (AR)</Label>
                <Textarea rows={2} dir="rtl" value={draft.mission.ar} onChange={(e) => setDraft({ ...draft, mission: { ...draft.mission, ar: e.target.value } })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Vision (EN)</Label>
                <Textarea rows={2} value={draft.vision.en} onChange={(e) => setDraft({ ...draft, vision: { ...draft.vision, en: e.target.value } })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Vision (AR)</Label>
                <Textarea rows={2} dir="rtl" value={draft.vision.ar} onChange={(e) => setDraft({ ...draft, vision: { ...draft.vision, ar: e.target.value } })} />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">{lang === "ar" ? "القيم (EN — سطر لكل قيمة)" : "Values (EN — one per line)"}</Label>
              <Textarea
                rows={5}
                value={draft.values.map((v) => v.en).join("\n")}
                onChange={(e) => {
                  const lines = e.target.value.split("\n");
                  setDraft({
                    ...draft,
                    values: lines.map((en, i) => ({ en, ar: draft.values[i]?.ar ?? en })),
                  });
                }}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">{lang === "ar" ? "القيم (AR — سطر لكل قيمة)" : "Values (AR — one per line)"}</Label>
              <Textarea
                rows={5}
                dir="rtl"
                value={draft.values.map((v) => v.ar).join("\n")}
                onChange={(e) => {
                  const lines = e.target.value.split("\n");
                  setDraft({
                    ...draft,
                    values: draft.values.map((v, i) => ({ en: v.en, ar: lines[i] ?? v.ar })),
                  });
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { resetAbout(); setEdit(false); toast({ title: lang === "ar" ? "أعيد للضبط الافتراضي" : "Reset to defaults" }); }}>
              {lang === "ar" ? "افتراضي" : "Reset"}
            </Button>
            <Button variant="outline" onClick={() => setEdit(false)}>{t("common.cancel")}</Button>
            <Button onClick={() => { setAbout(draft); setEdit(false); toast({ title: t("common.save") }); }}>{t("common.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Supporting documents */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <FileText size={14} className="text-primary" />
            {t("about.docsTitle")}
          </CardTitle>
          <p className="text-xs text-muted-foreground">{t("about.docsSub")}</p>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-2.5 text-xs">
            <div className="rounded-md border border-border px-3 py-2.5">
              <p className="font-medium text-foreground">{t("about.docs.blueprint")}</p>
              <p className="text-muted-foreground mt-0.5">22 sections · {lang === "ar" ? "المخطط الشامل" : "Comprehensive blueprint"}</p>
            </div>
            <div className="rounded-md border border-border px-3 py-2.5">
              <p className="font-medium text-foreground">{t("about.docs.matrix")}</p>
              <p className="text-muted-foreground mt-0.5">188 requirements · MoSCoW + standards mapping</p>
            </div>
            <div className="rounded-md border border-border px-3 py-2.5">
              <p className="font-medium text-foreground">{t("about.docs.rfp")}</p>
              <p className="text-muted-foreground mt-0.5">{lang === "ar" ? "كراسة الشروط جاهزة" : "RFP-ready package"}</p>
            </div>
            <div className="rounded-md border border-border px-3 py-2.5">
              <p className="font-medium text-foreground">{t("about.docs.governance")}</p>
              <p className="text-muted-foreground mt-0.5">{lang === "ar" ? "الحوكمة والامتثال" : "Governance & compliance pack"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
