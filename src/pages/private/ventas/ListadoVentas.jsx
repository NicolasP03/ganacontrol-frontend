import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import useVentas from "./hooks/useVentas";
import VentasHero from "./components/VentasHero";
import VentasKPIs from "./components/VentasKPIs";
import VentasTabla from "./components/VentasTabla";
import VentasModalDetalle from "./modals/VentasModalDetalle";
import VentasModalForm from "./modals/VentasModalForm";
import VentasModalEliminar from "./modals/VentasModalEliminar";
import "../../../styles/modules/Ventas.css";

export default function ListadoVentas() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    ventas,
    ventasTotales,
    kpis,
    resumenHero,
    busqueda,
    setBusqueda,
    filtroEstado,
    setFiltroEstado,
    loading,
    paginaActual,
    setPaginaActual,
    totalPaginas,
    modalDetalle,
    setModalDetalle,
    modalForm,
    setModalForm,
    ventaAEliminar,
    handleVer,
    handleEditar,
    solicitarEliminar,
    cancelarEliminar,
    confirmarEliminar,
    handleGuardar,
    handleExportar,
  } = useVentas();

  useEffect(() => {
    const editarVentaId = location.state?.editarVentaId;

    if (!editarVentaId) return;

    handleEditar({
      venta_id: editarVentaId,
    });

    navigate("/ventas", {
      replace: true,
      state: {},
    });
  }, [location.state, handleEditar, navigate]);

  return (
    <div className="vt-animate-in">
      <VentasHero
        onNuevaVenta={() => setModalForm("nueva")}
        onExportar={handleExportar}
        loading={loading}
        resumenHero={resumenHero}
      />

      <VentasKPIs kpis={kpis} />

      <VentasTabla
        ventas={ventas}
        ventasTotales={ventasTotales}
        busqueda={busqueda}
        onBusqueda={setBusqueda}
        filtroEstado={filtroEstado}
        onFiltroEstado={setFiltroEstado}
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        onPagina={setPaginaActual}
        onVer={handleVer}
        onEditar={handleEditar}
        onEliminar={solicitarEliminar}
        onNuevaVenta={() => setModalForm("nueva")}
        onExportar={handleExportar}
      />

      <VentasModalDetalle
        venta={modalDetalle}
        onClose={() => setModalDetalle(null)}
        onEditar={handleEditar}
      />

      {!!modalForm && (
        <VentasModalForm
          venta={modalForm === "nueva" ? null : modalForm}
          onClose={() => setModalForm(null)}
          onGuardar={handleGuardar}
        />
      )}

      <VentasModalEliminar
        venta={ventaAEliminar}
        onClose={cancelarEliminar}
        onConfirm={confirmarEliminar}
        loading={loading}
      />
    </div>
  );
}