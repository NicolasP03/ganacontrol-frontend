// ─── modals/ModalEliminarUsuario.jsx ─────────────────────────────────────────
import { ModalBase } from "../shared/ModalBase";

export function ModalEliminarUsuario({ item, onConfirm, onClose }) {
  return (
    <ModalBase title="Confirmar eliminación" onClose={onClose} size="sm">
      <p className="cfg-confirm__msg">
        ¿Está seguro que desea eliminar a <strong>{item.nombre}</strong>?
        Esta acción no se puede deshacer.
      </p>
      <div className="cfg-confirm__actions">
        <button className="gc-btn gc-btn--ghost" onClick={onClose}>
          Cancelar
        </button>
        <button
          className="gc-btn gc-btn--danger"
          onClick={() => { onConfirm(item.id); onClose(); }}
        >
          Eliminar
        </button>
      </div>
    </ModalBase>
  );
}