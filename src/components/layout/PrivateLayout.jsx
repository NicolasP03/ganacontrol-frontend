import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "../../services/AuthService";
import Sidebar from "./Sidebar";
import Navbar  from "./Navbar";
import "./PrivateLayout.css";
import "../../styles/Home.css";
import "../../styles/Modulos.css";

// Mapa de rutas → títulos para el Navbar
const titulos = {
  "/dashboard":                   "Dashboard",
  "/ganado":                      "Ganado",
  "/ganado/registrar":            "Registrar Ganado",
  "/reproduccion":                "Reproducción",
  "/eventos":                     "Sanidad & Eventos",
  "/inventario":                  "Inventario",
  "/inventario/registrar":        "Registrar Producto",
  "/inventario/movimientos":      "Movimientos",
  "/alimentacion":                "Alimentación",
  "/ventas":                      "Ventas",
  "/ventas/registrar":            "Registrar Venta",
  "/reportes/ganado":             "Reporte Ganado",
  "/reportes/ingresos":           "Reporte Ingresos",
  "/reportes/stock":              "Reporte Stock",
  "/configuracion/finca":         "Configuración · Finca",
  "/configuracion/usuarios":      "Configuración · Usuarios",
  "/configuracion/roles":         "Configuración · Roles",
};

export default function PrivateLayout() {
  const location = useLocation();

  // Redirige al login si no hay sesión
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const titulo = titulos[location.pathname] || "GanaControl";

  return (
    <div className="gc-layout">
      <Sidebar />
      <div className="gc-layout-main">
        <Navbar titulo={titulo} />
        <main className="gc-layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}