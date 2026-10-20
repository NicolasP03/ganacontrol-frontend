import { useEffect, useState, useCallback } from "react";
import { ganadoService } from "../../../../services/ganado.service";
import { invalidarCatalogos } from "./useCatalogos";

import { notify } from "../../../../services/notify.service";
import {
  executeRequest,
  getErrorMessage,
} from "../../../../utils/handleRequest";

export default function useGanado() {
  const [animales, setAnimales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");

  const [modalNuevo, setModalNuevo] = useState(false);
  const [modalEditar, setModalEditar] = useState(null);
  const [modalDetalle, setModalDetalle] = useState(null);
  const [modalExport, setModalExport] = useState(false);

  const cargarGanado = useCallback(async () => {
    try {
      setLoading(true);
      setErrorCarga("");

      const lista = await ganadoService.listar();
      setAnimales(Array.isArray(lista) ? lista : []);
    } catch (err) {
      console.error("Error cargando ganado:", err);
      const mensaje = getErrorMessage(err);
      setErrorCarga(mensaje);
      notify.error(mensaje);
      setAnimales([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarGanado();
  }, [cargarGanado]);

  const handleGuardar = useCallback(async (form) => {
    const result = await executeRequest({
      request: () => ganadoService.crear(form),
      loadingMessage: "Creando registro...",
      successMessage: "Registro creado correctamente",
      errorMessage: "No se pudo crear el registro",
      onSuccess: async (nuevo) => {
        if (!nuevo) {
          throw new Error("No se recibió el registro creado.");
        }

        setAnimales((prev) => [nuevo, ...prev]);
        invalidarCatalogos();
        setModalNuevo(false);
      },
    });

    if (!result?.ok) {
      throw result?.error;
    }

    return result.data;
  }, []);

  const handleActualizar = useCallback(async (form) => {
    const result = await executeRequest({
      request: () => ganadoService.actualizar(form),
      loadingMessage: "Actualizando registro...",
      successMessage: "Registro actualizado correctamente",
      errorMessage: "No se pudo actualizar el registro",
      onSuccess: async (actualizado) => {
        if (!actualizado) {
          throw new Error("No se recibió el registro actualizado.");
        }

        setAnimales((prev) =>
          prev.map((a) => (a.id === actualizado.id ? actualizado : a))
        );
        invalidarCatalogos();

        setModalEditar(null);

        setModalDetalle((prev) =>
          prev?.id === actualizado.id ? actualizado : prev
        );
      },
    });

    if (!result?.ok) {
      throw result?.error;
    }

    return result.data;
  }, []);

  const handleEliminar = useCallback(async (animal) => {
    const id = typeof animal === "object" ? animal?.id : animal;

    if (!id) {
      notify.error("No se encontró el id del registro");
      return;
    }

    await executeRequest({
      confirm: {
        title: "Anular registro",
        text: "El animal dejará de aparecer en el inventario. Su historial de sanidad, reproducción y ventas se conserva.",
        confirmText: "Sí, eliminar",
        cancelText: "Cancelar",
        icon: "warning",
      },
      request: () => ganadoService.eliminar(id),
      loadingMessage: "Eliminando registro...",
      successMessage: "Registro eliminado correctamente",
      errorMessage: "No se pudo eliminar el registro",
      onSuccess: async () => {
        setAnimales((prev) => prev.filter((a) => a.id !== id));
        invalidarCatalogos();
        setModalDetalle((prev) => (prev?.id === id ? null : prev));
        setModalEditar((prev) => (prev?.id === id ? null : prev));
      },
    });
  }, []);

  return {
    animales,
    loading,
    errorCarga,

    modalNuevo,
    setModalNuevo,

    modalEditar,
    setModalEditar,

    modalDetalle,
    setModalDetalle,

    modalExport,
    setModalExport,

    handleGuardar,
    handleActualizar,
    handleEliminar,

    recargarGanado: cargarGanado,
  };
}