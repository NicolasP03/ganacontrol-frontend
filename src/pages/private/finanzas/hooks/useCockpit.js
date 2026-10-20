import { useState, useEffect, useCallback } from "react";
import {
  getKPIs,
  getGrowthData,
  getLiquidacion,
  getTransacciones,
  deleteTransaccion as deleteTransaccionService,
  exportarReporte,
} from "../../../../services/cockpit.service";

import { notify } from "../../../../services/notify.service";
import { executeRequest, getErrorMessage } from "../../../../utils/handleRequest";

export function useCockpit() {
  const [kpis, setKpis] = useState([]);
  const [barras, setBarras] = useState([]);
  const [liquidacion, setLiquidacion] = useState([]);
  const [transacciones, setTransacciones] = useState([]);
  const [periodoActivo, setPeriodoActivo] = useState("Semana");

  const [loading, setLoading] = useState(false);
  const [loadingBusqueda, setLoadingBusqueda] = useState(false);
  const [errorCarga, setErrorCarga] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [busquedaDebounce, setBusquedaDebounce] = useState("");
  const [modalDetalle, setModalDetalle] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBusquedaDebounce(busqueda);
    }, 400);

    return () => clearTimeout(timer);
  }, [busqueda]);

  const cargarKPIs = useCallback(async () => {
    const data = await getKPIs();
    setKpis(Array.isArray(data) ? data : []);
  }, []);

  const cargarBarras = useCallback(async (periodo) => {
    const data = await getGrowthData(periodo);
    setBarras(Array.isArray(data) ? data : []);
  }, []);

  const cargarLiquidacion = useCallback(async () => {
    const data = await getLiquidacion();
    setLiquidacion(Array.isArray(data) ? data : []);
  }, []);

  const cargarTransacciones = useCallback(async (textoBusqueda = "") => {
    const filtros = textoBusqueda?.trim()
      ? { busqueda: textoBusqueda.trim() }
      : {};

    const data = await getTransacciones(filtros);
    setTransacciones(Array.isArray(data) ? data : []);
  }, []);

  const cargarInicial = useCallback(async () => {
    setLoading(true);
    setErrorCarga("");

    try {
      await Promise.all([
        cargarKPIs(),
        cargarLiquidacion(),
        cargarBarras(periodoActivo),
      ]);
    } catch (error) {
      const mensaje = getErrorMessage(error);
      console.error("Error general cargando cockpit:", error);
      setErrorCarga(mensaje);
      notify.error(mensaje);
    } finally {
      setLoading(false);
    }
  }, [cargarKPIs, cargarLiquidacion, cargarBarras, periodoActivo]);

  useEffect(() => {
    cargarInicial();
  }, [cargarInicial]);

  useEffect(() => {
    const cargar = async () => {
      setLoadingBusqueda(true);

      try {
        await cargarTransacciones(busquedaDebounce);
      } catch (error) {
        console.error("Error en búsqueda de transacciones:", error);
        notify.error(getErrorMessage(error));
      } finally {
        setLoadingBusqueda(false);
      }
    };

    cargar();
  }, [busquedaDebounce, cargarTransacciones]);

  const cambiarPeriodo = useCallback(
    async (nuevoPeriodo) => {
      if (nuevoPeriodo === periodoActivo) return;

      setPeriodoActivo(nuevoPeriodo);
      setLoading(true);

      try {
        await cargarBarras(nuevoPeriodo);
      } catch (error) {
        notify.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    },
    [periodoActivo, cargarBarras]
  );

  const handleExportar = useCallback(async () => {
    setLoading(true);

    try {
      await exportarReporte({
        kpis,
        barras,
        liquidacion,
        transacciones,
        periodoActivo,
        usuario: JSON.parse(localStorage.getItem("usuario") || "{}"),
      });
    } catch (error) {
      console.error("No se pudo exportar el reporte:", error);
      notify.error("No se pudo exportar el reporte");
    } finally {
      setLoading(false);
    }
  }, [kpis, barras, liquidacion, transacciones, periodoActivo]);

  const cerrarModalDetalle = useCallback(() => {
    setModalDetalle(null);
  }, []);

  const eliminarTransaccion = useCallback(async (transaccion) => {
    const idVisual =
      typeof transaccion === "object" ? transaccion?.id : transaccion;

    const idReal = String(idVisual || "")
      .replace(/^#V-/, "")
      .replace(/^#LT-/, "");

    if (!idReal) {
      notify.error("No se encontró el id de la transacción");
      return;
    }

    await executeRequest({
      confirm: {
        title: "Eliminar transacción",
        text: "Esta acción no se puede deshacer.",
        confirmText: "Sí, eliminar",
        cancelText: "Cancelar",
        icon: "warning",
      },
      request: () => deleteTransaccionService(idReal),
      loadingMessage: "Eliminando transacción...",
      successMessage: "Transacción eliminada correctamente",
      errorMessage: "No se pudo eliminar la transacción",
      onSuccess: async () => {
        setTransacciones((prev) =>
          prev.filter(
            (t) =>
              String(t?.venta_id) !== String(idReal) &&
              String(t?.id) !== String(idVisual)
          )
        );

        cerrarModalDetalle();
      },
    });
  }, [cerrarModalDetalle]);

  const verDetalleTransaccion = useCallback((transaccion) => {
    setModalDetalle({ ...transaccion });
  }, []);

  return {
    kpis,
    barras,
    liquidacion,
    transacciones,
    periodoActivo,
    loading,
    loadingBusqueda,
    errorCarga,
    busqueda,
    setBusqueda,
    cambiarPeriodo,
    handleExportar,
    eliminarTransaccion,
    modalDetalle,
    setModalDetalle,
    cerrarModalDetalle,
    verDetalleTransaccion,
    recargarCockpit: cargarInicial,
  };
}

export default useCockpit;