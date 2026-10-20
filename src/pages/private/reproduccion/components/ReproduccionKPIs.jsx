// src/pages/private/reproduccion/components/ReproduccionKPIs.jsx

import { calcularKPIs } from "../reproduccion.constants";

export default function ReproduccionKPIs({ registros }) {
  const { total, gestantes, partos, fallidas, tasaPrenez } = calcularKPIs(registros);

  const items = [
    {
      label: "Tasa de Preñez",
      val:   `${tasaPrenez}%`,
      ico:   "🧪",
      sub:   `${gestantes} gestantes activas`,
      pct:   tasaPrenez,
    },
    {
      label: "Total Servicios",
      val:   total,
      ico:   "🔬",
      sub:   "Registros en el ciclo",
      pct:   Math.min(total * 2, 100),
    },
    {
      label: "Partos Registrados",
      val:   partos,
      ico:   "🐄",
      sub:   "Partos exitosos",
      pct:   total > 0 ? Math.round((partos / total) * 100) : 0,
    },
    {
      label: "Fallidas / Abortos",
      val:   fallidas,
      ico:   "⚠️",
      sub:   fallidas === 0 ? "Sin novedades" : "Requieren seguimiento",
      pct:   total > 0 ? Math.round((fallidas / total) * 100) : 0,
      warn:  fallidas > 0,
    },
  ];

  return (
    <div className="rp-grid-4">
      {items.map((k, i) => (
        <div className="rp-kpi" key={i}>
          <div className="rp-kpi__top">
            <span className="rp-kpi__label">{k.label}</span>
            <span className="rp-kpi__ico">{k.ico}</span>
          </div>
          <div className="rp-kpi__value">{k.val}</div>
          <div className={`rp-kpi__sub${k.warn ? " rp-kpi__sub--warn" : ""}`}>
            {k.sub}
          </div>
          <div className="rp-kpi__bar">
            <div className="rp-kpi__bar-fill" style={{ width: `${k.pct}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}