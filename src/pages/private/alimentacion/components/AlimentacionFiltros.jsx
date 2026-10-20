import { TIPOS_ANIMAL } from "../alimentacion.constants";

export default function AlimentacionFiltros({
  filtros,
  onToggle,
  onLimpiar,
  onCerrar,
  alimentosDisponibles = [],
}) {
  return (
    <div className="al-filtros-panel">
      <div className="al-filtros-panel__header">
        <span>Filtros</span>
        <button className="al-modal__close" onClick={onCerrar}>✕</button>
      </div>

      <div className="al-filtros-panel__section">
        <div className="al-filtros-panel__label">Alimento</div>
        <div className="al-filtros-panel__chips">
          {alimentosDisponibles.map(nombre => (
            <button
              key={nombre}
              className={`al-filtro-chip${filtros.alimentos.includes(nombre) ? " active" : ""}`}
              onClick={() => onToggle("alimentos", nombre)}
            >
              {nombre}
            </button>
          ))}
        </div>
      </div>

      <div className="al-filtros-panel__section">
        <div className="al-filtros-panel__label">Tipo de Animal</div>
        <div className="al-filtros-panel__chips">
          {TIPOS_ANIMAL.map(t => (
            <button
              key={t}
              className={`al-filtro-chip${filtros.tiposAnimal.includes(t) ? " active" : ""}`}
              onClick={() => onToggle("tiposAnimal", t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <button className="al-btn al-btn--ghost al-btn--sm" onClick={onLimpiar}>
        × Limpiar filtros
      </button>
    </div>
  );
}