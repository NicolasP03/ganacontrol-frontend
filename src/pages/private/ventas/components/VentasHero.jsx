import "../../../../styles/modules/Ventas.css";

const money = (value) =>
  `$${Number(value || 0).toLocaleString("es-CO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;

export default function VentasHero({
  onNuevaVenta,
  onExportar,
  loading,
  resumenHero = {},
}) {
  const {
    ventasEsteAnio = 0,
    clientesActivos = 0,
    ingresosMes = 0,
  } = resumenHero;

  return (
    <div className="vt-hero">
      <div className="vt-hero__content">
        <div className="vt-hero__badge">
          <span className="vt-hero__badge-dot" />
          Módulo de Ventas
        </div>

        <h1 className="vt-hero__h1">
          Registro de
          <em className="vt-hero__h1-em">Ventas</em>
        </h1>

        <p className="vt-hero__p">
          Historial completo de transacciones, facturación y
          seguimiento de clientes del hato ganadero.
        </p>

        <div className="vt-hero__stats">
          <div className="vt-hero__stat">
            <span className="vt-hero__stat-val">{ventasEsteAnio}</span>
            <span className="vt-hero__stat-label">Ventas este año</span>
          </div>
          <div className="vt-hero__stat-divider" />
          <div className="vt-hero__stat">
            <span className="vt-hero__stat-val">{clientesActivos}</span>
            <span className="vt-hero__stat-label">Clientes activos</span>
          </div>
          <div className="vt-hero__stat-divider" />
          <div className="vt-hero__stat">
            <span className="vt-hero__stat-val">{money(ingresosMes)}</span>
            <span className="vt-hero__stat-label">Ingresos este mes</span>
          </div>
        </div>

        <div className="vt-hero__btns">
          <button className="vt-btn vt-btn--primary" onClick={onNuevaVenta}>
            + Nueva Venta
          </button>
          <button className="vt-btn vt-btn--outline" onClick={onExportar} disabled={loading}>
            {loading ? "Exportando…" : "📥 Exportar"}
          </button>
        </div>
      </div>

      <div className="vt-hero__img-wrap">
        <img
          className="vt-hero__img"
          src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=900&auto=format&fit=crop&q=80"
          alt="Ganado en subasta"
        />

        <div className="vt-hero__float-card">
          <span className="vt-hero__float-ico">📈</span>
          <div>
            <p className="vt-hero__float-val">{money(ingresosMes)}</p>
            <p className="vt-hero__float-label">Ingresos este mes</p>
          </div>
        </div>
      </div>
    </div>
  );
}