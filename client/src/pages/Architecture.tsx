import { useLocale } from "@/contexts/LocaleContext";
import { PageHeader } from "@/components/brand/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShieldCheck,
  Database,
  Layers,
  Gauge,
  Server,
  Network,
  Cloud,
  GitBranch,
  FileText,
  Boxes,
  Workflow,
  Radio,
  Repeat,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Bi = { en: string; ar: string };

type Domain = {
  id: string;
  Icon: typeof ShieldCheck;
  title: Bi;
  highlighted?: boolean;
  components: Bi[];
};

const DOMAINS: Domain[] = [
  {
    id: "security",
    Icon: ShieldCheck,
    title: { en: "Enterprise Security", ar: "أمن المؤسسة" },
    highlighted: true,
    components: [
      { en: "Application Security", ar: "أمن التطبيقات" },
      { en: "Cloud Security", ar: "الأمن السحابي" },
      { en: "Endpoint Security", ar: "أمن نقاط النهاية" },
      { en: "Identity & Access (IAM)", ar: "الهوية والوصول" },
      { en: "Data Security", ar: "أمن البيانات" },
      { en: "Network Security", ar: "أمن الشبكات" },
    ],
  },
  {
    id: "metadata",
    Icon: Database,
    title: { en: "Enterprise Metadata", ar: "البيانات الوصفية للمؤسسة" },
    components: [
      { en: "Business Glossary", ar: "المعجم المؤسسي" },
      { en: "Data Catalog", ar: "كتالوج البيانات" },
      { en: "Lineage & Quality", ar: "النسب والجودة" },
    ],
  },
  {
    id: "eam",
    Icon: Layers,
    title: { en: "Enterprise Architecture Management", ar: "إدارة البنية المؤسسية" },
    components: [
      { en: "Business Capability Model", ar: "نموذج القدرات" },
      { en: "Application Portfolio", ar: "محفظة التطبيقات" },
      { en: "Technology Standards", ar: "المعايير التقنية" },
    ],
  },
  {
    id: "grc",
    Icon: Gauge,
    title: { en: "Enterprise GRC", ar: "الحوكمة وإدارة المخاطر" },
    components: [
      { en: "RSA Archer eGRC", ar: "منظومة RSA Archer" },
      { en: "Policy Management", ar: "إدارة السياسات" },
      { en: "Risk & Control Library", ar: "مكتبة المخاطر والضوابط" },
    ],
  },
  {
    id: "ops",
    Icon: Server,
    title: { en: "Enterprise IT Operations", ar: "عمليات تقنية المعلومات" },
    components: [
      { en: "API Gateway & Management", ar: "بوابة الـ API" },
      { en: "Application Services", ar: "خدمات التطبيقات" },
      { en: "Enterprise Service Bus (ESB)", ar: "ناقل خدمات المؤسسة" },
      { en: "Master Data Management", ar: "إدارة البيانات المرجعية" },
      { en: "Data Lakehouse", ar: "بحيرة/مستودع البيانات" },
    ],
  },
];

type Pattern = {
  id: string;
  Icon: typeof Network;
  name: Bi;
  message: Bi;
  mandate: string;
  current: Bi;
  future: Bi;
};

