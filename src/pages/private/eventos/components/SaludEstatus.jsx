// SaludEstatus.jsx
import { useNavigate } from "react-router-dom";
import "../../../../styles/modules/Salud.css";

export default function SaludEstatus({ estatus = [] }) {
  const navigate = useNavigate();

  return (
    <div className="sl-card sl-estatus">
      <h4 className="sl-estatus__title">
        <i className="fas fa-chart-line"></i> Estatus del Campo
      </h4>

      <div className="sl-estatus__bars">
        {estatus.map((item, i) => {
          const pct = Math.max(0, Math.min(Number(item.pct || 0), 100));
          const isHigh = pct >= 80;
          const isMedium = pct >= 60 && pct < 80;

          // Determinar el color del texto y la barra
          let textColor, barGradient;

          if (isHigh) {
            textColor = "var(--sl-verde-cosecha)";
            barGradient = "linear-gradient(90deg, var(--sl-verde-cosecha), var(--sl-verde-prado))";
          } else if (isMedium) {
            textColor = "#d97706";
            barGradient = "linear-gradient(90deg, #d97706, #fbbf24)";
          } else {
            textColor = "#dc2626";
            barGradient = "linear-gradient(90deg, #dc2626, #f87171)";
          }

          return (
            <div key={i} className="sl-estatus__item">
              <div className="sl-estatus__item-top">
                <span className="sl-estatus__label">
                  <i className="fas fa-chart-simple"></i> {item.label}
                </span>
                <span className="sl-estatus__pct" style={{ color: textColor }}>
                  {pct}%
                </span>
              </div>

              <div className="sl-progress">
                <div
                  className="sl-progress__fill"
                  style={{
                    width: `${pct}%`,
                    background: barGradient,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <button
        className="sl-btn sl-btn--primary sl-btn--full"
        onClick={() => navigate("/eventos")}
      >
        <i className="fas fa-calendar-alt"></i> Ver todos los eventos
      </button>
    </div>
  );
}