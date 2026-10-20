// ─── shared/ModalBase.jsx ────────────────────────────────────────────────────
import { createPortal } from "react-dom";

export function ModalBase({ title, onClose, size = "md", children }) {
  return createPortal(
    <div className="cfg-overlay" onClick={onClose}>
      <div
        className={`cfg-modal cfg-modal--${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cfg-modal__header">
          <h3 className="cfg-modal__title">{title}</h3>
          <button className="cfg-modal__close" onClick={onClose}>×</button>
        </div>
        <div className="cfg-modal__body">{children}</div>
      </div>
    </div>,
    document.body
  );
}