// src/pages/private/reproduccion/ui/ToastContainer.jsx

export default function ToastContainer({ toasts }) {
  return (
    <div className="rp-toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`rp-toast rp-toast--${t.type}`}>
          <span>{t.type === "success" ? "✅" : "❌"}</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}