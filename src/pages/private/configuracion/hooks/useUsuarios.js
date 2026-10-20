import { useEffect, useState, useCallback } from "react";
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  toggleUsuarioActivo,
  deleteUsuario,
} from "../../../../services/ConfiguracionService";
import { USUARIO_VACIO } from "../configuracion.constants";

import { notify } from "../../../../services/notify.service";
import {
  executeRequest,
  getErrorMessage,
} from "../../../../utils/handleRequest";

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorCarga, setErrorCarga] = useState("");

  const [modalUsuario, setModalUsuario] = useState(null);
  const [draft, setDraft] = useState(USUARIO_VACIO);
  const [confirmElim, setConfirmElim] = useState(null);

  const cargarUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      setErrorCarga("");

      const data = await getUsuarios();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (e) {
      const mensaje = getErrorMessage(e) || "No se pudieron cargar los usuarios";
      setUsuarios([]);
      setErrorCarga(mensaje);
      notify.error(mensaje);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  const abrirNuevo = () => {
    setDraft({ ...USUARIO_VACIO });
    setModalUsuario("nuevo");
  };

  const abrirEditar = (u) => {
    setDraft({
      ...u,
      contrasena: "",
      confirmarContrasena: "",
    });
    setModalUsuario(u);
  };

  const cerrarModal = () => {
    setModalUsuario(null);
  };

  const guardar = async () => {
    const isNew = modalUsuario === "nuevo";

    if (!draft.nombres?.trim()) {
      notify.error("Los nombres son obligatorios");
      return;
    }

    if (!draft.apellidos?.trim()) {
      notify.error("Los apellidos son obligatorios");
      return;
    }

    if (!draft.correo?.trim()) {
      notify.error("El correo es obligatorio");
      return;
    }

    if (!draft.rol_id) {
      notify.error("Debe seleccionar un rol");
      return;
    }

    if (!draft.finca_id) {
      notify.error("Debe indicar la finca");
      return;
    }

    if (isNew && !draft.contrasena?.trim()) {
      notify.error("La contraseña es obligatoria al crear");
      return;
    }

    if (draft.contrasena || draft.confirmarContrasena) {
      if (!draft.contrasena?.trim()) {
        notify.error("Debe ingresar la contraseña");
        return;
      }

      if (!draft.confirmarContrasena?.trim()) {
        notify.error("Debe confirmar la contraseña");
        return;
      }

      if (draft.contrasena !== draft.confirmarContrasena) {
        notify.error("Las contraseñas no coinciden");
        return;
      }

      if (draft.contrasena.length < 6) {
        notify.error("La contraseña debe tener al menos 6 caracteres");
        return;
      }
    }

    const result = await executeRequest({
      request: () =>
        isNew ? createUsuario(draft) : updateUsuario(draft.id, draft),
      loadingMessage: isNew
        ? "Creando usuario..."
        : "Actualizando usuario...",
      successMessage: isNew
        ? "Usuario creado correctamente"
        : "Usuario actualizado correctamente",
      errorMessage: isNew
        ? "Error al crear usuario"
        : "Error al actualizar usuario",
      onSuccess: async () => {
        await cargarUsuarios();
        cerrarModal();
      },
    });

    if (!result?.ok) return;
  };

  const toggle = async (id) => {
    const actual = usuarios.find((u) => u.id === id);
    if (!actual) return;

    await executeRequest({
      confirm: {
        title: actual.activo ? "Desactivar usuario" : "Activar usuario",
        text: actual.activo
          ? "El usuario perderá acceso al sistema."
          : "El usuario recuperará acceso al sistema.",
        confirmText: actual.activo ? "Sí, desactivar" : "Sí, activar",
        cancelText: "Cancelar",
        icon: "warning",
      },
      request: () => toggleUsuarioActivo(id, !actual.activo),
      loadingMessage: actual.activo
        ? "Desactivando usuario..."
        : "Activando usuario...",
      successMessage: "Estado actualizado correctamente",
      errorMessage: "No se pudo cambiar el estado del usuario",
      onSuccess: async () => {
        await cargarUsuarios();
      },
    });
  };

  const eliminar = async (usuario) => {
    const id = typeof usuario === "object" ? usuario?.id : usuario;

    if (!id) {
      notify.error("No se encontró el id del usuario");
      return;
    }

    await executeRequest({
      confirm: {
        title: "Eliminar usuario",
        text: "Esta acción no se puede deshacer.",
        confirmText: "Sí, eliminar",
        cancelText: "Cancelar",
        icon: "warning",
      },
      request: () => deleteUsuario(id),
      loadingMessage: "Eliminando usuario...",
      successMessage: "Usuario eliminado correctamente",
      errorMessage: "No se pudo eliminar el usuario",
      onSuccess: async () => {
        await cargarUsuarios();
        setConfirmElim(null);
      },
    });
  };

  return {
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
    recargarUsuarios: cargarUsuarios,
  };
}

export default useUsuarios;