/**
 * StatBar — Barra de nivel de suministro / progreso
 *
 * Props:
 *  - label   : string  — nombre del suministro
 *  - pct     : number  — porcentaje (0–100)
 *  - showAlert: boolean — mostrar color de alerta automáticamente
 */
export default function StatBar({ label, pct, showAlert = true }) {
  const isLow  = showAlert && pct <= 20;
  const isMid  = showAlert && pct > 20 && pct <= 50;

  const barColor = isLow
    ? "var(--color-danger)"
    : isMid
    ? "var(--color-warning)"
    : "linear-gradient(to right, var(--green-700), var(--green-400))";

  const textColor = isLow
    ? "var(--color-danger)"
    : isMid
    ? "var(--color-warning)"
    : "var(--text-secondary)";

  return (
    <div>
      {/* Label + porcentaje */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-1)",
          fontSize: "0.82rem",
        }}
      >
        <span style={{ fontWeight: 600, color: textColor }}>{label}</span>
        <span style={{ fontWeight: 800, color: barColor.startsWith("var") ? barColor : "var(--green-700)" }}>
          {pct}%
        </span>
      </div>

      {/* Barra */}
      <div className="mod-progress">
        <div
          className="mod-progress__fill"
          style={{
            width: `${Math.min(pct, 100)}%`,
            background: barColor,
          }}
        />
      </div>
    </div>
  );
}