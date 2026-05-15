import { Accessibility, Type, Contrast, Gauge, Underline, RotateCcw } from "lucide-react";
import { useA11y } from "@/contexts/AccessibilityContext";
import { useLocale } from "@/contexts/LocaleContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

// WCAG 2.2 AA & DGA 5.17.1 / 5.20.2 — accessibility quick controls.
export function AccessibilityPanel() {
  const { t, lang, isRTL } = useLocale();
  const a11y = useA11y();
  const scales: { key: typeof a11y.fontScale; label: string }[] = [
    { key: "sm", label: "A" },
    { key: "md", label: "A" },
    { key: "lg", label: "A" },
    { key: "xl", label: "A" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative inline-flex items-center justify-center h-9 w-9 rounded-md border border-border bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/30"
          aria-label={lang === "ar" ? "إعدادات إمكانية الوصول" : "Accessibility settings"}
          data-testid="button-accessibility"
        >
          <Accessibility size={16} className="text-primary" />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-accent ring-2 ring-card" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-80 p-0">
        <div className="px-4 pt-3 pb-2 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
          <DropdownMenuLabel className="px-0 pb-1 flex items-center gap-2 text-sm">
            <Accessibility size={14} className="text-primary" />
            {lang === "ar" ? "إمكانية الوصول" : "Accessibility"}
          </DropdownMenuLabel>
          <p className="text-[11px] text-muted-foreground leading-snug">
            {lang === "ar"
              ? "اضبط إعدادات العرض وفق احتياجك. WCAG 2.2 AA · معيار DGA 5.17.1"
              : "Adjust how the platform is displayed. WCAG 2.2 AA · DGA 5.17.1"}
          </p>
        </div>

        <div className="p-4 space-y-4">
          {/* Font size */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <Type size={13} className="text-primary" />
              {lang === "ar" ? "حجم الخط" : "Text size"}
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {scales.map((s, i) => (
                <button
                  key={s.key}
                  onClick={() => a11y.setFontScale(s.key)}
                  data-testid={`a11y-scale-${s.key}`}
                  className={cn(
                    "h-9 rounded-md border text-foreground transition-colors",
                    a11y.fontScale === s.key
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : "border-border bg-background hover:bg-muted",
                  )}
                  aria-pressed={a11y.fontScale === s.key}
                >
                  <span style={{ fontSize: `${0.75 + i * 0.125}rem` }}>{s.label}</span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground">
              {lang === "ar"
                ? "صغير · متوسط · كبير · أكبر"
                : "Small · Medium · Large · X-Large"}
            </p>
          </div>

          <DropdownMenuSeparator className="-mx-4" />

          {/* High contrast */}
          <label className="flex items-center justify-between cursor-pointer gap-3">
            <span className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <Contrast size={13} className="text-primary" />
              {lang === "ar" ? "تباين عالٍ" : "High contrast"}
            </span>
            <Switch
              checked={a11y.contrast === "high"}
              onCheckedChange={(v) => a11y.setContrast(v ? "high" : "normal")}
              data-testid="a11y-toggle-contrast"
              aria-label={lang === "ar" ? "تباين عالٍ" : "High contrast"}
            />
          </label>

          {/* Reduce motion */}
          <label className="flex items-center justify-between cursor-pointer gap-3">
            <span className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <Gauge size={13} className="text-primary" />
              {lang === "ar" ? "تقليل الحركة" : "Reduce motion"}
            </span>
            <Switch
              checked={a11y.reduceMotion}
              onCheckedChange={a11y.setReduceMotion}
              data-testid="a11y-toggle-motion"
              aria-label={lang === "ar" ? "تقليل الحركة" : "Reduce motion"}
            />
          </label>

          {/* Underline links */}
          <label className="flex items-center justify-between cursor-pointer gap-3">
            <span className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <Underline size={13} className="text-primary" />
              {lang === "ar" ? "تسطير الروابط" : "Underline links"}
            </span>
            <Switch
              checked={a11y.underlineLinks}
              onCheckedChange={a11y.setUnderlineLinks}
              data-testid="a11y-toggle-underline"
              aria-label={lang === "ar" ? "تسطير الروابط" : "Underline links"}
            />
          </label>

          <DropdownMenuSeparator className="-mx-4" />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-muted-foreground leading-snug max-w-[180px]">
              {lang === "ar"
                ? "يحفظ خلال الجلسة فقط — قارئ الشاشة مدعوم بالكامل."
                : "Saved for this session — full screen-reader support."}
            </span>
            <button
              onClick={a11y.reset}
              data-testid="a11y-reset"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-border bg-background text-[11px] font-medium hover:bg-muted"
            >
              <RotateCcw size={11} />
              {lang === "ar" ? "استعادة" : "Reset"}
            </button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
