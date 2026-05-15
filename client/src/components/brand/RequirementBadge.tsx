import { FileCheck2 } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// REQ-ID badge — traceability to the 188-row requirements matrix.
// Displays the requirement code(s) on a module/section and, on hover,
// the standards (ISO/DGA/WCAG/EFQM/PDPL/NCA-ECC) those requirements map to.
export type RequirementBadgeProps = {
  ids: string[];           // e.g. ["FR-12", "FR-15"]
  standards?: string[];    // e.g. ["ISO 10002 §7.4", "DGA 5.18.2"]
  className?: string;
};

export function RequirementBadge({ ids, standards = [], className }: RequirementBadgeProps) {
  const { lang } = useLocale();
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            data-testid={`req-badge-${ids.join("-")}`}
            className={cn(
              "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-mono font-medium",
              "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors",
              className,
            )}
            aria-label={
              lang === "ar"
                ? `متطلبات: ${ids.join("، ")}`
                : `Requirements: ${ids.join(", ")}`
            }
          >
            <FileCheck2 size={10} strokeWidth={2.4} />
            <span>{ids.join(" · ")}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          align="start"
          className="max-w-[280px] p-3 text-xs"
        >
          <div className="font-semibold text-[11px] mb-1.5">
            {lang === "ar" ? "مرجع المتطلبات" : "Requirements reference"}
          </div>
          <div className="space-y-1.5">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {lang === "ar" ? "معرّفات المصفوفة" : "Matrix IDs"}
              </span>
              <div className="font-mono text-[11px] text-foreground mt-0.5">
                {ids.join(", ")}
              </div>
            </div>
            {standards.length > 0 && (
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {lang === "ar" ? "المرجعيات" : "Standards"}
                </span>
                <ul className="mt-0.5 space-y-0.5">
                  {standards.map((s) => (
                    <li key={s} className="text-[11px] text-foreground">
                      • {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="pt-1 border-t border-border text-[10px] text-muted-foreground">
              {lang === "ar"
                ? "متتبَّع في مصفوفة 188 متطلباً (Phase 1)."
                : "Tracked in the 188-row requirements matrix (Phase 1)."}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
