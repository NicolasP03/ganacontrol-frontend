/**
 * Badge — Etiqueta de estado coloreada
 *
 * Props:
 *  - text    : string — texto del badge
 *  - color   : string — color hex del badge (ej: "#22c55e")
 *  - variant : "success" | "warning" | "danger" | "info" | "custom"
 *              Si variant="custom" usa el color prop directamente
 */

const VARIANTS = {
  success: { bg: "rgba(34,197,94,0.12)",  color: "#15803d" },
  warning: { bg: "rgba(245,158,11,0.12)", color: "#b45309" },
  danger:  { bg: "rgba(239,68,68,0.12)",  color: "#b91c1c" },
  info:    { bg: "rgba(59,130,246,0.12)", color: "#1d4ed8" },
  neutral: { bg: "rgba(100,116,139,0.12)",color: "#475569" },
};

export default function Badge({ text, variant = "success", color }) {
  const style =
    variant === "custom" && color
      ? { background: `${color}20`, color: color }
      : VARIANTS[variant] || VARIANTS.neutral;

  return (
    <span
      className="gc-badge"
      style={{
        background: style.bg || style.background,
        color: style.color,
      }}
    >
      {text}
    </span>
  );
}