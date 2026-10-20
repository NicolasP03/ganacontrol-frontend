// src/pages/private/reproduccion/modals/ModalDetalleServicio.jsx

import BadgeReproduccion from "../ui/BadgeReproduccion";
import { formatFecha, diasHasta } from "../reproduccion.constants";

const Item = ({ label, value }) => {
  const esVacio =
    value === null ||
    value === undefined ||
    value === "";

  return (
    <div className="rp-detail-item">
      <div className="rp-detail-item__label">{label}</div>
      <div className="rp-detail-item__value">{esVacio ? "—" : value}</div>
    </div>
  );
};

export default function ModalDetalleServicio({ registro, onClose, onEditar, onEliminar }) {
  if (!registro) return null;

  const dias    = diasHasta(registro.fecha_probable_parto);
  const urgente = dias !== null && dias >= 0 && dias <= 15;

  const nombreVaca = registro.vaca?.nombre || registro.vaca?.codigo || `Vaca #${registro.vaca_id}`;
  const nombreToro = registro.tipo_servicio === "Monta_Natural"
    ? (registro.toro?.nombre || registro.toro?.codigo || `Toro #${registro.toro_id}` || "—")
    : (registro.proveedor_genetico || "—");

  return (
    <div className="rp-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="rp-modal rp-modal--md">
        <div className="rp-modal__header">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem" }}>
              <div className="rp-modal__title">{nombreVaca}</div>
              <BadgeReproduccion estado={registro.estado} />
            </div>
            <div className="rp-modal__subtitle">
              ID #{registro.id} · {registro.tipo_servicio?.replace("_", " ")}
            </div>
          </div>
          <button className="rp-modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="rp-modal__body">
          {urgente && (
            <div className="rp-alert-parto">
              🤰 Parto estimado en {dias === 0 ? "hoy" : `${dias} día${dias > 1 ? "s" : ""}`} —{" "}
              {formatFecha(registro.fecha_probable_parto)}
            </div>
          )}

          <div className="rp-detail-grid">
            <Item label="Vaca"            value={nombreVaca} />
            <Item label={registro.tipo_servicio === "Monta_Natural" ? "Toro" : "Proveedor"} value={nombreToro} />
            <Item label="Tipo de Servicio" value={registro.tipo_servicio?.replace("_", " ")} />
            <Item label="Estado"          value={<BadgeReproduccion estado={registro.estado} />} />
            <Item label="Fecha Servicio"  value={formatFecha(registro.fecha_servicio)} />
            <Item label="Parto Estimado"  value={formatFecha(registro.fecha_probable_parto)} />
            <Item label="Fecha de Parto"  value={formatFecha(registro.fecha_parto)} />
            <Item label="Código Cría"     value={registro.cria_codigo} />
          </div>
        </div>

        <div className="rp-modal__footer">
          <button className="rp-btn rp-btn--ghost"     onClick={() => { onEliminar(registro); onClose(); }}>🗑️ Eliminar</button>
          <button className="rp-btn rp-btn--secondary" onClick={() => { onClose(); onEditar(registro); }}>✏️ Editar</button>
          <button className="rp-btn rp-btn--primary"   onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}