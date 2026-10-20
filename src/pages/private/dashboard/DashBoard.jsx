import { useDashboard } from "./hooks/useDashboard";
import DashboardHeader from "./components/DashboardHeader";
import DashboardKPIs from "./components/DashboardKPIs";
import DashboardAlertas from "./components/DashboardAlertas";
import DashboardModulos from "./components/DashboardModulos";
import "../../../styles/modules/Dashboard.css";

export default function DashBoard() {
  const {
    nombre,
    rol,
    finca,
    inicial,
    saludo,
    fecha,
    kpis,
    alertas,
    modulos,
    alertasActivas,
    loading,
    error,
    recargarDashboard,
  } = useDashboard();

  if (loading && !kpis.length && !alertas.length) {
    return (
      <div className="db-animate-in">
        <div className="db-loading">
          <div className="db-loading__spinner" />
          <p>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !kpis.length && !alertas.length) {
    return (
      <div className="db-animate-in">
        <div className="db-error-card">
          <div className="db-error-card__icon">⚠️</div>
          <h3>No se pudo cargar el dashboard</h3>
          <p>{error}</p>
          <button className="db-btn db-btn--primary" onClick={recargarDashboard}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="db-animate-in">
      <DashboardHeader
        saludo={saludo}
        nombre={nombre}
        fecha={fecha}
        finca={finca}
        inicial={inicial}
        rol={rol}
      />

      <DashboardKPIs kpis={kpis} />
      <DashboardAlertas alertas={alertas} alertasActivas={alertasActivas} />
      <DashboardModulos modulos={modulos} />
    </div>
  );
}