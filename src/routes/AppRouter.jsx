import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layout privado
import PrivateLayout from "../components/layout/PrivateLayout";

// Páginas públicas
import Home              from "../pages/public/Home";
import Login             from "../pages/public/Login";

// Dashboard
import DashBoard from "../pages/private/dashboard/DashBoard";

// Ganado
import ListadoGanado   from "../pages/private/ganado/ListadoGanado";

// Reproducción
import Reproduccion from "../pages/private/reproduccion/Reproduccion";

// Eventos sanitarios / Vacunación / Salud
import ListadoEventos  from "../pages/private/eventos/ListadoEventos";

// Inventario
import ListadoInventario from "../pages/private/inventario/ListadoInventario";

// Alimentación
import Alimentacion from "../pages/private/inventario/Alimentacion";

// Ventas
import ListadoVentas   from "../pages/private/ventas/ListadoVentas";

// Pasturas
import MallaDigital from "../pages/private/pasturas/MallaDigital";

// Finanzas
import CockpitFinanciero from "../pages/private/finanzas/CockpitFinanciero";

// Mando Central
import MandoCentral from "../pages/private/mando/MandoCentral";

// Reportes
import ReporteGanado   from "../pages/private/reportes/ReporteGanado";
import ReporteIngresos from "../pages/private/reportes/ReporteIngresos";
import ReporteStock    from "../pages/private/reportes/ReporteStock";

// Configuración
import Finca    from "../pages/private/configuracion/Finca";
import Usuarios from "../pages/private/configuracion/Usuarios";
import Roles    from "../pages/private/configuracion/Roles";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Públicas ── */}
        <Route path="/"                   element={<Home />} />
        <Route path="/login"              element={<Login />} />
        <Route path="/registro"           element={<Navigate to="/login" replace />} />
        <Route path="/recuperar-password" element={<Navigate to="/login" replace />} />

        {/* ── Privadas (requieren auth) ── */}
        <Route element={<PrivateLayout />}>

          {/* Dashboard */}
          <Route path="/dashboard" element={<DashBoard />} />

          {/* Ganado */}
          <Route path="/ganado"            element={<ListadoGanado />} />
          <Route path="/ganado/registrar"  element={<Navigate to="/ganado" replace />} />
          <Route path="/ganado/:id"        element={<Navigate to="/ganado" replace />} />
          <Route path="/ganado/:id/editar" element={<Navigate to="/ganado" replace />} />

          {/* Reproducción */}
          <Route path="/reproduccion" element={<Reproduccion />} />

          {/* Eventos / Vacunación / Salud y Sanidad */}
          <Route path="/eventos"           element={<ListadoEventos />} />
          <Route path="/eventos/registrar" element={<Navigate to="/eventos" replace />} />
          <Route path="/eventos/:id"       element={<Navigate to="/eventos" replace />} />

          {/* Inventario */}
          <Route path="/inventario"             element={<ListadoInventario />} />
          <Route path="/inventario/productos"   element={<Navigate to="/inventario" replace />} />
          <Route path="/inventario/registrar"   element={<Navigate to="/inventario" replace />} />
          <Route path="/inventario/movimientos" element={<Navigate to="/inventario" replace />} />

          {/* Alimentación */}
          <Route path="/alimentacion" element={<Alimentacion />} />

          {/* Ventas */}
          <Route path="/ventas"           element={<ListadoVentas />} />
          <Route path="/ventas/registrar" element={<Navigate to="/ventas" replace />} />
          <Route path="/ventas/:id"       element={<Navigate to="/ventas" replace />} />

          {/* Pasturas / Malla Digital */}
          <Route path="/pasturas" element={<MallaDigital />} />

          {/* Cockpit Financiero */}
          <Route path="/finanzas" element={<CockpitFinanciero />} />

          {/* Mando Central */}
          <Route path="/mando" element={<MandoCentral />} />

          {/* Reportes */}
          <Route path="/reportes/ganado"   element={<ReporteGanado />} />
          <Route path="/reportes/ingresos" element={<ReporteIngresos />} />
          <Route path="/reportes/stock"    element={<ReporteStock />} />

          {/* Configuración */}
          <Route path="/configuracion/finca"    element={<Finca />} />
          <Route path="/configuracion/usuarios" element={<Usuarios />} />
          <Route path="/configuracion/roles"    element={<Roles />} />

        </Route>

        {/* Cualquier ruta desconocida → home */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;