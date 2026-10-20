// SaludHistorial.jsx
import { ESTADO_META_SALUD } from "../../../../services/salud.service";
import "../../../../styles/modules/Salud.css";

const FILTROS = [
  { key:"todos",      label:"Todos" },
  { key:"completado", label:"Completado" },
  { key:"en_curso",   label:"En Curso" },
  { key:"pendiente",  label:"Pendiente" },
  { key:"cancelado",  label:"Cancelado" },
];

const CAT_COLORS = {
  "Vacunación":    "#22c55e",
  "Intervención":  "#3b82f6",
  "Antiparasitario":"#8b5cf6",
  "Diagnóstico":   "#06b6d4",
  "Tratamiento":   "#f59e0b",
};

function VetAvatar({ seed }) {
  const palette = ["#14532d","#1e3a5f","#7c2d12","#312e81","#134e4a","#4a1d96"];
  const bg = palette[seed.charCodeAt(0) % palette.length];
  return <div className="sl-avatar" style={{ background: bg }}>{seed}</div>;
}

export default function SaludHistorial({
  historial = [],
  historialTotal,
  busqueda,     onBusqueda,
  filtroEstado, onFiltroEstado,
  onVer, onEditar, onEliminar,
  onNuevoExamen,
}) {
  return (
    <div className="sl-card sl-historial-card">

      {/* ── Header ──────────────────────────── */}
      <div className="sl-hist-header">
        <div>
          <h3 className="sl-hist-header__title">Historial Clínico</h3>
        </div>
        <div className="sl-hist-header__actions">
          <div className="sl-search-wrap">
            <span className="sl-search-ico">🔍</span>
            <input
              className="sl-search-input"
              placeholder="Buscar animal, tratamiento, vet…"
              value={busqueda}
              onChange={(e) => onBusqueda(e.target.value)}
            />
          </div>
          <button className="sl-btn sl-btn--outline sl-btn--sm" onClick={onNuevoExamen}>
            + Nuevo Examen
          </button>
          <button className="sl-btn sl-btn--ghost sl-btn--sm">
            Ver Todo →
          </button>
        </div>
      </div>

      {/* ── Filtros ─────────────────────────── */}
      <div className="sl-filtros">
        {FILTROS.map((f) => (
          <button
            key={f.key}
            className={`sl-filtro-btn${filtroEstado === f.key ? " sl-filtro-btn--active" : ""}`}
            onClick={() => onFiltroEstado(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Tabla ───────────────────────────── */}
      <div className="sl-table-wrap">
        <table className="sl-table">
          <thead>
            <tr>
              <th>ID Evento</th>
              <th>Animal</th>
              <th>Tratamiento</th>
              <th>Veterinario</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th style={{ textAlign:"center" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {historial.length === 0 && (
              <tr>
                <td colSpan={7} className="sl-table__empty">
                  No se encontraron eventos clínicos.
                </td>
              </tr>
            )}
            {historial.map((ev, i) => {
              const meta    = ESTADO_META_SALUD[ev.estadoKey] ?? { color:"#6b7280", label: ev.estado };
              const catColor= CAT_COLORS[ev.categoria] ?? "#6b7280";
              return (
                <tr key={i} className="sl-table__row">

                  {/* ID */}
                  <td>
                    <span className="sl-ev-id">{ev.id}</span>
                  </td>

                  {/* Animal */}
                  <td>
                    <div className="sl-animal-cell">
                      <div className="sl-animal-cell__icon">🐄</div>
                      <span className="sl-animal-cell__cod">{ev.animalCod}</span>
                    </div>
                  </td>

                  {/* Tratamiento + categoría */}
                  <td>
                    <div className="sl-trat-cell">
                      <p className="sl-trat-cell__name">{ev.tratamiento}</p>
                      <span
                        className="sl-cat-pill"
                        style={{ background:`${catColor}18`, color: catColor, border:`1px solid ${catColor}30` }}
                      >
                        {ev.categoria}
                      </span>
                    </div>
                  </td>

                  {/* Veterinario */}
                  <td>
                    <div className="sl-vet-cell">
                      <VetAvatar seed={ev.vetKey} />
                      <span className="sl-vet-cell__name">{ev.vet}</span>
                    </div>
                  </td>

                  {/* Fecha */}
                  <td>
                    <span className="sl-fecha">{ev.fecha}</span>
                  </td>

                  {/* Estado */}
                  <td>
                    <span
                      className="sl-badge"
                      style={{ background:`${meta.color}18`, color: meta.color, border:`1px solid ${meta.color}30` }}
                    >
                      <span className="sl-badge__dot" style={{ background: meta.color }} />
                      {meta.label}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td>
                    <div className="sl-acciones">
                      <button className="sl-action-btn sl-action-btn--view"  title="Ver detalle" onClick={() => onVer?.(ev)}>👁</button>
                      <button className="sl-action-btn sl-action-btn--edit"  title="Editar"      onClick={() => onEditar?.(ev)}>✏️</button>
                      <button className="sl-action-btn sl-action-btn--delete" title="Eliminar"   onClick={() => onEliminar?.(ev.id)}>🗑</button>
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Footer ──────────────────────────── */}
      <div className="sl-hist-footer">
        <span>Mostrando {historial.length} de {historialTotal} registros</span>
      </div>

    </div>
  );
}