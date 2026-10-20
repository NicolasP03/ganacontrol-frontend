// src/pages/private/ganado/components/GanadoKPIs.jsx

import { esAlerta, detalleAlertas } from "../ganado.constants";

// Genera el subtexto dinámico de alertas según lo que haya
function subtextoAlertas(detalle, total) {
  if (total === 0) return "Sin novedades";

  const partes = [];
  if (detalle.muertos)       partes.push(`${detalle.muertos} muerto${detalle.muertos > 1 ? "s" : ""}`);
  if (detalle.enfermos)      partes.push(`${detalle.enfermos} enfermo${detalle.enfermos > 1 ? "s" : ""}`);
  if (detalle.enTratamiento) partes.push(`${detalle.enTratamiento} en tratamiento`);
  if (detalle.enObservacion) partes.push(`${detalle.enObservacion} en observación`);
  if (detalle.proximosParto) partes.push(`${detalle.proximosParto} próximo${detalle.proximosParto > 1 ? "s" : ""} al parto`);
  if (detalle.inactivos)     partes.push(`${detalle.inactivos} inactivo${detalle.inactivos > 1 ? "s" : ""}`);
  if (detalle.vendidos)      partes.push(`${detalle.vendidos} vendido${detalle.vendidos > 1 ? "s" : ""}`);
  if (detalle.descartados)   partes.push(`${detalle.descartados} descartado${detalle.descartados > 1 ? "s" : ""}`);

  // Mostrar máximo 2 conceptos para no desbordar
  if (partes.length <= 2) return partes.join(" · ");
  return `${partes.slice(0, 2).join(" · ")} y más`;
}

export default function GanadoKPIs({ animales }) {
  const total   = animales.length;
  const activos = animales.filter(a => a.estado_general === "Activo").length;
  const pesoAvg = total
    ? Math.round(animales.reduce((s, a) => s + Number(a.peso_actual ?? a.peso ?? 0), 0) / total)
    : 0;

  const totalAlertas = animales.filter(esAlerta).length;
  const detalle      = detalleAlertas(animales);
  const subAlertas   = subtextoAlertas(detalle, totalAlertas);

  const items = [
    {
      label: "Total Cabezas",
      val:   total,
      ico:   "🐄",
      sub:   "Registradas en el sistema",
    },
    {
      label: "Animales Activos",
      val:   activos,
      ico:   "❤️",
      sub:   "En estado general activo",
    },
    {
      label: "Peso Promedio",
      val:   `${pesoAvg} kg`,
      ico:   "⚖️",
      sub:   "Promedio del hato",
    },
    {
      label: "Alertas Activas",
      val:   totalAlertas,
      ico:   totalAlertas === 0 ? "✅" : "⚠️",
      sub:   subAlertas,
      warn:  totalAlertas > 0,
    },
  ];

  return (
    <div className="gc-grid-4" style={{ marginBottom: "var(--space-8)" }}>
      {items.map((k, i) => (
        <div className="gc-kpi" key={i}>
          <div className="gc-kpi__top">
            <span className="gc-kpi__label">{k.label}</span>
            <span className="gc-kpi__ico">{k.ico}</span>
          </div>
          <div className="gc-kpi__value">{k.val}</div>
          <div className={`gc-kpi__sub${k.warn ? " gc-kpi__sub--warn" : ""}`}>
            {k.sub}
          </div>
        </div>
      ))}
    </div>
  );
}