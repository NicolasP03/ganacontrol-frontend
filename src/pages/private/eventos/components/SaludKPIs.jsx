// SaludKPIs.jsx
import "../../../../styles/modules/Salud.css";

export default function SaludKPIs({ kpis = [] }) {
  return (
    <div className="sl-kpis-grid">
      {kpis.map((k, i) => (
        <div key={i} className="sl-kpi-card">
          <div className="sl-kpi-card__top">
            <span className="sl-kpi-card__label">{k.label}</span>
            <span className="sl-kpi-card__ico">{k.ico}</span>
          </div>
          <div className="sl-kpi-card__value">{k.value}</div>
          <div className={`sl-kpi-card__delta sl-kpi-card__delta--${k.trend}`}>
            {k.trend === "up" ? "▲" : k.trend === "down" ? "▼" : "●"} {k.delta}
          </div>
          <p className="sl-kpi-card__sub">{k.sub}</p>
        </div>
      ))}
    </div>
  );
}