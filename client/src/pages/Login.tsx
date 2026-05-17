import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth, DEMO_ACCOUNTS, type DemoAccount } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, ChevronRight, ChevronLeft, ShieldCheck, Sparkles, Heart, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { HeroPattern } from "@/components/brand/HeroPattern";

// Feature flag: when VITE_SHOW_DEMO_ACCOUNTS="false", hide the demo-account
// panel. To flip in production, set the env var in your Vercel project.
const SHOW_DEMO_ACCOUNTS =
  (import.meta.env.VITE_SHOW_DEMO_ACCOUNTS ?? "true").toLowerCase() !== "false";

export default function Login() {
  const { signIn, user } = useAuth();
  const { t, lang, toggle, isRTL } = useLocale();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) navigate(user.landing);
  }, [user, navigate]);

  function fill(account: DemoAccount) {
    setEmail(account.email);
    setPassword(account.password);
    setError(null);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const u = signIn(email, password);
    if (!u) setError(t("login.invalid"));
  }

  const Chevron = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div className="min-h-screen grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {/* Left brand panel — DGA Saudi green gradient */}
      <aside
        className="relative hidden lg:flex flex-col justify-between p-12 text-white overflow-hidden"
        style={{
          background:
            "linear-gradient(155deg, hsl(152 64% 22%) 0%, hsl(152 65% 28%) 45%, hsl(152 60% 36%) 100%)",
        }}
      >
        {/* decorative arabesque */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-[420px] w-[420px] rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-[360px] w-[360px] rounded-full bg-[hsl(46_99%_49%/0.18)] blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
          <svg viewBox="0 0 800 600" preserveAspectRatio="none" className="h-full w-full">
            <defs>
              <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.4" fill="white" />
              </pattern>
            </defs>
            <rect width="800" height="600" fill="url(#dots)" />
          </svg>
        </div>
        <div className="pointer-events-none text-white"><HeroPattern variant="star" opacity={0.05} color="currentColor" /></div>

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="absolute inset-0 -m-2 rounded-full bg-[hsl(46_99%_49%/0.35)] blur-xl animate-soft-pulse" aria-hidden />
              <span className="relative inline-flex"><Logo size={44} /></span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-semibold">{t("brand.name")}</span>
              <span className="text-xs text-white/70">
                {lang === "ar" ? "تجربة المستفيد الحكومية" : "Government Customer Experience"}
              </span>
            </div>
          </div>
        </div>

        <div className="relative space-y-8 max-w-md">
          <div>
            <h1 className="text-xl font-semibold leading-snug">{t("brand.heroLine")}</h1>
            <p className="mt-3 text-sm text-white/75 leading-relaxed">{t("brand.tagline")}</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { Icon: Heart, ar: "عميل في القلب", en: "Citizen-first" },
              { Icon: Activity, ar: "قياس فوري", en: "Real-time signals" },
              { Icon: ShieldCheck, ar: "تدقيق وحوكمة", en: "Audit & governance" },
            ].map((f) => (
              <div key={f.en} className="rounded-xl bg-white/8 border border-white/10 p-3 backdrop-blur-sm">
                <f.Icon size={18} className="text-[hsl(38_92%_70%)] mb-2" strokeWidth={2} />
                <p className="text-[12px] font-medium text-white leading-tight">
                  {lang === "ar" ? f.ar : f.en}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-between text-[11px] text-white/55">
          <span>© 2026 CX Platform</span>
          <span dir="ltr" className="font-mono">v 1.0 · demo</span>
        </div>
      </aside>

      {/* Right form panel */}
      <main className="flex flex-col">
        <div className="flex items-center justify-between px-6 lg:px-12 pt-6">
          <button
            onClick={toggle}
            data-testid="button-toggle-language"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-border bg-background text-xs font-medium hover:bg-muted"
          >
            <Globe size={14} />
            {lang === "ar" ? "English" : "العربية"}
          </button>
          <span className="text-[11px] text-muted-foreground hidden sm:inline">{t("login.poweredBy")}</span>
        </div>

        <div className="flex-1 flex items-start justify-center px-6 lg:px-12 py-10">
          <div className="w-full max-w-[460px] space-y-7">
            <div className="lg:hidden flex items-center gap-3">
              <Logo size={36} />
              <span className="text-base font-semibold">{t("brand.name")}</span>
            </div>

            <header className="space-y-3">
              <p className="eyebrow text-muted-foreground">
                {lang === "ar" ? "تسجيل الدخول" : "Sign In"}
              </p>
              <h2 className="display-h2 text-foreground">{t("login.headline")}</h2>
              <p className="body-lead text-muted-foreground">{t("login.sub")}</p>
            </header>

            <form onSubmit={submit} className="space-y-4" data-testid="form-login">
              <div className="space-y-1.5">
                <Label htmlFor="email">{t("common.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@cx.gov.sa"
                  autoComplete="email"
                  data-testid="input-email"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">{t("common.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••"
                  autoComplete="current-password"
                  data-testid="input-password"
                  required
                />
              </div>
              {error && (
                <p className="text-xs text-destructive" data-testid="text-login-error">
                  {error}
                </p>
              )}
              <Button type="submit" className="w-full h-10" data-testid="button-sign-in">
                {t("common.signIn")}
              </Button>
            </form>

            {/* Demo accounts card — toggle via VITE_SHOW_DEMO_ACCOUNTS */}
            {SHOW_DEMO_ACCOUNTS && (
            <section className="premium-card p-1.5">
              <div className="px-3 pt-2.5 pb-2 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <p className="eyebrow text-muted-foreground">
                    {lang === "ar" ? "وصول تجريبي" : "Demo Access"}
                  </p>
                  <h3 className="text-sm font-semibold">{t("login.demoTitle")}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{t("login.demoHelp")}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  <Sparkles size={11} /> demo
                </span>
              </div>
              <ul className="divide-y divide-border">
                {DEMO_ACCOUNTS.map((a) => (
                  <li key={a.email}>
                    <button
                      type="button"
                      onClick={() => fill(a)}
                      data-testid={`demo-${a.role}`}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-start hover:bg-muted/60 transition-colors"
                    >
                      <span className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-semibold">
                        {a.initials}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="flex items-center gap-1.5 text-[12px] font-semibold text-foreground">
                          {t("role." + a.role)}
                          <span className="text-muted-foreground font-normal truncate">
                            · {lang === "ar" ? a.title_ar : a.title_en}
                          </span>
                        </span>
                        <span dir="ltr" className={cn("block text-[11px] text-muted-foreground truncate", isRTL && "text-right")}>
                          {a.email}
                        </span>
                      </span>
                      <Chevron size={16} className="text-muted-foreground shrink-0" />
                    </button>
                  </li>
                ))}
              </ul>
              <p className="text-[10.5px] text-muted-foreground px-3 pb-2 pt-1.5 leading-snug">
                {t("login.demoCaption")}
              </p>
            </section>
            )}

            <p className="text-[11px] text-muted-foreground text-center">
              {t("login.contactSupport")}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
