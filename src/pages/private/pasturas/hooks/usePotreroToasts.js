import { useEffect, useState, useCallback } from "react";
import {
  listarPotreros,
  crearPotrero,
  actualizarPotrero,
  eliminarPotrero,
} from "../../../../services/potrero.service";

import { notify } from "../../../../services/notify.service";
import {
  executeRequest,
  getErrorMessage,
} from "../../../../utils/handleRequest";

export default function usePotreros() {
  const [potreros, setPotreros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [potreroActivo, setPotreroActivo] = useState(null);
  const [modoForm, setModoForm] = useState("crear");

  const cargarPotreros = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await listarPotreros();
      setPotreros(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando potreros:", err);
      setPotreros([]);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarPotreros();
  }, [cargarPotreros]);

  const abrirCrear = useCallback(() => {
    setModoForm("crear");
    setPotreroActivo(null);
    setModalFormOpen(true);
  }, []);

  const abrirEditar = useCallback((potrero) => {
    setModoForm("editar");
    setPotreroActivo(potrero);
    setModalFormOpen(true);
  }, []);

  const cerrarForm = useCallback(() => {
    if (guardando) return;
    setModalFormOpen(false);
    setPotreroActivo(null);
  }, [guardando]);

  const handleGuardar = useCallback(
    async (form) => {
      try {
        setGuardando(true);

        const isEdit = modoForm === "editar" && Boolean(potreroActivo?.id);

        const result = await executeRequest({
          request: () =>
            isEdit
              ? actualizarPotrero(potreroActivo.id, form)
              : crearPotrero(form),
          loadingMessage: isEdit
            ? "Actualizando potrero..."
            : "Creando potrero...",
          successMessage: isEdit
            ? "Potrero actualizado correctamente"
            : "Potrero creado correctamente",
          errorMessage: isEdit
            ? "No se pudo actualizar el potrero"
            : "No se pudo crear el potrero",
          onSuccess: async (data) => {
            if (!data) {
              throw new Error(
                isEdit
                  ? "No se recibió el potrero actualizado."
                  : "No se recibió el potrero creado."
              );
            }

            if (isEdit) {
              setPotreros((prev) =>
                prev.map((item) => (item.id === potreroActivo.id ? data : item))
              );
            } else {
              setPotreros((prev) => [data, ...prev]);
            }

            setModalFormOpen(false);
            setPotreroActivo(null);
          },
        });

        if (!result?.ok) {
          throw result?.error;
        }
      } finally {
        setGuardando(false);
      }
    },
    [modoForm, potreroActivo]
  );

  const handleEliminar = useCallback(async (potrero) => {
    const id = potrero?.id;

    if (!id) {
      notify.error("No se encontró el id del potrero");
      return;
    }

    await executeRequest({
      confirm: {
        title: "Eliminar potrero",
        text: "Esta acción no se puede deshacer.",
        confirmText: "Sí, eliminar",
        cancelText: "Cancelar",
        icon: "warning",
      },
      request: () => eliminarPotrero(id),
      loadingMessage: "Eliminando potrero...",
      successMessage: "Potrero eliminado correctamente",
      errorMessage: "No se pudo eliminar el potrero",
      onSuccess: async () => {
        setPotreros((prev) => prev.filter((p) => p.id !== id));
        setPotreroActivo((prev) => (prev?.id === id ? null : prev));
      },
    });
  }, []);

  return {
    potreros,
    loading,
    guardando,
    error,

    modalFormOpen,
    setModalFormOpen,

    potreroActivo,
    setPotreroActivo,

    modoForm,
    setModoForm,

    abrirCrear,
    abrirEditar,
    cerrarForm,
    handleGuardar,
    handleEliminar,

    recargarPotreros: cargarPotreros,
  };
}