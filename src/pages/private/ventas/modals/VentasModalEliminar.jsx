import "../../../../styles/modules/Ventas.css";

export default function VentasModalEliminar({
  venta,
  onClose,
  onConfirm,
  loading = false,
}) {
  if (!venta) return null;

  return (
    <div className="vt-delete-overlay" onClick={onClose}>
      <div className="vt-delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="vt-delete-modal__icon-wrap">
          <div className="vt-delete-modal__icon">⚠️</div>
        </div>

        <h3 className="vt-delete-modal__title">¿Eliminar venta?</h3>

        <p className="vt-delete-modal__text">
          Esta acción eliminará la venta{" "}
          <strong>{venta.id}</strong> del cliente{" "}
          <strong>{venta.cliente}</strong> permanentemente.
        </p>

        <div className="vt-delete-modal__actions">
          <button
            className="vt-delete-modal__btn vt-delete-modal__btn--cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            className="vt-delete-modal__btn vt-delete-modal__btn--delete"
            onClick={() => {
                onConfirm?.();
            }}
            disabled={loading}
            >
            {loading ? "Eliminando..." : "🗑 Sí, eliminar"}
            </button>
        </div>
      </div>
    </div>
  );
}