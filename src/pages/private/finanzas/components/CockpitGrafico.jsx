import "../../../../styles/modules/Cockpit.css";

const PERIODOS = ["Semana", "Mes", "Año"];

function formatearValorCorto(valor) {
  const n = Number(valor || 0);

  if (n >= 1000000) {
    const millones = n / 1000000;
    return `$${Number.isInteger(millones) ? millones : millones.toFixed(1)}M`;
  }

  if (n >= 1000) {
    const miles = n / 1000;
    return `$${Number.isInteger(miles) ? miles : miles.toFixed(1)}K`;
  }

  return `$${n.toLocaleString("es-CO")}`;
}

export default function CockpitGrafico({
  barras = [],
  periodoActivo,
  onCambiarPeriodo,
  loading = false,
}) {
  return (
    <div className="ck-card ck-grafico">
      <div className="ck-grafico__header">
        <div>
          <h3 className="ck-grafico__title">Análisis de Crecimiento</h3>
          <p className="ck-grafico__sub">Proyección {periodoActivo}</p>
        </div>

        <div className="ck-periodo-tabs">
          {PERIODOS.map((p) => (
            <button
              key={p}
              type="button"
              className={`ck-periodo-btn${periodoActivo === p ? " ck-periodo-btn--active" : ""}`}
              onClick={() => onCambiarPeriodo(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="ck-grafico__empty">Cargando gráfico...</div>
      ) : !barras.length ? (
        <div className="ck-grafico__empty">Sin datos disponibles.</div>
      ) : (
        <div className="ck-grafico__bars">
          {barras.map((b, i) => {
            const altura = Math.max(0, Math.min(Number(b.altura || 0), 100));
            const valor = Number(b.valor || 0);

            return (
              <div key={i} className="ck-bar-col">
                <span className="ck-bar-col__pct" title={`$${valor.toLocaleString("es-CO")}`}>
                  {formatearValorCorto(valor)}
                </span>

                <div className="ck-bar-col__bar-wrap">
                  {altura > 0 ? (
                    <div
                      className={`ck-bar-col__bar${b.activo ? " ck-bar-col__bar--active" : ""}`}
                      style={{ height: `${altura}%` }}
                    />
                  ) : (
                    <div className="ck-bar-col__bar--zero" />
                  )}
                </div>

                <span
                  className={`ck-bar-col__label${b.activo ? " ck-bar-col__label--active" : ""}`}
                >
                  {b.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}