// src/pages/private/alimentacion/modals/ModalConfirmarEliminar.jsx

import { useState } from "react";

export default function ModalConfirmarEliminar({ registro, onClose, onConfirmar }) {
  const [loading, setLoading] = useState(false);

  const handleConfirmar = async () => {
    setLoading(true);
    try { await onConfirmar(registro.id); }
    finally { setLoading(false); onClose(); }
  };

  const nombre = registro?.animal?.nombre || registro?.animal?.codigo || `Animal #${registro?.animal_id}`;

  return (
    <div className="al-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="al-modal al-modal--sm">
        <div className="al-modal__body">
          <div className="al-confirm">
            <div className="al-confirm__ico">⚠️</div>
            <div className="al-confirm__title">¿Eliminar ración?</div>
            <div className="al-confirm__sub">
              Se eliminará la ración de <strong>{nombre}</strong> (ID #{registro?.id})
              permanentemente. Esta acción no se puede deshacer.
            </div>
          </div>
        </div>
        <div className="al-modal__footer">
          <button className="al-btn al-btn--secondary" onClick={onClose} disabled={loading}>Cancelar</button>
          <button className="al-btn al-btn--danger"    onClick={handleConfirmar} disabled={loading}>
            {loading ? "⏳ Eliminando…" : "🗑️ Sí, eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}