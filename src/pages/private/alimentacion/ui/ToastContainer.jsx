// src/pages/private/alimentacion/ui/ToastContainer.jsx

export default function ToastContainer({ toasts }) {
  return (
    <div className="al-toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`al-toast al-toast--${t.type}`}>
          <span>{t.type === "success" ? "✅" : "❌"}</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}