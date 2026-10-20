import { useNavigate } from "react-router-dom";
import "../../../../styles/modules/Cockpit.css";

const ICONOS_TIPO = {
  ganado: "🐄",
  produccion: "🥛",
  producto: "📦",
  mixto: "🧾",
};

export default function CockpitLiquidacion({ items = [], loading = false }) {
  const navigate = useNavigate();

  return (
    <div className="ck-liquidacion">
      <h3 className="ck-liquidacion__title">Estado de Liquidación</h3>

      <div className="ck-liquidacion__list">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="ck-card ck-liq-item ck-skeleton-card">
              <div className="ck-skeleton ck-skeleton--icon" />
              <div className="ck-liq-item__info">
                <div className="ck-skeleton ck-skeleton--sm" />
                <div className="ck-skeleton ck-skeleton--md" />
              </div>
              <div className="ck-skeleton ck-skeleton--value" />
            </div>
          ))
        ) : !items.length ? (
          <div className="ck-card ck-liq-item">
            <div className="ck-liq-item__ico">📭</div>
            <div className="ck-liq-item__info">
              <p className="ck-liq-item__label">Sin registros</p>
              <p className="ck-liq-item__desc">Aún no hay datos para mostrar.</p>
            </div>
            <span className="ck-liq-item__val">--</span>
          </div>
        ) : (
          items.map((item, i) => (
            <div
              key={i}
              className="ck-card ck-liq-item"
              title={`${item.label} · ${item.cliente || ""}`}
            >
              <div className="ck-liq-item__ico">
                {ICONOS_TIPO[item.tipo] || "🧾"}
              </div>

              <div className="ck-liq-item__info">
                <p className="ck-liq-item__label">{item.label}</p>
                <p className="ck-liq-item__desc">
                  {item.desc}
                  {item.cliente ? ` · ${item.cliente}` : ""}
                </p>
              </div>

              <span className="ck-liq-item__val">{item.val}</span>
            </div>
          ))
        )}
      </div>

      <button
        className="ck-btn ck-btn--primary ck-btn--full"
        onClick={() => navigate("/ventas")}
      >
        Ver Todas las Ventas →
      </button>
    </div>
  );
}