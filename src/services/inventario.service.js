// src/services/inventario.service.js

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

const getToken = () => localStorage.getItem("token");

const request = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data = null;
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    data = await res.json();
  }

  if (!res.ok) {
    throw {
      status: res.status,
      mensaje:
        data?.mensaje?.mensaje ||
        data?.mensaje ||
        data?.message ||
        "Error en la solicitud",
      errores: data?.mensaje?.errores || data?.errores || [],
      data: data?.data || null,
    };
  }

  return data;
};

const calcularEstadoInventario = (cantidadActual) => {
  const actual = Number(cantidadActual || 0);

  if (actual <= 0) return { estadoKey: "agotado", estado: "Agotado" };
  if (actual < 20) return { estadoKey: "critico", estado: "Crítico" };
  if (actual < 50) return { estadoKey: "stock_bajo", estado: "Stock Bajo" };

  return { estadoKey: "en_stock", estado: "En Stock" };
};

const iconoPorTipo = (tipo) => {
  switch (tipo) {
    case "Alimento": return "🌾";
    case "Medicamento": return "💊";
    case "Insumo": return "🔩";
    case "Herramienta": return "🛠️";
    case "Equipo": return "⚙️";
    default: return "📦";
  }
};

const adaptarProductoDesdeBackend = (item) => {
  const cantidadActual = Number(item?.cantidad_actual || 0);
  const cantidadMin = Number(item?.cantidad_min || 0);
  const estadoCalc = calcularEstadoInventario(cantidadActual);

  const stock = Math.max(0, Math.min(Math.round(cantidadActual), 100));

  return {
    id: item?.id,
    ico: iconoPorTipo(item?.tipo),
    nombre: item?.nombre || "",
    tipo: item?.tipo || "Otro",
    tipoKey: String(item?.tipo || "otro").toLowerCase(),
    fecha: item?.fecha_registro || "Sin fecha",
    fechaISO: item?.fecha_registro || "",
    stock,
    stockReal: cantidadActual,
    stockMinimo: cantidadMin,
    stockMax: 100,
    unidad: item?.unidad || "und",
    ubicacion: item?.ubicacion || "Finca principal",
    estado: estadoCalc.estado,
    estadoKey: estadoCalc.estadoKey,
    proveedor: item?.proveedor || "Sin proveedor",
    precio:
      item?.precio_unitario !== null &&
      item?.precio_unitario !== undefined &&
      item?.precio_unitario !== ""
        ? `$${item.precio_unitario}`
        : "No definido",
    precio_unitario:
      item?.precio_unitario !== null &&
      item?.precio_unitario !== undefined &&
      item?.precio_unitario !== ""
        ? Number(item.precio_unitario)
        : "",
    notas: item?.notas || "",
    categoria: item?.categoria || "",
    activo: item?.activo ?? true,
    cantidad_actual: cantidadActual,
    cantidad_min: cantidadMin,
  };
};

const adaptarPayloadProducto = (data) => ({
  nombre: data?.nombre?.trim() || "",
  tipo: data?.tipo || "Alimento",
  categoria: data?.categoria?.trim() || null,
  unidad: data?.unidad?.trim() || "kg",
  cantidad_actual: Number(data?.cantidad_actual ?? data?.stockReal ?? 0),
  cantidad_min: Number(data?.cantidad_min ?? data?.stockMinimo ?? 0),
  proveedor: data?.proveedor?.trim() || null,
  ubicacion: data?.ubicacion?.trim() || "Finca principal",
  precio_unitario:
    data?.precio_unitario !== "" &&
    data?.precio_unitario !== null &&
    data?.precio_unitario !== undefined
      ? Number(data.precio_unitario)
      : null,
  notas: data?.notas?.trim() || null,
  fecha_registro: data?.fecha_registro || null,
  activo: data?.activo ?? true,
});

export const inventarioService = {
  async getProductos() {
    const res = await request("/productos", { method: "GET" });
    const lista = res?.mensaje?.data ?? res?.data ?? res ?? [];
    return Array.isArray(lista) ? lista.map(adaptarProductoDesdeBackend) : [];
  },

  // 🔥 NUEVO MÉTODO PARA SALUD
  async getProductosSalud() {
    const res = await request("/productos/salud", { method: "GET" });
    const lista = res?.mensaje?.data ?? res?.data ?? [];
    return Array.isArray(lista) ? lista.map(adaptarProductoDesdeBackend) : [];
  },

  async getProductoById(id) {
    const res = await request(`/productos/${id}`, { method: "GET" });
    const item = res?.mensaje?.data ?? res?.data ?? res ?? null;
    return item ? adaptarProductoDesdeBackend(item) : null;
  },

  async createProducto(data) {
    const payload = adaptarPayloadProducto(data);

    const res = await request("/productos", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const item = res?.mensaje?.data ?? res?.data ?? res ?? null;
    return item ? adaptarProductoDesdeBackend(item) : null;
  },

  async updateProducto(id, data) {
    const payload = adaptarPayloadProducto(data);

    const res = await request(`/productos/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    const item = res?.mensaje?.data ?? res?.data ?? res ?? null;
    return item ? adaptarProductoDesdeBackend(item) : null;
  },

  async deleteProducto(id) {
    return await request(`/productos/${id}`, { method: "DELETE" });
  },

  async crearMovimientoProducto(data) {
    return await request("/productos/movimientos", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // formato: "excel" | "pdf"
  async exportarInventario(formato = "excel") {
    const productos = await this.getProductos();
    if (formato === "pdf") {
      const { exportarInventarioPDF } = await import("../utils/exportarInventario");
      let usuario = null;
      try { usuario = JSON.parse(localStorage.getItem("usuario") || "null"); } catch { /* sin sesión */ }
      exportarInventarioPDF(productos, usuario);
    } else {
      const { exportarInventarioExcel } = await import("../utils/exportarInventario");
      exportarInventarioExcel(productos);
    }
    return productos;
  },
};

// exports rápidos
export const getProductos = () => inventarioService.getProductos();
export const getProductosSalud = () => inventarioService.getProductosSalud();
export const getProductoById = (id) => inventarioService.getProductoById(id);
export const createProducto = (data) => inventarioService.createProducto(data);
export const updateProducto = (id, data) => inventarioService.updateProducto(id, data);
export const deleteProducto = (id) => inventarioService.deleteProducto(id);
export const crearMovimientoProducto = (data) => inventarioService.crearMovimientoProducto(data);
export const exportarInventario = (formato) => inventarioService.exportarInventario(formato);

// metadata
export const ESTADO_META_INV = {
  en_stock: { color: "#22c55e", label: "En Stock" },
  stock_bajo: { color: "#f59e0b", label: "Stock Bajo" },
  critico: { color: "#ef4444", label: "Crítico" },
  agotado: { color: "#6b7280", label: "Agotado" },
};

export const TIPO_META = {
  alimento: { color: "#16a34a", ico: "🌾" },
  medicamento: { color: "#3b82f6", ico: "💊" },
  insumo: { color: "#8b5cf6", ico: "🔩" },
  herramienta: { color: "#f59e0b", ico: "🛠️" },
  equipo: { color: "#64748b", ico: "⚙️" },
  otro: { color: "#6b7280", ico: "📦" },
};

// IA
export const analizarInventarioIA = async () => {
  const res = await request("/inventario/analisis-ia", {
    method: "POST",
    body: JSON.stringify({}),
  });

  return res?.mensaje?.data || res?.data || null;
};