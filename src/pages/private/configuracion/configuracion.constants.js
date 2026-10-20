// ─── configuracion.constants.js ──────────────────────────────────────────────

export const TABS = [
  { id: "Finca",    icon: "🏡", label: "Finca"    },
  { id: "Usuarios", icon: "👥", label: "Usuarios" },
  { id: "Roles",    icon: "🔐", label: "Roles"    },
  { id: "Sistema",  icon: "🖥️", label: "Sistema"  },
];

export const ROLES_DISPONIBLES = [
  { id: 1, nombre: "Administrador" },
  { id: 2, nombre: "Veterinario" },
  { id: 3, nombre: "Operario" },
  { id: 4, nombre: "Contador" },
];

export const USUARIO_VACIO = {
  nombres: "",
  apellidos: "",
  nombre: "",
  correo: "",
  rol_id: 3,
  finca_id: 1,
  activo: true,
  contrasena: "",
  confirmarContrasena: "",
};

export const FINCA_FIELDS = [
  { label: "Nombre de la finca", key: "nombre"      },
  { label: "Municipio",          key: "municipio"    },
  { label: "Departamento",       key: "departamento" },
  { label: "Propietario",        key: "propietario"  },
  { label: "Prefijo Factura",    key: "prefijo"      },
];

export const SISTEMA_ICONOS = {
  "Versión":       "🏷️",
  "Base de Datos": "🗄️",
  "Entorno":       "🌐",
  "JWT":           "🔑",
};

export const SISTEMA_ACCIONES = [
  { icon: "📦", label: "Exportar datos",       desc: "Descarga una copia de seguridad en JSON" },
  { icon: "🔄", label: "Limpiar caché",        desc: "Reinicia la caché del servidor"          },
  { icon: "📋", label: "Ver logs del sistema", desc: "Revisa eventos recientes del sistema"    },
];