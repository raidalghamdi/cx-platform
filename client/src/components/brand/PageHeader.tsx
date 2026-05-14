import type { ComponentType, ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  actions,
  Icon,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  Icon?: ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 pb-5 mb-6 border-b border-border">
      <div className="space-y-1 min-w-0">
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
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
