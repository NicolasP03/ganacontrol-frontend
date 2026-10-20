// src/pages/Configuracion/hooks/useRoles.js
import { useEffect, useState, useCallback } from "react";
import { getRoles, updateRol } from "../../../../services/ConfiguracionService";
import { notify } from "../../../../services/notify.service";
import { executeRequest, getErrorMessage } from "../../../../utils/handleRequest";
import { getUsuarioActual, me } from "../../../../services/AuthService";

export function useRoles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorCarga, setErrorCarga] = useState("");

  const [modalRol, setModalRol] = useState(null);
  const [draft, setDraft] = useState(null);
  const [nuevoPermiso, setNuevoPermiso] = useState("");

  const cargarRoles = useCallback(async () => {
    try {
      setLoading(true);
      setErrorCarga("");

      const data = await getRoles();
      setRoles(Array.isArray(data) ? data : []);
    } catch (e) {
      const mensaje = getErrorMessage(e) || "No se pudieron cargar los roles";
      setRoles([]);
      setErrorCarga(mensaje);
      notify.error(mensaje);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarRoles();
  }, [cargarRoles]);

  const abrirEditar = (r) => {
    // Asegurar que los permisos sean un array
    const permisos = Array.isArray(r.permisos) ? [...r.permisos] : [];
    setDraft({ ...r, permisos });
    setModalRol(r);
  };

  const cerrarModal = () => {
    setModalRol(null);
    setDraft(null);
  };

  const guardar = async () => {
    if (!draft?.nombre?.trim()) {
      notify.error("El nombre del rol es obligatorio");
      return;
    }

    const result = await executeRequest({
      request: () => updateRol(draft.id, draft),
      loadingMessage: "Actualizando rol...",
      successMessage: "Rol actualizado correctamente",
      errorMessage: "No se pudo actualizar el rol",
      onSuccess: async () => {
        // Si se editó el rol del usuario conectado, refresca sus permisos en la sesión
        if (Number(getUsuarioActual()?.rol_id) === Number(draft.id)) {
          await me();
        }
        await cargarRoles();
        cerrarModal();
      },
    });

    if (!result?.ok) {
      return;
    }
  };

  const agregarPermiso = () => {
    const permiso = nuevoPermiso.trim();

    if (!permiso) return;

    if (draft?.permisos?.includes(permiso)) {
      notify.error("Ese permiso ya existe");
      return;
    }

    setDraft((p) => ({
      ...p,
      permisos: [...(p?.permisos || []), permiso],
    }));

    setNuevoPermiso("");
  };

  const quitarPermiso = (permiso) => {
    setDraft((prev) => ({
      ...prev,
      permisos: (prev?.permisos || []).filter((x) => x !== permiso),
    }));
  };

  // Función para actualizar permisos completos (usada desde el modal editable)
  const actualizarPermisos = (nuevosPermisos) => {
    setDraft((prev) => ({
      ...prev,
      permisos: [...nuevosPermisos],
    }));
  };

  return {
    roles,
    loading,
    errorCarga,
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
    actualizarPermisos,
    recargarRoles: cargarRoles,
  };
}

export default useRoles;