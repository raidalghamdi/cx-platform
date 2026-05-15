import { Link } from "wouter";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/brand/Logo";
import { HeroPattern } from "@/components/brand/HeroPattern";
import { Button } from "@/components/ui/button";
import {
  Globe,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Activity,
  Heart,
  Compass,
  LayoutDashboard,
  MessageSquare,
  Sparkles,
  BookOpen,
  Users,
  Award,
  CheckCircle2,
  Building2,
  Gauge,
  Lock,
  Globe2,
  Languages,
  Accessibility,
  TrendingUp,
  FileBarChart,
  Workflow,
} from "lucide-react";

/**
 * Landing page — public entry point that introduces the platform.
 *
 * Sections (in order):
 *   1. Top bar (logo + language toggle + Sign In)
 *   2. Hero — purpose statement, primary CTA
 *   3. KPI strip — proof of execution
 *   4. Why this exists — the problem
 *   5. What it does — 8 capability cards
 *   6. Standards & compliance — 8 chips
 *   7. Awards readiness — 6 KSA + 6 Global
 *   8. Architecture pillars — 4 commitments
 *   9. Built for these roles — 6 personas
 *   10. Footer CTA + tertiary nav
 *
 * Visual language: Premium v2.0 (warm bg #FCF4EF, premium-card, display-h1)
 * with locked GAC brand colors (Saudi green + KSA gold).
 */
