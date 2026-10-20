import "../../../styles/modules/Ganado.css";

import { PER_PAGE } from "./ganado.constants";
import useGanado from "./hooks/useToasts";
import useTabla from "./hooks/useTabla";

import GanadoHero from "./components/GanadoHero";
import GanadoKPIs from "./components/GanadoKPIs";
import GanadoCards from "./components/GanadoCards";

import GanadoSearch from "./components/GanadoSearch";
import GanadoFiltros from "./components/GanadoFiltros";
import GanadoTabla from "./components/GanadoTabla";
import GanadoPaginacion from "./components/GanadoPaginacion";

import ModalNuevoRegistro from "./modals/ModalNuevoRegistro";
import ModalEditar from "./modals/ModalEditar";
import ModalDetalle from "./modals/ModalDetalle";
import ModalExportar from "./modals/ModalExportar";

export default function ListadoGanado() {
  const {
    animales,
    loading,
    errorCarga,
    modalNuevo,
    setModalNuevo,
    modalEditar,
    setModalEditar,
    modalDetalle,
    setModalDetalle,
    modalExport,
    setModalExport,
    handleGuardar,
    handleActualizar,
    handleEliminar,
    recargarGanado,
  } = useGanado();

  const tabla = useTabla(animales);

  if (loading) {
    return (
      <div className="gc-root gc-animate-in">
        <div className="ganado-table-section">
          <div className="ganado-table-header__title">Cargando ganado...</div>
        </div>
      </div>
    );
  }

  if (errorCarga) {
    return (
      <div className="gc-root gc-animate-in">
        <div className="ganado-table-section">
          <div className="ganado-table-header__title">Error al cargar</div>
          <p style={{ marginTop: 12 }}>{errorCarga}</p>

          <button
            className="gc-btn gc-btn--secondary gc-btn--sm"
            onClick={recargarGanado}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="gc-root gc-animate-in">
      <GanadoHero
        onNuevoRegistro={() => setModalNuevo(true)}
        onExportar={() => setModalExport(true)}
      />

      <GanadoKPIs animales={animales} />
      <GanadoCards animales={animales} onVerDetalle={setModalDetalle} />

      <div className="ganado-table-section">
        <div className="ganado-table-header">
          <div>
            <div className="ganado-table-header__title">Inventario de Hato</div>

            {tabla.filtrosActivos > 0 && (
              <div className="ganado-table-header__filtros-activos">
                {tabla.filtrosActivos} filtro
                {tabla.filtrosActivos > 1 ? "s" : ""} activo
                {tabla.filtrosActivos > 1 ? "s" : ""}
                <button
                  className="ganado-table-header__limpiar"
                  onClick={tabla.limpiarFiltros}
                >
                  × Limpiar
                </button>
              </div>
            )}
          </div>

          <div className="ganado-table-controls">
            <GanadoSearch
              busqueda={tabla.busqueda}
              onChange={(v) => {
                tabla.setBusqueda(v);
                tabla.setPagina(1);
              }}
            />

            <div style={{ position: "relative" }}>
              <button
                className="gc-btn gc-btn--secondary gc-btn--sm"
                style={
                  tabla.filtrosActivos > 0
                    ? { borderColor: "var(--green-400)", color: "var(--green-700)" }
                    : {}
                }
                onClick={() => tabla.setFiltroOpen((o) => !o)}
              >
                🔽 Filtrar {tabla.filtrosActivos > 0 && `(${tabla.filtrosActivos})`}
              </button>

              {tabla.filtroOpen && (
                <GanadoFiltros
                  filtros={tabla.filtros}
                  onToggle={tabla.toggleFiltro}
                  onLimpiar={tabla.limpiarFiltros}
                  onCerrar={() => tabla.setFiltroOpen(false)}
                />
              )}
            </div>

            <button
              className="gc-btn gc-btn--secondary gc-btn--sm"
              onClick={() => setModalNuevo(true)}
            >
              ➕ Agregar
            </button>
          </div>
        </div>

        <GanadoTabla
          filas={tabla.paginados}
          sortCol={tabla.sortCol}
          sortDir={tabla.sortDir}
          onSort={tabla.handleSort}
          onVerDetalle={setModalDetalle}
          onEditar={setModalEditar}
          onEliminar={handleEliminar}
        />

        <GanadoPaginacion
          pagina={tabla.pagina}
          totalPags={tabla.totalPags}
          totalFiltrados={tabla.filtrados.length}
          perPage={PER_PAGE}
          onChange={tabla.setPagina}
        />
      </div>

      {modalNuevo && (
        <ModalNuevoRegistro
          onClose={() => setModalNuevo(false)}
          onGuardar={handleGuardar}
        />
      )}

      {modalEditar && (
        <ModalEditar
          onClose={() => setModalEditar(null)}
          onGuardar={handleActualizar}
          animal={modalEditar}
        />
      )}

      {modalDetalle && (
        <ModalDetalle
          onClose={() => setModalDetalle(null)}
          onEliminar={handleEliminar}
          onEditar={(animal) => {
            setModalDetalle(null);
            setModalEditar(animal);
          }}
          animal={modalDetalle}
        />
      )}

      {modalExport && (
        <ModalExportar
          onClose={() => setModalExport(false)}
          animales={tabla.filtrados}
        />
      )}
    </div>
  );
}