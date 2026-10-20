// src/services/ventas.service.js
import api from "./api";
import { exportarVentasPDF } from "../utils/exportarVentasPDF";

export const ESTADO_META = {
  completado: { label: "Completado", color: "#15803d" },
  pendiente: { label: "Pendiente", color: "#b45309" },
  verificando: { label: "Verificando", color: "#1d4ed8" },
  en_ruta: { label: "En Ruta", color: "#7c3aed" },
  cancelado: { label: "Cancelado", color: "#b91c1c" },
};

const extraerLista = (res) => res?.mensaje?.data ?? res?.data ?? [];
const extraerData = (res) => res?.mensaje?.data ?? res?.data ?? null;

const formatearMoneda = (valor) =>
  `$${Number(valor || 0).toLocaleString("es-CO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const formatearFecha = (fecha) => {
  if (!fecha) return "";
  try {
    const soloFecha = /^d{4}-d{2}-d{2}$/.test(fecha) ? `${fecha}T00:00:00` : fecha;
    return new Date(soloFecha).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return fecha;
  }
};

const adaptarVentaLista = (item) => ({
  id: item.numero_factura || `FV-${String(item.id).padStart(5, "0")}`,
  venta_id: item.id,
  cliente: item.cliente || "Sin cliente",
  clienteKey: (item.cliente || "CL").slice(0, 2).toUpperCase(),
  categoria: item.categoria || "General",
  fecha: formatearFecha(item.fecha),
  fechaISO: item.fecha,
  items: item.items || "Venta registrada",
  itemsTexto: item.items || "Venta registrada",
  estado: item.estado || "Pendiente",
  estadoKey: (item.estado || "Pendiente").toLowerCase(),
  total: formatearMoneda(item.total),
  totalNumber: Number(item.total || 0),
  notas: item.notas || "",
});

export async function obtenerResumenHeroVentas() {
  const res = await api("/ventas/resumen-hero");
  return extraerData(res);
}

export async function listarVentas() {
  const res = await api("/ventas");
  const data = extraerLista(res);

  return data.map(adaptarVentaLista);
}

export async function obtenerVenta(id) {
  const res = await api(`/ventas/${id}`);
  const item = extraerData(res);

  if (!item) return null;

  const itemsGanado = (item.detalle_ganado || []).map((g) => ({
    tempId: crypto.randomUUID(),
    tipo: "ganado",
    codigo: g.ganado?.codigo || "",
    nombre: g.ganado?.nombre || "",
    precio: Number(g.precio || 0),
  }));

  const itemsProductos = (item.detalle_productos || []).map((p) => {
    if (p.producto_id) {
      return {
        tempId: crypto.randomUUID(),
        tipo: "producto",
        ref_id: p.producto_id,
        nombre: p.producto?.nombre || "",
        unidad: p.producto?.unidad || "",
        cantidad: Number(p.cantidad || 0),
        precio_unitario: Number(p.precio_unitario || 0),
      };
    }

    return {
      tempId: crypto.randomUUID(),
      tipo: "produccion",
      ref_id: p.produccion_id,
      nombre: p.produccion ? `${p.produccion.tipo} #${p.produccion_id}` : "",
      unidad: p.produccion?.unidad || "",
      cantidad: Number(p.cantidad || 0),
      precio_unitario: Number(p.precio_unitario || 0),
    };
  });

  const items = [...itemsGanado, ...itemsProductos];
  const total = Number(item.total || 0);

  return {
    venta_id: item.id,
    id: item.numero_factura || `FV-${String(item.id).padStart(5, "0")}`,
    cliente: item.cliente || "",
    fechaISO: item.fecha || "",
    fecha: formatearFecha(item.fecha),
    notas: item.notas || "",
    categoria: item.categoria || "General",
    estado: item.estado || "Pendiente",
    items,
    total,
  };
}

export async function crearVenta(payload) {
  const res = await api("/ventas", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return extraerData(res);
}

export async function actualizarVenta(id, payload) {
  const res = await api(`/ventas/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  return extraerData(res);
}

export async function eliminarVenta(id) {
  const res = await api(`/ventas/${id}`, {
    method: "DELETE",
  });

  return extraerData(res);
}

export async function obtenerKpisVentas() {
  try {
    const res = await api("/ventas/kpis");
    return extraerLista(res);
  } catch {
    const ventas = await listarVentas();

    const totalHistorico = ventas.reduce((acc, v) => acc + Number(v.totalNumber || 0), 0);
    const cantidadVentas = ventas.length;
    const ticketPromedio = cantidadVentas > 0 ? totalHistorico / cantidadVentas : 0;

    return [
      {
        label: "Ventas Totales",
        value: formatearMoneda(totalHistorico),
        delta: `${cantidadVentas} registro(s)`,
        trend: "up",
        ico: "💰",
        sub: "Acumulado histórico",
      },
      {
        label: "Cantidad de Ventas",
        value: `${cantidadVentas}`,
        delta: "Registros cargados",
        trend: "flat",
        ico: "🧾",
        sub: "Ventas registradas",
      },
      {
        label: "Ticket Promedio",
        value: formatearMoneda(ticketPromedio),
        delta: "Promedio por venta",
        trend: "flat",
        ico: "📊",
        sub: "Total / cantidad",
      },
    ];
  }
}

// Animales disponibles para vender (el backend referencia el animal por código)
export async function listarAnimalesDisponibles() {
  const res = await api("/ganado");
  const lista = extraerLista(res);
  return (Array.isArray(lista) ? lista : [])
    .filter((a) => a.estado_comercial === "Disponible" && a.estado_biologico !== "Muerto" && a.estado_general === "Activo")
    .map((a) => ({ id: a.id, codigo: a.codigo, nombre: a.nombre || "", categoria: a.categoria || "", peso: a.peso_actual }));
}

export async function listarProductosVendibles() {
  const res = await api("/productos");
  const lista = extraerLista(res);
  return (Array.isArray(lista) ? lista : [])
    .filter((p) => p.activo !== false && Number(p.cantidad_actual || 0) > 0)
    .map((p) => ({
      id: p.id, nombre: p.nombre, unidad: p.unidad || "und",
      stock: Number(p.cantidad_actual || 0), precio: p.precio_unitario != null ? Number(p.precio_unitario) : "",
    }));
}

export async function listarProduccionDisponible() {
  const res = await api("/ventas/produccion-disponible");
  const lista = extraerLista(res);
  return (Array.isArray(lista) ? lista : []).map((p) => ({
    id: p.id, tipo: p.tipo, cantidad: Number(p.cantidad || 0), unidad: p.unidad,
    fecha: p.fecha, animal: p.ganado?.codigo || "",
  }));
}

export async function exportarVentas(usuario = {}) {
  const ventas = await listarVentas();
  await exportarVentasPDF(ventas, usuario);

}