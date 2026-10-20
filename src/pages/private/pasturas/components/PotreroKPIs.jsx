import { ESTADO_CONFIG } from "../potrero.constants";

export default function PotreroKPIs({ potreros = [] }) {
  const total = potreros.length;
  const disponibles = potreros.filter((p) => p.estado === "Disponible").length;
  const ocupados = potreros.filter((p) => p.estado === "Ocupado").length;
  const mantenimiento = potreros.filter((p) => p.estado === "Mantenimiento").length;
  const descanso = potreros.filter((p) => p.estado === "Descanso").length;

  const cards = [
    {
      label: "Disponibles",
      valor: disponibles,
      ...ESTADO_CONFIG.Disponible,
    },
    {
      label: "Ocupados",
      valor: ocupados,
      ...ESTADO_CONFIG.Ocupado,
    },
    {
      label: "Mantenimiento",
      valor: mantenimiento,
      ...ESTADO_CONFIG.Mantenimiento,
    },
    {
      label: "Descanso",
      valor: descanso,
      ...ESTADO_CONFIG.Descanso,
    },
  ];

  return (
    <div className="pt-kpis">
      {cards.map((item) => (
        <div key={item.label} className="pt-kpi">
          <div className="pt-kpi__top">
            <span className="pt-kpi__icon" style={{ background: item.bg, color: item.color }}>
              {item.icono}
            </span>
            <span className="pt-kpi__label">{item.label}</span>
          </div>

          <div className="pt-kpi__value">{item.valor}</div>
          <div className="pt-kpi__sub">de {total} potreros registrados</div>
        </div>
      ))}
    </div>
  );
}