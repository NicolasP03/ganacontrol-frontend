import { useState, useMemo, useCallback, useEffect } from "react";
import { exportarHistorialSaludPDF } from "../../../../utils/exportarHistorialSaludPDF";
import { getUsuarioActual } from "../../../../services/AuthService";
import {
  listarEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
  obtenerKpisSalud,
  obtenerProximosEventos,
  obtenerEstatusSalud,
  obtenerResumenSalud,
} from "../../../../services/salud.service";

import { notify } from "../../../../services/notify.service";
import {
  executeRequest,
  getErrorMessage,
} from "../../../../utils/handleRequest";

export function useSalud() {
  const [historialBase, setHistorialBase] = useState([]);

  const [kpis, setKpis] = useState([]);
  const [proximos, setProximos] = useState([]);
  const [estatus, setEstatus] = useState([]);
  const [heroStats, setHeroStats] = useState({});

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [loading, setLoading] = useState(false);
  const [modalDetalle, setModalDetalle] = useState(null);
  const [modalForm, setModalForm] = useState(null);
  const [error, setError] = useState(null);

  const cargarModulo = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [eventos, kpisData, proximosData, estatusData, resumenData] =
        await Promise.all([
          listarEventos(),
          obtenerKpisSalud(),
          obtenerProximosEventos(),
          obtenerEstatusSalud(),
          obtenerResumenSalud(),
        ]);

      setHistorialBase(Array.isArray(eventos) ? eventos : []);
      setKpis(Array.isArray(kpisData) ? kpisData : []);
      setProximos(Array.isArray(proximosData) ? proximosData : []);
      setEstatus(Array.isArray(estatusData) ? estatusData : []);
      setHeroStats(
        resumenData && typeof resumenData === "object" ? resumenData : {}
      );
    } catch (err) {
      console.error("Error cargando módulo salud:", err);
      const mensaje = getErrorMessage(err) || "No se pudo cargar el módulo de salud.";
      setError(mensaje);
      setHistorialBase([]);
      setKpis([]);
      setProximos([]);
      setEstatus([]);
      setHeroStats({});
      notify.error(mensaje);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarModulo();
  }, [cargarModulo]);

  const historialFiltrado = useMemo(() => {
    return historialBase.filter((ev) => {
      const q = busqueda.trim().toLowerCase();

      const matchQ =
        !q ||
        String(ev?.id ?? "").toLowerCase().includes(q) ||
        String(ev?.tratamiento ?? "").toLowerCase().includes(q) ||
        String(ev?.vet ?? "").toLowerCase().includes(q) ||
        String(ev?.animalCod ?? "").toLowerCase().includes(q) ||
        String(ev?.animalNombre ?? "").toLowerCase().includes(q) ||
        String(ev?.notas ?? "").toLowerCase().includes(q);

      const matchE =
        filtroEstado === "todos" || ev?.estadoKey === filtroEstado;

      return matchQ && matchE;
    });
  }, [historialBase, busqueda, filtroEstado]);

  const handleEliminar = useCallback(
    async (evento) => {
      const id = typeof evento === "object" ? evento?.id : evento;

      if (!id) {
        notify.error("No se encontró el id del evento");
        return;
      }

      await executeRequest({
        confirm: {
          title: "Eliminar evento sanitario",
          text: "Esta acción no se puede deshacer.",
          confirmText: "Sí, eliminar",
          cancelText: "Cancelar",
          icon: "warning",
        },
        request: () => eliminarEvento(id),
        loadingMessage: "Eliminando evento...",
        successMessage: "Evento eliminado correctamente",
        errorMessage: "No se pudo eliminar el evento",
        onSuccess: async () => {
          setHistorialBase((prev) => prev.filter((ev) => ev.id !== id));

          setModalDetalle((prev) => (prev?.id === id ? null : prev));
          setModalForm((prev) => (prev?.id === id ? null : prev));

          await cargarModulo();
        },
      });
    },
    [cargarModulo]
  );

  const handleGuardar = useCallback(
    async (eventoForm) => {
      const isEdit = Boolean(eventoForm?.id || eventoForm?.backendId);
      const idReal = eventoForm?.backendId || eventoForm?.id;

      const result = await executeRequest({
        request: () =>
          isEdit
            ? actualizarEvento(idReal, eventoForm)
            : crearEvento(eventoForm),
        loadingMessage: isEdit
          ? "Actualizando evento..."
          : "Creando evento...",
        successMessage: isEdit
          ? "Evento actualizado correctamente"
          : "Evento creado correctamente",
        errorMessage: isEdit
          ? "No se pudo actualizar el evento"
          : "No se pudo crear el evento",
        onSuccess: async () => {
          await cargarModulo();
          setModalForm(null);
        },
      });

      if (!result?.ok) {
        throw result?.error;
      }
    },
    [cargarModulo]
  );

  const handleExportar = useCallback(() => {
  try {
    const usuario = getUsuarioActual?.() || {};

    exportarHistorialSaludPDF(historialFiltrado, usuario);

    notify.success("PDF generado correctamente");
  } catch (error) {
    console.error("Error exportando PDF:", error);
    notify.error("No se pudo generar el PDF");
  }
}, [historialFiltrado]);

  return {
    historial: historialFiltrado,
    historialTotal: historialFiltrado.length,
    historialBase,

    kpis,
    proximos,
    estatus,
    heroStats,

    busqueda,
    setBusqueda,

    filtroEstado,
    setFiltroEstado,

    loading,
    error,

    modalDetalle,
    setModalDetalle,

    modalForm,
    setModalForm,

    recargar: cargarModulo,
    handleEliminar,
    handleGuardar,
    handleExportar,
  };
}

export default useSalud;