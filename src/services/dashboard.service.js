import api from "./api";

/* ── Íconos ───────────────────────────────────────── */
import icoCow from "../assets/icons/cow.png";
import icoDashboard from "../assets/icons/dashboard.png";
import icoReproduccion from "../assets/icons/reproduccion.png";
import icoSalud from "../assets/icons/salud.png";
import icoInventario from "../assets/icons/inventario.png";
import icoPotreros from "../assets/icons/potreros.png";
import icoFinanzas from "../assets/icons/finanzas.png";
import icoAlimentacion from "../assets/icons/alimentacion.png";
import icoVerificacion from "../assets/icons/verificacion.png";
import icoAlerta from "../assets/icons/alerta.png";

export {
  icoCow,
  icoDashboard,
  icoReproduccion,
  icoSalud,
  icoInventario,
  icoPotreros,
  icoFinanzas,
  icoAlimentacion,
  icoVerificacion,
  icoAlerta,
};

/* ── Módulos ─────────────────────────────────────── */
export const MODULOS_DATA = [
  {
    img: icoCow,
    label: "Control Ganadero",
    desc: "Registro y trazabilidad",
    href: "/ganado",
    permiso: "ganado.ver",
  },
  {
    img: icoReproduccion,
    label: "Reproducción",
    desc: "Gestaciones y partos",
    href: "/reproduccion",
    permiso: "reproduccion.ver",
  },
  {
    img: icoSalud,
    label: "Salud y Sanidad",
    desc: "Vacunaciones y tratamientos",
    href: "/eventos",
    permiso: "salud.ver",
  },
  {
    img: icoInventario,
    label: "Inventario",
    desc: "Productos y stock",
    href: "/inventario",
    permiso: "productos.ver",
  },
  {
    img: icoAlimentacion,
    label: "Alimentación",
    desc: "Raciones diarias",
    href: "/alimentacion",
    permiso: "alimentacion.ver",
  },
  {
    img: icoPotreros,
    label: "Potreros",
    desc: "Pasturas y rotación",
    href: "/pasturas",
    permiso: "potreros.ver",
  },
  {
    img: icoFinanzas,
    label: "Ventas",
    desc: "Gestión comercial",
    href: "/ventas",
    permiso: "ventas.ver",
  },
  {
    img: icoFinanzas,
    label: "Cockpit Financiero",
    desc: "Indicadores financieros",
    href: "/finanzas",
    permiso: "cockpit.ver",
  },
];

/* ── Utilidades ─────────────────────────────────── */
export const getSaludo = () => {
  const h = new Date().getHours();
  return h < 12 ? "Buenos días" : h < 18 ? "Buenas tardes" : "Buenas noches";
};

export const normalizarPermisos = (usuario) => {
  const permisos = usuario?.permisos || [];

  if (!Array.isArray(permisos)) return [];

  return permisos
    .map((p) => {
      if (typeof p === "string") return p;
      return p?.codigo || p?.permiso || p?.nombre || "";
    })
    .filter(Boolean);
};

export const usuarioTienePermiso = (usuario, permiso) => {
  if (!permiso) return true;

  const rol = String(usuario?.rol || "").toLowerCase();

  if (rol === "administrador") return true;

  const permisos = normalizarPermisos(usuario);

  return permisos.includes(permiso);
};

export const obtenerModulosPermitidos = (usuario) => {
  return MODULOS_DATA.filter((modulo) =>
    usuarioTienePermiso(usuario, modulo.permiso)
  );
};

export const getFechaFormateada = () =>
  new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

/* ── Helpers ────────────────────────────────────── */
const extraerData = (res) =>
  res?.mensaje?.data ?? res?.data ?? res ?? null;

/* ── API Dashboard ─────────────────────────────── */
export const obtenerResumenDashboard = async () => {
  const res = await api("/dashboard/resumen");
  return extraerData(res);
};

export const obtenerAlertasDashboard = async () => {
  const res = await api("/dashboard/alertas");
  return extraerData(res) ?? [];
};