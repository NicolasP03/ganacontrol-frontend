// src/pages/private/reproduccion/components/ReproduccionFiltros.jsx

import { ESTADOS_REPRODUCCION, TIPOS_SERVICIO } from "../reproduccion.constants";

function GrupoFiltro({ label, opciones, activos, onToggle }) {
  return (
    <div className="rp-filtros__grupo">
      <span className="rp-filtros__grupo-label">{label}</span>
      <div className="rp-filtros__chips">
        {opciones.map(op => (
          <div
            key={op}
            className={`rp-filtros__chip${activos.includes(op) ? " active" : ""}`}
            onClick={() => onToggle(op)}
          >
            {op.replace("_", " ")}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReproduccionFiltros({ filtros, onToggle, onLimpiar, onCerrar }) {
  return (
    <div className="rp-filtros-panel">
      <div className="rp-filtros-panel__title">Filtros</div>

      <GrupoFiltro
        label="Estado"
        opciones={ESTADOS_REPRODUCCION}
        activos={filtros.estados}
        onToggle={v => onToggle("estados", v)}
      />
      <GrupoFiltro
        label="Tipo de Servicio"
        opciones={TIPOS_SERVICIO}
        activos={filtros.tipos}
        onToggle={v => onToggle("tipos", v)}
      />

      <div className="rp-filtros-panel__actions">
        <button className="rp-btn rp-btn--ghost rp-btn--sm" style={{ flex: 1 }} onClick={onLimpiar}>
          Limpiar
        </button>
        <button className="rp-btn rp-btn--primary rp-btn--sm" style={{ flex: 1 }} onClick={onCerrar}>
          Aplicar
        </button>
      </div>
    </div>
  );
}