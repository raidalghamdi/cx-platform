import { useMemo, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { PageHeader } from "@/components/brand/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ARTICLES, type Article } from "@/lib/seed";
import {
  Search,
  Wrench,
  CreditCard,
  UserCircle2,
  Cpu,
  Shield,
  ChevronRight,
  ChevronLeft,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CAT_META: Record<string, { Icon: any; key: string }> = {
  services: { Icon: Wrench, key: "kb.cat.services" },
  billing: { Icon: CreditCard, key: "kb.cat.billing" },
  account: { Icon: UserCircle2, key: "kb.cat.account" },
  technical: { Icon: Cpu, key: "kb.cat.technical" },
  policy: { Icon: Shield, key: "kb.cat.policy" },
};

export default function KB() {
  const { t, lang, pick, isRTL } = useLocale();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [active, setActive] = useState<Article | null>(null);

  const Chev = isRTL ? ChevronLeft : ChevronRight;

  const filtered = useMemo(() => {
    return ARTICLES.filter((a) => {
      if (cat && a.category !== cat) return false;
      if (q) {
        const hay = `${a.title.ar} ${a.title.en}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [q, cat]);

  if (active) {
    return (
      <div>
        <PageHeader
          title={pick(active.title)}
          subtitle={t("kb.cat." + active.category) + " · " + active.updated}
          actions={
            <Button variant="outline" size="sm" onClick={() => setActive(null)}>
              {lang === "ar" ? "العودة للقائمة" : "Back to list"}
            </Button>
          }
        />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          <article className="prose prose-slate max-w-none text-[15px] leading-relaxed">
            <p>{pick(active.body)}</p>
            <h3 className="text-base font-semibold mt-6">{lang === "ar" ? "الخطوات" : "Steps"}</h3>
            <ol>
              <li>{lang === "ar" ? "الدخول إلى تطبيق الخدمة." : "Open the service app."}</li>
              <li>{lang === "ar" ? "تحديد الخدمة المطلوبة." : "Select the required service."}</li>
              <li>{lang === "ar" ? "إكمال بيانات الطلب." : "Complete the request details."}</li>
              <li>{lang === "ar" ? "تأكيد الإرسال." : "Confirm submission."}</li>
            </ol>
            <h3 className="text-base font-semibold mt-6">{lang === "ar" ? "مقالات ذات صلة" : "Related articles"}</h3>
            <ul>
              {ARTICLES.filter((a) => a.id !== active.id && a.category === active.category).slice(0, 3).map((a) => (
                <li key={a.id}>
                  <button className="text-primary hover:underline" onClick={() => setActive(a)}>
                    {pick(a.title)}
                  </button>
                </li>
              ))}
            </ul>
          </article>

          <aside className="space-y-4">
            <Card className="shadow-card">
              <CardContent className="p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">{t("kb.rateArticle")}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1"><ThumbsUp size={14} className="me-1.5" />{t("kb.yes")}</Button>
                  <Button variant="outline" size="sm" className="flex-1"><ThumbsDown size={14} className="me-1.5" />{t("kb.no")}</Button>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                  <div>
                    <p className="text-lg font-semibold tabular-nums">{active.views.toLocaleString()}</p>
                    <p className="text-[11px] text-muted-foreground">{t("kb.views")}</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold tabular-nums text-emerald-600">{active.helpful}%</p>
                    <p className="text-[11px] text-muted-foreground">{t("kb.helpful")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        Icon={BookOpen}
        title={t("nav.kb")}
        subtitle={lang === "ar" ? "أدلة وسياسات للمستفيدين والموظفين" : "Guides and policies for customers and staff"}
      />

      {/* Hero search */}
      <Card className="shadow-card mb-6 overflow-hidden">
        <CardContent
          className="p-8 lg:p-12 text-center relative"
          style={{
            background:
              "linear-gradient(135deg, hsl(144 56% 94%) 0%, hsl(46 99% 96%) 100%)",
          }}
        >
          <h2 className="text-xl font-semibold mb-2">{t("kb.heroTitle")}</h2>
          <p className="text-sm text-muted-foreground mb-5">{t("kb.heroSub")}</p>
          <div className="max-w-xl mx-auto relative">
            <Search size={18} className={cn("absolute top-1/2 -translate-y-1/2", isRTL ? "right-4" : "left-4", "text-muted-foreground")} />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("kb.searchPlaceholder")}
              className={cn("h-12 text-base bg-card border-border shadow-sm", isRTL ? "pr-12" : "pl-12")}
              data-testid="input-kb-search"
            />
          </div>
        </CardContent>
      </Card>

      {/* Category tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <button
          onClick={() => setCat(null)}
          className={cn(
            "rounded-xl border bg-card p-4 text-start hover:shadow-card-hover transition-shadow",
            !cat ? "border-primary ring-1 ring-primary/30" : "border-border",
          )}
        >
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
            {t("common.all")}
          </span>
          <span className="text-sm font-medium">{lang === "ar" ? "كل المقالات" : "All articles"}</span>
        </button>
        {Object.entries(CAT_META).map(([k, m]) => {
          const count = ARTICLES.filter((a) => a.category === k).length;
          return (
            <button
              key={k}
              onClick={() => setCat(k)}
              className={cn(
                "rounded-xl border bg-card p-4 text-start hover:shadow-card-hover transition-shadow",
                cat === k ? "border-primary ring-1 ring-primary/30" : "border-border",
              )}
            >
              <span className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2.5">
                <m.Icon size={18} />
              </span>
              <p className="text-sm font-semibold">{t(m.key)}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{count} {lang === "ar" ? "مقالات" : "articles"}</p>
            </button>
          );
        })}
      </div>

      {/* Article list */}
      <Card className="shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/40">
              <tr>
                <th className="text-start px-4 py-3 font-medium">{lang === "ar" ? "العنوان" : "Title"}</th>
                <th className="text-start px-4 py-3 font-medium">{t("common.category")}</th>
                <th className="text-start px-4 py-3 font-medium">{t("kb.views")}</th>
                <th className="text-start px-4 py-3 font-medium">{t("kb.helpful")}</th>
                <th className="text-start px-4 py-3 font-medium">{t("common.lastUpdated")}</th>
                <th className="text-start px-4 py-3 font-medium">{t("common.status")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-muted/40 cursor-pointer transition-colors" onClick={() => setActive(a)}>
                  <td className="px-4 py-3 font-medium">{pick(a.title)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t("kb.cat." + a.category)}</td>
                  <td className="px-4 py-3 tabular-nums">{a.views.toLocaleString()}</td>
                  <td className="px-4 py-3 tabular-nums text-emerald-600">{a.helpful}%</td>
                  <td className="px-4 py-3 text-muted-foreground tabular-nums">{a.updated}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
                        a.status === "published" && "bg-emerald-50 text-emerald-700 ring-emerald-200",
                        a.status === "draft" && "bg-slate-50 text-slate-600 ring-slate-200",
                        a.status === "review" && "bg-amber-50 text-amber-700 ring-amber-200",
                      )}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-end">
                    <Chev size={16} className="text-muted-foreground inline-block" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
