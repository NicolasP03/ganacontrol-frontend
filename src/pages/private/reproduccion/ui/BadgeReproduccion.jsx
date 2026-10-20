// src/pages/private/reproduccion/ui/BadgeReproduccion.jsx

import { ESTADO_REPRO_STYLES } from "../reproduccion.constants";

export default function BadgeReproduccion({ estado }) {
  const s = ESTADO_REPRO_STYLES[estado] ?? ESTADO_REPRO_STYLES.Pendiente;
  return (
    <span className="rp-badge" style={{ background: s.bg, color: s.color }}>
      <span className="rp-badge__ico">{s.icono}</span>
      {estado}
    </span>
  );
}