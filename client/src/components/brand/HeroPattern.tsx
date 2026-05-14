/**
 * Saudi-inspired geometric SVG pattern overlay for hero strips.
 * Renders an absolutely positioned, low-opacity pattern. Parent should be `relative`.
 *
 * variant="hex"  — interlocking hexagons (Najdi-inspired)
 * variant="star" — 8-point star tessellation
 * variant="grid" — thin diagonal grid
 */
export function HeroPattern({
  variant = "hex",
  opacity = 0.06,
  color = "currentColor",
  className = "",
}: {
  variant?: "hex" | "star" | "grid";
  opacity?: number;
  color?: string;
  className?: string;
}) {
  const id = `hp-${variant}-${Math.random().toString(36).slice(2, 8)}`;

  let pattern: JSX.Element;
  if (variant === "hex") {
    pattern = (
      <pattern id={id} width="44" height="38" patternUnits="userSpaceOnUse" patternTransform="scale(1.2)">
        <path
          d="M22 1 L43 13 L43 25 L22 37 L1 25 L1 13 Z"
          fill="none"
          stroke={color}
          strokeWidth="1"
        />
      </pattern>
    );
  } else if (variant === "star") {
    pattern = (
      <pattern id={id} width="48" height="48" patternUnits="userSpaceOnUse" patternTransform="rotate(22.5)">
        <path
          d="M24 4 L29 19 L44 19 L32 28 L37 43 L24 34 L11 43 L16 28 L4 19 L19 19 Z"
          fill="none"
          stroke={color}
          strokeWidth="0.9"
        />
      </pattern>
    );
  } else {
    pattern = (
      <pattern id={id} width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <path d="M0 0 L0 22" stroke={color} strokeWidth="0.7" />
        <path d="M11 0 L11 22" stroke={color} strokeWidth="0.7" opacity="0.5" />
      </pattern>
    );
  }

  return (
    <svg
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ opacity }}
    >
      <defs>{pattern}</defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
