// DashboardKPIs.jsx
import "../../../../styles/modules/Dashboard.css";

export default function DashboardKPIs({ kpis = [] }) {
  return (
    <div className="db-kpis">
      {kpis.map((k, i) => (
        <div key={i} className="db-kpi-card">
          <div className="db-kpi-card__top">
            <span className="db-kpi-card__label">{k.label}</span>
            {k.icon && (
              <img src={k.icon} alt={k.label} className="db-kpi-card__ico" />
            )}
          </div>
          <div className="db-kpi-card__value">{k.value}</div>
          <div className={`db-kpi-card__sub db-kpi-card__sub--${k.trend}`}>
            {k.trend === "up" ? "▲" : k.trend === "down" ? "▼" : "●"} {k.sub}
          </div>
          <div className="db-kpi-card__bar">
            <div
              className="db-kpi-card__bar-fill"
              style={{ "--pct": `${k.barPct}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}