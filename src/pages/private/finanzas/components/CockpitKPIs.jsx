import "../../../../styles/modules/Cockpit.css";

export default function CockpitKPIs({ kpis = [], loading = false }) {
  if (loading) {
    return (
      <div className="ck-kpis-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="ck-kpi-card">
            <div className="ck-kpi-card__top">
              <span className="ck-kpi-card__label">Cargando...</span>
              <span className="ck-kpi-card__ico">📊</span>
            </div>
            <div className="ck-kpi-card__value">--</div>
            <div className="ck-kpi-card__delta ck-kpi-card__delta--flat">
              ● Cargando información
            </div>
            <div className="ck-kpi-card__bar">
              <div className="ck-kpi-card__bar-fill" style={{ width: "0%" }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!Array.isArray(kpis) || !kpis.length) {
    return (
      <div className="ck-kpis-grid">
        <div className="ck-kpi-card">
          <div className="ck-kpi-card__top">
            <span className="ck-kpi-card__label">Sin datos</span>
            <span className="ck-kpi-card__ico">📊</span>
          </div>
          <div className="ck-kpi-card__value">--</div>
          <div className="ck-kpi-card__delta ck-kpi-card__delta--flat">
            ● Esperando información
          </div>
          <div className="ck-kpi-card__bar">
            <div className="ck-kpi-card__bar-fill" style={{ width: "0%" }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ck-kpis-grid">
      {kpis.map((k, i) => {
        const pct = Math.max(0, Math.min(Number(k.pct || 0), 100));
        const trend = k.trend || "flat";

        return (
          <div key={i} className="ck-kpi-card">
            <div className="ck-kpi-card__top">
              <span className="ck-kpi-card__label">{k.label || "--"}</span>
              <span className="ck-kpi-card__ico">{k.ico || "📊"}</span>
            </div>

            <div className="ck-kpi-card__value">{k.value || "--"}</div>

            <div className={`ck-kpi-card__delta ck-kpi-card__delta--${trend}`}>
              {trend === "up" ? "▲" : trend === "down" ? "▼" : "●"} {k.delta || "Sin variación"}
            </div>

            <div className="ck-kpi-card__bar">
              <div className="ck-kpi-card__bar-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}