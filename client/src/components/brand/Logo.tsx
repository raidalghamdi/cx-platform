// Custom inline SVG logo — two interlocking arcs representing customer + service.
// Geometric, monochrome, currentColor — works at 24px and 200px.

export function Logo({ size = 36, withWordmark = false }: { size?: number; withWordmark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3" aria-label="CX Platform">
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
      >
        <rect width="40" height="40" rx="10" fill="hsl(var(--primary))" />
        {/* two interlocking arcs */}
        <path
          d="M14 14.5a5.5 5.5 0 1 1 5.5 5.5"
          stroke="white"
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M26 25.5a5.5 5.5 0 1 1-5.5-5.5"
          stroke="hsl(var(--accent))"
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      {withWordmark && (
        <span className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-foreground">CX Platform</span>
          <span className="text-[11px] text-muted-foreground">منصة تجربة المستفيد</span>
        </span>
      )}
    </span>
  );
}
