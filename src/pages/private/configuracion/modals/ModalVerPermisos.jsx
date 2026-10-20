// src/pages/Configuracion/modals/ModalVerPermisos.jsx
import { ModalBase } from "../shared/ModalBase";
import { getModulesWithPermissions } from "../../../../utils/permissionCatalog";

export function ModalVerPermisos({ rol, onClose }) {
  const modules = getModulesWithPermissions();
  const userPerms = new Set(rol.permisos || []);

  const hasPermission = (code) => {
    return userPerms.has(code);
  };

  const getActionLabel = (action) => {
    const labels = {
      ver: "Consultar",
      crear: "Registrar",
      editar: "Modificar",
      eliminar: "Anular / Desactivar"
    };
    return labels[action] || action;
  };

  // Definir las acciones a mostrar (ordenadas)
  const actions = ['ver', 'crear', 'editar', 'eliminar'];

  return (
    <ModalBase
      title={`Permisos: ${rol.nombre}`}
      onClose={onClose}
      size="lg"
    >
      <div className="cfg-permisos-modal">
        <div className="cfg-permisos-helper">
          <p className="cfg-helper-text">
            <span className="cfg-helper-icon">💡</span>
            Los códigos técnicos se usan internamente, pero aquí se muestran de forma sencilla.
            <br />
            <span className="cfg-helper-note">"Anular / Desactivar" evita borrar información importante de la finca.</span>
          </p>
        </div>

        <div className="cfg-permisos-table-wrap">
          <table className="cfg-permisos-table">
            <thead>
              <tr>
                <th className="cfg-col-modulo">Módulo</th>
                <th className="cfg-col-desc">Descripción</th>
                {actions.map(action => (
                  <th key={action} className="cfg-col-action">{getActionLabel(action)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modules.map((module) => {
                // Verificar si el módulo tiene algún permiso asignado
                const hasAnyPerm = module.permissions.some(p => hasPermission(p.code));
                const isSoloLectura = module.soloLectura;

                return (
                  <tr key={module.key} className={hasAnyPerm ? "cfg-row-active" : "cfg-row-inactive"}>
                    <td className="cfg-cell-modulo">
                      <span className="cfg-modulo-icon">{module.icon}</span>
                      <span className="cfg-modulo-label">{module.label}</span>
                    </td>
                    <td className="cfg-cell-desc">{module.description}</td>
                    
                    {actions.map(action => {
                      const perm = module.permissions.find(p => p.action === action);
                      const hasPerm = perm ? hasPermission(perm.code) : false;
                      
                      // Si el módulo es solo lectura y la acción no es "ver", mostrar "—"
                      const isDisabled = isSoloLectura && action !== 'ver';
                      const showCheck = hasPerm || (isSoloLectura && action === 'ver' && hasPerm);
                      
                      return (
                        <td key={action} className="cfg-cell-action">
                          {isDisabled ? (
                            <span className="cfg-permiso-disabled">—</span>
                          ) : showCheck ? (
                            <span className="cfg-permiso-check">✅</span>
                          ) : (
                            <span className="cfg-permiso-empty">◻️</span>
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
            <span className="cfg-leyenda-check">✅</span> Tiene permiso
          </span>
          <span className="cfg-leyenda-item">
            <span className="cfg-leyenda-empty">◻️</span> Sin permiso
          </span>
          <span className="cfg-leyenda-item">
            <span className="cfg-leyenda-disabled">—</span> No aplica
          </span>
        </div>

        <div className="cfg-permisos-resumen">
          <span className="cfg-resumen-total">
            Total: <strong>{userPerms.size}</strong> permisos
          </span>
        </div>
      </div>
    </ModalBase>
  );
}