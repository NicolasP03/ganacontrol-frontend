import { calcularKPIsAlimentacion, formatFrecuencia } from "../alimentacion.constants";

export default function AlimentacionKPIs({ registros }) {
  const { total, animalesUnicos, alimentoTop, frecuenciaTop } = calcularKPIsAlimentacion(registros);

  const items = [
    {
      label: "Total Registros",
      val: total,
      ico: "📋",
      sub: "Raciones registradas",
      pct: Math.min(total * 2, 100),
    },
    {
      label: "Animales en Dieta",
      val: animalesUnicos,
      ico: "🐄",
      sub: "Animales con raciones activas",
      pct: Math.min(animalesUnicos * 5, 100),
    },
    {
      label: "Alimento Principal",
      val: alimentoTop,
      ico: "📦",
      sub: alimentoTop === "—" ? "Sin registros aún" : "El más suministrado",
      pct: alimentoTop === "—" ? 0 : 75,
    },
    {
      label: "Frecuencia Principal",
      val: frecuenciaTop === "—" ? "—" : formatFrecuencia(frecuenciaTop),
      ico: "⏰",
      sub: frecuenciaTop === "—" ? "Sin registros aún" : "La más usada",
      pct: frecuenciaTop === "—" ? 0 : 70,
    },
  ];

  return (
    <div className="al-grid-4">
      {items.map((k, i) => (
        <div className="al-kpi" key={i}>
          <div className="al-kpi__top">
            <span className="al-kpi__label">{k.label}</span>
            <span className="al-kpi__ico">{k.ico}</span>
          </div>
          <div className="al-kpi__value">{k.val}</div>
          <div className="al-kpi__sub">{k.sub}</div>
          <div className="al-kpi__bar">
            <div className="al-kpi__bar-fill" style={{ width: `${k.pct}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}