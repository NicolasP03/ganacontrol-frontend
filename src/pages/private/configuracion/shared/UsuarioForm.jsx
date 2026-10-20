import { ROLES_DISPONIBLES } from "../configuracion.constants";
import { ConfigToggle } from "../ui/ConfigToggle";
import { getUsuarioActual } from "../../../../services/AuthService";

export function UsuarioForm({ draft, setDraft, esNuevo = false }) {
  const set = (key) => (e) =>
    setDraft((prev) => ({ ...prev, [key]: e.target.value }));

  const setNumber = (key) => (e) =>
    setDraft((prev) => ({ ...prev, [key]: Number(e.target.value) }));

  const esAdministrador = Number(draft.rol_id) === 1;

  return (
    <div className="cfg-fields-stack">
      <div className="cfg-field">
        <label className="gc-label">Nombres</label>
        <input
          className="gc-input"
          type="text"
          value={draft.nombres || ""}
          onChange={set("nombres")}
          placeholder="Ej. Jair Alfonso"
        />
      </div>

      <div className="cfg-field">
        <label className="gc-label">Apellidos</label>
        <input
          className="gc-input"
          type="text"
          value={draft.apellidos || ""}
          onChange={set("apellidos")}
          placeholder="Ej. Arias Cueca"
        />
      </div>

      <div className="cfg-field">
        <label className="gc-label">Correo electrónico</label>
        <input
          className="gc-input"
          type="email"
          value={draft.correo || ""}
          onChange={set("correo")}
          placeholder="usuario@ejemplo.com"
        />
      </div>

      <div className="cfg-field">
        <label className="gc-label">Rol</label>
        <select
          className="gc-input"
          value={draft.rol_id || ""}
          onChange={setNumber("rol_id")}
        >
          {ROLES_DISPONIBLES.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="cfg-field">
        <label className="gc-label">Finca</label>
        {/* Los usuarios siempre se registran en la finca del administrador */}
        <input
          className="gc-input"
          type="text"
          value={draft.finca || getUsuarioActual()?.finca || `Finca #${draft.finca_id || 1}`}
          disabled
          readOnly
        />
      </div>

      <div className="cfg-field">
        <label className="gc-label">
          {esNuevo ? "Contraseña" : "Nueva contraseña"}
        </label>
        <input
          className="gc-input"
          type="password"
          value={draft.contrasena || ""}
          onChange={set("contrasena")}
          placeholder={
            esNuevo
              ? "Ingrese la contraseña"
              : "Deje vacío si no desea cambiarla"
          }
        />
      </div>

      <div className="cfg-field">
        <label className="gc-label">Confirmar contraseña</label>
        <input
          className="gc-input"
          type="password"
          value={draft.confirmarContrasena || ""}
          onChange={set("confirmarContrasena")}
          placeholder="Confirme la contraseña"
        />
      </div>

      <div className="cfg-toggle-row">
        <label className="gc-label" style={{ margin: 0 }}>
          Estado
        </label>

        <ConfigToggle
          checked={!!draft.activo}
          disabled={esAdministrador}
          onChange={(e) =>
            setDraft((prev) => ({ ...prev, activo: e.target.checked }))
          }
        />

        <span className="cfg-muted cfg-muted--sm">
          {esAdministrador
            ? "Administrador activo"
            : draft.activo
            ? "Activo"
            : "Inactivo"}
        </span>
      </div>
    </div>
  );
}