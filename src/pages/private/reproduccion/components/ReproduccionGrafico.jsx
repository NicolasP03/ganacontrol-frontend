// src/pages/private/reproduccion/components/ReproduccionGrafico.jsx
// Barras mensuales de servicios registrados (últimos 6 meses).

import { useMemo } from "react";

const MESES_SHORT = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

function ultimosSeisMeses() {
  const hoy  = new Date();
  const meses = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
    meses.push({ año: d.getFullYear(), mes: d.getMonth(), label: MESES_SHORT[d.getMonth()] });
  }
  return meses;
}

export default function ReproduccionGrafico({ registros }) {
  const datos = useMemo(() => {
    return ultimosSeisMeses().map(m => {
      const count = registros.filter(r => {
        if (!r.fecha_servicio) return false;
        const d = new Date(r.fecha_servicio + "T00:00:00");
        return d.getFullYear() === m.año && d.getMonth() === m.mes;
      }).length;
      return { ...m, count };
    });
  }, [registros]);

  const max = Math.max(...datos.map(d => d.count), 1);
  const actual = datos[datos.length - 1];

  return (
    <div className="rp-card">
      <h3 className="rp-card__title">Servicios por Mes</h3>
      <div className="rp-grafico">
        {datos.map((b, i) => {
          const pct    = Math.round((b.count / max) * 100);
          const activo = b.mes === actual.mes && b.año === actual.año;
          return (
            <div key={i} className="rp-grafico__col">
              <span className="rp-grafico__num">{b.count > 0 ? b.count : ""}</span>
              <div
                className={`rp-grafico__bar${activo ? " rp-grafico__bar--active" : ""}`}
                style={{ height: `${Math.max(pct, 4)}%` }}
                title={`${b.label}: ${b.count} servicio${b.count !== 1 ? "s" : ""}`}
              />
              <span className={`rp-grafico__label${activo ? " rp-grafico__label--active" : ""}`}>
                {b.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}