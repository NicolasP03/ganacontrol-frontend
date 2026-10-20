import Badge from "../ui/Badge";

const valor = (v, sufijo = "") => {
  if (v === null || v === undefined || v === "") return "-";
  return sufijo ? `${v} ${sufijo}` : v;
};

const fecha = (f) => {
  if (!f) return "-";
  try {
    return new Date(f).toLocaleDateString();
  } catch {
    return f;
  }
};

const fila = (label, value) => (
  <div className="gc-detail-item">
    <div className="gc-detail-item__label">{label}</div>
    <div className="gc-detail-item__value">{value}</div>
  </div>
);

export default function ModalDetalle({ animal, onClose, onEliminar, onEditar }) {
  if (!animal) return null;

  const fotoFallback = "/images/ganado-fallback.png";

  const foto =
    animal?.foto &&
    animal.foto !== "null" &&
    animal.foto !== "undefined" &&
    animal.foto.trim() !== ""
      ? animal.foto
      : fotoFallback;

  const estadoPrincipal =
    animal.estado || animal.estado_general || "Activo";

  return (
    <div
      className="gc-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="gc-modal gc-modal--xl">
        <div className="gc-modal__header">
          <div>
            <div className="gc-modal__title">Detalle del Animal</div>
            <div
              className="gc-modal__subtitle"
              style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}
            >
              {animal.codigo || animal.id} · {animal.nombre || "Sin nombre"}
            </div>
          </div>

          <button className="gc-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="gc-modal__body">
          <div className="gc-detail-layout">
            <div className="gc-detail-media">
              <img
                src={foto}
                alt={animal.nombre || animal.codigo || "Animal"}
                className="gc-detail-media__img"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = fotoFallback;
                }}
              />

              <div className="gc-detail-media__chips">
                <Badge estado={estadoPrincipal} />

                <span className="gc-detail-chip">
                  {animal.sexo === "Macho" ? "🐂" : "🐄"} {valor(animal.sexo)}
                </span>

                <span className="gc-detail-chip">
                  {valor(animal.categoria)}
                </span>

                {animal.raza && (
                  <span className="gc-detail-chip">{animal.raza}</span>
                )}
              </div>
            </div>

            <div className="gc-detail-main">
              <div className="gc-detail-block">
                <div className="gc-detail-block__title">
                  Información general
                </div>

                <div className="gc-detail-grid">
                  {fila("Código", valor(animal.codigo || animal.id))}
                  {fila("Nombre", valor(animal.nombre))}
                  {fila("Raza", valor(animal.raza))}
                  {fila("Sexo", valor(animal.sexo))}
                  {fila("Categoría", valor(animal.categoria))}
                  {fila("Peso actual", valor(animal.peso_actual, "kg"))}
                  {fila("Fecha de nacimiento", fecha(animal.fecha_nacimiento))}
                  {fila("Origen", valor(animal.origen))}
                  {fila("Fecha de ingreso", fecha(animal.fecha_ingreso))}
                </div>
              </div>

              <div className="gc-detail-block">
                <div className="gc-detail-block__title">Estados</div>

                <div className="gc-detail-grid">
                  {fila("Estado general", valor(animal.estado_general))}
                  {fila("Estado biológico", valor(animal.estado_biologico))}
                  {fila("Estado comercial", valor(animal.estado_comercial))}
                  {fila("Estado visible", valor(animal.estado))}
                  {fila("Estado de salud", valor(animal.estado_salud))}
                  {fila("Estado reproductivo", valor(animal.estado_reproductivo))}
                  {fila("Estado productivo", valor(animal.estado_productivo))}
                  {fila("Número de partos", valor(animal.numero_partos))}
                  {fila("Último parto", fecha(animal.fecha_ultimo_parto))}
                  {fila("Parto probable", fecha(animal.fecha_probable_parto))}
                  {fila("Reproductor", animal.es_reproductor ? "Sí" : "No")}
                </div>
              </div>

              <div className="gc-detail-block">
                <div className="gc-detail-block__title">
                  Relaciones y trazabilidad
                </div>

                <div className="gc-detail-grid">
                  {fila("Madre", valor(animal.madre || animal.madre_id))}
                  {fila("Padre", valor(animal.padre || animal.padre_id))}
                  {fila("Potrero", valor(animal.potrero))}
                  {fila("Creado en", fecha(animal.creado_en))}
                </div>
              </div>

              <div className="gc-detail-block">
                <div className="gc-detail-block__title">
                  Observaciones
                </div>

                <div className="gc-detail-note">
                  {animal.observaciones ||
                    animal.notas ||
                    "Sin observaciones registradas."}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="gc-modal__footer">
          <button className="gc-btn gc-btn--secondary" onClick={onClose}>
            Cerrar
          </button>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="gc-btn gc-btn--secondary"
              onClick={() => onEditar?.(animal)}
            >
              ✏️ Editar
            </button>

            <button
              className="gc-btn gc-btn--danger"
              onClick={() => onEliminar?.(animal.id)}
            >
              🗑️ Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}