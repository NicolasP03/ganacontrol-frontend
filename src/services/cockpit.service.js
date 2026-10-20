// ─────────────────────────────────────────────
// cockpit.service.js – Finanzas / Ventas
// ─────────────────────────────────────────────

import { exportarCockpitPDF } from "../utils/exportarCockpitPDF";

const BASE_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:3000/api").replace(/\/+$/, "");

/* ── helpers base ─────────────────────────── */
const getToken = () => localStorage.getItem("token");

const buildHeaders = ({ extraHeaders = {}, isJson = true } = {}) => {
  const token = getToken();

  return {
    ...(isJson ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  };
};

const buildUrl = (path) => `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

const parseResponseBody = async (res) => {
  const contentType = res.headers.get("content-type") || "";

  if (res.status === 204) return null;

  try {
    if (contentType.includes("application/json")) {
      return await res.json();
    }
    return await res.text();
  } catch {
    return null;
  }
};

const buildError = async (res) => {
  const data = await parseResponseBody(res);

  return {
    status: res.status,
    ok: false,
    mensaje:
      data?.mensaje ||
      data?.message ||
      (typeof data === "string" && data) ||
      `Error HTTP ${res.status}`,
    errores: Array.isArray(data?.errores) ? data.errores : [],
    data: data?.data ?? null,
  };
};

const cerrarSesionSiVencio = (res) => {
  if (res.status !== 401) return;
  ["token", "refreshToken", "usuario"].forEach((k) => localStorage.removeItem(k));
  if (window.location.hash !== "#/login") window.location.href = "/#/login";
};

const jsonRequest = async (path, options = {}) => {
  const isFormData = options.body instanceof FormData;

  const res = await fetch(buildUrl(path), {
    ...options,
    headers: buildHeaders({
      extraHeaders: options.headers || {},
      isJson: !isFormData,
    }),
  });

  if (!res.ok) {
    cerrarSesionSiVencio(res);
    throw await buildError(res);
  }

  return parseResponseBody(res);
};

const get = (path) => jsonRequest(path, { method: "GET" });
const post = (path, body) => jsonRequest(path, { method: "POST", body: JSON.stringify(body) });
const put = (path, body) => jsonRequest(path, { method: "PUT", body: JSON.stringify(body) });
const del = (path) => jsonRequest(path, { method: "DELETE" });

const extraerLista = (res) => {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res)) return res;
  return [];
};

const extraerData = (res) => {
  if (res?.data !== undefined) return res.data;
  return res ?? null;
};

/* ── KPIs ─────────────────────────────────── */
export const getKPIs = async () => {
  const res = await get("/ventas/kpis");
  const data = res?.data;

  if (Array.isArray(data)) return data;

  if (data && typeof data === "object") {
    const totalVentas = Number(data.totalVentas || 0);
    const totalVentasMes = Number(data.totalVentasMes || 0);
    const cantidadVentas = Number(data.cantidadVentas || 0);
    const ticketPromedio = cantidadVentas > 0 ? totalVentas / cantidadVentas : 0;

    return [
      {
        label: "Ventas Totales",
        value: `$${totalVentas.toLocaleString("es-CO")}`,
        delta: "Histórico",
        trend: "flat",
        ico: "💰",
        pct: totalVentas > 0 ? 100 : 0,
      },
      {
        label: "Ventas del Mes",
        value: `$${totalVentasMes.toLocaleString("es-CO")}`,
        delta: `${cantidadVentas} venta(s)`,
        trend: cantidadVentas > 0 ? "up" : "flat",
        ico: "📈",
        pct: totalVentasMes > 0 ? 75 : 0,
      },
      {
        label: "Cantidad de Ventas",
        value: `${cantidadVentas}`,
        delta: "Registros",
        trend: "flat",
        ico: "🧾",
        pct: cantidadVentas > 0 ? 60 : 0,
      },
      {
        label: "Ticket Promedio",
        value: `$${ticketPromedio.toLocaleString("es-CO", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}`,
        delta: "Promedio por venta",
        trend: "flat",
        ico: "🏦",
        pct: ticketPromedio > 0 ? 70 : 0,
      },
    ];
  }

  return [];
};

/* ── Gráfico de barras ────────────────────── */
export const getGrowthData = async (periodo = "Semana") => {
  const res = await get(`/ventas/crecimiento?periodo=${encodeURIComponent(periodo)}`);
  return extraerLista(res);
};

/* ── Estado de liquidación ────────────────── */
export const getLiquidacion = async () => {
  const res = await get("/ventas/liquidacion");
  return extraerLista(res);
};

/* ── Transacciones ────────────────────────── */
export const getTransacciones = async (params = {}) => {
  const limpios = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );

  const qs = new URLSearchParams(limpios).toString();
  const res = await get(`/ventas/transacciones${qs ? `?${qs}` : ""}`);
  return extraerLista(res);
};

export const getTransaccionById = async (id) => {
  const res = await get(`/ventas/transacciones/${id}`);
  return extraerData(res);
};

export const createTransaccion = async (data) => {
  const res = await post("/ventas/transacciones", data);
  return extraerData(res);
};

export const updateTransaccion = async (id, data) => {
  const res = await put(`/ventas/transacciones/${id}`, data);
  return extraerData(res);
};

export const deleteTransaccion = async (id) => {
  const res = await del(`/ventas/transacciones/${id}`);
  return extraerData(res);
};

export const exportarReporte = async ({
  kpis = [],
  barras = [],
  liquidacion = [],
  transacciones = [],
  usuario = {},
  periodoActivo = "Mes",
} = {}) => {
  await exportarCockpitPDF({
    kpis,
    barras,
    liquidacion,
    transacciones,
    usuario,
    periodoActivo,
  });
};