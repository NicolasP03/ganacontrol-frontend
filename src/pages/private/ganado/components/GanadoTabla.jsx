import Badge from "../ui/Badge";
import AccionesMenu from "../ui/AccionesMenu";
import defaultCow from "../../../../assets/default-cow.png";

const COLS = [
  { key: "foto", label: "Foto" },
  { key: "codigo", label: "Código" },
  { key: "nombre", label: "Nombre" },
  { key: "categoria", label: "Categoría" },
  { key: "raza", label: "Raza" },
  { key: "sexo", label: "Sexo" },
  { key: "peso_actual", label: "Peso (kg)" },
  { key: "potrero", label: "Potrero" },
  { key: "estado", label: "Estado" },
];

const getFoto = (a) => {
  const raw = a?.foto_url || a?.foto;

  if (!raw) return defaultCow;

  const foto = String(raw).trim();

  if (!foto) return defaultCow;

  if (foto.startsWith("http")) return foto;

  const apiUrl = import.meta.env.VITE_API_URL || "";
  const base = apiUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");

  if (!base) return defaultCow;

  const path = foto.startsWith("/") ? foto : `/${foto}`;

  return `${base}${path}`;
};

export default function GanadoTabla({
  filas,
  sortCol,
  sortDir,
  onSort,
  onVerDetalle,
  onEditar,
  onEliminar,
}) {
  return (
    <div className="gc-table-wrap">
      <table className="gc-table">
        <thead>
          <tr>
            {COLS.map((c) => (
              <th
                key={c.key}
                className={sortCol === c.key ? "sorted" : ""}
                onClick={c.key !== "foto" ? () => onSort(c.key) : undefined}
                style={c.key === "foto" ? { cursor: "default" } : {}}
              >
                {c.label}
                {c.key !== "foto" && (
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
              <td colSpan={10} className="gc-table__empty">
                😔 No se encontraron animales con los filtros actuales
              </td>
            </tr>
          ) : (
            filas.map((a) => (
              <tr key={a.id} onClick={() => onVerDetalle(a)}>
                <td>
                  <img
                    src={getFoto(a)}
                    alt={a.nombre || a.codigo || "Ganado"}
                    className="gc-table__thumb" // <--- MUY IMPORTANTE: Añadir esta clase
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = defaultCow;
                    }}
                />
                </td>

                <td className="cell-id">{a.codigo || a.id}</td>
                <td className="cell-nombre">{a.nombre || "Sin nombre"}</td>
                <td>{a.categoria || "-"}</td>
                <td>{a.raza || "-"}</td>
                <td>{a.sexo || "-"}</td>
                <td className="cell-num">{a.peso_actual ?? a.peso ?? "-"}</td>
                <td>{a.potrero || "-"}</td>
                <td>
                  <Badge estado={a.estado} />
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <AccionesMenu
                    animal={a}
                    onVer={onVerDetalle}
                    onEditar={onEditar}
                    onEliminar={onEliminar}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}