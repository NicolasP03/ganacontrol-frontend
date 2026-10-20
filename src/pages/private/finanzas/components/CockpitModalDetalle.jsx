import { useEffect } from "react";
import { createPortal, flushSync } from "react-dom";
import "../../../../styles/modules/Cockpit.css";

const ESTADO_META = {
  confirmado: { color: "#22c55e", label: "Confirmado" },
  completado: { color: "#22c55e", label: "Completado" },
  pendiente: { color: "#6b7280", label: "Pendiente" },
  en_ruta: { color: "#3b82f6", label: "En Ruta" },
  verificando: { color: "#f59e0b", label: "Verificando" },
  cancelado: { color: "#ef4444", label: "Cancelado" },
};

export default function CockpitModalDetalle({ transaccion, onClose, onEditar }) {
  useEffect(() => {
    if (!transaccion) return;

    const cerrarConEsc = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose?.();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", cerrarConEsc);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", cerrarConEsc);
    };
  }, [transaccion, onClose]);

  if (!transaccion) return null;

  const meta =
    ESTADO_META[String(transaccion.estadoKey || "").toLowerCase()] || {
      color: "#6b7280",
      label: transaccion.estado || "Pendiente",
    };

  const cerrarModal = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    flushSync(() => {
      onClose?.();
    });
  };

  const editarTransaccion = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    flushSync(() => {
      onClose?.();
    });

    setTimeout(() => {
      onEditar?.(transaccion);
    }, 120);
  };

  return createPortal(
    <div
      className="ck-modal-overlay ck-modal-overlay--portal"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) {
          cerrarModal(e);
        }
      }}
    >
      <div
        className="ck-modal ck-modal--portal"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ck-modal__header">
          <div>
            <p className="ck-modal__sub">Transacción</p>
            <h2 className="ck-modal__title">{transaccion.id}</h2>
          </div>

          <div
            role="button"
            tabIndex={0}
            className="ck-modal__close ck-modal__close--force"
            aria-label="Cerrar modal"
            onPointerDown={cerrarModal}
            onClick={cerrarModal}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") cerrarModal(e);
            }}
          >
            ×
          </div>
        </div>

        <div className="ck-modal__body">
          <div className="ck-modal__row">
            <span className="ck-modal__key">Lote</span>
            <span className="ck-modal__val">{transaccion.lote}</span>
          </div>

          <div className="ck-modal__row">
            <span className="ck-modal__key">Adquiriente</span>
            <span className="ck-modal__val">{transaccion.cliente}</span>
          </div>

          <div className="ck-modal__row">
            <span className="ck-modal__key">Fecha</span>
            <span className="ck-modal__val">{transaccion.fecha}</span>
          </div>

          <div className="ck-modal__row">
            <span className="ck-modal__key">Estado</span>
            <span
              className="ck-badge"
              style={{
                background: `${meta.color}20`,
                color: meta.color,
                border: `1px solid ${meta.color}40`,
              }}
            >
              <span
                className="ck-badge__dot"
                style={{ background: meta.color }}
              />
              {meta.label}
            </span>
          </div>

          <div className="ck-modal__row ck-modal__row--monto">
            <span className="ck-modal__key">Monto</span>
            <span className="ck-modal__monto">{transaccion.monto}</span>
          </div>
        </div>

        <div className="ck-modal__footer">
          <button
            type="button"
            className="ck-btn ck-btn--ghost"
            onPointerDown={cerrarModal}
            onClick={cerrarModal}
          >
            Cerrar
          </button>

          <button
            type="button"
            className="ck-btn ck-btn--primary"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={editarTransaccion}
          >
            Editar Transacción
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}