// src/pages/private/reproduccion/components/ReproduccionTabla.jsx

import BadgeReproduccion from "../ui/BadgeReproduccion";
import { formatFecha, diasHasta } from "../reproduccion.constants";

const COLS = [
  { key: "id",                 label: "ID",              sortable: true  },
  { key: "vaca",               label: "Vaca",            sortable: true  },
  { key: "toro",               label: "Toro / Proveedor",sortable: false },
  { key: "tipo_servicio",      label: "Tipo",            sortable: true  },
  { key: "fecha_servicio",     label: "Fecha Servicio",  sortable: true  },
  { key: "fecha_probable_parto",label: "Parto Estimado", sortable: true  },
  { key: "estado",             label: "Estado",          sortable: true  },
];

function CeldaToro({ r }) {
  if (r.tipo_servicio === "Monta_Natural") {
    return <span>{r.toro?.nombre || r.toro?.codigo || `#${r.toro_id}` || "—"}</span>;
  }
  return <span className="rp-tabla__proveedor">{r.proveedor_genetico || "—"}</span>;
}

function CeldaParto({ fecha }) {
  if (!fecha) return <span className="rp-tabla__muted">—</span>;
  const dias = diasHasta(fecha);
  const urgente = dias !== null && dias >= 0 && dias <= 15;
  return (
    <span className={urgente ? "rp-tabla__parto-urgente" : ""}>
      {formatFecha(fecha)}
      {urgente && dias <= 0  && <span className="rp-tabla__parto-tag">Hoy</span>}
      {urgente && dias === 1 && <span className="rp-tabla__parto-tag">Mañana</span>}
      {urgente && dias  > 1  && <span className="rp-tabla__parto-tag">{dias}d</span>}
    </span>
  );
}

export default function ReproduccionTabla({
  filas, sortCol, sortDir, onSort, onVerDetalle, onEditar, onEliminar,
}) {
  return (
    <div className="rp-table-wrap">
      <table className="rp-table">
        <thead>
          <tr>
            {COLS.map(c => (
              <th
                key={c.key}
                className={sortCol === c.key ? "sorted" : ""}
                onClick={() => c.sortable && onSort(c.key)}
                style={!c.sortable ? { cursor: "default" } : {}}
              >
                {c.label}
                {c.sortable && (
                  <span className="sort-ico">
                    {sortCol === c.key ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
                  </span>
                )}
              </th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filas.length === 0 ? (
            <tr>
              <td colSpan={8} className="rp-table__empty">
                😔 No se encontraron registros con los filtros actuales
              </td>
            </tr>
          ) : filas.map(r => (
            <tr key={r.id} onClick={() => onVerDetalle(r)}>
              <td className="rp-cell-id">{r.id}</td>
              <td className="rp-cell-nombre">
                <div>{r.vaca?.nombre || "Sin nombre"}</div>
                <div className="rp-tabla__sub">{r.vaca?.codigo} · {r.vaca?.raza}</div>
              </td>
              <td><CeldaToro r={r} /></td>
              <td>
                <span className="rp-tipo-chip">
                  {r.tipo_servicio === "Monta_Natural" ? "🐂 Monta" : "🔬 Inseminación"}
                </span>
              </td>
              <td>{formatFecha(r.fecha_servicio)}</td>
              <td><CeldaParto fecha={r.fecha_probable_parto} /></td>
              <td><BadgeReproduccion estado={r.estado} /></td>
              <td onClick={e => e.stopPropagation()}>
                <div className="rp-acciones">
                  <button
                    className="rp-btn-ico rp-btn-ico--view"
                    onClick={() => onVerDetalle(r)}
                    title="Ver detalle"
                  >
                    <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                  <button
                    className="rp-btn-ico rp-btn-ico--edit"
                    onClick={() => onEditar(r)}
                    title="Editar"
                  >
                    <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button
                    className="rp-btn-ico rp-btn-ico--delete"
                    onClick={() => onEliminar(r)}
                    title="Eliminar"
                  >
                    <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}