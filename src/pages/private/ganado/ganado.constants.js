// src/pages/private/ganado/ganado.constants.js

export const RAZAS = [
  "Brahman", "Angus", "Simmental", "Cebú",
  "Holstein", "Hereford", "Charolais", "Limousin", "Gyr", "Nelore",
];

export const CATEGORIAS_GANADO     = ["Ternero", "Novillo", "Vaca", "Toro", "Otro"];
export const ESTADOS_GENERALES     = ["Activo", "Inactivo"];
export const ESTADOS_BIOLOGICOS    = ["Vivo", "Muerto"];
export const ESTADOS_COMERCIALES   = ["Disponible", "Vendido", "Descartado"];
export const ESTADOS_SALUD         = ["Sano", "En observacion", "Enfermo", "En tratamiento", "Recuperacion"];
export const ESTADOS_REPRODUCTIVOS = [
  "No aplica", "Vacia", "Servida", "Preñada",
  "Proxima al parto", "Lactando", "Seca",
];

export const ESTADOS  = ["Activo", "Inactivo", "Vendido", "Descartado", "Muerto"];

export const PER_PAGE = 5;

// ─────────────────────────────────────────────────────────────────────────────
// BADGE_PRIORIDAD
// Cuanto menor el número de prioridad, más crítico y más arriba se muestra.
// ─────────────────────────────────────────────────────────────────────────────
export const BADGE_PRIORIDAD = {
  Muerto:              { prioridad: 1,  bg: "#fecaca", color: "#7f1d1d", },
  Enfermo:             { prioridad: 2,  bg: "#fee2e2", color: "#991b1b", },
  "En tratamiento":    { prioridad: 3,  bg: "#fde68a", color: "#78350f", },
  "En observacion":    { prioridad: 4,  bg: "#fef9c3", color: "#854d0e", },
  "Proxima al parto":  { prioridad: 5,  bg: "#ede9fe", color: "#5b21b6", },
  Vendido:             { prioridad: 6,  bg: "#dbeafe", color: "#1e40af", },
  Descartado:          { prioridad: 7,  bg: "#fef3c7", color: "#92400e", },
  Inactivo:            { prioridad: 8,  bg: "#f3f4f6", color: "#374151", },
  Recuperacion:        { prioridad: 9,  bg: "#d1fae5", color: "#065f46", },
  "Preñada":           { prioridad: 10, bg: "#ede9fe", color: "#6d28d9", },
  Lactando:            { prioridad: 11, bg: "#e0f2fe", color: "#075985", },
  Activo:              { prioridad: 99, bg: "#dcfce7", color: "#166534", },
};

// Alias para compatibilidad con Badge.jsx existente
export const ESTADO_STYLES = BADGE_PRIORIDAD;

export const CARD_IMGS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuArW-QEqRpP4naKqaMRsFuT97jCL55C5bwwyv5jsXEmAsjCUiJ7m6BHZxPJ52PwyJtxrbEUH3CIiuzStqawwDqWH-tNcBPTtYWST04ha7lCbL1LY3vbJZWgzKIbq170fO_iefE0rXany6_EGAOdhflbVOjiZbCcy7Xy3Kttji5DIeVHCqU9CMY_7C0rFNT6JMCYM230Wmo_gZywrnzbBtK2dVQXnyvbdF4p0N_gQ5K9jLav-QCaCncwMES5vLr2Ijylvu5z27WNyls",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBHSHS-PDLZM_cTDqHfmm6GtkYdkXiUOXmtEFURzIICsjnEj0QCIN79jMsikR7RaI-QeogK6Dec_JPfTHHQUjphKRxNziED0NFUI-7_B5h-LcxaZEq93yIlaXUxP10n-L-dRB1DaPXDJFSjX1IOuxkv6vG9GA6MU8fpMUNvwU4A3voYjMxEWIOkScd1e-85Mstbk3l0gxndWmS_625Ni8jZHyLc35e36mRS0vG4SftXKl9Wb_fbMoNftOfe4kW4_OWVKVbj0E-VCC0",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBt86E7HX8yiQB3ZLZwIz339DeXhGc61Y746LSbHfYchqJHHDAyN7BgH98vdyYZun59NMGRBGzs24S5SRE1Bx0teaQBd1UAOJUCoSUS9F7tbNRauE7LpPiriRE2vcsB6dahTaa4G0zxuZ9PnG795daMLOPXJa9PUEQgvlbovKWYie3ltNqSCaedifssqtVJCWY45OIKZ60uQLTDSLJOM-t0PxbLBUPGN2E2pzEgGp6K_co03zu6E4UtRZ8wRq8rXHQboRDV4GJgszE",
];

