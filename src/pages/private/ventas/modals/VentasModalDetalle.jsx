import { ESTADO_META } from "../../../../services/ventas.service";
import "../../../../styles/modules/Ventas.css";

export default function VentasModalDetalle({ venta, onClose, onEditar }) {
  if (!venta) return null;

  const meta = ESTADO_META[(venta.estado || "Pendiente").toLowerCase()] ?? {
    color: "#6b7280",
    label: venta.estado || "Pendiente",
  };

  const items = Array.isArray(venta.items) ? venta.items : [];

  return (
    <div className="vt-modal-overlay" onClick={onClose}>
      <div className="vt-modal" onClick={(e) => e.stopPropagation()}>
        <div className="vt-modal__header">
          <div>
            <p className="vt-modal__pre">Detalle de Venta</p>
            <h2 className="vt-modal__title">{venta.id}</h2>
          </div>
          <button className="vt-modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="vt-modal__body">
          <div className="vt-modal__row">
            <span className="vt-modal__key">Cliente</span>
            <span className="vt-modal__val vt-modal__val--strong">
              {venta.cliente}
            </span>
          </div>

          <div className="vt-modal__row">
            <span className="vt-modal__key">Fecha</span>
            <span className="vt-modal__val">{venta.fecha}</span>
          </div>

          <div className="vt-modal__row">
            <span className="vt-modal__key">Estado</span>
            <span
              className="vt-badge"
              style={{
                background: `${meta.color}18`,
                color: meta.color,
                border: `1px solid ${meta.color}35`,
              }}
            >
              <span className="vt-badge__dot" style={{ background: meta.color }} />
              {meta.label}
            </span>
          </div>

          <div className="vt-modal__row vt-modal__row--col">
            <span className="vt-modal__key">Ítems</span>

            {items.length === 0 ? (
              <p className="vt-modal__notas">Sin ítems registrados.</p>
            ) : (
              items.map((item) => (
                <p key={item.tempId} className="vt-modal__notas">
                  {item.tipo === "ganado" && (
                    <>
                      <strong>Ganado:</strong> {item.codigo}{item.nombre ? ` · ${item.nombre}` : ""} — ${Number(item.precio || 0).toLocaleString("es-CO")}
                    </>
                  )}

                  {item.tipo === "producto" && (
                    <>
                      <strong>Producto:</strong> {item.nombre || `ID ${item.ref_id}`} — Cantidad: {item.cantidad} {item.unidad} — P. Unit: ${Number(item.precio_unitario || 0).toLocaleString("es-CO")}
                    </>
                  )}

                  {item.tipo === "produccion" && (
                    <>
                      <strong>Producción:</strong> {item.nombre || `ID ${item.ref_id}`} — Cantidad: {item.cantidad} {item.unidad} — P. Unit: ${Number(item.precio_unitario || 0).toLocaleString("es-CO")}
                    </>
                  )}
                </p>
              ))
            )}
          </div>

          {venta.notas && (
            <div className="vt-modal__row vt-modal__row--col">
              <span className="vt-modal__key">Notas</span>
              <p className="vt-modal__notas">{venta.notas}</p>
            </div>
          )}

          <div className="vt-modal__row vt-modal__row--total">
            <span className="vt-modal__key">Total</span>
            <span className="vt-modal__total">
              ${Number(venta.total || 0).toLocaleString("es-CO")}
            </span>
          </div>
        </div>

        <div className="vt-modal__footer">
          <button className="vt-btn vt-btn--ghost" onClick={onClose}>
            Cerrar
          </button>
          <button
            className="vt-btn vt-btn--primary"
            onClick={() => {
              onClose();
              onEditar?.(venta);
            }}
          >
            ✏️ Editar Venta
          </button>
        </div>
      </div>
    </div>
  );
}