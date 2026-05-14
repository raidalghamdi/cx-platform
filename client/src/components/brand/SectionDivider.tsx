/**
 * Subtle gold gradient horizontal divider (DGA accent).
 * Use in place of bare <hr> for richer visual rhythm.
 */
export function SectionDivider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-px w-full bg-gradient-to-r from-transparent via-amber-300/60 to-transparent ${className}`}
      role="separator"
      aria-hidden="true"
    />
  );
}
