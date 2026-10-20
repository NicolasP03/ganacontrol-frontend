import { ESTADOS, RAZAS } from "../ganado.constants";
import useCatalogos from "../hooks/useCatalogos";

// Las opciones pueden ser textos o { value, label }
const valorDe = (op) => (typeof op === "object" ? op.value : op);
const etiquetaDe = (op) => (typeof op === "object" ? op.label : op);

function GrupoFiltro({ label, opciones, activos, onToggle }) {
  return (
    <div className="ganado-filter-group">
      <span className="ganado-filter-label">{label}</span>
      <div className="ganado-filter-opts">
        {opciones.map((op) => (
          <div
            key={valorDe(op)}
            className={`ganado-filter-chip${activos.includes(valorDe(op)) ? " active" : ""}`}
            onClick={() => onToggle(valorDe(op))}
          >
            {etiquetaDe(op)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GanadoFiltros({ filtros, onToggle, onLimpiar, onCerrar }) {
  const { potreros } = useCatalogos();
  return (
    <div className="ganado-filter-panel">
      <div className="ganado-filter-panel__title">Filtros</div>

      <GrupoFiltro
        label="Estado"
        opciones={ESTADOS}
        activos={filtros.estados}
        onToggle={(v) => onToggle("estados", v)}
      />

      <GrupoFiltro
        label="Potrero"
        opciones={potreros.map((p) => ({ value: p.id, label: p.nombre }))}
        activos={filtros.potreros}
        onToggle={(v) => onToggle("potreros", v)}
      />

      <GrupoFiltro
        label="Raza"
        opciones={RAZAS}
        activos={filtros.razas}
        onToggle={(v) => onToggle("razas", v)}
      />

      <div className="ganado-filter-actions">
        <button className="gc-btn gc-btn--ghost gc-btn--sm" style={{ flex: 1 }} onClick={onLimpiar}>
          Limpiar
        </button>
        <button className="gc-btn gc-btn--primary gc-btn--sm" style={{ flex: 1 }} onClick={onCerrar}>
          Aplicar
        </button>
      </div>
    </div>
  );
}