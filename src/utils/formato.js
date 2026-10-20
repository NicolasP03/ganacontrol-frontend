// MySQL devuelve los DECIMAL como texto: siempre pasar por num()
export const num = (v) => Number(v ?? 0);

export const pesos = (v) =>
  "$" + num(v).toLocaleString("es-CO", { maximumFractionDigits: 0 });

export const cantidad = (v) =>
  num(v).toLocaleString("es-CO", { maximumFractionDigits: 2 });

// "GN-001 · Cara Blanca"
export const animal = (g) => (g ? [g.codigo, g.nombre].filter(Boolean).join(" · ") : "—");

export const hoyISO = () => {
  const d = new Date();
  const p = (x) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

// Días entre hoy y una fecha "YYYY-MM-DD" (positivo = futuro)
export const diasHasta = (fecha) => {
  const [y, m, d] = fecha.split("-").map(Number);
  const objetivo = new Date(y, m - 1, d);
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  return Math.round((objetivo - hoy) / 86400000);
};

// Quita strings vacíos para que el backend reciba null y no ""
export const limpiarForm = (form) =>
  Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v === "" ? null : v]));