const PATTERNS: Pattern[] = [
  {
    id: "api",
    Icon: Network,
    name: { en: "API Gateway & Management", ar: "بوابة الـ API" },
    message: { en: "REST", ar: "REST" },
    mandate: "OWASP · NCA",
    current: { en: "Direct service exposure, no gateway.", ar: "الخدمات مكشوفة مباشرة بدون بوابة." },
    future: { en: "Formal API gateway with policy enforcement.", ar: "بوابة API رسمية بسياسات حماية موحدة." },
  },
  {
    id: "soap",
    Icon: FileText,
    name: { en: "Web Services", ar: "خدمات الويب" },
    message: { en: "SOAP", ar: "SOAP" },
    mandate: "OASIS · NCA",
    current: { en: "Existing SOAP endpoints in use.", ar: "نقاط SOAP حالية مستخدمة." },
    future: { en: "Minimised to G2G / GSB interfaces only.", ar: "الإبقاء على SOAP لتكامل G2G / GSB فقط." },
  },
  {
    id: "file",
    Icon: GitBranch,
    name: { en: "File Transfer", ar: "نقل الملفات" },
    message: { en: "Multipart / SFTP", ar: "Multipart / SFTP" },
    mandate: "NCA",
    current: { en: "Digital for public; manual elsewhere.", ar: "رقمي للخدمات العامة، يدوي في الباقي." },
    future: { en: "Centralised DMS for all file flows.", ar: "نظام إدارة وثائق مركزي لكل التدفقات." },
  },
  {
    id: "esb",
    Icon: Workflow,
    name: { en: "Enterprise Service Bus", ar: "ناقل خدمات المؤسسة" },
    message: { en: "All patterns except microservices", ar: "كل الأنماط عدا الخدمات المصغّرة" },
    mandate: "OASIS · OWASP · NDMO · NCA",
    current: { en: "No central bus in operation.", ar: "لا يوجد ناقل خدمات مركزي حالياً." },
    future: { en: "Centralised ESB for service connectivity.", ar: "ناقل مركزي لربط الخدمات الداخلية." },
  },
  {
    id: "gsb",
    Icon: Building2,
    name: { en: "G2G / Government Service Bus (GSB)", ar: "ناقل الخدمات الحكومية" },
    message: { en: "SOAP / REST", ar: "SOAP / REST" },
    mandate: "NCA",
    current: { en: "Sample integrations active: MoJ attorney, MoC commercial registry, GASTAT ISIC.", ar: "تكاملات قائمة: العدل (المحاماة)، التجارة (السجل التجاري)، الإحصاء (ISIC)." },
    future: { en: "Expand reuse via GSB with shared schemas.", ar: "توسيع الاستخدام عبر GSB وموحّدة المخططات." },
  },
  {
    id: "micro",
    Icon: Boxes,
    name: { en: "Microservices", ar: "الخدمات المصغّرة" },
    message: { en: "REST (internal)", ar: "REST (داخلي)" },
    mandate: "OWASP",
    current: { en: "Monolithic services still in operation.", ar: "خدمات أحادية (Monolith) قيد التشغيل." },
    future: { en: "Decompose into independently deployable services.", ar: "تفكيك إلى خدمات مستقلة قابلة للنشر." },
  },
  {
    id: "msg",
    Icon: Radio,
    name: { en: "Messaging / Pub-Sub", ar: "المراسلة والنشر/الاشتراك" },
    message: { en: "Async events", ar: "أحداث غير متزامنة" },
    mandate: "NCA",
    current: { en: "Minimal event-driven flows today.", ar: "تدفقات حدثية محدودة حالياً." },
    future: { en: "Event bus for asynchronous integrations.", ar: "ناقل أحداث للتكاملات غير المتزامنة." },
  },
  {
    id: "migration",
    Icon: Repeat,
    name: { en: "Data Migration & Sync", ar: "ترحيل ومزامنة البيانات" },
    message: { en: "Bulk + CDC", ar: "نقل دفعي + CDC" },
    mandate: "NDMO",
    current: { en: "Scheduled ETL batches.", ar: "عمليات ETL مجدولة." },
    future: { en: "Change-data-capture and replication.", ar: "التقاط التغيّر (CDC) والتكرار الفوري." },
  },
  {
    id: "agg",
    Icon: Database,
    name: { en: "Data Aggregation", ar: "تجميع البيانات" },
    message: { en: "Lakehouse (bronze / silver / gold)", ar: "بحيرة بيانات (bronze / silver / gold)" },
    mandate: "NDMO",
    current: { en: "Data silos across operational systems.", ar: "بيانات معزولة بين الأنظمة التشغيلية." },
    future: { en: "Bronze / silver / gold data lakehouse.", ar: "بحيرة بيانات بثلاث طبقات قياسية." },
  },
];

const MANDATES: { en: string; ar: string }[] = [
  { en: "Royal Decrees", ar: "الأوامر الملكية" },
  { en: "Vision 2030", ar: "رؤية 2030" },
  { en: "DGA", ar: "هيئة الحكومة الرقمية" },
  { en: "NCA", ar: "الأمن السيبراني NCA" },
  { en: "NDMO", ar: "إدارة البيانات NDMO" },
  { en: "International Competition Network", ar: "شبكة المنافسة الدولية" },
];

