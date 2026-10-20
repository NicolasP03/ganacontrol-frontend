// src/pages/private/reproduccion/reproduccion.constants.js

export const TIPOS_SERVICIO = ["Monta_Natural", "Inseminacion"];

export const ESTADOS_REPRODUCCION = [
  "Pendiente",
  "Gestante",
  "Fallida",
  "Parto",
  "Aborto",
];

export const PER_PAGE = 8;

// ── Estilos por estado ────────────────────────────────────────────────────
export const ESTADO_REPRO_STYLES = {
  Pendiente: { bg: "#fef9c3", color: "#854d0e", icono: "⏳" },
  Gestante:  { bg: "#dcfce7", color: "#166534", icono: "🐄" },
  Fallida:   { bg: "#fee2e2", color: "#991b1b", icono: "❌" },
  Parto:     { bg: "#dbeafe", color: "#1e40af", icono: "🎉" },
  Aborto:    { bg: "#f3f4f6", color: "#374151", icono: "⚠️" },
};

// ── KPI helpers ───────────────────────────────────────────────────────────
export function calcularKPIs(registros) {
  const total      = registros.length;
  const gestantes  = registros.filter(r => r.estado === "Gestante").length;
  const partos     = registros.filter(r => r.estado === "Parto").length;
  const fallidas   = registros.filter(r => r.estado === "Fallida" || r.estado === "Aborto").length;
  const tasaPrenez = total > 0 ? Math.round((gestantes / total) * 100) : 0;

  return { total, gestantes, partos, fallidas, tasaPrenez };
}

// ── Próximos partos (fecha_probable_parto != null, estado Gestante) ───────
export function proximosPartos(registros, dias = 30) {
  const hoy    = new Date();
  const limite = new Date();
  limite.setDate(hoy.getDate() + dias);

  return registros
    .filter(r => {
      if (r.estado !== "Gestante" || !r.fecha_probable_parto) return false;
      const fecha = new Date(r.fecha_probable_parto);
      return fecha >= hoy && fecha <= limite;
    })
    .sort((a, b) =>
      new Date(a.fecha_probable_parto) - new Date(b.fecha_probable_parto)
    );
}

// ── Formato de fecha legible ──────────────────────────────────────────────
export function formatFecha(fecha) {
  if (!fecha) return "—";
  const d = new Date(fecha + "T00:00:00");
  if (isNaN(d)) return "—";
  return d.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ── Días hasta una fecha ──────────────────────────────────────────────────
export function diasHasta(fecha) {
  if (!fecha) return null;
  const diff = new Date(fecha + "T00:00:00") - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}