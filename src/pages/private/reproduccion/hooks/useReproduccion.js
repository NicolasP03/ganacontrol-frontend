import { useState, useEffect, useCallback } from "react";
import { reproduccionService } from "../../../../services/reproduccion.service";

import { notify } from "../../../../services/notify.service";
import {
  executeRequest,
  getErrorMessage,
} from "../../../../utils/handleRequest";

export default function useReproduccion() {
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

      const data = await reproduccionService.listar();
      setRegistros(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando reproducción:", error);
      setRegistros([]);

      const mensaje = getErrorMessage(error);
      setErrorCarga(mensaje);
      notify.error(mensaje);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarRegistros();
  }, [cargarRegistros]);

  const handleGuardar = useCallback(
    async (form) => {
      const result = await executeRequest({
        request: () => reproduccionService.crear(form),
        loadingMessage: "Creando registro...",
        successMessage: "Registro creado correctamente",
        errorMessage: "No se pudo crear el registro",
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
    },
    []
  );

  const handleActualizar = useCallback(
    async (form) => {
      const result = await executeRequest({
        request: () => reproduccionService.actualizar(form),
        loadingMessage: "Actualizando registro...",
        successMessage: "Registro actualizado correctamente",
        errorMessage: "No se pudo actualizar el registro",
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
    },
    []
  );

  const handleEliminar = useCallback(
    async (registro) => {
      const id = registro?.id;

      if (!id) {
        notify.error("No se encontró el id del registro");
        return;
      }

      await executeRequest({
        confirm: {
          title: "Eliminar registro",
          text: "Esta acción no se puede deshacer.",
          confirmText: "Sí, eliminar",
          cancelText: "Cancelar",
          icon: "warning",
        },
        request: () => reproduccionService.eliminar(id),
        loadingMessage: "Eliminando registro...",
        successMessage: "Registro eliminado correctamente",
        errorMessage: "No se pudo eliminar el registro",
        onSuccess: async () => {
          setRegistros((prev) => prev.filter((r) => r.id !== id));
          setModalDetalle((prev) => (prev?.id === id ? null : prev));
          setModalEditar((prev) => (prev?.id === id ? null : prev));
        },
      });
    },
    []
  );

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

    recargarReproduccion: cargarRegistros,
  };
}
