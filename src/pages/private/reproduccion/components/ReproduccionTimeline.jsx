// src/pages/private/reproduccion/components/ReproduccionTimeline.jsx

import { proximosPartos, formatFecha, diasHasta } from "../reproduccion.constants";

function etiquetaDias(dias) {
  if (dias === null) return "—";
  if (dias <= 0) return "Hoy";
  if (dias === 1) return "Mañana";
  if (dias <= 7) return `En ${dias} días`;
  if (dias > 30) return `En ${Math.floor(dias / 30)} mes(es)`;
  return `En ${dias} días`;
}

export default function ReproduccionTimeline({ registros, onVerDetalle }) {
  const proximos = proximosPartos(registros, 60);

  return (
    <div className="rp-card">
      <h3 className="rp-card__title">Partos Próximos 🔔</h3>

      {proximos.length === 0 ? (
        <p className="rp-empty-msg">
          Sin partos esperados en los próximos 60 días
        </p>
      ) : (
        <div className="rp-timeline">
          {proximos.slice(0, 4).map((r, i) => {
            const dias = diasHasta(r.fecha_probable_parto);
            const urgente = dias !== null && dias <= 7;

            return (
              <div
                key={r.id}
                className="rp-timeline__item"
                onClick={() => onVerDetalle(r)}
              >
                <div className="rp-timeline__dot-wrap">
                  <div
                    className="rp-timeline__dot"
                    style={{
                      background: urgente
                        ? "var(--rp-green-500)"
                        : "var(--rp-border)",
                      boxShadow: urgente
                        ? "0 0 0 4px rgba(34,197,94,0.15)"
                        : "none",
                    }}
                  />

                  {i < proximos.slice(0, 4).length - 1 && (
                    <div className="rp-timeline__line" />
                  )}
                </div>

                <div className="rp-timeline__body">
                  <p
                    className={`rp-timeline__fecha${
                      urgente ? " rp-timeline__fecha--urgent" : ""
                    }`}
                  >
                    {etiquetaDias(dias)} —{" "}
                    {formatFecha(r.fecha_probable_parto)}
                  </p>

                  <p className="rp-timeline__nombre">
                    {r.vaca?.nombre ||
                      r.vaca?.codigo ||
                      `Vaca #${r.vaca_id}`}
                  </p>

                  <p className="rp-timeline__detalle">
                    {r.vaca?.raza || "—"} ·{" "}
                    {r.tipo_servicio?.replace("_", " ")}
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