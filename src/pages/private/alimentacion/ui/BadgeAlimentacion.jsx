// src/pages/private/alimentacion/ui/BadgeAlimentacion.jsx

import { TIPO_ALIMENTO_STYLES } from "../alimentacion.constants";

export default function BadgeAlimentacion({ tipo }) {
  const s = TIPO_ALIMENTO_STYLES[tipo] ?? TIPO_ALIMENTO_STYLES.Otro;
  return (
    <span className="al-badge" style={{ background: s.bg, color: s.color }}>
      <span className="al-badge__ico">{s.icono}</span>
      {tipo?.replace("_", " ")}
    </span>
  );
}