export default function Architecture() {
  const { t, lang, pick, isRTL } = useLocale();

  return (
    <div>
      <PageHeader
        Icon={Layers}
        title={t("arch.title")}
        subtitle={t("arch.subtitle")}
      />

      {/* In-house build note — humanised */}
      <Card className="shadow-card mb-6 border-[#FAC126]/40">
        <CardContent className="p-4 flex items-start gap-3">
          <span className="h-8 w-8 rounded-[100px] bg-[#FAC126] text-[#060606] flex items-center justify-center shrink-0">
            <Building2 size={16} />
          </span>
          <div className={cn("text-sm leading-relaxed", isRTL && "text-right")}>
            <p className="font-medium text-foreground">
              {lang === "ar"
                ? "بُنيت داخلياً من فريق تقنية المعلومات في الهيئة العامة للمنافسة — بدون أي مزود خارجي."
                : "Built in-house by GAC's IT team — no external vendor."}
            </p>
            <p className="text-muted-foreground mt-1">
              {lang === "ar"
                ? "متوافقة مع البنية المرجعية للهيئة الإصدار 0.1 وأنماط التكامل المعتمدة (أكتوبر 2024)."
                : "Aligned with GAC Reference Architecture v0.1 and the approved Integration Patterns (October 2024)."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 5 conceptual domains */}
      <h3 className={cn("text-base font-semibold text-foreground mb-3", isRTL && "text-right")}>{t("arch.domains.title")}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {DOMAINS.map((d) => (
          <Card
            key={d.id}
            className={cn(
              "shadow-card border",
              d.highlighted ? "border-[#FAC126] ring-1 ring-[#FAC126]/40" : "border-border",
            )}
          >
            <CardContent className="p-4">
              <span
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-[10px] mb-3",
                  d.highlighted ? "bg-[#FAC126] text-[#060606]" : "bg-[#0069A7]/10 text-[#0069A7]",
                )}
              >
                <d.Icon size={18} />
              </span>
              <p className={cn("text-sm font-semibold leading-tight text-[#00192B]", isRTL && "text-right")}>{pick(d.title)}</p>
              <ul className={cn("mt-2 space-y-1", isRTL && "text-right")}>
                {d.components.map((c, i) => (
                  <li key={i} className="text-[11.5px] text-muted-foreground leading-snug">· {pick(c)}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Integration patterns */}
      <h3 className={cn("text-base font-semibold text-foreground mb-1", isRTL && "text-right")}>{t("arch.patterns.title")}</h3>
      <p className={cn("text-xs text-muted-foreground mb-4", isRTL && "text-right")}>{t("arch.patterns.subtitle")}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {PATTERNS.map((p) => (
          <Card key={p.id} className="shadow-card border border-border">
            <CardContent className="p-4">
              <div className="flex items-start gap-2.5 mb-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#28334A] text-white shrink-0">
                  <p.Icon size={15} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={cn("text-sm font-semibold text-[#00192B] leading-tight", isRTL && "text-right")}>{pick(p.name)}</p>
                  <p className="text-[10.5px] text-muted-foreground font-mono mt-0.5" dir="ltr">{p.mandate}</p>
                </div>
              </div>
              <dl className="space-y-1.5 text-[11.5px] leading-snug">
                <Row label={t("arch.col.message")} value={pick(p.message)} dir="ltr" />
                <Row label={t("arch.col.current")} value={pick(p.current)} muted />
                <Row label={t("arch.col.future")} value={pick(p.future)} accent />
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mandates */}
      <h3 className={cn("text-base font-semibold text-foreground mb-3", isRTL && "text-right")}>{t("arch.mandates.title")}</h3>
      <div className="flex flex-wrap gap-2 mb-8">
        {MANDATES.map((m) => (
          <span
            key={m.en}
            className="inline-flex items-center rounded-[100px] px-3 py-1 text-xs font-medium bg-[#00192B] text-white"
          >
            {pick(m)}
          </span>
        ))}
      </div>

      {/* Cloud */}
      <Card className="shadow-card border-[#0069A7]/30 bg-[#0069A7]/5">
        <CardContent className="p-4 flex items-start gap-3">
          <span className="h-8 w-8 rounded-[10px] bg-[#0069A7] text-white flex items-center justify-center shrink-0">
            <Cloud size={16} />
          </span>
          <p className={cn("text-sm text-foreground leading-relaxed", isRTL && "text-right")}>{t("arch.cloud")}</p>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value, dir, muted, accent }: { label: string; value: string; dir?: "ltr" | "rtl"; muted?: boolean; accent?: boolean }) {
  return (
    <div className="flex items-start gap-2">
      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold w-20 shrink-0 mt-0.5">{label}</dt>
      <dd
        className={cn(
          "flex-1",
          muted && "text-muted-foreground",
          accent && "text-[#0069A7] font-medium",
        )}
        dir={dir}
      >
        {value}
      </dd>
    </div>
  );
}
