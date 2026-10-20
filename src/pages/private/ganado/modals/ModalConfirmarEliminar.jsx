import { useState } from "react";

export default function ModalConfirmarEliminar({ animal, onClose, onConfirmar }) {
  const [loading, setLoading] = useState(false);

  const handleConfirmar = async () => {
    setLoading(true);
    try {
      await onConfirmar(animal.id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gc-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="gc-modal gc-modal--sm">
        <div className="gc-modal__body">
          <div className="gc-confirm">
            <div className="gc-confirm__ico">⚠️</div>
            <div className="gc-confirm__title">¿Eliminar animal?</div>
            <div className="gc-confirm__sub">
              Esta acción eliminará a <strong>{animal.nombre || "Sin nombre"}</strong>{" "}
              ({animal.codigo || animal.id}) del hato permanentemente.
            </div>
          </div>
        </div>

        <div className="gc-modal__footer">
          <button className="gc-btn gc-btn--secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button className="gc-btn gc-btn--danger" onClick={handleConfirmar} disabled={loading}>
            {loading ? "⏳ Eliminando…" : "🗑️ Sí, eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}