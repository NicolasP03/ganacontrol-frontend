import { useNavigate } from "react-router-dom";
import "../../../../styles/modules/Cockpit.css";

const ESTADO_META = {
  confirmado: { color: "#22c55e", label: "Confirmado" },
  en_ruta: { color: "#3b82f6", label: "En Ruta" },
  verificando: { color: "#f59e0b", label: "Verificando" },
  completado: { color: "#22c55e", label: "Completado" },
  pendiente: { color: "#f59e0b", label: "Pendiente" },
  cancelado: { color: "#ef4444", label: "Cancelado" },
};

function Avatar({ seed }) {
  const colors = ["#14532d", "#1e3a5f", "#7c2d12", "#312e81", "#134e4a"];
  const idx = seed.charCodeAt(0) % colors.length;
  return (
    <div className="ck-tx-avatar" style={{ background: colors[idx] }}>
      {seed.slice(0, 2).toUpperCase()}
    </div>
  );
}

export default function CockpitTransacciones({
  transacciones = [],
  busqueda,
  onBusqueda,
  onVer,
  onEditar,
  onEliminar,
  loading = false,
}) {
  const navigate = useNavigate();

  return (
    <div className="ck-card ck-tx-card">
      <div className="ck-tx-header">
        <div>
          <h3 className="ck-tx-header__title">Transacciones Recientes</h3>
        </div>

        <div className="ck-tx-header__actions">
          <div className="ck-search-wrap">
            <span className="ck-search-ico">🔍</span>
            <input
              className="ck-search-input"
              placeholder="Buscar por ID, lote, cliente…"
              value={busqueda}
              onChange={(e) => onBusqueda(e.target.value)}
            />
          </div>
          <button className="ck-btn ck-btn--outline" onClick={() => navigate("/ventas")}>
            + Nueva Venta
          </button>
          <button className="ck-btn ck-btn--ghost" onClick={() => navigate("/ventas")}>
            Ver Historial →
          </button>
        </div>
      </div>

      <div className="ck-table-wrap">
        <table className="ck-table">
          <thead>
            <tr>
              <th>Lote / ID</th>
              <th>Adquiriente</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th style={{ textAlign: "right" }}>Monto</th>
              <th style={{ textAlign: "center" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="ck-table__row">
                  <td><div className="ck-skeleton ck-skeleton--row" /></td>
                  <td><div className="ck-skeleton ck-skeleton--row" /></td>
                  <td><div className="ck-skeleton ck-skeleton--row" /></td>
                  <td><div className="ck-skeleton ck-skeleton--row" /></td>
                  <td><div className="ck-skeleton ck-skeleton--row" /></td>
                  <td><div className="ck-skeleton ck-skeleton--row" /></td>
                </tr>
              ))
            ) : transacciones.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "2.5rem", color: "var(--ck-text-muted)" }}>
                  No se encontraron transacciones.
                </td>
              </tr>
            ) : (
              transacciones.map((t, i) => {
                const meta = ESTADO_META[t.estadoKey] ?? { color: "#6b7280", label: t.estado };

                return (
                  <tr key={i} className="ck-table__row">
                    <td>
                      <div className="ck-tx-lote">
                        <div className="ck-tx-lote__icon">🐄</div>
                        <div>
                          <p className="ck-tx-lote__id">{t.id}</p>
                          <p className="ck-tx-lote__desc">{t.lote}</p>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="ck-tx-cliente">
                        <Avatar seed={t.avatarSeed || "CL"} />
                        <span className="ck-tx-cliente__name">{t.cliente}</span>
                      </div>
                    </td>

                    <td>
                      <span className="ck-tx-fecha">{t.fecha}</span>
                    </td>

                    <td>
                      <span
                        className="ck-badge"
                        style={{
                          background: `${meta.color}20`,
                          color: meta.color,
                          border: `1px solid ${meta.color}40`,
                        }}
                      >
                        <span className="ck-badge__dot" style={{ background: meta.color }} />
                        {meta.label}
                      </span>
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <span className="ck-tx-monto">{t.monto}</span>
                    </td>

                    <td>
                      <div className="ck-tx-actions">
                        <button
                          className="ck-action-btn ck-action-btn--view"
                          title="Ver detalle"
                          onClick={() => onVer?.(t)}
                        >
                          👁
                        </button>
                        <button
                          className="ck-action-btn ck-action-btn--edit"
                          title="Editar"
                          onClick={() => onEditar?.(t)}
                        >
                          ✏️
                        </button>
                        <button
                          className="ck-action-btn ck-action-btn--delete"
                          title="Eliminar"
                          onClick={() => onEliminar?.(t.id)}
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="ck-tx-footer">
        <span>Mostrando {transacciones.length} registro{transacciones.length !== 1 ? "s" : ""}</span>
      </div>
    </div>
  );
}