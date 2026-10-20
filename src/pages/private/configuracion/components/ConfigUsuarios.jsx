import { useUsuarios } from "../hooks/useUsuarios";
import { ConfigUsuariosTabla } from "./ConfigUsuariosTabla";
import { ModalUsuario } from "../modals/ModalUsuario";
import { ModalEliminarUsuario } from "../modals/ModalEliminarUsuario";

export function ConfigUsuarios({ esAdmin }) {
  const {
    usuarios,
    loading,
    errorCarga,
    modalUsuario,
    draft,
    setDraft,
    confirmElim,
    setConfirmElim,
    abrirNuevo,
    abrirEditar,
    cerrarModal,
    guardar,
    toggle,
    eliminar,
  } = useUsuarios();

  return (
    <div>
      <div className="cfg-toolbar">
        <div>
          <h3 className="cfg-toolbar__title">Usuarios del sistema</h3>
          <p className="cfg-toolbar__sub">
            {usuarios.length} usuario{usuarios.length !== 1 ? "s" : ""} registrado
            {usuarios.length !== 1 ? "s" : ""}
          </p>
        </div>

        {esAdmin && (
          <button className="gc-btn gc-btn--primary" onClick={abrirNuevo}>
            ➕ Nuevo Usuario
          </button>
        )}
      </div>

      {loading && (
        <div className="cfg-empty">Cargando usuarios...</div>
      )}

      {!loading && errorCarga && (
        <div className="cfg-empty">{errorCarga}</div>
      )}

      {!loading && !errorCarga && (
        <ConfigUsuariosTabla
          usuarios={usuarios}
          esAdmin={esAdmin}
          onEditar={abrirEditar}
          onToggle={toggle}
          onEliminar={(u) => setConfirmElim(u)}
        />
      )}

      {modalUsuario !== null && (
        <ModalUsuario
          modalUsuario={modalUsuario}
          draft={draft}
          setDraft={setDraft}
          onGuardar={guardar}
          onClose={cerrarModal}
        />
      )}

      {confirmElim && (
        <ModalEliminarUsuario
          item={confirmElim}
          onConfirm={eliminar}
          onClose={() => setConfirmElim(null)}
        />
      )}
    </div>
  );
}