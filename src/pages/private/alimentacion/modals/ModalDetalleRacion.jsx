// src/pages/private/alimentacion/modals/ModalDetalleRacion.jsx

import BadgeAlimentacion from "../ui/BadgeAlimentacion";
import { formatFecha, formatCantidad } from "../alimentacion.constants";

const Item = ({ label, value }) => {
  const esVacio = value === null || value === undefined || value === "";
  return (
    <div className="al-detail-item">
      <div className="al-detail-item__label">{label}</div>
      <div className="al-detail-item__value">{esVacio ? "—" : value}</div>
    </div>
  );
};

const TIPO_ANIMAL_ICO = {
  Vaca: "🐄", Toro: "🐂", Ternero: "🐮", Novillo: "🐃",
};

export default function ModalDetalleRacion({ registro, onClose, onEditar, onEliminar }) {
  if (!registro) return null;

  const nombreAnimal = registro.animal?.nombre || registro.animal?.codigo || `Animal #${registro.animal_id}`;

  return (
    <div className="al-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="al-modal al-modal--md">
        <div className="al-modal__header">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem" }}>
              <div className="al-modal__title">
                {TIPO_ANIMAL_ICO[registro.tipo_animal] ?? "🐄"} {nombreAnimal}
              </div>
              <BadgeAlimentacion tipo={registro.tipo_alimento} />
            </div>
            <div className="al-modal__subtitle">
              ID #{registro.id} · {registro.tipo_animal} · {formatFecha(registro.fecha_registro)}
            </div>
          </div>
          <button className="al-modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="al-modal__body">
          <div className="al-detail-grid">
            <Item label="Animal" value={nombreAnimal} />
            <Item label="Tipo de Animal" value={registro.tipo_animal} />
            <Item label="Alimento" value={registro.nombre_alimento} />
            <Item label="Producto asociado" value={registro.producto?.nombre || registro.nombre_alimento || "No asociado"} />
            <Item label="Cantidad" value={formatCantidad(registro.cantidad_kg)} />
            <Item label="Frecuencia" value={registro.frecuencia?.replace("_", " ")} />
            <Item label="Fecha Registro" value={formatFecha(registro.fecha_registro)} />
            <Item label="Producto asociado" value={registro.producto?.nombre || "No asociado"} />
          </div>

          {registro.observaciones && (
            <div className="al-detail-obs">
              <div className="al-detail-item__label">Observaciones</div>
              <p className="al-detail-obs__text">{registro.observaciones}</p>
            </div>
          )}
        </div>

        <div className="al-modal__footer">
          <button className="al-btn al-btn--ghost" onClick={() => { onEliminar(registro); onClose(); }}>🗑️ Eliminar</button>
          <button className="al-btn al-btn--secondary" onClick={() => { onClose(); onEditar(registro); }}>✏️ Editar</button>
          <button className="al-btn al-btn--primary" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}