/**
 * Deterministic colored circle showing person initials. Color derived
 * from a stable hash of the name, picked from the DGA-friendly palette.
 */
const PALETTE = [
  { bg: "bg-emerald-100", fg: "text-emerald-700", ring: "ring-emerald-200" },
  { bg: "bg-amber-100", fg: "text-amber-800", ring: "ring-amber-200" },
  { bg: "bg-sky-100", fg: "text-sky-700", ring: "ring-sky-200" },
  { bg: "bg-violet-100", fg: "text-violet-700", ring: "ring-violet-200" },
  { bg: "bg-rose-100", fg: "text-rose-700", ring: "ring-rose-200" },
  { bg: "bg-teal-100", fg: "text-teal-700", ring: "ring-teal-200" },
  { bg: "bg-indigo-100", fg: "text-indigo-700", ring: "ring-indigo-200" },
  { bg: "bg-orange-100", fg: "text-orange-800", ring: "ring-orange-200" },
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
}

export function InitialsAvatar({
  name,
  size = 28,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const p = PALETTE[hash(name) % PALETTE.length];
  const fontSize = Math.round(size * 0.4);
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-semibold ring-1 ${p.bg} ${p.fg} ${p.ring} ${className}`}
      style={{ width: size, height: size, fontSize, lineHeight: 1 }}
      aria-label={name}
    >
      {initials(name) || "?"}
    </span>
  );
}
