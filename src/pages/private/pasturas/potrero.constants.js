export const POTRERO_ESTADOS = [
  "Disponible",
  "Ocupado",
  "Mantenimiento",
  "Descanso",
];

export const ESTADO_CONFIG = {
  Disponible: {
    label: "Disponible",
    color: "#16a34a",
    bg: "#dcfce7",
    icono: "✅",
  },
  Ocupado: {
    label: "Ocupado",
    color: "#2563eb",
    bg: "#dbeafe",
    icono: "🐄",
  },
  Mantenimiento: {
    label: "Mantenimiento",
    color: "#d97706",
    bg: "#fef3c7",
    icono: "🔧",
  },
  Descanso: {
    label: "Descanso",
    color: "#64748b",
    bg: "#e2e8f0",
    icono: "🌿",
  },
};

export const FORM_INICIAL_POTRERO = {
  nombre: "",
  hectareas: "",
  tipo_pasto: "",
  capacidad_animales: "",
  estado: "Disponible",
};

export const ORDENES_TABLA = {
  nombre: "nombre",
  hectareas: "hectareas",
  tipo_pasto: "tipo_pasto",
  capacidad_animales: "capacidad_animales",
  estado: "estado",
};