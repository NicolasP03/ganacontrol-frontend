// ============================================================
// GanaControl — Catálogo de Permisos
// Traduce códigos técnicos a lenguaje humano
// ============================================================

export const PERMISSION_CATALOG = {
  ganado: {
    label: "Ganado",
    description: "Animales registrados en la finca",
    icon: "🐄",
    permissions: {
      ver: { code: "ganado.ver", label: "Consultar ganado", action: "ver" },
      crear: { code: "ganado.crear", label: "Registrar ganado", action: "crear" },
      editar: { code: "ganado.editar", label: "Modificar información del ganado", action: "editar" },
      eliminar: { code: "ganado.eliminar", label: "Anular / Desactivar registros de ganado", action: "eliminar" }
    }
  },
  ventas: {
    label: "Ventas",
    description: "Ventas de ganado o productos",
    icon: "💰",
    permissions: {
      ver: { code: "ventas.ver", label: "Consultar ventas", action: "ver" },
      crear: { code: "ventas.crear", label: "Registrar ventas", action: "crear" },
      editar: { code: "ventas.editar", label: "Modificar ventas", action: "editar" },
      eliminar: { code: "ventas.eliminar", label: "Anular / Desactivar ventas", action: "eliminar" }
    }
  },
  usuarios: {
    label: "Usuarios",
    description: "Personas con acceso al sistema",
    icon: "👥",
    permissions: {
      ver: { code: "usuarios.ver", label: "Consultar usuarios", action: "ver" },
      crear: { code: "usuarios.crear", label: "Registrar usuarios", action: "crear" },
      editar: { code: "usuarios.editar", label: "Modificar usuarios", action: "editar" },
      eliminar: { code: "usuarios.eliminar", label: "Anular / Desactivar usuarios", action: "eliminar" }
    }
  },
  productos: {
    label: "Inventario / Productos",
    description: "Productos, alimentos, medicamentos e insumos",
    icon: "📦",
    permissions: {
      ver: { code: "productos.ver", label: "Consultar productos", action: "ver" },
      crear: { code: "productos.crear", label: "Registrar productos", action: "crear" },
      editar: { code: "productos.editar", label: "Modificar productos", action: "editar" },
      eliminar: { code: "productos.eliminar", label: "Anular / Desactivar productos", action: "eliminar" }
    }
  },
  dashboard: {
    label: "Dashboard",
    description: "Panel principal con indicadores",
    icon: "📊",
    soloLectura: true,
    permissions: {
      ver: { code: "dashboard.ver", label: "Acceder al Dashboard", action: "ver" }
    }
  },
  salud: {
    label: "Salud",
    description: "Historial clínico y sanidad animal",
    icon: "🏥",
    soloLectura: true,
    permissions: {
      ver: { code: "salud.ver", label: "Consultar salud animal", action: "ver" }
    }
  },
  alimentacion: {
    label: "Alimentación",
    description: "Registro de alimentación y raciones",
    icon: "🌾",
    soloLectura: true,
    permissions: {
      ver: { code: "alimentacion.ver", label: "Consultar alimentación", action: "ver" }
    }
  },
  reproduccion: {
    label: "Reproducción",
    description: "Gestión reproductiva del ganado",
    icon: "🧬",
    soloLectura: true,
    permissions: {
      ver: { code: "reproduccion.ver", label: "Consultar reproducción", action: "ver" }
    }
  },
  potreros: {
    label: "Potreros",
    description: "Gestión de potreros y pasturas",
    icon: "🌿",
    soloLectura: true,
    permissions: {
      ver: { code: "potreros.ver", label: "Consultar potreros", action: "ver" }
    }
  },
  configuracion: {
    label: "Configuración",
    description: "Ajustes del sistema",
    icon: "⚙️",
    soloLectura: true,
    permissions: {
      ver: { code: "configuracion.ver", label: "Acceder a configuración", action: "ver" }
    }
  },
  cockpit: {
    label: "Cockpit Financiero",
    description: "Panel financiero y reportes",
    icon: "📈",
    soloLectura: true,
    permissions: {
      ver: { code: "cockpit.ver", label: "Acceder al Cockpit", action: "ver" }
    }
  },
  logs: {
    label: "Auditoría / Logs",
    description: "Registro de actividades del sistema",
    icon: "📋",
    soloLectura: true,
    permissions: {
      ver: { code: "logs.ver", label: "Consultar logs del sistema", action: "ver" }
    }
  }
};

// Mapeo inverso: código -> módulo + acción
export const PERMISSION_CODE_MAP = {};
Object.keys(PERMISSION_CATALOG).forEach(moduleKey => {
  const module = PERMISSION_CATALOG[moduleKey];
  Object.keys(module.permissions).forEach(actionKey => {
    const perm = module.permissions[actionKey];
    PERMISSION_CODE_MAP[perm.code] = {
      module: moduleKey,
      action: actionKey,
      moduleLabel: module.label,
      actionLabel: perm.label
    };
  });
});

// Obtener todos los códigos de permiso disponibles
export const getAllPermissionCodes = () => {
  const codes = [];
  Object.keys(PERMISSION_CATALOG).forEach(moduleKey => {
    const module = PERMISSION_CATALOG[moduleKey];
    Object.keys(module.permissions).forEach(actionKey => {
      codes.push(module.permissions[actionKey].code);
    });
  });
  return codes;
};

// Obtener módulos con sus permisos para mostrar en tabla
export const getModulesWithPermissions = () => {
  return Object.keys(PERMISSION_CATALOG).map(moduleKey => {
    const module = PERMISSION_CATALOG[moduleKey];
    const actions = ['ver', 'crear', 'editar', 'eliminar'];
    const perms = [];
    
    actions.forEach(action => {
      if (module.permissions[action]) {
        perms.push({
          action,
          code: module.permissions[action].code,
          label: module.permissions[action].label
        });
      }
    });
    
    return {
      key: moduleKey,
      label: module.label,
      description: module.description,
      icon: module.icon || '📌',
      soloLectura: module.soloLectura || false,
      permissions: perms
    };
  });
};