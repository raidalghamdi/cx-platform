import { Megaphone, ShieldCheck, Phone, Globe } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { RequirementBadge } from "@/components/brand/RequirementBadge";

// Balagh Raqami (بلاغ رقمي) — Saudi national digital complaints channel.
// DGA Standard 5.18.2: complaints must be routed/escalated through Balagh Raqami
// where applicable. Banner advertises the official channel and confirms integration.
export function BalaghBanner() {
  const { lang } = useLocale();
  return (
    <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/[0.04] via-primary/[0.02] to-accent/[0.04] p-4 mb-6">
      <div className="flex flex-wrap items-start gap-4">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Megaphone size={20} strokeWidth={2} />
        </span>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-foreground">
              {lang === "ar"
                ? "متكاملة مع منصة «بلاغ رقمي» الوطنية"
                : "Integrated with the national «Balagh Raqami» channel"}
            </h3>
            <RequirementBadge
              ids={["FR-67", "FR-68"]}
              standards={["DGA 5.18.2", "ISO 10002 §7.5", "Vision 2030 NTP"]}
            />
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-soft-pulse" />
              {lang === "ar" ? "متصل" : "Connected"}
            </span>
          </div>
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            {lang === "ar"
              ? "تُستقبل البلاغات الواردة من «بلاغ رقمي» تلقائياً، ويتم التصعيد للقناة الوطنية للشكاوى الحكومية وفق سياسات DGA. يخضع التصنيف والرد لمراقبة الزمن الفعلي."
              : "Tickets opened on Balagh Raqami are ingested automatically, and unresolved cases escalate to the national government-complaints channel under DGA policy. Classification and response are monitored in real time."}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-foreground">
              <ShieldCheck size={12} className="text-primary" />
              <span className="font-mono">{lang === "ar" ? "بلاغ رقمي" : "Balagh Raqami"}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Phone size={12} />
              <span className="font-mono">19996</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Globe size={12} />
              <span className="font-mono">balagh.gov.sa</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-border bg-background text-[10px]">
              {lang === "ar" ? "إجمالي بلاغات اليوم" : "Today’s intake"}
              <span className="font-semibold text-primary">142</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-border bg-background text-[10px]">
              {lang === "ar" ? "متوسط زمن الاستجابة" : "Avg response"}
              <span className="font-semibold text-primary">{lang === "ar" ? "٤ ساعات ١٢ دقيقة" : "4h 12m"}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
