import "../../../../styles/modules/Inventario.css";

export default function InventarioModalAnalisisIA({
  abierto,
  analisis,
  onClose,
}) {
  if (!abierto || !analisis) return null;

  return (
    <div className="iv-modal-overlay" onClick={onClose}>
      <div className="iv-modal iv-modal--form" onClick={(e) => e.stopPropagation()}>
        <div className="iv-modal__header">
          <div>
            <p className="iv-modal__pre">
              Análisis IA
              {analisis.fuente && (
                <span style={{ marginLeft: 8, fontSize: "0.7em", opacity: 0.75 }}>
                  ·{" "}
                  {analisis.fuente === "claude"
                    ? "generado con Claude"
                    : "análisis por reglas de inventario"}
                </span>
              )}
            </p>
            <h2 className="iv-modal__title">Diagnóstico Inteligente</h2>
          </div>
          <button className="iv-modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="iv-modal__body">
          <div className="iv-form__row">
            <label className="iv-form__label">Resumen general</label>
            <div className="iv-analisis-box">{analisis.resumen_general}</div>
          </div>

          <div className="iv-form__row">
            <label className="iv-form__label">Riesgos</label>
            <ul className="iv-analisis-list">
              {(analisis.riesgos || []).length ? (
                analisis.riesgos.map((r, i) => <li key={i}>{r}</li>)
              ) : (
                <li>Sin riesgos relevantes detectados.</li>
              )}
            </ul>
          </div>

          <div className="iv-form__row">
            <label className="iv-form__label">Recomendaciones</label>
            <ul className="iv-analisis-list">
              {(analisis.recomendaciones || []).length ? (
                analisis.recomendaciones.map((r, i) => <li key={i}>{r}</li>)
              ) : (
                <li>Sin recomendaciones adicionales.</li>
              )}
            </ul>
          </div>

          <div className="iv-form__row">
            <label className="iv-form__label">Prioridades de compra</label>
            <div className="iv-analisis-prioridades">
              {(analisis.prioridades_compra || []).length ? (
                analisis.prioridades_compra.map((p, i) => (
                  <div key={i} className="iv-analisis-prioridad">
                    <strong>{p.nombre}</strong>
                    <span>{p.prioridad}</span>
                    <p>{p.motivo}</p>
                  </div>
                ))
              ) : (
                <p>No hay prioridades urgentes de compra.</p>
              )}
            </div>
          </div>
        </div>

        <div className="iv-modal__footer">
          <button className="iv-btn iv-btn--primary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}