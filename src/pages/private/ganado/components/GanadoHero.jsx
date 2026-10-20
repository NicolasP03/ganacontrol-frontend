export default function GanadoHero({ onNuevoRegistro, onExportar }) {
  return (
    <div className="ganado-hero">
      <div className="ganado-hero__inner">
        <div className="ganado-hero__eyebrow">
          <span className="ganado-hero__line" />
          Análisis de Hato
        </div>
        <h1 className="ganado-hero__h1">
          Control <span>Ganadero</span>
        </h1>
        <p className="ganado-hero__p">
          Telemetría de precisión y trazabilidad completa para sus activos ganaderos.
        </p>
        <div className="ganado-hero__btns">
          <button className="gc-btn gc-btn--primary" onClick={onNuevoRegistro}>
            ➕ Nuevo Registro
          </button>
          <button className="gc-btn gc-btn--secondary" onClick={onExportar}>
            📤 Exportar
          </button>
        </div>
      </div>
    </div>
  );
}