// InventarioHero.jsx
import "../../../../styles/modules/Inventario.css";

export default function InventarioHero({
  silos = [],
  estadisticasHero = {
    totalProductos: 0,
    alertasCriticas: 0,
    valorTotal: 0,
  },
  onAnadirInsumo,
  onExportar,
  onExportarExcel,
  onExportarPDF,
  loading,
}) {
  const nivelColor = (n) =>
    n === "critico" ? "#ef4444" : n === "bajo" ? "#f59e0b" : "#22c55e";

  const formatearValorCorto = (valor) => {
  const n = Number(valor || 0);

  if (n >= 1000000000) return `$${(n / 1000000000).toFixed(1)}B`;
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n);
};

const valorFormateado = formatearValorCorto(estadisticasHero?.valorTotal);

  return (
    <div className="iv-hero">
      <div className="iv-hero__content">
        <div className="iv-hero__badge">
          <span className="iv-hero__badge-dot" />
          Sistema de Telemetría Activo
        </div>

        <h1 className="iv-hero__h1">
          Inventario
          <em className="iv-hero__h1-em">Inteligente v7</em>
        </h1>

        <p className="iv-hero__p">
          Gestión predictiva de suministros y monitoreo de recursos en tiempo
          real para tu operación ganadera.
        </p>

        <div className="iv-hero__stats">
          <div className="iv-hero__stat">
            <span className="iv-hero__stat-val">
              {estadisticasHero?.totalProductos ?? 0}
            </span>
            <span className="iv-hero__stat-label">Productos</span>
          </div>

          <span className="iv-hero__stat-div" />

          <div className="iv-hero__stat">
            <span className="iv-hero__stat-val iv-hero__stat-val--danger">
              {estadisticasHero?.alertasCriticas ?? 0}
            </span>
            <span className="iv-hero__stat-label">Alertas críticas</span>
          </div>

          <span className="iv-hero__stat-div" />

          <div className="iv-hero__stat">
            <span className="iv-hero__stat-val">
              {valorFormateado}
            </span>
            <span className="iv-hero__stat-label">Valor total</span>
          </div>
        </div>

        <div className="iv-hero__btns">
          <button className="iv-btn iv-btn--primary" onClick={onAnadirInsumo}>
            + Añadir Insumo
          </button>

          <button
            className="iv-btn iv-btn--outline"
            onClick={onExportar}
            disabled={loading}
          >
            {loading ? "Analizando…" : "📊 Análisis IA"}
          </button>

          {onExportarExcel && (
            <button className="iv-btn iv-btn--outline" onClick={onExportarExcel}>
              ⬇ Excel
            </button>
          )}
          {onExportarPDF && (
            <button className="iv-btn iv-btn--outline" onClick={onExportarPDF}>
              ⬇ PDF
            </button>
          )}
        </div>
      </div>

      <div className="iv-hero__silos-wrap">
        <p className="iv-hero__silos-title">Estado de Alimentos</p>

        <div className="iv-hero__silos">
          {silos.map((s, i) => {
            const col = nivelColor(s.nivel);

            return (
              <div key={i} className="iv-silo">
                <span className="iv-silo__pct" style={{ color: col }}>
                  {s.pct}%
                </span>

                <div className="iv-silo__tube">
                  <div
                    className="iv-silo__fill"
                    style={{ "--h": `${s.pct}%`, background: col }}
                  />
                  <span className="iv-silo__inner-pct">{s.pct}%</span>
                </div>

                <span className="iv-silo__label">{s.label}</span>

                {s.nivel === "critico" && (
                  <span className="iv-silo__alert">⚠ Crítico</span>
                )}

                {s.nivel === "bajo" && (
                  <span className="iv-silo__alert" style={{ color: "#f59e0b" }}>
                    ▲ Bajo
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="iv-hero__silo-legend">
          <span className="iv-legend-dot" style={{ background: "#22c55e" }} /> Normal
          <span className="iv-legend-dot" style={{ background: "#f59e0b" }} /> Bajo
          <span className="iv-legend-dot" style={{ background: "#ef4444" }} /> Crítico
        </div>
      </div>
    </div>
  );
}