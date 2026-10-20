import "../../../../styles/modules/Salud.css";

export default function SaludHero({
  onNuevoExamen,
  onExportar,
  loading,
  stats = {},
}) {
  const {
    animalesActivos = 0,
    porcentajeVacunados = 0,
    vetsActivos = 0,
    alertasActivas = 0,
    tratamientosHoy = 0,
  } = stats;

  return (
    <div className="sl-hero">
      <div className="sl-hero__content">
        <div className="sl-hero__badge">
          <span className="sl-hero__badge-dot" />
          Módulo Sanitario V7
        </div>

        <h1 className="sl-hero__h1">
          Salud y Sanidad
          <em className="sl-hero__h1-em">Inteligente</em>
        </h1>

        <p className="sl-hero__p">
          Monitoreo biométrico y diagnóstico preventivo para la
          excelencia en la gestión veterinaria del hato ganadero.
        </p>

        <div className="sl-hero__stats">
          <div className="sl-hero__stat">
            <span className="sl-hero__stat-val">{animalesActivos}</span>
            <span className="sl-hero__stat-label">Animales activos</span>
          </div>

          <div className="sl-hero__stat-div" />

          <div className="sl-hero__stat">
            <span className="sl-hero__stat-val">{porcentajeVacunados}%</span>
            <span className="sl-hero__stat-label">Vacunados</span>
          </div>

          <div className="sl-hero__stat-div" />

          <div className="sl-hero__stat">
            <span className="sl-hero__stat-val">{vetsActivos}</span>
            <span className="sl-hero__stat-label">Vets activos</span>
          </div>
        </div>

        <div className="sl-hero__btns">
          <button className="sl-btn sl-btn--primary" onClick={onNuevoExamen}>
            + Nuevo Examen
          </button>
          <button
            className="sl-btn sl-btn--outline"
            onClick={onExportar}
            disabled={loading}
          >
            {loading ? "Exportando…" : "📊 Exportar Historial"}
          </button>
        </div>
      </div>

      <div className="sl-hero__img-wrap">
        <img
          className="sl-hero__img"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqaert0Je6_m1zaN_hXwaBICvmnldiYJ6-wDJHC7dBgJAQFR2O1166rC1IRoBqqQ-wa5xwax8GA_3uG0vM_YfvoPxiRR1lgXPpqKXCfq1G6eqfhoUUsfJBFJbb7Y6yUBNIgjEF2TM4IDDf4zHhXksELJ0_mFqTn3eQjp0FMB4BtrhmjGvafSdqbakHFM22foepExFUUzPW-cVEjbeyveGxTr10w9Al3PjjzL63uYPWchdwxMa06jTiiyGWxguPog6DzgBlJPt-Ckw"
          alt="Salud y sanidad ganadera"
        />

        <div className="sl-hero__alert-pill">
          <span className="sl-hero__alert-dot" />
          {alertasActivas} alertas activas
        </div>

        <div className="sl-hero__float-card">
          <span className="sl-hero__float-ico">💉</span>
          <div>
            <p className="sl-hero__float-val">{tratamientosHoy} tratamientos</p>
            <p className="sl-hero__float-label">En seguimiento hoy</p>
          </div>
        </div>
      </div>
    </div>
  );
}