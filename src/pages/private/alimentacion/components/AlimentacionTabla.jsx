// src/pages/private/alimentacion/components/AlimentacionTabla.jsx

import BadgeAlimentacion from "../ui/BadgeAlimentacion";
import { formatFecha, formatCantidad, diasDesde } from "../alimentacion.constants";
import { formatFrecuencia } from "../alimentacion.constants";

const COLS = [
  { key: "id",              label: "ID",        sortable: true  },
  { key: "animal",          label: "Animal",    sortable: true  },
  { key: "tipo_animal",     label: "Tipo Animal", sortable: true },
  { key: "nombre_alimento", label: "Alimento",  sortable: true  },
  { key: "cantidad_kg",     label: "Cantidad",  sortable: true  },
  { key: "frecuencia",      label: "Frecuencia", sortable: true },
  { key: "fecha_registro",  label: "Fecha",     sortable: true  },
];

const TIPO_ANIMAL_ICO = {
  Vaca: "🐄",
  Toro: "🐂",
  Ternero: "🐮",
  Novillo: "🐃",
};

function CeldaAnimal({ r }) {
  const ico = TIPO_ANIMAL_ICO[r.tipo_animal] ?? "🐄";
  return (
    <span>
      {ico} {r.animal?.nombre || r.animal?.codigo || `Animal #${r.animal_id}`}
      {r.animal?.codigo && (
        <div className="al-tabla__sub">{r.animal.codigo} · {r.animal.raza || "—"}</div>
      )}
    </span>
  );
}

function CeldaFrecuencia({ frecuencia }) {
  return (
    <span className="al-frecuencia-chip">
      {formatFrecuencia(frecuencia)}
    </span>
  );
}

function CeldaFecha({ fecha }) {
  if (!fecha) return <span className="al-tabla__muted">—</span>;
  const dias = diasDesde(fecha);
  return (
    <span>
      {formatFecha(fecha)}
      {dias !== null && dias === 0 && <span className="al-tabla__tag">Hoy</span>}
      {dias !== null && dias === 1 && <span className="al-tabla__tag">Ayer</span>}
    </span>
  );
}

export default function AlimentacionTabla({
  filas, sortCol, sortDir, onSort, onVerDetalle, onEditar, onEliminar,
}) {
  return (
    <div className="al-table-wrap">
      <table className="al-table">
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
              <td colSpan={8} className="al-table__empty">
                😔 No se encontraron registros con los filtros actuales
              </td>
            </tr>
          ) : filas.map(r => (
            <tr key={r.id} onClick={() => onVerDetalle(r)}>
              <td className="al-cell-id">{r.id}</td>
              <td className="al-cell-nombre"><CeldaAnimal r={r} /></td>
              <td>
                <span className="al-tipo-animal-chip">
                  {TIPO_ANIMAL_ICO[r.tipo_animal] ?? "🐄"} {r.tipo_animal || "—"}
                </span>
              </td>
              <td>{r.nombre_alimento || r.producto?.nombre || "—"}</td>
              <td className="al-cell-cantidad">{formatCantidad(r.cantidad_kg)}</td>
              <td><CeldaFrecuencia frecuencia={r.frecuencia} /></td>
              <td><CeldaFecha fecha={r.fecha_registro} /></td>
              <td onClick={e => e.stopPropagation()}>
                <div className="al-acciones">
                  <button
                    className="al-btn-ico al-btn-ico--view"
                    onClick={() => onVerDetalle(r)}
                    title="Ver detalle"
                  >
                    <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                  <button
                    className="al-btn-ico al-btn-ico--edit"
                    onClick={() => onEditar(r)}
                    title="Editar"
                  >
                    <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button
                    className="al-btn-ico al-btn-ico--delete"
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