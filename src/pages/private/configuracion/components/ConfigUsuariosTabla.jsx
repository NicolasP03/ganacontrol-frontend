import { ConfigAvatar } from "../ui/ConfigAvatar";
import { ConfigToggle } from "../ui/ConfigToggle";

export function ConfigUsuariosTabla({
  usuarios,
  esAdmin,
  onEditar,
  onToggle,
  onEliminar,
}) {
  return (
    <div className="gc-card" style={{ padding: 0, overflow: "hidden" }}>
      <div className="gc-table-wrap">
        <table className="gc-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              {esAdmin && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>
                  <div className="cfg-user-cell">
                    <ConfigAvatar name={u.nombre} size={32} />
                    <span className="cfg-user-name">{u.nombre}</span>
                  </div>
                </td>

                <td className="cfg-muted">{u.correo}</td>

                <td>
                  <span className="gc-badge gc-badge--success">{u.rol}</span>
                </td>

                <td>
                  {esAdmin ? (
                    <ConfigToggle checked={u.activo} onChange={() => onToggle(u.id)} />
                  ) : (
                    <span
                      className={`gc-badge gc-badge--${
                        u.activo ? "success" : "danger"
                      }`}
                    >
                      {u.activo ? "Activo" : "Inactivo"}
                    </span>
                  )}
                </td>

                {esAdmin && (
                  <td>
                    <div className="cfg-row-actions">
                      <button
                        className="gc-btn gc-btn--ghost gc-btn--sm"
                        onClick={() => onEditar(u)}
                      >
                        ✏️ Editar
                      </button>

                      <button
                        className="gc-btn gc-btn--danger gc-btn--sm"
                        onClick={() => onEliminar(u)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}

            {usuarios.length === 0 && (
              <tr>
                <td colSpan={esAdmin ? 5 : 4} className="cfg-empty">
                  Sin usuarios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}