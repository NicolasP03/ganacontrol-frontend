import { ESTADO_CONFIG } from "../potrero.constants";

const COLS = [
  { key: "id", label: "ID", sortable: true },
  { key: "nombre", label: "Potrero", sortable: true },
  { key: "tipo_pasto", label: "Tipo de Pasto", sortable: true },
  { key: "hectareas", label: "Hectáreas", sortable: true },
  { key: "capacidad_animales", label: "Capacidad", sortable: true },
  { key: "estado", label: "Estado", sortable: true },
];

function BadgeEstado({ estado }) {
  const cfg = ESTADO_CONFIG[estado] || ESTADO_CONFIG.Disponible;

  return (
    <span className="pt-badge" style={{ background: cfg.bg, color: cfg.color }}>
      <span>{cfg.icono}</span>
      {cfg.label}
    </span>
  );
}

export default function PotreroTabla({
  rows,
  total,
  pagina,
  totalPaginas,
  setPagina,
  sortBy,
  sortDir,
  onSort,
  onEditar,
  onEliminar,
}) {
  return (
    <>
      <div className="pt-table-wrap">
        <table className="pt-table">
          <thead>
            <tr>
              {COLS.map((c) => (
                <th
                  key={c.key}
                  className={sortBy === c.key ? "sorted" : ""}
                  onClick={() => c.sortable && onSort(c.key)}
                  style={!c.sortable ? { cursor: "default" } : {}}
                >
                  {c.label}
                  {c.sortable && (
                    <span className="sort-ico">
                      {sortBy === c.key ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
                    </span>
                  )}
                </th>
              ))}
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="pt-table__empty">
                  🌿 No se encontraron potreros con los filtros actuales
                </td>
              </tr>
            ) : (
              rows.map((p) => (
                <tr key={p.id}>
                  <td className="pt-cell-id">{p.id}</td>

                  <td className="pt-cell-nombre">
                    <div>{p.nombre || "Sin nombre"}</div>
                    <div className="pt-tabla__sub">
                      {p.ganado.length} animal(es) en el potrero
                      {Number(p.capacidad_animales) > 0 && p.ganado.length > Number(p.capacidad_animales) ? " · sobrecupo" : ""}
                    </div>
                  </td>

                  <td>{p.tipo_pasto || "No registrado"}</td>
                  <td>{Number(p.hectareas || 0).toFixed(2)} Ha</td>
                  <td>{p.capacidad_animales || 0} animales</td>
                  <td>
                    <BadgeEstado estado={p.estado} />
                  </td>

                  <td onClick={(e) => e.stopPropagation()}>
                    <div className="pt-acciones">
                      <button
                        className="pt-btn-ico pt-btn-ico--edit"
                        onClick={() => onEditar(p)}
                        title="Editar"
                      >
                        <svg viewBox="0 0 24 24">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>

                      <button
                        className="pt-btn-ico pt-btn-ico--delete"
                        onClick={() => onEliminar(p)}
                        title="Eliminar"
                      >
                        <svg viewBox="0 0 24 24">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pt-pagination">
        <span>
          Mostrando {rows.length === 0 ? 0 : (pagina - 1) * 6 + 1}-{Math.min(pagina * 6, total)} de {total} registros
        </span>

        <div className="pt-pagination__actions">
          <button
            className="pt-page-btn"
            disabled={pagina === 1}
            onClick={() => setPagina(1)}
          >
            «
          </button>

          <button
            className="pt-page-btn"
            disabled={pagina === 1}
            onClick={() => setPagina((p) => Math.max(1, p - 1))}
          >
            ‹
          </button>

          <span className="pt-page-chip">{pagina}</span>

          <button
            className="pt-page-btn"
            disabled={pagina === totalPaginas}
            onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
          >
            ›
          </button>

          <button
            className="pt-page-btn"
            disabled={pagina === totalPaginas}
            onClick={() => setPagina(totalPaginas)}
          >
            »
          </button>
        </div>
      </div>
    </>
  );
}