import "../../../styles/modules/Potreros.css";

import usePotreros from "./hooks/usePotreroToasts";
import useTablaPotreros from "./hooks/useTablaPotreros";

import PotreroHero from "./components/PotreroHero";
import PotreroKPIs from "./components/PotreroKPIs";
import PotreroTabla from "./components/PotreroTabla";
import PotreroFormModal from "./modals/PotreroFormModal";

export default function Potreros() {
  const {
    potreros,
    loading,
    guardando,
    error,
    modalFormOpen,
    potreroActivo,
    modoForm,
    abrirCrear,
    abrirEditar,
    cerrarForm,
    handleGuardar,
    handleEliminar,
    recargarPotreros,
  } = usePotreros();

  const tabla = useTablaPotreros(potreros);

  if (loading) {
    return (
      <div className="pt-root">
        <div className="pt-loading">
          <div className="pt-spinner" />
          <p>Cargando potreros...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-root">
        <div className="pt-error-card">
          <div className="pt-error-card__icon">⚠️</div>
          <h3>No se pudo cargar el módulo</h3>
          <p>{error}</p>
          <button className="pt-btn pt-btn--primary" onClick={recargarPotreros}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const totalFiltrosActivos =
    (tabla.busqueda?.trim() ? 1 : 0) +
    (tabla.estadoFiltro !== "Todos" ? 1 : 0);

  return (
    <div className="pt-root pt-animate-in">
      <PotreroHero onNuevo={abrirCrear} />

      <PotreroKPIs potreros={potreros} />

      <div className="pt-tabla-section">
        <div className="pt-toolbar">
          <div className="pt-toolbar__left">
            <h3 className="pt-toolbar__title">Registro de Potreros</h3>
            {totalFiltrosActivos > 0 && (
              <div className="pt-toolbar__filters-active">
                {totalFiltrosActivos} filtro
                {totalFiltrosActivos > 1 ? "s" : ""} activo
                {totalFiltrosActivos > 1 ? "s" : ""}
                <button
                  className="pt-toolbar__clear"
                  onClick={tabla.limpiarFiltros}
                >
                  × Limpiar
                </button>
              </div>
            )}
          </div>

          <div className="pt-toolbar__right">
            <div className="pt-search">
              <span className="pt-search__icon">🔎</span>
              <input
                value={tabla.busqueda}
                onChange={(e) => {
                  tabla.setBusqueda(e.target.value);
                  tabla.setPagina(1);
                }}
                placeholder="Buscar por nombre, id o tipo..."
              />
              {tabla.busqueda && (
                <button
                  className="pt-search__clear"
                  onClick={() => {
                    tabla.setBusqueda("");
                    tabla.setPagina(1);
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            <select
              className="pt-select"
              value={tabla.estadoFiltro}
              onChange={(e) => {
                tabla.setEstadoFiltro(e.target.value);
                tabla.setPagina(1);
              }}
            >
              <option value="Todos">Todos</option>
              <option value="Disponible">Disponible</option>
              <option value="Ocupado">Ocupado</option>
              <option value="Mantenimiento">Mantenimiento</option>
              <option value="Descanso">Descanso</option>
            </select>

            <button className="pt-btn pt-btn--primary pt-btn--sm pt-btn-agregar" onClick={abrirCrear}>
              ➕ Agregar
            </button>
          </div>
        </div>

        <PotreroTabla
          vista="tabla"
          rows={tabla.paginados}
          total={tabla.filtrados.length}
          pagina={tabla.pagina}
          totalPaginas={tabla.totalPaginas}
          setPagina={tabla.setPagina}
          sortBy={tabla.sortBy}
          sortDir={tabla.sortDir}
          onSort={tabla.toggleSort}
          onEditar={abrirEditar}
          onEliminar={handleEliminar}
        />
      </div>

      <PotreroFormModal
        key={`${modalFormOpen}-${modoForm}-${potreroActivo?.id ?? "nuevo"}`}
        open={modalFormOpen}
        modo={modoForm}
        initialData={potreroActivo}
        onClose={cerrarForm}
        onSubmit={handleGuardar}
        loading={guardando}
      />
    </div>
  );
}