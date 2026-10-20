// InventarioTabla.jsx
import { ESTADO_META_INV, TIPO_META } from "../../../../services/inventario.service";
import "../../../../styles/modules/Inventario.css";

const FILTROS_TIPO   = [{ key:"todos", label:"Todos" },{ key:"alimento", label:"Alimento" },{ key:"medicamento", label:"Medicamento" },{ key:"insumo", label:"Insumo" }];
const FILTROS_ESTADO = [{ key:"todos", label:"Todos" },{ key:"en_stock", label:"En Stock" },{ key:"stock_bajo", label:"Stock Bajo" },{ key:"critico", label:"Crítico" }];

export default function InventarioTabla({
  productos = [], productosTotal,
  busqueda, onBusqueda,
  filtroTipo, onFiltroTipo,
  filtroEstado, onFiltroEstado,
  onVer, onEditar, onEliminar, onAnadir,
}) {
  return (
    <div className="iv-card iv-tabla-card">

      {/* Header */}
      <div className="iv-tabla-header">
        <div>
          <h3 className="iv-tabla-header__title">Flujos de Carga</h3>
        </div>
        <div className="iv-tabla-header__actions">
          <div className="iv-search-wrap">
            <span className="iv-search-ico">🔍</span>
            <input
              className="iv-search-input"
              placeholder="Buscar producto, ID, proveedor…"
              value={busqueda}
              onChange={(e) => onBusqueda(e.target.value)}
            />
          </div>
          <button className="iv-btn iv-btn--outline iv-btn--sm" onClick={onAnadir}>+ Añadir</button>
          <button className="iv-btn iv-btn--ghost iv-btn--sm">📥 Exportar</button>
        </div>
      </div>

      {/* Filtros */}
      <div className="iv-filtros iv-filtros--row">
        <div className="iv-filtros__group">
          <span className="iv-filtros__label">Tipo:</span>
          {FILTROS_TIPO.map(f => (
            <button
              key={f.key}
              className={`iv-filtro-btn${filtroTipo === f.key ? " iv-filtro-btn--active" : ""}`}
              onClick={() => onFiltroTipo(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="iv-filtros__group">
          <span className="iv-filtros__label">Estado:</span>
          {FILTROS_ESTADO.map(f => (
            <button
              key={f.key}
              className={`iv-filtro-btn${filtroEstado === f.key ? " iv-filtro-btn--active" : ""}`}
              onClick={() => onFiltroEstado(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div className="iv-table-wrap">
        <table className="iv-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Tipo</th>
              <th>Proveedor</th>
              <th>Fecha</th>
              <th>Stock</th>
              <th>Estado</th>
              <th style={{ textAlign:"center" }}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {productos.length === 0 && (
              <tr>
                <td colSpan={7} className="iv-table__empty">
                  No se encontraron productos.
                </td>
              </tr>
            )}

            {productos.map((p, i) => {
              const meta = ESTADO_META_INV[p.estadoKey] ?? { color:"#6b7280", label: p.estado };
              const tipoMeta = TIPO_META[p.tipoKey] ?? { color:"#6b7280" };

              return (
                <tr key={i} className="iv-table__row">

                  {/* Producto */}
                  <td>
                    <div className="iv-prod-cell">
                      <div
                        className="iv-prod-cell__ico"
                        style={{
                          background:`${tipoMeta.color}15`,
                          border:`1px solid ${tipoMeta.color}25`
                        }}
                      >
                        {p.ico}
                      </div>
                      <div>
                        <p className="iv-prod-cell__name">{p.nombre}</p>
                        <p className="iv-prod-cell__id">ID: {p.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Tipo */}
                  <td>
                    <span
                      className="iv-tipo-pill"
                      style={{
                        background:`${tipoMeta.color}15`,
                        color: tipoMeta.color,
                        border:`1px solid ${tipoMeta.color}25`
                      }}
                    >
                      {p.tipo}
                    </span>
                  </td>

                  {/* Proveedor */}
                  <td>
                    <span className="iv-proveedor">
                      {p.proveedor ?? "—"}
                    </span>
                  </td>

                  {/* Fecha */}
                  <td>
                    <span className="iv-fecha">
                      {p.fecha ?? "—"}
                    </span>
                  </td>

                  {/* Stock mejorado 🔥 */}
                  <td>
                    <div className="iv-stock-cell">
                      <div className="iv-stock-bar">
                        <div
                          className="iv-stock-bar__fill"
                          style={{
                            "--pct": `${p.stock ?? 0}%`,
                            background: meta.color
                          }}
                        />
                      </div>

                      <span className="iv-stock-pct" style={{ color: meta.color }}>
                        {p.cantidad_actual ?? 0} {p.unidad ?? ""}
                      </span>
                    </div>
                  </td>

                  {/* Estado */}
                  <td>
                    <span
                      className="iv-badge"
                      style={{
                        background:`${meta.color}18`,
                        color: meta.color,
                        border:`1px solid ${meta.color}30`
                      }}
                    >
                      <span className="iv-badge__dot" style={{ background: meta.color }} />
                      {meta.label}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td>
                    <div className="iv-acciones">
                      <button
                        className="iv-action-btn iv-action-btn--view"
                        title="Ver"
                        onClick={() => onVer?.(p)}
                      >
                        👁
                      </button>

                      <button
                        className="iv-action-btn iv-action-btn--edit"
                        title="Editar"
                        onClick={() => onEditar?.(p)}
                      >
                        ✏️
                      </button>

                      <button
                        className="iv-action-btn iv-action-btn--delete"
                        title="Eliminar"
                        onClick={() => onEliminar?.(p.id)}
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

      {/* Footer */}
      <div className="iv-tabla-footer">
        <span>
          Mostrando {productos.length} de {productosTotal} registros
        </span>
      </div>

    </div>
  );
}