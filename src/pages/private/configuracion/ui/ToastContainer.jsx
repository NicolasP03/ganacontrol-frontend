// ─── ui/ToastContainer.jsx ───────────────────────────────────────────────────
import { createPortal } from "react-dom";

export function ToastContainer({ msg, onHide }) {
  if (!msg) return null;
  return createPortal(
    <div className="cfg-toast">
      <span>{msg}</span>
      <button className="cfg-toast__close" onClick={onHide}>×</button>
    </div>,
    document.body
  );
}