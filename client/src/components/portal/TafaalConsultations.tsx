import { Vote, Users, MessageSquare, ArrowUpRight, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/contexts/LocaleContext";
import { RequirementBadge } from "@/components/brand/RequirementBadge";
import { cn } from "@/lib/utils";

// Tafa3al (تفاعل) — Saudi national public-consultations platform.
// DGA Standard 5.18.1: customers participate in service design via Tafa3al.
type Status = "open" | "review" | "closed";

type Consultation = {
  id: string;
  title: { ar: string; en: string };
  body: { ar: string; en: string };
  status: Status;
  closesIn: number;          // days until close (0 if closed/review)
  participants: number;
  comments: number;
  category: { ar: string; en: string };
};

const CONSULTATIONS: Consultation[] = [
  {
    id: "TFL-2026-018",
    title: {
      ar: "تطوير تجربة طلب الخدمات الحكومية الموحدة",
      en: "Redesigning the unified government-services request flow",
    },
    body: {
      ar: "نستطلع آراءكم حول النموذج المقترح لتوحيد طلبات الخدمات الحكومية على المنصة الموحدة قبل الإطلاق.",
      en: "Share your input on the proposed unified-services request form before launch.",
    },
    status: "open",
    closesIn: 9,
    participants: 1248,
    comments: 312,
    category: { ar: "الخدمات الحكومية", en: "Government services" },
  },
  {
    id: "TFL-2026-016",
    title: {
      ar: "ميثاق خدمة العميل الحكومي ٢٠٢٦",
      en: "2026 Government Customer-Service Charter",
    },
    body: {
      ar: "مسودة الميثاق الجديد لخدمة العميل تتضمن معايير الزمن والشفافية. شاركنا ما يجب تعزيزه.",
      en: "Draft charter outlines new time and transparency standards. Tell us what to strengthen.",
    },
    status: "open",
    closesIn: 21,
    participants: 624,
    comments: 187,
    category: { ar: "السياسات", en: "Policy" },
  },
  {
    id: "TFL-2026-011",
    title: {
      ar: "تحسين قنوات الاستفسار في القطاع الصحي",
      en: "Improving inquiry channels in the health sector",
    },
    body: {
      ar: "بناءً على مدخلاتكم، يتم حالياً مراجعة المقترحات وإعداد خطة التطوير.",
      en: "Submissions are now under review and the action plan is being finalised.",
    },
    status: "review",
    closesIn: 0,
    participants: 2890,
    comments: 814,
    category: { ar: "الصحة", en: "Health" },
  },
];

const STATUS_STYLES: Record<Status, { ar: string; en: string; cls: string }> = {
  open: {
    ar: "مفتوحة للتصويت",
    en: "Open for input",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  review: {
    ar: "قيد المراجعة",
    en: "Under review",
    cls: "bg-amber-50 text-amber-700 border-amber-200",
  },
  closed: {
    ar: "مغلقة",
    en: "Closed",
    cls: "bg-muted text-muted-foreground border-border",
  },
};

export function TafaalConsultations() {
  const { lang } = useLocale();
  return (
    <Card className="shadow-card mb-6">
      <CardContent className="p-0">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3 flex-wrap bg-gradient-to-r from-primary/[0.04] to-transparent">
          <div className="flex items-center gap-3 min-w-0">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Vote size={16} />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold flex items-center gap-2 flex-wrap">
                {lang === "ar" ? "استشارات تفاعل العامة" : "Tafa3al — Public consultations"}
                <RequirementBadge
                  ids={["FR-71"]}
                  standards={["DGA 5.18.1", "ISO 9001 §5.1.2", "Vision 2030 — Participation"]}
                />
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {lang === "ar"
                  ? "شاركنا في تصميم الخدمات الحكومية عبر منصة «تفاعل» الوطنية."
                  : "Help us co-design government services through the national «Tafa3al» platform."}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5" data-testid="button-tafaal-all">
            {lang === "ar" ? "كل الاستشارات" : "All consultations"}
            <ArrowUpRight size={14} />
          </Button>
        </div>

        <ul className="divide-y divide-border">
          {CONSULTATIONS.map((c) => {
            const meta = STATUS_STYLES[c.status];
            return (
              <li
                key={c.id}
                className="px-5 py-4 hover:bg-muted/30 transition-colors"
                data-testid={`tafaal-${c.id}`}
              >
                <div className="flex flex-wrap items-start gap-3">
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] text-muted-foreground">{c.id}</span>
                      <span
                        className={cn(
                          "inline-flex items-center px-1.5 py-0.5 rounded-md border text-[10px] font-medium",
                          meta.cls,
                        )}
                      >
                        {lang === "ar" ? meta.ar : meta.en}
                      </span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-muted text-[10px] text-foreground">
                        {lang === "ar" ? c.category.ar : c.category.en}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-foreground leading-snug">
                      {lang === "ar" ? c.title.ar : c.title.en}
                    </p>
                    <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2">
                      {lang === "ar" ? c.body.ar : c.body.en}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Users size={11} />
                        <span className="font-mono">{c.participants.toLocaleString(lang === "ar" ? "ar-SA" : "en-US")}</span>
                        {lang === "ar" ? "مشاركاً" : "participants"}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MessageSquare size={11} />
                        <span className="font-mono">{c.comments.toLocaleString(lang === "ar" ? "ar-SA" : "en-US")}</span>
                        {lang === "ar" ? "مداخلة" : "comments"}
                      </span>
                      {c.status === "open" && (
                        <span className="inline-flex items-center gap-1 text-amber-700">
                          <Calendar size={11} />
                          {lang === "ar"
                            ? `تُغلق خلال ${c.closesIn} أيام`
                            : `Closes in ${c.closesIn} days`}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={c.status === "open" ? "default" : "outline"}
                    className="shrink-0 gap-1"
                    data-testid={`button-tafaal-${c.id}`}
                  >
                    {c.status === "open"
                      ? lang === "ar"
                        ? "شارك برأيك"
                        : "Contribute"
                      : lang === "ar"
                        ? "عرض النتائج"
                        : "View results"}
                    <ArrowUpRight size={13} />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
