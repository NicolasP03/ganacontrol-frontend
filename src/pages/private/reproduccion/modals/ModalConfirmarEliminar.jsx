// src/pages/private/reproduccion/modals/ModalConfirmarEliminar.jsx

import { useState } from "react";

export default function ModalConfirmarEliminar({ registro, onClose, onConfirmar }) {
  const [loading, setLoading] = useState(false);

  const handleConfirmar = async () => {
    setLoading(true);
    try { await onConfirmar(registro.id); }
    finally { setLoading(false); onClose(); }
  };

  const nombre = registro?.vaca?.nombre || registro?.vaca?.codigo || `Registro #${registro?.id}`;

  return (
    <div className="rp-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="rp-modal rp-modal--sm">
        <div className="rp-modal__body">
          <div className="rp-confirm">
            <div className="rp-confirm__ico">⚠️</div>
            <div className="rp-confirm__title">¿Eliminar registro?</div>
            <div className="rp-confirm__sub">
              Se eliminará el servicio de <strong>{nombre}</strong> (ID #{registro?.id})
              permanentemente. Esta acción no se puede deshacer.
            </div>
          </div>
        </div>
        <div className="rp-modal__footer">
          <button className="rp-btn rp-btn--secondary" onClick={onClose} disabled={loading}>Cancelar</button>
          <button className="rp-btn rp-btn--danger"    onClick={handleConfirmar} disabled={loading}>
            {loading ? "⏳ Eliminando…" : "🗑️ Sí, eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}