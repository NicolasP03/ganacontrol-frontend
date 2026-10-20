import { useState, useEffect, useCallback } from "react";
import { alimentacionService } from "../../../../services/alimentacion.service";

import { notify } from "../../../../services/notify.service";
import {
  executeRequest,
  getErrorMessage,
} from "../../../../utils/handleRequest";

export default function useAlimentacion() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");

  const [modalNuevo, setModalNuevo] = useState(false);
  const [modalEditar, setModalEditar] = useState(null);
  const [modalDetalle, setModalDetalle] = useState(null);

  const cargarRegistros = useCallback(async () => {
    try {
      setLoading(true);
      setErrorCarga("");

      const lista = await alimentacionService.listar();
      setRegistros(Array.isArray(lista) ? lista : []);
    } catch (err) {
      console.error("Error cargando alimentación:", err);
      const mensaje =
        getErrorMessage(err) || "No se pudo cargar los registros de alimentación.";
      setErrorCarga(mensaje);
      setRegistros([]);
      notify.error(mensaje);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarRegistros();
  }, [cargarRegistros]);

  const handleGuardar = useCallback(async (form) => {
    const result = await executeRequest({
      request: () => alimentacionService.crear(form),
      loadingMessage: "Creando ración...",
      successMessage: "Ración creada correctamente",
      errorMessage: "No se pudo crear la ración",
      onSuccess: async (nuevo) => {
        if (!nuevo) {
          throw new Error("No se recibió el registro creado.");
        }

        setRegistros((prev) => [nuevo, ...prev]);
        setModalNuevo(false);
      },
    });

    if (!result?.ok) {
      throw result?.error;
    }
  }, []);

  const handleActualizar = useCallback(async (form) => {
    const result = await executeRequest({
      request: () => alimentacionService.actualizar(form),
      loadingMessage: "Actualizando ración...",
      successMessage: "Ración actualizada correctamente",
      errorMessage: "No se pudo actualizar la ración",
      onSuccess: async (actualizado) => {
        if (!actualizado) {
          throw new Error("No se recibió el registro actualizado.");
        }

        setRegistros((prev) =>
          prev.map((r) => (r.id === actualizado.id ? actualizado : r))
        );

        setModalEditar(null);

        setModalDetalle((prev) =>
          prev?.id === actualizado.id ? actualizado : prev
        );
      },
    });

    if (!result?.ok) {
      throw result?.error;
    }
  }, []);

  const handleEliminar = useCallback(async (registro) => {
    const id = typeof registro === "object" ? registro?.id : registro;

    if (!id) {
      notify.error("No se encontró el id del registro");
      return;
    }

    await executeRequest({
      confirm: {
        title: "Eliminar ración",
        text: "Esta acción no se puede deshacer.",
        confirmText: "Sí, eliminar",
        cancelText: "Cancelar",
        icon: "warning",
      },
      request: () => alimentacionService.eliminar(id),
      loadingMessage: "Eliminando ración...",
      successMessage: "Ración eliminada correctamente",
      errorMessage: "No se pudo eliminar la ración",
      onSuccess: async () => {
        setRegistros((prev) => prev.filter((r) => r.id !== id));
        setModalDetalle((prev) => (prev?.id === id ? null : prev));
        setModalEditar((prev) => (prev?.id === id ? null : prev));
      },
    });
  }, []);

  return {
    registros,
    loading,
    errorCarga,

    modalNuevo,
    setModalNuevo,

    modalEditar,
    setModalEditar,

    modalDetalle,
    setModalDetalle,

    handleGuardar,
    handleActualizar,
    handleEliminar,

    recargarAlimentacion: cargarRegistros,
  };
}