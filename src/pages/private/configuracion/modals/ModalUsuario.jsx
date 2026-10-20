import { ModalBase } from "../shared/ModalBase";
import { UsuarioForm } from "../shared/UsuarioForm";

export function ModalUsuario({ modalUsuario, draft, setDraft, onGuardar, onClose }) {
  const esNuevo = modalUsuario === "nuevo";

  return (
    <ModalBase
      title={
        esNuevo
          ? "Nuevo Usuario"
          : `Editar: ${(draft?.nombres || "")} ${(draft?.apellidos || "")}`.trim()
      }
      onClose={onClose}
    >
      <UsuarioForm
        draft={draft}
        setDraft={setDraft}
        esNuevo={esNuevo}
      />

      <div className="cfg-modal__footer">
        <button className="gc-btn gc-btn--ghost" onClick={onClose}>
          Cancelar
        </button>
        <button className="gc-btn gc-btn--primary" onClick={onGuardar}>
          {esNuevo ? "Crear Usuario" : "Guardar Cambios"}
        </button>
      </div>
    </ModalBase>
  );
}