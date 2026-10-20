import { useState, useCallback, useMemo, useEffect } from "react";
import { getUsuarioActual } from "../../../../services/AuthService";
import {
  listarVentas,
  obtenerVenta,
  crearVenta,
  actualizarVenta,
  eliminarVenta,
  obtenerKpisVentas,
  exportarVentas,
  obtenerResumenHeroVentas,
} from "../../../../services/ventas.service";

import { notify } from "../../../../services/notify.service";
import {
  executeRequest,
  getErrorMessage,
} from "../../../../utils/handleRequest";

export function useVentas() {
  const [ventas, setVentas] = useState([]);
  const [kpis, setKpis] = useState([]);
  const [resumenHero, setResumenHero] = useState({
    ventasEsteAnio: 0,
    clientesActivos: 0,
    ingresosMes: 0,
  });

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [loading, setLoading] = useState(false);

  const [modalDetalle, setModalDetalle] = useState(null);
  const [modalForm, setModalForm] = useState(null);
  const [ventaAEliminar, setVentaAEliminar] = useState(null);

  const [paginaActual, setPaginaActual] = useState(1);
  const POR_PAGINA = 8;

  const cargarTodo = useCallback(async () => {
    try {
      setLoading(true);

      const [ventasData, kpisData, resumenData] = await Promise.all([
        listarVentas(),
        obtenerKpisVentas(),
        obtenerResumenHeroVentas(),
      ]);

      setVentas(Array.isArray(ventasData) ? ventasData : []);
      setKpis(Array.isArray(kpisData) ? kpisData : []);
      setResumenHero(
        resumenData || {
          ventasEsteAnio: 0,
          clientesActivos: 0,
          ingresosMes: 0,
        }
      );
    } catch (error) {
      console.error("Error cargando ventas:", error);
      setVentas([]);
      setKpis([]);
      setResumenHero({
        ventasEsteAnio: 0,
        clientesActivos: 0,
        ingresosMes: 0,
      });
      notify.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarTodo();
  }, [cargarTodo]);

  const ventasFiltradas = useMemo(() => {
    const q = busqueda.toLowerCase().trim();

    return ventas.filter((v) => {
      const idTexto = `${v?.id ?? ""} ${v?.venta_id ?? ""}`.toLowerCase();
      const clienteTexto = String(v?.cliente ?? "").toLowerCase();
      const itemsTexto = String(v?.itemsTexto ?? "").toLowerCase();
      const estadoTexto = String(v?.estado ?? "").toLowerCase();

      const matchQ =
        !q ||
        idTexto.includes(q) ||
        clienteTexto.includes(q) ||
        itemsTexto.includes(q) ||
        estadoTexto.includes(q);

      const matchE =
        filtroEstado === "todos" || v?.estadoKey === filtroEstado;

      return matchQ && matchE;
    });
  }, [ventas, busqueda, filtroEstado]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(ventasFiltradas.length / POR_PAGINA)
  );

  const ventasPaginadas = useMemo(() => {
    const inicio = (paginaActual - 1) * POR_PAGINA;
    const fin = inicio + POR_PAGINA;
    return ventasFiltradas.slice(inicio, fin);
  }, [ventasFiltradas, paginaActual]);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroEstado]);

  useEffect(() => {
    if (paginaActual > totalPaginas) {
      setPaginaActual(totalPaginas);
    }
  }, [paginaActual, totalPaginas]);

  const handleVer = useCallback(async (venta) => {
    try {
      const ventaId = venta?.venta_id || venta?.id;

      if (!ventaId) {
        notify.error("No se encontró el id de la venta");
        return;
      }

      setLoading(true);
      const detalle = await obtenerVenta(ventaId);
      setModalDetalle(detalle);
    } catch (error) {
      console.error("Error cargando detalle:", error);
      notify.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  const handleEditar = useCallback(async (venta) => {
    try {
      const ventaId = venta?.venta_id || venta?.id;

      if (!ventaId) {
        notify.error("No se encontró el id de la venta");
        return;
      }

      setLoading(true);
      const detalle = await obtenerVenta(ventaId);
      setModalForm(detalle);
    } catch (error) {
      console.error("Error cargando venta para editar:", error);
      notify.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  const solicitarEliminar = useCallback((venta) => {
    setVentaAEliminar(venta);
  }, []);

  const cancelarEliminar = useCallback(() => {
    setVentaAEliminar(null);
  }, []);

  const confirmarEliminar = useCallback(async () => {
    const ventaId = ventaAEliminar?.venta_id || ventaAEliminar?.id;

    if (!ventaId) {
      notify.error("No se encontró el id de la venta");
      return;
    }

    const result = await executeRequest({
      confirm: {
        title: "Eliminar venta",
        text: "Esta acción no se puede deshacer.",
        confirmText: "Sí, eliminar",
        cancelText: "Cancelar",
        icon: "warning",
      },
      request: () => eliminarVenta(ventaId),
      loadingMessage: "Eliminando venta...",
      successMessage: "Venta eliminada correctamente",
      errorMessage: "No se pudo eliminar la venta",
      onSuccess: async () => {
        setVentaAEliminar(null);
        await cargarTodo();
      },
    });

    if (result?.cancelled) {
      return;
    }
  }, [ventaAEliminar, cargarTodo]);

  const handleGuardar = useCallback(
    async ({ venta_id, payloadBackend }) => {
      const isEdit = Boolean(venta_id);

      await executeRequest({
        request: () =>
          isEdit
            ? actualizarVenta(venta_id, payloadBackend)
            : crearVenta(payloadBackend),
        loadingMessage: isEdit
          ? "Actualizando venta..."
          : "Creando venta...",
        successMessage: isEdit
          ? "Venta actualizada correctamente"
          : "Venta creada correctamente",
        errorMessage: isEdit
          ? "No se pudo actualizar la venta"
          : "No se pudo crear la venta",
        onSuccess: async () => {
          setModalForm(null);
          await cargarTodo();
        },
      });
    },
    [cargarTodo]
  );

  const handleExportar = useCallback(async () => {
  try {
    setLoading(true);

    const usuario = getUsuarioActual?.() || {};
    await exportarVentas(usuario);

    notify.success("Reporte de ventas exportado correctamente");
  } catch (error) {
    console.error("Error exportando ventas:", error);
    notify.error(getErrorMessage(error) || "No se pudo exportar el reporte");
  } finally {
    setLoading(false);
  }
}, []);

  return {
    ventas: ventasPaginadas,
    ventasOriginales: ventas,
    ventasTotales: ventasFiltradas.length,
    kpis,
    resumenHero,
    busqueda,
    setBusqueda,
    filtroEstado,
    setFiltroEstado,
    loading,
    paginaActual,
    setPaginaActual,
    totalPaginas,
    modalDetalle,
    setModalDetalle,
    modalForm,
    setModalForm,
    ventaAEliminar,
    setVentaAEliminar,
    handleVer,
    handleEditar,
    solicitarEliminar,
    cancelarEliminar,
    confirmarEliminar,
    handleGuardar,
    handleExportar,
    recargarVentas: cargarTodo,
  };
}

export default useVentas;