export default function Landing() {
  const { t, lang, toggle, isRTL } = useLocale();
  const { user } = useAuth();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const isAr = lang === "ar";

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ───── Top bar ───── */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/85 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link href="/landing" data-testid="link-landing-logo">
            <a className="flex items-center gap-3">
              <Logo size={36} />
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-foreground">{t("brand.name")}</span>
                <span className="text-[11px] text-muted-foreground">
                  {isAr ? "تجربة المستفيد الحكومية" : "Government Customer Experience"}
                </span>
              </div>
            </a>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm">
            <a href="#capabilities" onClick={scrollTo("capabilities")} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              {isAr ? "القدرات" : "Capabilities"}
            </a>
            <a href="#standards" onClick={scrollTo("standards")} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              {isAr ? "المعايير" : "Standards"}
            </a>
            <a href="#awards" onClick={scrollTo("awards")} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              {isAr ? "الجوائز" : "Awards"}
            </a>
            <a href="#roles" onClick={scrollTo("roles")} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              {isAr ? "الأدوار" : "Roles"}
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              data-testid="button-toggle-language"
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-border bg-background text-xs font-medium hover:bg-muted transition-colors"
            >
              <Globe size={14} />
              {isAr ? "English" : "العربية"}
            </button>
            <Link href={user ? user.landing : "/login"} data-testid="link-cta-signin">
              <Button size="sm" className="gap-1.5">
                {user ? (isAr ? "ادخل للوحتي" : "Open my workspace") : (isAr ? "تسجيل الدخول" : "Sign in")}
                <Arrow size={14} />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ───── Hero ───── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 premium-hero-gradient" />
        <div className="pointer-events-none absolute -top-32 -right-32 h-[520px] w-[520px] rounded-full bg-primary/8 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-32 h-[460px] w-[460px] rounded-full bg-accent/8 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-24 lg:pt-28 lg:pb-32 grid lg:grid-cols-[1.15fr_0.85fr] gap-14 items-center">
          <div className="space-y-7">
            <span className="inline-flex items-center gap-2 h-7 px-3 rounded-full text-[11px] font-medium bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-sm">
              <Sparkles size={11} /> {isAr ? "منصة موحّدة · رؤية 2030 · DGA" : "Unified platform · Vision 2030 · DGA"}
            </span>
            <h1 className="display-h1 text-white" data-testid="landing-headline">
              {isAr
                ? "نُصغي. نستجيب. نُحسّن. منصة واحدة لكل تفاعل مع المستفيد."
                : "Listen. Respond. Improve. One platform for every citizen interaction."}
            </h1>
            <p className="body-lead text-white/90 max-w-2xl">
              {isAr
                ? "منصة موحّدة وثنائية اللغة لإدارة تجربة المستفيد في القطاع الحكومي — مُحاذية لـ رؤية 2030، هيئة الحكومة الرقمية (DGA)، EFQM، ISO 9001/10002، PDPL، وضوابط الأمن السيبراني الوطنية."
                : "A unified, bilingual government customer-experience platform aligned to Vision 2030, the Digital Government Authority (DGA), EFQM, ISO 9001/10002, PDPL, and Saudi cybersecurity essentials."}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={user ? user.landing : "/login"}>
                <Button size="lg" className="gap-2" data-testid="button-hero-primary">
                  {user ? (isAr ? "ادخل للوحتي" : "Open my workspace") : (isAr ? "ابدأ التجربة" : "Try the demo")}
                  <Arrow size={16} />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="gap-2 bg-white/10 text-white border-white/40 hover:bg-white/20 hover:text-white" data-testid="button-hero-secondary" onClick={scrollTo("capabilities")}>
                {isAr ? "تعرّف على القدرات" : "Explore capabilities"}
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-[12px] text-white/85">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={13} className="text-accent" /> WCAG 2.2 AA</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={13} className="text-accent" /> PDPL</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={13} className="text-accent" /> NCA-ECC</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={13} className="text-accent" /> ISO 9001 / 10002</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={13} className="text-accent" /> DGA 5.17-5.21</span>
            </div>
          </div>

          {/* Right visual — layered editorial frame */}
          <div className="relative">
            <div className="absolute inset-0 -translate-x-4 translate-y-4 rotate-1 rounded-2xl warm-panel" aria-hidden />
            <div className="relative premium-card rounded-2xl p-6 overflow-hidden">
              <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
                <HeroPattern variant="star" opacity={1} color="currentColor" />
              </div>
              <div className="relative space-y-5">
                <div className="flex items-center justify-between">
                  <p className="eyebrow text-muted-foreground">
                    {isAr ? "نتائج هذا الشهر" : "This month at a glance"}
                  </p>
                  <span className="text-[10px] uppercase tracking-wider text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-full">live</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] text-muted-foreground">{isAr ? "رضا المستفيد" : "Customer satisfaction"}</p>
                    <p className="stat-display-sm text-foreground mt-1">87.4<span className="text-base text-muted-foreground ms-1">%</span></p>
                    <p className="text-[11px] text-emerald-600 font-medium">▲ 2.1 {isAr ? "مقارنة بالشهر الماضي" : "vs last month"}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">{isAr ? "حلّ من أول تواصل" : "First-contact resolution"}</p>
                    <p className="stat-display-sm text-foreground mt-1">71.3<span className="text-base text-muted-foreground ms-1">%</span></p>
                    <p className="text-[11px] text-emerald-600 font-medium">▲ 1.4 {isAr ? "تحسّن" : "improving"}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">{isAr ? "خدمات موثّقة" : "Documented journeys"}</p>
                    <p className="stat-display-sm text-foreground mt-1">12</p>
                    <p className="text-[11px] text-muted-foreground">{isAr ? "خدمة حكومية فعلية" : "real GAC services"}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">{isAr ? "مشاركات المستفيدين" : "Citizen participants"}</p>
                    <p className="stat-display-sm text-foreground mt-1">486</p>
                    <p className="text-[11px] text-muted-foreground">{isAr ? "في الاستشارات العامة" : "in public consultations"}</p>
                  </div>
                </div>
                <hr className="hairline" />
                <div className="flex items-center justify-between text-[12px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5"><Activity size={13} className="text-primary" /> {isAr ? "بيانات حيّة من المنصة" : "Live platform data"}</span>
                  <span className="font-mono text-[10px]">demo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Problem statement ───── */}
      <section className="relative">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-20">
          <p className="eyebrow text-primary mb-3">{isAr ? "لماذا هذه المنصة" : "Why this exists"}</p>
          <h2 className="display-h2 text-foreground mb-5">
            {isAr
              ? "صوت المستفيد مُبعثَر — والقرارات تحتاج إثباتاً."
              : "Citizen voice is fragmented — and decisions need evidence."}
          </h2>
          <p className="body-lead text-muted-foreground">
            {isAr
              ? "تتعامل الجهات الحكومية مع شكاوى، استبيانات، استشارات، ومكالمات عبر أدوات متفرقة — مما يُصعّب إثبات الأثر وقياس النضج وفق DGA. المنصة توحّد القنوات، تُغلق دائرة التغذية الراجعة، وتُنتج الأدلة الجاهزة للجوائز والتدقيق."
              : "Government entities juggle complaints, surveys, consultations, and calls across disconnected tools — making it hard to prove impact or measure DGA maturity. This platform unifies channels, closes the feedback loop, and produces award-ready, audit-ready evidence."}
          </p>
          <div className="grid sm:grid-cols-3 gap-3 mt-8">
            {[
              { Icon: Workflow, ar: "قنوات موحّدة بدل أدوات متفرقة", en: "Unified channels, not silos" },
              { Icon: FileBarChart, ar: "أدلة جاهزة للتدقيق والجوائز", en: "Evidence ready for audit & awards" },
              { Icon: TrendingUp, ar: "حلقة تحسين مستمرة بالأرقام", en: "Continuous improvement, measured" },
            ].map((p) => (
              <div key={p.en} className="warm-panel p-4 rounded-xl">
                <p.Icon size={20} className="text-primary mb-2" strokeWidth={2} />
                <p className="text-sm font-medium text-foreground">{isAr ? p.ar : p.en}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Capabilities ───── */}
      <section id="capabilities" className="relative bg-surface-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
          <div className="max-w-3xl mb-12">
            <p className="eyebrow text-primary mb-3">{isAr ? "القدرات" : "Capabilities"}</p>
            <h2 className="display-h2 text-foreground mb-4">
              {isAr ? "ثماني قدرات أساسية، منصة واحدة." : "Eight core capabilities, one platform."}
            </h2>
            <p className="body-lead text-muted-foreground">
              {isAr
                ? "من خرائط الرحلات إلى حوكمة الامتثال — كل شيء منسوب لمتطلبات DGA و EFQM."
                : "From journey maps to compliance governance — every feature tagged to DGA & EFQM requirements."}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { Icon: LayoutDashboard, ar: "لوحة المؤشرات", en: "Executive dashboard", arS: "6 مؤشرات تنفيذية مع المقارنات والاتجاهات", enS: "6 live KPIs with deltas, trends & themes" },
              { Icon: Compass, ar: "رحلات الخدمة", en: "Service journeys", arS: "12 رحلة حقيقية بمراحل وعاطفة وفرص تحسين", enS: "12 real journeys with stages, emotion & improvements" },
              { Icon: MessageSquare, ar: "صوت المستفيد", en: "Voice of customer", arS: "تحليل المشاعر والمواضيع عبر القنوات", enS: "Sentiment & themes across all channels" },
              { Icon: Users, ar: "المشاركة العامة", en: "Public participation", arS: "استشارات تفاعل وتصميم مشترك في 5 مراحل", enS: "Consultations & 5-stage co-design" },
              { Icon: ShieldCheck, ar: "الحوكمة والامتثال", en: "Governance & compliance", arS: "RACI، PDPL، NCA-ECC، 7 معايير EFQM", enS: "RACI · PDPL · NCA-ECC · EFQM 7 criteria" },
              { Icon: Sparkles, ar: "المساعد الذكي", en: "AI co-pilot", arS: "اقتراحات ردود وملخصات وقواعد معرفة", enS: "Reply suggestions, summaries & KB"  },
              { Icon: BookOpen, ar: "قاعدة المعرفة", en: "Knowledge base", arS: "مقالات وأدلة وسياسات بحث سريع", enS: "Articles, guides & policies with fast search" },
              { Icon: Gauge, ar: "إدارة البرنامج", en: "Programme management", arS: "مبادرات وخريطة طريق ومقاييس قبل/بعد", enS: "Initiatives, roadmap & before-after impact" },
            ].map((c) => (
              <div key={c.en} className="premium-card p-5 card-lift">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15 mb-4">
                  <c.Icon size={20} strokeWidth={2} />
                </span>
                <h3 className="text-[15px] font-semibold text-foreground mb-1.5">
                  {isAr ? c.ar : c.en}
                </h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  {isAr ? c.arS : c.enS}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Standards & compliance ───── */}
      <section id="standards" className="relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
          <div className="max-w-3xl mb-10">
            <p className="eyebrow text-primary mb-3">{isAr ? "المعايير والامتثال" : "Standards & compliance"}</p>
            <h2 className="display-h2 text-foreground mb-4">
              {isAr ? "مبنية على ثمانية معايير وطنية ودولية." : "Built on eight national & international standards."}
            </h2>
            <p className="body-lead text-muted-foreground">
              {isAr
                ? "كل ميزة في المنصة تحمل وسماً بمعرّفات المتطلبات (REQ-IDs) ومسارها إلى المعايير المعتمدة."
                : "Every feature is tagged with REQ-IDs and traced to the standard it satisfies."}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { code: "DGA 5.17-5.21", title_ar: "هيئة الحكومة الرقمية", title_en: "Digital Government Authority", count: "12/12" },
              { code: "EFQM 2025", title_ar: "نموذج التميز الأوروبي", title_en: "European excellence model", count: "7/7" },
              { code: "ISO 9001 / 10002 / 9241", title_ar: "الجودة وقابلية الاستخدام", title_en: "Quality & usability", count: "7/7" },
              { code: "WCAG 2.2 AA", title_ar: "إمكانية الوصول الرقمي", title_en: "Web accessibility", count: "8/8" },
              { code: "PDPL", title_ar: "حماية البيانات الشخصية", title_en: "Personal data protection (KSA)", count: "5/5" },
              { code: "NCA-ECC", title_ar: "الضوابط الأساسية للأمن السيبراني", title_en: "Essential cybersecurity controls", count: "5/5" },
              { code: "Vision 2030", title_ar: "محاور الرؤية الوطنية", title_en: "National pillars", count: "3/3" },
              { code: "DGA Qiyas", title_ar: "مؤشر النضج الرقمي", title_en: "Digital maturity index", count: "6/6" },
            ].map((s) => (
              <div key={s.code} className="warm-panel p-4 rounded-xl flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-mono text-primary font-semibold mb-1">{s.code}</p>
                  <p className="text-sm font-semibold text-foreground leading-snug">
                    {isAr ? s.title_ar : s.title_en}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 ring-1 ring-primary/15 px-2 py-0.5 rounded-full shrink-0 tabular-nums">
                  <CheckCircle2 size={11} /> {s.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Awards readiness ───── */}
      <section id="awards" className="relative bg-surface-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
          <div className="max-w-3xl mb-12">
            <p className="eyebrow text-primary mb-3">{isAr ? "جاهزية الجوائز" : "Award readiness"}</p>
            <h2 className="display-h2 text-foreground mb-4">
              {isAr ? "ثلاث عشرة جائزة — جميع المعايير مغطّاة." : "Thirteen awards — every criterion mapped."}
            </h2>
            <p className="body-lead text-muted-foreground">
              {isAr
                ? "صفحات المنصة تخدم كأدلة فعلية لمعايير الجوائز المحلية والعالمية، مع جدول تتبّع كامل."
                : "Platform pages serve as live evidence for local and global award criteria, with a full traceability matrix."}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="premium-card p-7">
              <div className="flex items-center gap-3 mb-5">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                  <Building2 size={20} strokeWidth={2} />
                </span>
                <h3 className="text-base font-semibold text-foreground">
                  {isAr ? "جوائز محلية (السعودية)" : "Local awards (Saudi Arabia)"}
                </h3>
              </div>
              <ul className="space-y-2.5 text-[13px]">
                {[
                  { ar: "جائزة الملك عبدالعزيز للجودة (KAQA)", en: "King Abdulaziz Quality Award (KAQA)", c: "9/9" },
                  { ar: "جائزة تميّز الحكومية (تَمَيُّز)", en: "Tamayyuz Government Excellence Award", c: "5/5" },
                  { ar: "جائزة مكة للتميّز الحكومي", en: "MAKKAH Award for Government Excellence", c: "5/5" },
                  { ar: "جائزة إعتراز للمشاركة المجتمعية", en: "Eteraz — Citizen Engagement (NTP)", c: "4/4" },
                  { ar: "جائزة تجربة المستفيد السعودية", en: "Saudi Customer Experience Award", c: "6/6" },
                  { ar: "قياس نضج التحول الرقمي (DGA)", en: "DGA Qiyas — Digital Maturity Index", c: "6/6" },
                ].map((a) => (
                  <li key={a.en} className="flex items-center justify-between gap-3 py-2 border-b border-border/60 last:border-0">
                    <span className="text-foreground">{isAr ? a.ar : a.en}</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 ring-1 ring-primary/15 px-2 py-0.5 rounded-full shrink-0 tabular-nums">
                      <CheckCircle2 size={11} /> {a.c}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="premium-card p-7">
              <div className="flex items-center gap-3 mb-5">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-[hsl(32_64%_14%)] ring-1 ring-accent/30">
                  <Globe2 size={20} strokeWidth={2} />
                </span>
                <h3 className="text-base font-semibold text-foreground">
                  {isAr ? "جوائز عالمية" : "Global awards"}
                </h3>
              </div>
              <ul className="space-y-2.5 text-[13px]">
                {[
                  { ar: "جائزة EFQM العالمية (RFE → Prize → Award)", en: "EFQM Global Award (RFE → Prize → Award)", c: "7/7" },
                  { ar: "جائزة بولدريج للأداء المتميّز", en: "Malcolm Baldrige Performance Excellence", c: "7/7" },
                  { ar: "جوائز Stevie لخدمة العملاء", en: "Stevie Awards — Customer Service", c: "4/4" },
                  { ar: "جوائز الأمم المتحدة للخدمة العامة", en: "UN Public Service Awards", c: "3/3" },
                  { ar: "القمة العالمية للحكومات — أفضل خدمة عامة", en: "World Government Summit — Best Public Service", c: "3/3" },
                  { ar: "Apolitical — Future of Government / IAOP 100", en: "Apolitical & IAOP — Future of Government", c: "2/2" },
                ].map((a) => (
                  <li key={a.en} className="flex items-center justify-between gap-3 py-2 border-b border-border/60 last:border-0">
                    <span className="text-foreground">{isAr ? a.ar : a.en}</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 ring-1 ring-primary/15 px-2 py-0.5 rounded-full shrink-0 tabular-nums">
                      <CheckCircle2 size={11} /> {a.c}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Architecture pillars ───── */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
          <div className="max-w-3xl mb-12">
            <p className="eyebrow text-primary mb-3">{isAr ? "الالتزامات المعمارية" : "Architecture commitments"}</p>
            <h2 className="display-h2 text-foreground mb-4">
              {isAr ? "أربعة مبادئ غير قابلة للتفاوض." : "Four non-negotiable principles."}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { Icon: Languages, ar: "ثنائية اللغة افتراضياً", en: "Bilingual by default", arS: "كل صفحة وكل حقل بالعربية والإنجليزية مع دعم RTL كامل", enS: "Every page, every field — Arabic & English with full RTL." },
              { Icon: Accessibility, ar: "إمكانية وصول WCAG 2.2 AA", en: "WCAG 2.2 AA accessibility", arS: "حجم خط، تباين، تسطير، وحركة محدودة عند الحاجة", enS: "Font scale, contrast, underlines, reduced motion." },
              { Icon: Lock, ar: "الخصوصية بالتصميم", en: "Privacy by design", arS: "تصنيف بيانات، احتفاظ، طلبات أصحاب البيانات (PDPL)", enS: "Classification, retention, PDPL data-subject requests." },
              { Icon: ShieldCheck, ar: "قابلية التدقيق", en: "Audit-ready", arS: "سجل تدقيق غير قابل للتعديل لكل إجراء", enS: "Immutable audit log for every action." },
            ].map((p) => (
              <div key={p.en} className="premium-card p-5 card-lift">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15 mb-4">
                  <p.Icon size={20} strokeWidth={2} />
                </span>
                <h3 className="text-[15px] font-semibold text-foreground mb-1.5">{isAr ? p.ar : p.en}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{isAr ? p.arS : p.enS}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Roles ───── */}
      <section id="roles" className="relative bg-surface-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
          <div className="max-w-3xl mb-12">
            <p className="eyebrow text-primary mb-3">{isAr ? "مبنية لهذه الأدوار" : "Built for these roles"}</p>
            <h2 className="display-h2 text-foreground mb-4">
              {isAr ? "ست شخصيات — ست تجارب مخصّصة." : "Six personas — six tailored experiences."}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { ar: "تنفيذي", en: "Executive", arD: "نظرة موحّدة على الأداء والأثر — KPI و قبل/بعد", enD: "Unified view of performance & impact — KPIs and before-after." },
              { ar: "مشرف تجربة المستفيد", en: "CX supervisor", arD: "إدارة الجودة، التصعيدات، وموظفي الخدمة", enD: "Quality management, escalations, and team oversight." },
              { ar: "موظف خدمة المستفيدين", en: "Front-line agent", arD: "صندوق وارد موحّد، اقتراحات الرد، قاعدة معرفة", enD: "Unified inbox, reply suggestions, knowledge base." },
              { ar: "مسؤول الجودة", en: "Quality officer", arD: "متابعة المؤشرات، تحليل المواضيع، التقارير", enD: "KPI monitoring, theme analysis, reporting." },
              { ar: "المستفيد", en: "Citizen", arD: "بوّابة الخدمات، الاستشارات العامة، الشكاوى", enD: "Service portal, public consultations, complaints." },
              { ar: "مسؤول النظام", en: "System admin", arD: "إدارة الرحلات، الأدوار، القنوات، الـ SLA", enD: "Manage journeys, roles, channels, SLAs." },
            ].map((r) => (
              <div key={r.en} className="warm-panel p-5 rounded-xl">
                <h3 className="text-[15px] font-semibold text-foreground mb-1.5">{isAr ? r.ar : r.en}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{isAr ? r.arD : r.enD}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Footer CTA ───── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 premium-hero-gradient opacity-60" />
        <div className="relative max-w-5xl mx-auto px-6 lg:px-10 py-20 text-center">
          <h2 className="display-h2 text-foreground mb-4">
            {isAr ? "جاهز لتجربة المنصة بأكملها؟" : "Ready to experience the full platform?"}
          </h2>
          <p className="body-lead text-muted-foreground mb-8 max-w-2xl mx-auto">
            {isAr
              ? "سجّل الدخول بأي حساب تجريبي لاستكشاف ست تجارب مخصّصة — تنفيذي، مشرف، موظف، جودة، مستفيد، مسؤول نظام."
              : "Sign in with any demo account to explore six tailored experiences — executive, supervisor, agent, quality, citizen, and admin."}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={user ? user.landing : "/login"}>
              <Button size="lg" className="gap-2" data-testid="button-footer-cta">
                {user ? (isAr ? "ادخل للوحتي" : "Open my workspace") : (isAr ? "تسجيل الدخول" : "Sign in")}
                <Arrow size={16} />
              </Button>
            </Link>
            <Button size="lg" variant="outline" onClick={scrollTo("capabilities")}>
              {isAr ? "عودة لأعلى" : "Back to top"}
            </Button>
          </div>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo size={28} />
            <div className="flex flex-col leading-tight">
              <span className="text-[13px] font-semibold text-foreground">{t("brand.name")}</span>
              <span className="text-[11px] text-muted-foreground">
                {isAr ? "تجربة المستفيد الحكومية" : "Government Customer Experience"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-5 text-[12px] text-muted-foreground">
            <span>© 2026 CX Platform</span>
            <span className="hidden sm:inline">·</span>
            <span dir="ltr" className="font-mono">v 2.0 · demo</span>
            <span className="hidden sm:inline">·</span>
            <Link href="/login"><a className="hover:text-foreground transition-colors">{isAr ? "تسجيل الدخول" : "Sign in"}</a></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
