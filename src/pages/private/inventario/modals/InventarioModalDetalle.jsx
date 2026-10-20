// InventarioModalDetalle.jsx
import { ESTADO_META_INV } from "../../../../services/inventario.service";
import "../../../../styles/modules/Inventario.css";

export default function InventarioModalDetalle({ producto, onClose, onEditar }) {
  if (!producto) return null;
  const meta = ESTADO_META_INV[producto.estadoKey] ?? { color:"#6b7280", label: producto.estado };

  return (
    <div className="iv-modal-overlay" onClick={onClose}>
      <div className="iv-modal" onClick={e => e.stopPropagation()}>
        <div className="iv-modal__header">
          <div>
            <p className="iv-modal__pre">Detalle de Producto · {producto.tipo}</p>
            <h2 className="iv-modal__title">{producto.nombre}</h2>
          </div>
          <button className="iv-modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="iv-modal__body">
          {[
            ["ID",        producto.id],
            ["Ubicación", producto.ubicacion],
            ["Proveedor", producto.proveedor],
            ["Precio",    producto.precio],
            ["Fecha",     producto.fecha],
          ].map(([k, v]) => (
            <div key={k} className="iv-modal__row">
              <span className="iv-modal__key">{k}</span>
              <span className="iv-modal__val">{v}</span>
            </div>
          ))}
          <div className="iv-modal__row">
            <span className="iv-modal__key">Estado</span>
            <span className="iv-badge" style={{ background:`${meta.color}18`, color: meta.color, border:`1px solid ${meta.color}30` }}>
              <span className="iv-badge__dot" style={{ background: meta.color }} />{meta.label}
            </span>
          </div>
          <div className="iv-modal__row">
            <span className="iv-modal__key">Stock</span>
            <div style={{ flex:1, display:"flex", alignItems:"center", gap:".75rem", justifyContent:"flex-end" }}>
              <div className="iv-progress" style={{ width:120 }}>
                <div className="iv-progress__fill" style={{ "--pct":`${producto.stock}%`, background: meta.color }} />
              </div>
              <span style={{ fontFamily:"var(--iv-font-mono)", fontWeight:800, color: meta.color }}>{producto.stock}%</span>
            </div>
          </div>
          {producto.notas && (
            <div className="iv-modal__row iv-modal__row--col">
              <span className="iv-modal__key">Notas</span>
              <p className="iv-modal__notas">{producto.notas}</p>
            </div>
          )}
        </div>
        <div className="iv-modal__footer">
          <button className="iv-btn iv-btn--ghost" onClick={onClose}>Cerrar</button>
          <button className="iv-btn iv-btn--primary" onClick={() => { onClose(); onEditar?.(producto); }}>✏️ Editar</button>
        </div>
      </div>
    </div>
  );
}