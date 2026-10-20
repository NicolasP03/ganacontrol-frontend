import "../../../styles/modules/Reproduccion.css";

import { PER_PAGE } from "./reproduccion.constants";
import useTablaReproduccion from "./hooks/useTablaReproduccion";
import useReproduccion from "./hooks/useReproduccion";

import ReproduccionHero from "./components/ReproduccionHero";
import ReproduccionKPIs from "./components/ReproduccionKPIs";
import ReproduccionGrafico from "./components/ReproduccionGrafico";
import ReproduccionTimeline from "./components/ReproduccionTimeline";
import ReproduccionSearch from "./components/ReproduccionSearch";
import ReproduccionFiltros from "./components/ReproduccionFiltros";
import ReproduccionTabla from "./components/ReproduccionTabla";
import ReproduccionPaginacion from "./components/ReproduccionPaginacion";

import ModalNuevoServicio from "./modals/ModalNuevoServicio";
import ModalEditarServicio from "./modals/ModalEditarServicio";
import ModalDetalleServicio from "./modals/ModalDetalleServicio";

export default function Reproduccion() {
  const {
    registros,
    loading,
    errorCarga,
    modalNuevo,
    setModalNuevo,
    modalEditar,
    setModalEditar,
    modalDetalle,
    setModalDetalle,
    handleGuardar,
    handleActualizar,
    handleEliminar,
    recargarReproduccion,
  } = useReproduccion();

  const tabla = useTablaReproduccion(registros);

  if (loading) {
    return (
      <div className="rp-root rp-animate-in">
        <div className="rp-loading">
          <div className="rp-loading__spinner" />
          <p>Cargando registros reproductivos…</p>
        </div>
      </div>
    );
  }

  if (errorCarga) {
    return (
      <div className="rp-root rp-animate-in">
        <div className="rp-error-card">
          <div className="rp-error-card__ico">😔</div>
          <div className="rp-error-card__title">Error al cargar</div>
          <p className="rp-error-card__msg">{errorCarga}</p>
          <button
            className="rp-btn rp-btn--secondary"
            onClick={recargarReproduccion}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rp-root rp-animate-in">
      <ReproduccionHero onNuevoServicio={() => setModalNuevo(true)} />

      <ReproduccionKPIs registros={registros} />

      <div className="rp-grid-main">
        <ReproduccionGrafico registros={registros} />
        <ReproduccionTimeline
          registros={registros}
          onVerDetalle={setModalDetalle}
        />
      </div>

      <div className="rp-tabla-section">
        <div className="rp-tabla-header">
          <div>
            <div className="rp-tabla-header__title">Registro de Servicios</div>

            {tabla.filtrosActivos > 0 && (
              <div className="rp-tabla-header__filtros">
                {tabla.filtrosActivos} filtro
                {tabla.filtrosActivos > 1 ? "s" : ""} activo
                {tabla.filtrosActivos > 1 ? "s" : ""}
                <button
                  className="rp-tabla-header__limpiar"
                  onClick={tabla.limpiarFiltros}
                >
                  × Limpiar
                </button>
              </div>
            )}
          </div>

          <div className="rp-tabla-controls">
            <ReproduccionSearch
              busqueda={tabla.busqueda}
              onChange={(v) => {
                tabla.setBusqueda(v);
                tabla.setPagina(1);
              }}
            />

            <div style={{ position: "relative" }}>
              <button
                className={`rp-btn rp-btn--secondary rp-btn--sm${
                  tabla.filtrosActivos > 0 ? " rp-btn--filtered" : ""
                }`}
                onClick={() => tabla.setFiltroOpen((o) => !o)}
              >
                🔽 Filtrar{" "}
                {tabla.filtrosActivos > 0 && `(${tabla.filtrosActivos})`}
              </button>

              {tabla.filtroOpen && (
                <ReproduccionFiltros
                  filtros={tabla.filtros}
                  onToggle={tabla.toggleFiltro}
                  onLimpiar={tabla.limpiarFiltros}
                  onCerrar={() => tabla.setFiltroOpen(false)}
                />
              )}
            </div>

            <button
              className="rp-btn rp-btn--primary rp-btn--sm"
              onClick={() => setModalNuevo(true)}
            >
              ➕ Agregar
            </button>
          </div>
        </div>

        <ReproduccionTabla
          filas={tabla.paginados}
          sortCol={tabla.sortCol}
          sortDir={tabla.sortDir}
          onSort={tabla.handleSort}
          onVerDetalle={setModalDetalle}
          onEditar={setModalEditar}
          onEliminar={handleEliminar}
        />

        <ReproduccionPaginacion
          pagina={tabla.pagina}
          totalPags={tabla.totalPags}
          totalFiltrados={tabla.filtrados.length}
          perPage={PER_PAGE}
          onChange={tabla.setPagina}
        />
      </div>

      {modalNuevo && (
        <ModalNuevoServicio
          onClose={() => setModalNuevo(false)}
          onGuardar={handleGuardar}
        />
      )}

      {modalEditar && (
        <ModalEditarServicio
          onClose={() => setModalEditar(null)}
          onGuardar={handleActualizar}
          registro={modalEditar}
        />
      )}

      {modalDetalle && (
        <ModalDetalleServicio
          onClose={() => setModalDetalle(null)}
          onEditar={setModalEditar}
          onEliminar={handleEliminar}
          registro={modalDetalle}
        />
      )}
    </div>
  );
}