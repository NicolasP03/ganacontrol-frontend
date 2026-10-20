import "../../../../styles/modules/Ventas.css";

export default function VentasKPIs({ kpis = [] }) {
  return (
    <section className="vt-kpis">
      {(Array.isArray(kpis) ? kpis : []).map((item, index) => (
        <article key={index} className="vt-kpi-card">
          <div className="vt-kpi-card__icon">{item.ico}</div>

          <div className="vt-kpi-card__content">
            <p className="vt-kpi-card__label">{item.label}</p>
            <h3 className="vt-kpi-card__value">{item.value}</h3>
            <span
              className={`vt-kpi-card__delta vt-kpi-card__delta--${item.trend || "flat"}`}
            >
              {item.delta}
            </span>
          </div>
        </article>
      ))}
    </section>
  );
}