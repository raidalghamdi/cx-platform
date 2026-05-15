import type { ComponentType, ReactNode } from "react";
import { RequirementBadge } from "@/components/brand/RequirementBadge";

export function PageHeader({
  title,
  subtitle,
  actions,
  Icon,
  requirementIds,
  standards,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  Icon?: ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  /** Optional REQ-IDs from the 188-row requirements matrix. */
  requirementIds?: string[];
  /** Optional standards mapped to those REQ-IDs (ISO/DGA/WCAG/EFQM/PDPL/NCA-ECC). */
  standards?: string[];
  /** Optional ALL-CAPS micro-label rendered above the title (modernized). */
  eyebrow?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 pb-6 mb-7 border-b border-border/70">
      <div className="space-y-2 min-w-0">
        {eyebrow && (
          <p className="eyebrow text-muted-foreground" data-testid="page-eyebrow">
            {eyebrow}
          </p>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          <h1
            className="display-h2 flex items-center gap-3 text-foreground"
            data-testid="page-title"
          >
            {Icon && (
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                <Icon size={20} strokeWidth={2} />
              </span>
            )}
            <span className="truncate">{title}</span>
          </h1>
          {requirementIds && requirementIds.length > 0 && (
            <RequirementBadge ids={requirementIds} standards={standards} />
          )}
        </div>
        {subtitle && <p className="body-lead text-muted-foreground max-w-2xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
