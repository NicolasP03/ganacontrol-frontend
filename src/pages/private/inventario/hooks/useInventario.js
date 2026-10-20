import { useState, useMemo, useCallback, useEffect } from "react";
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
  exportarInventario,
  analizarInventarioIA,
} from "../../../../services/inventario.service";

import { notify } from "../../../../services/notify.service";
import {
  executeRequest,
  getErrorMessage,
} from "../../../../utils/handleRequest";

export function useInventario() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [loading, setLoading] = useState(false);
  const [errorCarga, setErrorCarga] = useState("");

  const [modalDetalle, setModalDetalle] = useState(null);
  const [modalForm, setModalForm] = useState(null);

  const [analisisIA, setAnalisisIA] = useState(null);
  const [modalAnalisisIA, setModalAnalisisIA] = useState(false);
  const [loadingIA, setLoadingIA] = useState(false);

  const cargarProductos = useCallback(async () => {
    try {
      setLoading(true);
      setErrorCarga("");

      const data = await getProductos();
      setProductos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando productos:", error);
      setProductos([]);
      const mensaje = getErrorMessage(error);
      setErrorCarga(mensaje);
      notify.error(mensaje);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  const productosFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim();

    return productos.filter((p) => {
      const matchQ =
        !q ||
        String(p?.nombre ?? "").toLowerCase().includes(q) ||
        String(p?.id ?? "").toLowerCase().includes(q) ||
        String(p?.proveedor ?? "").toLowerCase().includes(q);

      const matchT = filtroTipo === "todos" || p?.tipoKey === filtroTipo;
      const matchE = filtroEstado === "todos" || p?.estadoKey === filtroEstado;

      return matchQ && matchT && matchE;
    });
  }, [productos, busqueda, filtroTipo, filtroEstado]);

  const handleEliminarProducto = useCallback(async (producto) => {
    const id = typeof producto === "object" ? producto?.id : producto;

    if (!id) {
      notify.error("No se encontró el id del producto");
      return;
    }

    await executeRequest({
      confirm: {
        title: "Eliminar producto",
        text: "Esta acción no se puede deshacer.",
        confirmText: "Sí, eliminar",
        cancelText: "Cancelar",
        icon: "warning",
      },
      request: () => deleteProducto(id),
      loadingMessage: "Eliminando producto...",
      successMessage: "Producto eliminado correctamente",
      errorMessage: "No se pudo eliminar el producto",
      onSuccess: async () => {
        setProductos((prev) => prev.filter((p) => p.id !== id));
        setModalDetalle((prev) => (prev?.id === id ? null : prev));
        setModalForm((prev) => (prev?.id === id ? null : prev));
      },
    });
  }, []);

  const handleGuardarProducto = useCallback(async (prod) => {
    const isEdit = Boolean(prod?.id);

    const result = await executeRequest({
      request: () =>
        isEdit ? updateProducto(prod.id, prod) : createProducto(prod),
      loadingMessage: isEdit
        ? "Actualizando producto..."
        : "Creando producto...",
      successMessage: isEdit
        ? "Producto actualizado correctamente"
        : "Producto creado correctamente",
      errorMessage: isEdit
        ? "No se pudo actualizar el producto"
        : "No se pudo crear el producto",
      onSuccess: async (data) => {
        if (!data) {
          throw new Error(
            isEdit
              ? "No se recibió el producto actualizado."
              : "No se recibió el producto creado."
          );
        }

        if (isEdit) {
          setProductos((prev) =>
            prev.map((item) => (item.id === prod.id ? data : item))
          );

          setModalDetalle((prev) => (prev?.id === prod.id ? data : prev));
        } else {
          setProductos((prev) => [data, ...prev]);
        }

        setModalForm(null);
      },
    });

    if (!result?.ok) {
      throw result?.error;
    }
  }, []);

  const handleExportar = useCallback(async (formato = "excel") => {
    try {
      setLoading(true);
      await exportarInventario(formato);
      notify.success("Exportación realizada correctamente");
    } catch (error) {
      console.error("Error exportando inventario:", error);
      notify.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAnalisisIA = useCallback(async () => {
    try {
      setLoadingIA(true);
      const data = await analizarInventarioIA();
      setAnalisisIA(data);
      setModalAnalisisIA(true);
    } catch (error) {
      console.error("Error analizando inventario con IA:", error);
      alert(error?.mensaje || "No se pudo generar el análisis IA");
    } finally {
      setLoadingIA(false);
    }
  }, []);

  const kpis = useMemo(() => {
    const total = productos.length;
    const criticos = productos.filter((p) => p.estadoKey === "critico").length;
    const bajos = productos.filter((p) => p.estadoKey === "stock_bajo").length;
    const activos = productos.filter(
      (p) => Number(p.cantidad_actual || 0) > 0
    ).length;
    const inactivos = productos.filter(
      (p) => Number(p.cantidad_actual || 0) <= 0
    ).length;

    return [
      {
        label: "Total productos",
        value: String(total),
        ico: "📦",
        sub: "Registrados",
        trend: "up",
        delta: `${activos} activos`,
      },
      {
        label: "Alertas críticas",
        value: String(criticos),
        ico: "⚠️",
        sub: "Stock crítico",
        trend: criticos > 0 ? "down" : "flat",
        delta: criticos > 0 ? "Revisar" : "OK",
      },
      {
        label: "Stock bajo",
        value: String(bajos),
        ico: "📉",
        sub: "Reabastecer",
        trend: bajos > 0 ? "down" : "flat",
        delta: bajos > 0 ? "Atención" : "Estable",
      },
      {
        label: "Activos",
        value: String(activos),
        ico: "✅",
        sub: `${inactivos} inactivos`,
        trend: activos > 0 ? "up" : "flat",
        delta: `${total} total`,
      },
    ];
  }, [productos]);

  const obtenerNivel = (stock) => {
  const pct = Number(stock || 0);

  if (pct < 20) return "critico";
  if (pct < 50) return "bajo";
  return "normal";
};

const suministros = useMemo(() => {
  return productos.slice(0, 5).map((p) => {
    const pct = Math.max(0, Math.min(Number(p.stock || 0), 100));

    return {
      nombre: p.nombre,
      pct,
      nivel: obtenerNivel(pct),
    };
  });
}, [productos]);

const silos = useMemo(() => {
  const alimentos = productos
    .filter((p) => p.tipo === "Alimento")
    .slice(0, 3);

  return alimentos.map((p) => {
    const pct = Math.max(0, Math.min(Number(p.stock || 0), 100));

    return {
      label: p.nombre || "Sin nombre",
      pct,
      nivel: obtenerNivel(pct),
    };
  });
}, [productos]);

  const estadisticasHero = useMemo(() => {
    const totalProductos = productos.length;

    const alertasCriticas = productos.filter(
      (p) => p.estadoKey === "critico" || p.estadoKey === "agotado"
    ).length;

    const valorTotal = productos.reduce((acc, p) => {
      const cantidad = Number(p.cantidad_actual || 0);
      const precio = Number(p.precio_unitario || 0);
      return acc + cantidad * precio;
    }, 0);

    return {
      totalProductos,
      alertasCriticas,
      valorTotal,
    };
  }, [productos]);

  return {
    productos: productosFiltrados,
    productosOriginales: productos,
    productosTotal: productosFiltrados.length,
    suministros,
    silos,
    kpis,
    estadisticasHero,
    busqueda,
    setBusqueda,
    filtroTipo,
    setFiltroTipo,
    filtroEstado,
    setFiltroEstado,
    loading,
    errorCarga,
    modalDetalle,
    setModalDetalle,
    modalForm,
    setModalForm,
    handleEliminarProducto,
    handleGuardarProducto,
    handleExportar,
    analisisIA,
    modalAnalisisIA,
    setModalAnalisisIA,
    loadingIA,
    handleAnalisisIA,
    recargarProductos: cargarProductos,
  };
}

export default useInventario;