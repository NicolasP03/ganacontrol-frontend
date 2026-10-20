// src/services/ProductoService.jsx
import api from "./api";

// ── PRODUCTOS ─────────────────────────────────────
export const getProductos      = ()       => api("/productos");
export const getUnProducto     = (id)     => api(`/productos/${id}`);
export const crearProducto     = (datos)  => api("/productos", { method: "POST",   body: JSON.stringify(datos) });
export const editarProducto    = (id, d)  => api(`/productos/${id}`, { method: "PUT",    body: JSON.stringify(d) });
export const eliminarProducto  = (id)     => api(`/productos/${id}`, { method: "DELETE" });

// ── MOVIMIENTOS DE PRODUCTO ───────────────────────
export const getMovimientos    = ()       => api("/productos/movimientos");
export const crearMovimiento   = (datos)  => api("/productos/movimientos", { method: "POST", body: JSON.stringify(datos) });

// ── STOCK BAJO (vista v_stock_bajo) ───────────────
export const getStockBajo      = ()       => api("/productos/stock-bajo");

// ── ALIMENTACIÓN ──────────────────────────────────
export const getAlimentacion   = ()       => api("/productos/alimentacion");
export const crearAlimentacion = (datos)  => api("/productos/alimentacion", { method: "POST", body: JSON.stringify(datos) });
export const eliminarAlimentacion = (id)  => api(`/productos/alimentacion/${id}`, { method: "DELETE" });