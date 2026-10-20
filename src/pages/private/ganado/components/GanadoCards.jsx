import { ESTADO_STYLES } from "../ganado.constants";
import defaultCow from "../../../../assets/default-cow.png";

const getFoto = (a) => {
  const raw = a?.foto_url || a?.foto;

  if (!raw) return defaultCow;

  if (raw.startsWith("http")) return raw;

  const apiUrl = import.meta.env.VITE_API_URL || "";
  const base = apiUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");

  const path = raw.startsWith("/") ? raw : `/${raw}`;
  return `${base}${path}`;
};

export default function GanadoCards({ animales, onVerDetalle }) {
  return (
    <div className="ganado-cards">
      {animales.slice(0, 3).map((a) => {
        const es = ESTADO_STYLES[a.estado] || ESTADO_STYLES.Activo;
        const foto = getFoto(a);

        return (
          <div className="ganado-card" key={a.id} onClick={() => onVerDetalle(a)}>
            <div className="ganado-card__img-wrap">
              <img
                src={foto}
                alt={a.nombre || a.codigo || "Ganado"}
                className="ganado-card__img"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = defaultCow;
                }}
              />

              <span className="ganado-card__id">Código: {a.codigo || a.id}</span>

              <span className="ganado-card__estado" style={{ background: es.color }}>
                {a.estado}
              </span>
            </div>

            <div className="ganado-card__body">
              <div className="ganado-card__nombre">{a.nombre || "Sin nombre"}</div>

              <div className="ganado-card__raza">
                {(a.raza || "Sin raza")} · {(a.categoria || "Sin categoría")}
              </div>

              <div className="ganado-card__peso">
                {a.peso_actual ?? a.peso ?? "-"} kg
              </div>

              <div className="ganado-card__peso-lbl">Peso actual</div>

              <div className="ganado-card__metrics">
                <div className="ganado-card__metric">
                  <span>📍</span>
                  <div>
                    <div className="ganado-card__metric-lbl">Potrero</div>
                    <div className="ganado-card__metric-val">{a.potrero || "-"}</div>
                  </div>
                </div>

                <div className="ganado-card__metric">
                  <span>{a.sexo === "Macho" ? "🐂" : "🐄"}</span>
                  <div>
                    <div className="ganado-card__metric-lbl">Sexo</div>
                    <div className="ganado-card__metric-val">{a.sexo || "-"}</div>
                  </div>
                </div>
              </div>

              {a.fecha_nacimiento && (
                <div
                  className="ganado-card__metric-val"
                  style={{ marginTop: "0.75rem", fontSize: "0.85rem" }}
                >
                  Nació: {a.fecha_nacimiento}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}