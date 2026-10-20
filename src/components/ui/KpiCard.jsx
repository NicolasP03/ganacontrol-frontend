/**
 * KpiCard — Tarjeta de indicador clave de desempeño
 *
 * Props:
 *  - label    : string  — etiqueta del KPI
 *  - value    : string  — valor principal
 *  - sub      : string  — texto secundario / tendencia
 *  - icon     : string  — emoji o texto del ícono
 *  - barPct   : number  — porcentaje de la barra (0-100), opcional
 *  - onClick  : fn      — acción al hacer clic, opcional
 */
export default function KpiCard({ label, value, sub, icon, barPct, onClick }) {
  return (
    <div
      className="gc-kpi"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      {/* Encabezado: label + ícono */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="gc-kpi__label">{label}</span>
        {icon && (
          <span style={{ fontSize: "1.4rem" }}>{icon}</span>
        )}
      </div>

      {/* Valor principal */}
      <div className="gc-kpi__value">{value}</div>

      {/* Subtexto */}
      {sub && (
        <div className="gc-kpi__sub">{sub}</div>
      )}

      {/* Barra de progreso opcional */}
      {barPct !== undefined && (
        <div className="gc-kpi__bar">
          <div
            className="gc-kpi__bar-fill"
            style={{ width: `${Math.min(barPct, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}