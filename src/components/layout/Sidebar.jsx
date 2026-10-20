import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../services/AuthService";
import "./Sidebar.css";

const menu = [
  {
    label: "Principal",
    items: [
      { to: "/dashboard", icon: "⊞", label: "Dashboard" },
    ],
  },
  {
    label: "Ganadería",
    items: [
      { to: "/ganado",       icon: "🐄", label: "Ganado" },
      { to: "/reproduccion", icon: "🧬", label: "Reproducción" },
      { to: "/eventos",      icon: "💉", label: "Sanidad" },
    ],
  },
  {
    label: "Operaciones",
    items: [
      { to: "/inventario",   icon: "📦", label: "Inventario" },
      { to: "/alimentacion", icon: "🌾", label: "Alimentación" },
      { to: "/ventas",     icon: "💰", label: "Ventas" },
    ],
  },
  {
    label: "Reportes",
    items: [
      { to: "/reportes/ganado",   icon: "📋", label: "Rep. Ganado" },
      { to: "/reportes/ingresos", icon: "📈", label: "Rep. Ingresos" },
      { to: "/reportes/stock",    icon: "📊", label: "Rep. Stock" },
    ],
  },
  {
    label: "Configuración",
    items: [
      { to: "/configuracion/finca",    icon: "🏡", label: "Finca" },
      { to: "/configuracion/usuarios", icon: "👤", label: "Usuarios" },
      { to: "/configuracion/roles",    icon: "🛡️", label: "Roles" },
    ],
  },
];

export default function Sidebar() {
  const navigate  = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className={`gc-sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Header */}
      <div className="gc-sb-header">
        <div className="gc-sb-logo">
          <div className="gc-sb-shield">🐂</div>
          {!collapsed && (
            <div>
              <span className="gc-sb-brand">GanaControl</span>
              <span className="gc-sb-subbrand">Gestión Ganadera</span>
            </div>
          )}
        </div>
        <button
          className="gc-sb-toggle"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expandir" : "Colapsar"}
        >
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      {/* Nav */}
      <nav className="gc-sb-nav">
        {menu.map((group) => (
          <div key={group.label} className="gc-sb-group">
            {!collapsed && (
              <span className="gc-sb-group-label">{group.label}</span>
            )}
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `gc-sb-link ${isActive ? "active" : ""}`
                }
                title={collapsed ? item.label : ""}
              >
                <span className="gc-sb-icon">{item.icon}</span>
                {!collapsed && (
                  <span className="gc-sb-link-label">{item.label}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="gc-sb-footer">
        <button className="gc-sb-logout" onClick={handleLogout}>
          <span className="gc-sb-icon">⏻</span>
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
}