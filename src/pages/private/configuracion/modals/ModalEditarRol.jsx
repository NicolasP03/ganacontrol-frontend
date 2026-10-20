// src/pages/Configuracion/modals/ModalEditarRol.jsx
import { ModalBase } from "../shared/ModalBase";
import { useMemo } from "react";
import { getModulesWithPermissions } from "../../../../utils/permissionCatalog";

export function ModalEditarRol({
  modalRol,
  draft,
  setDraft,
  onGuardar,
  onQuitarPermiso,
  onClose,
}) {
  const modules = useMemo(() => getModulesWithPermissions(), []);

  // Obtener los permisos del draft (array de códigos)
  const currentPerms = new Set(draft?.permisos || []);

  const togglePermission = (code) => {
    if (currentPerms.has(code)) {
      onQuitarPermiso(code);
    } else {
      // Simular agregar permiso (usando el método existente)
      setDraft(prev => ({
        ...prev,
        permisos: [...(prev?.permisos || []), code]
      }));
    }
  };

  const actions = ['ver', 'crear', 'editar', 'eliminar'];

  return (
    <ModalBase
      title={`Editar Rol: ${modalRol.nombre}`}
      onClose={onClose}
      size="lg"
    >
      <div className="cfg-editar-rol">
        <div className="cfg-editar-rol__fields">
          <div className="cfg-field">
            <label className="gc-label">Nombre del Rol</label>
            <input
              className="gc-input"
              value={draft.nombre || ""}
              onChange={(e) => setDraft((p) => ({ ...p, nombre: e.target.value }))}
            />
          </div>

          <div className="cfg-field">
            <label className="gc-label">Descripción</label>
            <input
              className="gc-input"
              value={draft.desc || ""}
              onChange={(e) => setDraft((p) => ({ ...p, desc: e.target.value }))}
            />
          </div>
        </div>

        <div className="cfg-editar-rol__permisos">
          <div className="cfg-permisos-helper">
            <p className="cfg-helper-text">
              <span className="cfg-helper-icon">💡</span>
              Marca los permisos que tendrá este rol. <br />
              <span className="cfg-helper-note">
                "Anular / Desactivar" evita borrar información importante.
              </span>
            </p>
          </div>

          <div className="cfg-permisos-table-wrap">
            <table className="cfg-permisos-table cfg-permisos-table--editable">
              <thead>
                <tr>
                  <th className="cfg-col-modulo">Módulo</th>
                  <th className="cfg-col-desc">Descripción</th>
                  {actions.map(action => {
                    const labels = {
                      ver: "Consultar",
                      crear: "Registrar",
                      editar: "Modificar",
                      eliminar: "Anular"
                    };
                    return (
                      <th key={action} className="cfg-col-action">{labels[action]}</th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {modules.map((module) => {
                  const isSoloLectura = module.soloLectura;

                  return (
                    <tr key={module.key}>
                      <td className="cfg-cell-modulo">
                        <span className="cfg-modulo-icon">{module.icon}</span>
                        <span className="cfg-modulo-label">{module.label}</span>
                      </td>
                      <td className="cfg-cell-desc">{module.description}</td>

                      {actions.map(action => {
                        const perm = module.permissions.find(p => p.action === action);
                        const code = perm?.code || null;
                        const hasPerm = code ? currentPerms.has(code) : false;
                        const isDisabled = isSoloLectura && action !== 'ver';

                        // Si no hay permiso definido para esta acción
                        if (!code) {
                          return (
                            <td key={action} className="cfg-cell-action">
                              <span className="cfg-permiso-disabled">—</span>
                            </td>
                          );
                        }

                        return (
                          <td key={action} className="cfg-cell-action">
                            {isDisabled ? (
                              <span className="cfg-permiso-disabled">—</span>
                            ) : (
                              <label className="cfg-permiso-toggle">
                                <input
                                  type="checkbox"
                                  checked={hasPerm}
                                  onChange={() => togglePermission(code)}
                                  className="cfg-permiso-checkbox"
                                />
                                <span className="cfg-permiso-slider"></span>
                              </label>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="cfg-permisos-leyenda">
            <span className="cfg-leyenda-item">
              <span className="cfg-leyenda-toggle-on">🟢</span> Activado
            </span>
            <span className="cfg-leyenda-item">
              <span className="cfg-leyenda-toggle-off">⚪</span> Desactivado
            </span>
            <span className="cfg-leyenda-item">
              <span className="cfg-leyenda-disabled">—</span> No aplica
            </span>
          </div>

          <div className="cfg-permisos-resumen">
            <span className="cfg-resumen-total">
              Total: <strong>{currentPerms.size}</strong> permisos seleccionados
            </span>
          </div>
        </div>

        <div className="cfg-modal__footer">
          <button className="gc-btn gc-btn--ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="gc-btn gc-btn--primary" onClick={onGuardar}>
            Guardar Rol
          </button>
        </div>
      </div>
    </ModalBase>
  );
}