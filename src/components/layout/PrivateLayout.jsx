import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { isAuthenticated } from "../../services/AuthService";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

import "../../styles/Sidebar.css";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/ganado": "Control Ganadero",
  "/reproduccion": "Reproducción y Genética",
  "/eventos": "Salud y Sanidad",
  "/alimentacion": "Alimentación",
  "/inventario": "Inventario",
  "/pasturas": "Potreros",
  "/ventas": "Ventas",
  "/finanzas": "Cockpit Financiero",
  "/configuracion/finca": "Configuración",
  "/configuracion/usuarios": "Usuarios",
};

export default function PrivateLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    document.body.classList.toggle("gc-mobile-menu-open", mobileMenuOpen);

    return () => {
      document.body.classList.remove("gc-mobile-menu-open");
    };
  }, [mobileMenuOpen]);

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const pageTitle = PAGE_TITLES[location.pathname] || "GanaControl";

  const handleMenuClick = () => {
    setMobileMenuOpen((open) => !open);
  };

  const handleMobileClose = () => {
    setMobileMenuOpen(false);
  };

  const handleToggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setMobileMenuOpen(false);
      return;
    }

    setCollapsed((current) => !current);
  };

  return (
    <div className="gc-private-layout">
      <Sidebar
        collapsed={collapsed}
        onToggle={handleToggleSidebar}
        mobileOpen={mobileMenuOpen}
        onMobileClose={handleMobileClose}
      />

      <div className={`gc-main-content ${collapsed ? "sidebar-collapsed" : ""}`}>
        <Navbar
          collapsed={collapsed}
          pageTitle={pageTitle}
          onMenuClick={handleMenuClick}
        />

        <main className="gc-page-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}