export const DATOS_INICIALES = [];

// ─────────────────────────────────────────────────────────────────────────────
// resolverBadge(animal)
// Devuelve el estado más crítico del animal para mostrarlo en el badge.
// Retorna { label, prioridad, bg, color, icono }
// ─────────────────────────────────────────────────────────────────────────────
export function resolverBadge(animal) {
  if (!animal) return { label: "Activo", ...BADGE_PRIORIDAD.Activo };

  const candidatos = [];

  // 1. Biológico
  if (animal.estado_biologico === "Muerto")
    candidatos.push("Muerto");

  // 2. Salud
  if (["Enfermo", "En tratamiento", "En observacion", "Recuperacion"]
      .includes(animal.estado_salud))
    candidatos.push(animal.estado_salud);

  // 3. Reproductivo (solo estados notables)
  if (["Proxima al parto", "Preñada", "Lactando"]
      .includes(animal.estado_reproductivo))
    candidatos.push(animal.estado_reproductivo);

  // 4. Comercial / general
  if (animal.estado_comercial === "Vendido")    candidatos.push("Vendido");
  if (animal.estado_comercial === "Descartado") candidatos.push("Descartado");
  if (animal.estado_general   === "Inactivo")   candidatos.push("Inactivo");

  if (candidatos.length === 0)
    return { label: "Activo", ...BADGE_PRIORIDAD.Activo };

  // Ordenar por prioridad ascendente y tomar el primero (más crítico)
  const ordenado = candidatos
    .map(k => ({ label: k, ...(BADGE_PRIORIDAD[k] ?? BADGE_PRIORIDAD.Activo) }))
    .sort((a, b) => a.prioridad - b.prioridad);

  return ordenado[0];
}

// ─────────────────────────────────────────────────────────────────────────────
// esAlerta(animal)
// true si el animal debe sumarse al contador de alertas del KPI.
// ─────────────────────────────────────────────────────────────────────────────
export function esAlerta(animal) {
  if (!animal) return false;
  return (
    animal.estado_biologico === "Muerto"                              ||
    ["Enfermo", "En tratamiento", "En observacion"]
      .includes(animal.estado_salud)                                  ||
    animal.estado_reproductivo === "Proxima al parto"                 ||
    ["Vendido", "Descartado"].includes(animal.estado_comercial)       ||
    animal.estado_general === "Inactivo"
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// detalleAlertas(animales)
// Devuelve un desglose para el tooltip / subtexto del KPI de alertas.
// ─────────────────────────────────────────────────────────────────────────────
export function detalleAlertas(animales) {
  if (!Array.isArray(animales)) return {};
  return {
    muertos:         animales.filter(a => a.estado_biologico === "Muerto").length,
    enfermos:        animales.filter(a => a.estado_salud === "Enfermo").length,
    enTratamiento:   animales.filter(a => a.estado_salud === "En tratamiento").length,
    enObservacion:   animales.filter(a => a.estado_salud === "En observacion").length,
    proximosParto:   animales.filter(a => a.estado_reproductivo === "Proxima al parto").length,
    vendidos:        animales.filter(a => a.estado_comercial === "Vendido").length,
    descartados:     animales.filter(a => a.estado_comercial === "Descartado").length,
    inactivos:       animales.filter(a => a.estado_general === "Inactivo").length,
  };
}