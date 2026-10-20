// src/pages/private/pasturas/components/PotreroHero.jsx
// Imagen sugerida (libre de derechos, pastizal ganadero):
// https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=900&q=80
// Puedes cambiarla por cualquier URL de imagen de tu proyecto.

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=900&q=80";

export default function PotreroHero({ onNuevo }) {
  return (
    <section className="pt-hero pt-animate-in">
      {/* ── Columna izquierda: texto ── */}
      <div className="pt-hero__content">
        <span className="pt-hero__badge">
          <span className="pt-hero__badge-dot" />
          Control ganadero
        </span>

        <h1 className="pt-hero__title">
          Gestión de{" "}
          <span>Potreros</span>
        </h1>

        <p className="pt-hero__text">
          Administra tus potreros, controla capacidad, estado de ocupación
          y mantén organizada la información de pasturas conectada
          directamente con tu backend.
        </p>

        <div className="pt-hero__actions">
          <button className="pt-btn pt-btn--primary" onClick={onNuevo}>
            ➕ Nuevo Potrero
          </button>
        </div>
      </div>

      {/* ── Columna derecha: imagen real ── */}
      <div
        className="pt-hero__visual"
        style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
      >
        <div className="pt-hero__visual-card">
          <span>🌿</span>
          <strong>Pasturas activas</strong>
          <p>Seguimiento visual del estado de cada zona de pastoreo.</p>
        </div>
      </div>
    </section>
  );
}