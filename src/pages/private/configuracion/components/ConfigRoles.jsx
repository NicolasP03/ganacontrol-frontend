// src/pages/Configuracion/components/ConfigRoles.jsx
import { useRoles } from "../hooks/useRoles";
import { ModalEditarRol } from "../modals/ModalEditarRol";
import { ModalVerPermisos } from "../modals/ModalVerPermisos";
import { PERMISSION_CATALOG } from "../../../../utils/permissionCatalog";
import { useState } from "react";

export function ConfigRoles({ esAdmin }) {
  const {
    roles,
    modalRol,
    draft,
    setDraft,
    nuevoPermiso,
    setNuevoPermiso,
    abrirEditar,
    cerrarModal,
    guardar,
    agregarPermiso,
    quitarPermiso,
    loading,
  } = useRoles();

  const [modalVer, setModalVer] = useState(null);

  const getPermisosResumen = (permisos) => {
    if (!permisos || permisos.length === 0) return "Sin permisos";
    
    const modulos = new Set();
    permisos.forEach(p => {
      const parts = p.split('.');
      if (parts.length === 2) modulos.add(parts[0]);
    });
    
    const nombres = Array.from(modulos).map(m => {
      return PERMISSION_CATALOG[m]?.label || m;
    });
    
    if (nombres.length <= 3) return nombres.join(", ");
    return `${nombres.slice(0, 3).join(", ")} y ${nombres.length - 3} más`;
  };

  if (loading) {
    return (
      <div className="cfg-loading">
        <div className="cfg-loading__spinner" />
        <p>Cargando roles...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="cfg-toolbar">
        <div>
          <h3 className="cfg-toolbar__title">Roles del sistema</h3>
          <p className="cfg-toolbar__sub">
            Define los niveles de acceso por perfil. {roles.length} rol{roles.length !== 1 ? "es" : ""} configurado{roles.length !== 1 ? "s" : ""}.
          </p>
        </div>
        <div className="cfg-toolbar__help">
          <span className="cfg-help-icon">ℹ️</span>
          <span className="cfg-help-text">
            Los permisos definen qué puede consultar, registrar o modificar una persona dentro del sistema.
          </span>
        </div>
      </div>

      <div className="cfg-roles-grid">
        {roles.map((r) => (
          <div key={r.id} className="cfg-rol-card">
            <div className="cfg-rol-card__head">
              <div className="cfg-rol-icon">{r.nombre.charAt(0)}</div>
              <div className="cfg-rol-info">
                <h4 className="cfg-rol-nombre">{r.nombre}</h4>
                <p className="cfg-rol-desc">{r.desc}</p>
              </div>
            </div>

            <div className="cfg-rol-permisos-resumen">
              <span className="cfg-rol-permisos-count">
                {(r.permisos || []).length} permisos
              </span>
              <span className="cfg-rol-permisos-modulos">
                {getPermisosResumen(r.permisos)}
              </span>
            </div>

            <div className="cfg-rol-footer">
              <button
                className="cfg-rol-btn cfg-rol-btn--ver"
                onClick={() => setModalVer(r)}
              >
                👁️ Ver permisos
              </button>
              {esAdmin && (
                <button
                  className="cfg-rol-btn cfg-rol-btn--editar"
                  onClick={() => abrirEditar(r)}
                >
                  ✏️ Editar permisos
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {modalRol !== null && draft && (
        <ModalEditarRol
          modalRol={modalRol}
          draft={draft}
          setDraft={setDraft}
          nuevoPermiso={nuevoPermiso}
          setNuevoPermiso={setNuevoPermiso}
          onGuardar={guardar}
          onAgregarPermiso={agregarPermiso}
          onQuitarPermiso={quitarPermiso}
          onClose={cerrarModal}
          catalog={PERMISSION_CATALOG}
        />
      )}

      {modalVer !== null && (
        <ModalVerPermisos
          rol={modalVer}
          onClose={() => setModalVer(null)}
          catalog={PERMISSION_CATALOG}
        />
      )}
    </div>
  );
}