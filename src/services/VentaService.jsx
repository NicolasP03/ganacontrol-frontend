// src/services/VentaService.jsx
import api from "./api";

export const getVentas    = ()       => api("/ventas");
export const getVenta     = (id)     => api(`/ventas/${id}`);
export const crearVenta   = (datos)  => api("/ventas", { method: "POST", body: JSON.stringify(datos) });

// ── DASHBOARD ─────────────────────────────────────
export const getResumen   = ()       => api("/dashboard/resumen");
