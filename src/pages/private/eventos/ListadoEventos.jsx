import { useSalud } from "./hooks/useSalud";
import SaludHero from "./components/SaludHero";
import SaludKPIs from "./components/SaludKPIs";
import SaludHistorial from "./components/SaludHistorial";
import SaludProximos from "./components/SaludProximos";
import SaludEstatus from "./components/SaludEstatus";
import SaludModalDetalle from "./modals/SaludModalDetalle";
import SaludModalForm from "./modals/SaludModalForm";
import "../../../styles/modules/Salud.css";

export default function ListadoEventos() {
  const {
    historial,
    historialTotal,
    kpis,
    proximos,
    estatus,
    heroStats,
    busqueda,
    setBusqueda,
    filtroEstado,
    setFiltroEstado,
    loading,
    error,
    modalDetalle,
    setModalDetalle,
    modalForm,
    setModalForm,
    recargar,
    handleEliminar,
    handleGuardar,
    handleExportar,
  } = useSalud();

  if (loading && !historial.length && !kpis.length) {
    return (
      <div className="sl-animate-in">
        <div className="sl-loading">
          <div className="sl-loading__spinner" />
          <p>Cargando módulo de salud...</p>
        </div>
      </div>
    );
  }

  if (error && !historial.length && !kpis.length) {
    return (
      <div className="sl-animate-in">
        <div className="sl-error-card">
          <div className="sl-error-card__icon">⚠️</div>
          <h3>No se pudo cargar el módulo de salud</h3>
          <p>{error}</p>
          <button className="sl-btn sl-btn--primary" onClick={recargar}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sl-animate-in">
      <SaludHero
        onNuevoExamen={() => setModalForm("nuevo")}
        onExportar={handleExportar}
        loading={loading}
        stats={heroStats}
      />

      <SaludKPIs kpis={kpis} />

      <div className="sl-main-grid">
        <SaludHistorial
          historial={historial}
          historialTotal={historialTotal}
          busqueda={busqueda}
          onBusqueda={setBusqueda}
          filtroEstado={filtroEstado}
          onFiltroEstado={setFiltroEstado}
          onVer={(ev) => setModalDetalle(ev)}
          onEditar={(ev) => setModalForm(ev)}
          onEliminar={handleEliminar}
          onNuevoExamen={() => setModalForm("nuevo")}
        />

        <div className="sl-sidebar">
          <SaludProximos proximos={proximos} />
          <SaludEstatus estatus={estatus} />
        </div>
      </div>

      <SaludModalDetalle
        evento={modalDetalle}
        onClose={() => setModalDetalle(null)}
        onEditar={(ev) => setModalForm(ev)}
      />

      {(modalForm === "nuevo" || (modalForm && modalForm !== "nuevo")) && (
        <SaludModalForm
          evento={modalForm === "nuevo" ? null : modalForm}
          onClose={() => setModalForm(null)}
          onGuardar={handleGuardar}
        />
      )}
    </div>
  );
}