export default function PotreroDeleteModal({
  open,
  potrero,
  onClose,
  onConfirm,
  loading = false,
}) {
  if (!open || !potrero) return null;

  return (
    <div className="pt-modal-backdrop">
      <div className="pt-modal pt-modal--sm">
        <div className="pt-modal__header">
          <div>
            <h3>Eliminar potrero</h3>
            <p>Esta acción no se puede deshacer.</p>
          </div>
          <button className="pt-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="pt-modal__body">
          <div className="pt-delete-box">
            <div className="pt-delete-box__icon">⚠️</div>
            <p>
              Vas a eliminar el potrero <strong>{potrero.nombre}</strong>.
            </p>
          </div>
        </div>

        <div className="pt-modal__footer">
          <button className="pt-btn pt-btn--ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="pt-btn pt-btn--danger" onClick={onConfirm} disabled={loading}>
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}