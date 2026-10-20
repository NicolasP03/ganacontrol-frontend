import { useState } from "react";

/**
 * DataTable — Tabla de datos reutilizable
 *
 * Props:
 *  - title       : string                    — título de la sección
 *  - columns     : Array<{ key, label, render? }> — columnas
 *  - data        : Array<object>             — filas de datos
 *  - searchKey   : string | string[]        — campo(s) por los que filtrar
 *  - actions     : ReactNode                 — botones adicionales en el header
 *  - onRowClick  : (row) => void             — acción al hacer clic en fila
 *  - pageSize    : number                    — filas por página (default 10)
 */
export default function DataTable({
  title,
  columns = [],
  data = [],
  searchKey,
  actions,
  onRowClick,
  pageSize = 10,
}) {
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina]     = useState(1);

  // Filtrado
  const filtrados = busqueda
    ? data.filter((row) => {
        const keys = Array.isArray(searchKey) ? searchKey : [searchKey];
        return keys.some((k) =>
          String(row[k] || "").toLowerCase().includes(busqueda.toLowerCase())
        );
      })
    : data;

  // Paginación
  const totalPaginas = Math.ceil(filtrados.length / pageSize);
  const inicio       = (pagina - 1) * pageSize;
  const paginados    = filtrados.slice(inicio, inicio + pageSize);

  return (
    <div
      className="gc-card"
      style={{ padding: 0, overflow: "hidden" }}
    >
      {/* Header */}
      <div className="mod-table-actions">

        {/* Título */}
        <h3 style={{ fontWeight: 800, margin: 0 }}>{title}</h3>

        {/* Búsqueda + acciones */}
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>

          {searchKey && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "var(--surface-light)",
                border: "1px solid var(--border-light)",
                borderRadius: "var(--radius-full)",
                padding: "0.4rem 1rem",
                minWidth: 220,
              }}
            >
              <span>🔍</span>
              <input
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setPagina(1);
                }}
                placeholder="Buscar..."
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "0.85rem",
                  outline: "none",
                  boxShadow: "none",
                  padding: 0,
                  width: "100%",
                }}
              />
            </div>
          )}

          {actions}
        </div>
      </div>

      {/* Tabla */}
      <div className="gc-table-wrap">
        <table className="gc-table">

          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginados.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    textAlign: "center",
                    color: "var(--text-muted)",
                    padding: "2rem",
                    fontStyle: "italic",
                  }}
                >
                  No se encontraron registros
                </td>
              </tr>
            ) : (
              paginados.map((row, i) => (
                <tr
                  key={i}
                  onClick={() => onRowClick && onRowClick(row)}
                  style={{ cursor: onRowClick ? "pointer" : "default" }}
                >
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

      {/* Footer: conteo + paginación */}
      <div
        style={{
          padding: "0.875rem 1.25rem",
          borderTop: "1px solid var(--surface-subtle)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
          {filtrados.length === 0
            ? "Sin resultados"
            : `Mostrando ${inicio + 1}–${Math.min(inicio + pageSize, filtrados.length)} de ${filtrados.length} registros`}
        </span>

        {totalPaginas > 1 && (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              className="gc-btn gc-btn--ghost gc-btn--sm"
              onClick={() => setPagina((p) => Math.max(p - 1, 1))}
              disabled={pagina === 1}
            >
              Anterior
            </button>

            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`gc-btn gc-btn--sm ${p === pagina ? "gc-btn--primary" : "gc-btn--ghost"}`}
                onClick={() => setPagina(p)}
              >
                {p}
              </button>
            ))}

            <button
              className="gc-btn gc-btn--ghost gc-btn--sm"
              onClick={() => setPagina((p) => Math.min(p + 1, totalPaginas))}
              disabled={pagina === totalPaginas}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}