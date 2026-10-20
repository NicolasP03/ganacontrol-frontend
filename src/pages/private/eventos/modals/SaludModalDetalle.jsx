import { ESTADO_META_SALUD } from "../../../../services/salud.service";
import "../../../../styles/modules/Salud.css";

export default function SaludModalDetalle({ evento, onClose, onEditar }) {
  if (!evento) return null;

  const meta = ESTADO_META_SALUD[evento.estadoKey] ?? {
    color: "#6b7280",
    label: evento.estado,
  };

  return (
    <div className="sl-modal-overlay" onMouseDown={onClose}>
      <div className="sl-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="sl-modal__header">
          <div>
            <p className="sl-modal__pre">Evento Clínico · {evento.animalCod}</p>
            <h2 className="sl-modal__title">Evento #{evento.id}</h2>
          </div>

          <button type="button" className="sl-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="sl-modal__body">
          <div className="sl-modal__row">
            <span className="sl-modal__key">Tratamiento</span>
            <span className="sl-modal__val sl-modal__val--strong">
              {evento.tratamiento}
            </span>
          </div>

          <div className="sl-modal__row">
            <span className="sl-modal__key">Categoría</span>
            <span className="sl-modal__val">{evento.categoria}</span>
          </div>

          <div className="sl-modal__row">
            <span className="sl-modal__key">Veterinario</span>
            <span className="sl-modal__val">{evento.vet}</span>
          </div>

          <div className="sl-modal__row">
            <span className="sl-modal__key">Fecha</span>
            <span className="sl-modal__val">{evento.fecha}</span>
          </div>

          {evento.proxima_fecha && (
            <div className="sl-modal__row">
              <span className="sl-modal__key">Próxima fecha</span>
              <span className="sl-modal__val">{evento.proxima_fecha}</span>
            </div>
          )}

          {evento.dosis && (
            <div className="sl-modal__row">
              <span className="sl-modal__key">Dosis</span>
              <span className="sl-modal__val">{evento.dosis}</span>
            </div>
          )}

          {evento.via_administracion && (
            <div className="sl-modal__row">
              <span className="sl-modal__key">Vía</span>
              <span className="sl-modal__val">{evento.via_administracion}</span>
            </div>
          )}

          <div className="sl-modal__row">
            <span className="sl-modal__key">Estado</span>
            <span
              className="sl-badge"
              style={{
                background: `${meta.color}18`,
                color: meta.color,
                border: `1px solid ${meta.color}30`,
              }}
            >
              <span
                className="sl-badge__dot"
                style={{ background: meta.color }}
              />
              {meta.label}
            </span>
          </div>

          {evento.notas && (
            <div className="sl-modal__row sl-modal__row--col">
              <span className="sl-modal__key">Notas clínicas</span>
              <p className="sl-modal__notas">{evento.notas}</p>
            </div>
          )}
        </div>

        <div className="sl-modal__footer">
          <button type="button" className="sl-btn sl-btn--ghost" onClick={onClose}>
            Cerrar
          </button>

          <button
            type="button"
            className="sl-btn sl-btn--primary"
            onClick={() => {
              onClose();
              setTimeout(() => onEditar?.(evento), 0);
            }}
          >
            ✏️ Editar Evento
          </button>
        </div>
      </div>
    </div>
  );
}