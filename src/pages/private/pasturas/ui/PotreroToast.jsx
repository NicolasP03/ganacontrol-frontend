export default function PotreroToast({ toasts, onClose }) {
  if (!toasts.length) return null;

  return (
    <div className="pt-toast-wrap">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pt-toast ${toast.tipo === "error" ? "pt-toast--error" : "pt-toast--success"}`}
        >
          <span>{toast.tipo === "error" ? "⚠️" : "✅"}</span>
          <span>{toast.mensaje}</span>
          <button className="pt-toast__close" onClick={() => onClose(toast.id)}>
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}