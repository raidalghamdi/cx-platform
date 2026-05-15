import type { ComponentType, ReactNode } from "react";
import { RequirementBadge } from "@/components/brand/RequirementBadge";

export function PageHeader({
  title,
  subtitle,
  actions,
  Icon,
  requirementIds,
  standards,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  Icon?: ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  /** Optional REQ-IDs from the 188-row requirements matrix. */
  requirementIds?: string[];
  /** Optional standards mapped to those REQ-IDs (ISO/DGA/WCAG/EFQM/PDPL/NCA-ECC). */
  standards?: string[];
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 pb-5 mb-6 border-b border-border">
      <div className="space-y-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h1
            className="flex items-center gap-2.5 text-xl font-semibold tracking-tight text-foreground"
            data-testid="page-title"
          >
            {Icon && (
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon size={18} strokeWidth={2} />
              </span>
            )}
            <span className="truncate">{title}</span>
          </h1>
          {requirementIds && requirementIds.length > 0 && (
            <RequirementBadge ids={requirementIds} standards={standards} />
          )}
        </div>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
