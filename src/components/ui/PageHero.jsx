/**
 * PageHero — Hero superior reutilizable para módulos privados
 *
 * Props:
 *  - badge     : string  — texto del badge superior (ej: "Módulo Sanitario V7")
 *  - title     : string  — título principal
 *  - titleSpan : string  — parte del título con color verde
 *  - description: string — párrafo descriptivo
 *  - actions   : Array<{ label, onClick, variant }> — botones de acción
 *  - imgSrc    : string  — URL de la imagen del lado derecho (opcional)
 *  - imgAlt    : string  — texto alternativo de la imagen
 */

export default function PageHero({
  badge,
  title,
  titleSpan,
  description,
  actions = [],
  imgSrc,
  imgAlt = "Módulo GanaControl",
}) {
  return (
    <div
      className="mod-hero"
      style={{ marginBottom: "var(--space-8)" }}
    >
      {/* Contenido izquierdo */}
      <div className="mod-hero__content">

        {/* Badge */}
        {badge && (
          <div className="mod-hero__badge">
            <span className="mod-hero__badge-dot" />
            {badge}
          </div>
        )}

        {/* Título */}
        <h1 className="mod-hero__h1">
          {title}
          {titleSpan && (
            <>
              <br />
              <span>{titleSpan}</span>
            </>
          )}
        </h1>

        {/* Descripción */}
        {description && (
          <p className="mod-hero__p">{description}</p>
        )}

        {/* Botones de acción */}
        {actions.length > 0 && (
          <div className="mod-hero__btns">
            {actions.map((action, i) => (
              <button
                key={i}
                className={`gc-btn gc-btn--${action.variant || "primary"}`}
                onClick={action.onClick}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Imagen derecha */}
      {imgSrc && (
        <div className="mod-hero__img-wrap">
          <img
            src={imgSrc}
            alt={imgAlt}
            className="mod-hero__img"
          />
          <div className="mod-hero__img-overlay" />
        </div>
      )}
    </div>
  );
}