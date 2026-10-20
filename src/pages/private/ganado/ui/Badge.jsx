// src/pages/private/ganado/ui/Badge.jsx
// Muestra el estado más crítico del animal usando resolverBadge().
// Si se llama con `estado` (string) actúa como antes (compatibilidad).
// Si se llama con `animal` (objeto) resuelve automáticamente la prioridad.

import { resolverBadge, BADGE_PRIORIDAD } from "../ganado.constants";

export default function Badge({ animal, estado }) {
  // Modo objeto: recibe el animal completo → resuelve automáticamente
  if (animal && typeof animal === "object") {
    const badge = resolverBadge(animal);
    return (
      <span
        className="gc-badge"
        style={{ background: badge.bg, color: badge.color }}
        title={badge.label}
      >
        <span className="gc-badge__ico">{badge.icono}</span>
        {badge.label}
      </span>
    );
  }

  // Modo string: compatibilidad con uso anterior Badge estado="Activo"
  const s = BADGE_PRIORIDAD[estado] ?? BADGE_PRIORIDAD.Activo;
  return (
    <span
      className="gc-badge"
      style={{ background: s.bg, color: s.color }}
      title={estado}
    >
      <span className="gc-badge__ico">{s.icono}</span>
      {estado}
    </span>
  );
}