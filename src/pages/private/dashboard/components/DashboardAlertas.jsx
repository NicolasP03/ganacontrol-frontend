import { useNavigate } from "react-router-dom";
import "../../../../styles/modules/Dashboard.css";

const TIPO_META = {
  warn: { label: "Advertencia", cls: "warn" },
  info: { label: "Información", cls: "info" },
  ok:   { label: "OK", cls: "ok" },
};

export default function DashboardAlertas({ alertas = [], alertasActivas = 0 }) {
  const navigate = useNavigate();

  return (
    <div className="db-section">
      <div className="db-section-label">
        Alertas activas
        {alertasActivas > 0 && (
          <span className="db-badge-count">{alertasActivas}</span>
        )}
      </div>

      <div className="db-alertas">
        {alertas.map((a, i) => {
          const meta = TIPO_META[a.tipo] ?? { cls: "info" };

          return (
            <div
              key={i}
              className={`db-alerta db-alerta--${meta.cls}`}
              onClick={() => navigate(a.href)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigate(a.href)}
            >
              <div className="db-alerta__ico-wrap">
                <img src={a.ico} alt={a.titulo} className="db-alerta__ico" />
              </div>

              <div className="db-alerta__body">
                <p className="db-alerta__titulo">{a.titulo}</p>
                <p className="db-alerta__desc">{a.desc}</p>
              </div>

              <span className="db-alerta__arrow">→</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}