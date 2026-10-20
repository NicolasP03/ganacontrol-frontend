// VentasTabla.jsx
import { ESTADO_META } from "../../../../services/ventas.service";
import "../../../../styles/modules/Ventas.css";

const FILTROS = [
  { key: "todos", label: "Todos" },
  { key: "completado", label: "Completado" },
  { key: "pendiente", label: "Pendiente" },
  { key: "verificando", label: "Verificando" },
  { key: "en_ruta", label: "En Ruta" },
  { key: "cancelado", label: "Cancelado" },
];

function Avatar({ seed }) {
  const palette = ["#14532d", "#1e3a5f", "#7c2d12", "#312e81", "#134e4a", "#713f12"];
  const bg = palette[seed.charCodeAt(0) % palette.length];
  return (
    <div className="vt-avatar" style={{ background: bg }}>
      {seed.slice(0, 2).toUpperCase()}
    </div>
  );
}

export default function VentasTabla({
  ventas = [],
  ventasTotales,
  busqueda,     onBusqueda,
  filtroEstado, onFiltroEstado,
  paginaActual, totalPaginas,  onPagina,
  onVer, onEditar, onEliminar,
  onNuevaVenta,
  onExportar,
}) {
  return (
    <div className="vt-card vt-tabla-card">

      {/* ── Header ──────────────────────────── */}
      <div className="vt-tabla-header">
        <div>
          <h3 className="vt-tabla-header__title">Historial de Ventas</h3>
        </div>

        <div className="vt-tabla-header__actions">
          {/* Búsqueda */}
          <div className="vt-search-wrap">
            <span className="vt-search-ico">🔍</span>
            <input
              className="vt-search-input"
              placeholder="Buscar factura, cliente…"
              value={busqueda}
              onChange={(e) => onBusqueda(e.target.value)}
            />
          </div>
          <button className="vt-btn vt-btn--outline vt-btn--sm" onClick={onNuevaVenta}>
            + Nueva Venta
          </button>
          <button className="vt-btn vt-btn--ghost vt-btn--sm" onClick={onExportar}>
            📥 Exportar
          </button>
        </div>
      </div>

      {/* ── Filtros de estado ────────────────── */}
      <div className="vt-filtros">
        {FILTROS.map((f) => (
          <button
            key={f.key}
            className={`vt-filtro-btn${filtroEstado === f.key ? " vt-filtro-btn--active" : ""}`}
            onClick={() => onFiltroEstado(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Tabla ───────────────────────────── */}
      <div className="vt-table-wrap">
        <table className="vt-table">
          <thead>
            <tr>
              <th>Nº Factura</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th style={{ textAlign: "right" }}>Total</th>
              <th style={{ textAlign: "center" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.length === 0 && (
              <tr>
                <td colSpan={7} className="vt-table__empty">
                  No se encontraron ventas.
                </td>
              </tr>
            )}
            {ventas.map((v) => {
              const meta = ESTADO_META[v.estadoKey] ?? { color: "#6b7280", label: v.estado };
              return (
                <tr key={v.venta_id ?? v.id} className="vt-table__row">

                  {/* Factura */}
                  <td>
                    <span className="vt-factura-id">{v.id}</span>
                  </td>

                  {/* Cliente */}
                  <td>
                    <div className="vt-cliente-cell">
                      <Avatar seed={v.clienteKey} />
                      <div>
                        <p className="vt-cliente-cell__name">{v.cliente}</p>
                        <p className="vt-cliente-cell__cat">{v.categoria}</p>
                      </div>
                    </div>
                  </td>

                  {/* Fecha */}
                  <td>
                    <span className="vt-fecha">{v.fecha}</span>
                  </td>

                  {/* Descripción */}
                  <td>
                    <span className="vt-items">{v.items || "—"}</span>
                  </td>

                  {/* Estado */}
                  <td>
                    <span
                      className="vt-badge"
                      style={{
                        background: `${meta.color}18`,
                        color:       meta.color,
                        border:      `1px solid ${meta.color}35`,
                      }}
                    >
                      <span className="vt-badge__dot" style={{ background: meta.color }} />
                      {meta.label}
                    </span>
                  </td>

                  {/* Total */}
                  <td style={{ textAlign: "right" }}>
                    <span className="vt-total">{v.total}</span>
                  </td>

                  {/* Acciones */}
                  <td>
                    <div className="vt-acciones">
                      <button
                        className="vt-action-btn vt-action-btn--view"
                        title="Ver detalle"
                        onClick={() => onVer?.(v)}
                      >👁</button>
                      <button
                        className="vt-action-btn vt-action-btn--edit"
                        title="Editar"
                        onClick={() => onEditar?.(v)}
                      >✏️</button>
                      <button
                        className="vt-action-btn vt-action-btn--delete"
                        title="Eliminar"
                        onClick={() => onEliminar?.(v)}
                      >
                        🗑
                      </button>
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Footer + paginación ─────────────── */}
      <div className="vt-tabla-footer">
        <span className="vt-tabla-footer__count">
          Mostrando {ventas.length} de {ventasTotales} ventas
        </span>
        <div className="vt-paginacion">
          <button
            className="vt-btn vt-btn--ghost vt-btn--sm"
            disabled={paginaActual <= 1}
            onClick={() => onPagina(paginaActual - 1)}
          >
            ‹ Anterior
          </button>
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`vt-pagina-btn${p === paginaActual ? " vt-pagina-btn--active" : ""}`}
              onClick={() => onPagina(p)}
            >
              {p}
            </button>
          ))}
          <button
            className="vt-btn vt-btn--ghost vt-btn--sm"
            disabled={paginaActual >= totalPaginas}
            onClick={() => onPagina(paginaActual + 1)}
          >
            Siguiente ›
          </button>
        </div>
      </div>

    </div>
  );
}