export default function ToastContainer({ toasts }) {
  return (
    <div className="gc-toast-wrap">
      {toasts.map((t) => (
        <div key={t.id} className={`gc-toast gc-toast--${t.type}`}>
          <span>{t.type === "success" ? "✅" : "❌"}</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}