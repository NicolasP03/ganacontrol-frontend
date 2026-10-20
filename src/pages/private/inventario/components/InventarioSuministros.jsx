// InventarioSuministros.jsx
import "../../../../styles/modules/Inventario.css";

const normalizarPct = (valor) => {
  const n = Number(valor || 0);
  return Math.max(0, Math.min(Math.round(n), 100));
};

const nivelColor = (nivel) => {
  if (nivel === "critico") return "#ef4444";
  if (nivel === "bajo") return "#f59e0b";
  return "#22c55e";
};

const nivelGradient = (nivel) => {
  if (nivel === "critico") return "linear-gradient(90deg,#dc2626,#f87171)";
  if (nivel === "bajo") return "linear-gradient(90deg,#d97706,#fbbf24)";
  return "linear-gradient(90deg,#16a34a,#22c55e)";
};

const obtenerMensajeNivel = (nivel) => {
  if (nivel === "critico") return "⚠ Reponer urgente";
  if (nivel === "bajo") return "▲ Stock bajo";
  return null;
};

export default function InventarioSuministros({ suministros = [] }) {
  const alertas = suministros.filter(
    (s) => s.nivel === "critico" || s.nivel === "bajo"
  ).length;

  return (
    <div className="iv-card iv-sumi-card">
      <div className="iv-sumi-header">
        <h3 className="iv-sumi-header__title">Niveles de Suministro</h3>

        <span
          className={`iv-sumi-header__sub${
            alertas === 0 ? " iv-sumi-header__sub--ok" : ""
          }`}
        >
          {alertas} alertas
        </span>
      </div>

      <div className="iv-sumi-list">
        {suministros.length === 0 && (
          <div className="iv-sumi-empty">
            No hay suministros registrados.
          </div>
        )}

        {suministros.map((s, i) => {
          const pct = normalizarPct(s.pct);
          const color = nivelColor(s.nivel);
          const mensaje = obtenerMensajeNivel(s.nivel);

          return (
            <div key={`${s.nombre}-${i}`} className="iv-sumi-item">
              <div className="iv-sumi-item__top">
                <span
                  className="iv-sumi-item__name"
                  title={s.nombre}
                  style={{
                    color: s.nivel === "critico" ? "#ef4444" : undefined,
                  }}
                >
                  {s.nombre || "Sin nombre"}
                </span>

                <span className="iv-sumi-item__pct" style={{ color }}>
                  {pct}%
                </span>
              </div>

              <div className="iv-progress">
                <div
                  className="iv-progress__fill"
                  style={{
                    "--pct": `${pct}%`,
                    background: nivelGradient(s.nivel),
                  }}
                />
              </div>

              {mensaje && (
                <p
                  className="iv-sumi-item__warn"
                  style={{
                    color,
                  }}
                >
                  {mensaje}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}