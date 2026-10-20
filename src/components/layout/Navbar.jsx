import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsuarioActual, logout } from "../../services/AuthService";
import { useDashboardAlertas } from "../layout/hooks/useDashboardAlertas";
import "../../styles/Navbar.css";

import icoBuscar from "../../assets/icons/buscar.png";
import icoAlerta from "../../assets/icons/alerta.png";

export default function Navbar({ collapsed, pageTitle, onMenuClick }) {
  const navigate = useNavigate();
  const usuario = getUsuarioActual();
  const nombre = usuario?.nombres || "Usuario";
  const rol = usuario?.rol || "Administrador";
  const inicial = nombre ? nombre.charAt(0).toUpperCase() : "U";

  const [busqueda, setBusqueda] = useState("");

  const { hayAlertas } = useDashboardAlertas();

  const rutasBusqueda = useMemo(
    () => [
      { path: "/dashboard", keywords: ["dashboard", "inicio", "panel", "resumen", "alertas", "estadisticas", "kpis"] },
      { path: "/ganado", keywords: ["ganado", "animales", "animal", "vacas", "toros", "bovinos"] },
      { path: "/reproduccion", keywords: ["reproduccion", "reproducción", "servicios", "partos", "gestacion", "gestación", "crias", "crías"] },
      { path: "/alimentacion", keywords: ["alimentacion", "alimentación", "raciones", "alimento", "comida", "suplementos"] },
      { path: "/inventario", keywords: ["inventario", "productos", "producto", "stock", "insumos", "medicamentos", "herramientas"] },
      { path: "/ventas", keywords: ["ventas", "facturas", "clientes", "comercial", "venta"] },
      { path: "/eventos", keywords: ["salud", "sanidad", "evento sanitario", "eventos sanitarios", "vacunas", "tratamientos", "controles"] },
      { path: "/pasturas", keywords: ["potreros", "potrero", "lotes", "pastoreo", "parcelas", "pasturas"] },
      { path: "/finanzas", keywords: ["cockpit", "finanzas", "financiero", "ingresos", "transacciones", "produccion", "producción", "leche"] },
      { path: "/configuracion/finca", keywords: ["configuracion", "configuración", "ajustes", "perfil", "usuario", "finca"] },
    ],
    []
  );

  const resolverRutaBusqueda = (texto) => {
    const query = texto.trim().toLowerCase();
    if (!query) return null;
    const encontrado = rutasBusqueda.find((item) =>
      item.keywords.some((keyword) => keyword.includes(query) || query.includes(keyword))
    );
    return encontrado?.path || null;
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    const ruta = resolverRutaBusqueda(busqueda);
    if (ruta) {
      navigate(ruta);
      return;
    }
    navigate("/dashboard", { state: { busquedaGlobal: busqueda.trim() } });
  };

  // logout() revoca la sesión en el backend, limpia el almacenamiento y redirige a /#/login
  const handleLogout = async () => {
    await logout();
  };

  const handleIrAlertas = () => {
    navigate("/dashboard");
  };

  return (
    <header className={`gc-navbar ${collapsed ? "sidebar-collapsed" : ""}`}>
      {/* Botón de menú hamburguesa (solo visible en móvil) */}
      <button className="gc-navbar__menu-btn" onClick={onMenuClick} aria-label="Menú">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className="gc-navbar__left">
        <span className="gc-navbar__page-title">{pageTitle || "GanaControl"}</span>
      </div>

      <div className="gc-navbar__right">
        <form className="gc-navbar__search" onSubmit={handleBuscar}>
          <img src={icoBuscar} alt="buscar" className="gc-navbar__search-icon" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="gc-navbar__search-input"
            placeholder="Buscar módulo..."
          />
        </form>

        <button className="gc-navbar__icon-btn" title="Ver alertas" onClick={handleIrAlertas} type="button">
          <img src={icoAlerta} alt="notificaciones" className="gc-navbar__icon-img" />
          {hayAlertas && <span className="gc-navbar__notif-dot" />}
        </button>

        <div className="gc-navbar__user" onClick={() => navigate("/configuracion/finca")}>
          <div className="gc-navbar__avatar">{inicial}</div>
          <div className="gc-navbar__user-info">
            <span className="gc-navbar__user-name">{nombre}</span>
            <span className="gc-navbar__user-role">{rol}</span>
          </div>
          <span className="gc-navbar__chevron">▾</span>
        </div>

        <button className="gc-btn gc-btn--ghost gc-btn--sm gc-navbar__logout" onClick={handleLogout} type="button">
          Salir
        </button>
      </div>
    </header>
  );
}