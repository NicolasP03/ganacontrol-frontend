// InventarioKPIs.jsx
import "../../../../styles/modules/Inventario.css";

export default function InventarioKPIs({ kpis = [] }) {
  return (
    <div className="iv-kpis-grid">
      {kpis.map((k, i) => (
        <div key={i} className="iv-kpi-card">
          <div className="iv-kpi-card__top">
            <span className="iv-kpi-card__label">{k.label}</span>
            <span className="iv-kpi-card__ico">{k.ico}</span>
          </div>
          <div className="iv-kpi-card__value">{k.value}</div>
          <div className={`iv-kpi-card__delta iv-kpi-card__delta--${k.trend}`}>
            {k.trend === "up" ? "▲" : k.trend === "down" ? "▼" : "●"} {k.delta}
          </div>
          <p className="iv-kpi-card__sub">{k.sub}</p>
        </div>
      ))}
    </div>
  );
}