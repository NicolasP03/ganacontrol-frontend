import { URGENCIA_META } from "../../../../services/salud.service";
import "../../../../styles/modules/Salud.css";

export default function SaludProximos({ proximos = [] }) {
  return (
    <div className="sl-card sl-proximos">
      <div className="sl-proximos__header">
        <h3 className="sl-proximos__title">Próximos Eventos</h3>
        <span className="sl-proximos__count">{proximos.length} programados</span>
      </div>

      <div className="sl-timeline">
        {proximos.map((ev, i) => {
          const urg = URGENCIA_META[ev.urgencia] ?? { color: "#6b7280", label: "Normal" };

          return (
            <div key={ev.id ?? i} className="sl-timeline-item">
              <div className="sl-timeline-track">
                <div className="sl-timeline-dot" style={{ background: urg.color }} />
                {i < proximos.length - 1 && <div className="sl-timeline-line" />}
              </div>

              <div className="sl-timeline-content">
                <div className="sl-timeline-top">
                  <div className="sl-timeline-ico">{ev.ico}</div>

                  <div className="sl-timeline-info">
                    <p className="sl-timeline-titulo">{ev.titulo}</p>
                    <p className="sl-timeline-sub">
                      Animal: {ev.animalCod || "Sin código"}
                      {ev.animalNombre ? ` · ${ev.animalNombre}` : ""}
                    </p>
                    {ev.id && (
                      <p className="sl-timeline-id">Evento #{ev.id}</p>
                    )}
                  </div>
                </div>

                <div className="sl-timeline-meta">
                  <span
                    className="sl-urg-pill"
                    style={{
                      background: `${urg.color}18`,
                      color: urg.color,
                      border: `1px solid ${urg.color}30`,
                    }}
                  >
                    {URGENCIA_META[ev.urgencia]?.label ?? "Normal"}
                  </span>

                  <span className="sl-timeline-fecha">{ev.fecha}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}