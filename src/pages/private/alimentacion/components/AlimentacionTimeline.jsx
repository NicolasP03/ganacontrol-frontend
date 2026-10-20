// src/pages/private/alimentacion/components/AlimentacionTimeline.jsx

import { registrosRecientes, formatFecha, diasDesde, TIPO_ALIMENTO_STYLES } from "../alimentacion.constants";

function etiquetaDias(dias) {
  if (dias === null) return "—";
  if (dias === 0) return "Hoy";
  if (dias === 1) return "Ayer";
  if (dias <= 7) return `Hace ${dias} días`;
  return `Hace ${Math.floor(dias / 7)} semana(s)`;
}

export default function AlimentacionTimeline({ registros, onVerDetalle }) {
  const recientes = registrosRecientes(registros, 7)
    .sort((a, b) => new Date(b.fecha_registro) - new Date(a.fecha_registro));

  return (
    <div className="al-card">
      <h3 className="al-card__title">Últimas Raciones 📅</h3>

      {recientes.length === 0 ? (
        <p className="al-empty-msg">Sin registros en los últimos 7 días</p>
      ) : (
        <div className="al-timeline">
          {recientes.slice(0, 4).map((r, i) => {
            const dias    = diasDesde(r.fecha_registro);
            const reciente = dias !== null && dias <= 1;

            return (
              <div
                key={r.id}
                className="al-timeline__item"
                onClick={() => onVerDetalle(r)}
              >
                <div className="al-timeline__dot-wrap">
                  <div
                    className="al-timeline__dot"
                    style={{
                      background: reciente ? "var(--al-green-500)" : "var(--al-border)",
                      boxShadow:  reciente ? "0 0 0 4px rgba(34,197,94,0.15)" : "none",
                    }}
                  />
                  {i < recientes.slice(0, 4).length - 1 && (
                    <div className="al-timeline__line" />
                  )}
                </div>

                <div className="al-timeline__body">
                  <p className={`al-timeline__fecha${reciente ? " al-timeline__fecha--urgent" : ""}`}>
                    {etiquetaDias(dias)} — {formatFecha(r.fecha_registro)}
                  </p>
                  <p className="al-timeline__nombre">
                    {r.animal?.nombre || r.animal?.codigo || `Animal #${r.animal_id}`}
                  </p>
                  <p className="al-timeline__detalle">
                    📦 {r.nombre_alimento || r.producto?.nombre || "—"} · {r.tipo_animal || "—"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}