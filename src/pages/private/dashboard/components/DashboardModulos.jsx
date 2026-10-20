// DashboardModulos.jsx
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getUsuarioActual } from "../../../../services/AuthService";
import { obtenerModulosPermitidos } from "../../../../services/dashboard.service";
import "../../../../styles/modules/Dashboard.css";

export default function DashboardModulos({ modulos = [] }) {
  const navigate = useNavigate();
  const usuario = getUsuarioActual();

  const modulosPermitidos = useMemo(() => {
    const base = modulos.length > 0 ? modulos : obtenerModulosPermitidos(usuario);

    return base.filter((modulo) => {
      if (!modulo.permiso) return true;
      if (usuario?.rol === "Administrador") return true;

      const permisos = usuario?.permisos || [];
      return permisos.includes(modulo.permiso);
    });
  }, [modulos, usuario]);

  if (!modulosPermitidos.length) {
    return (
      <div className="db-section">
        <div className="db-section-label">Acceso rápido a módulos</div>

        <div className="db-empty-card">
          <strong>Sin módulos disponibles</strong>
          <span>No tienes permisos asignados para acceder a módulos del sistema.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="db-section">
      <div className="db-section-label">Acceso rápido a módulos</div>

      <div className="db-modulos">
        {modulosPermitidos.map((m) => (
          <button
            key={m.href}
            className="db-modulo"
            onClick={() => navigate(m.href)}
            type="button"
          >
            <div className="db-modulo__ico-wrap">
              <img src={m.img} alt={m.label} className="db-modulo__ico" />
            </div>

            <span className="db-modulo__label">{m.label}</span>
            <span className="db-modulo__desc">{m.desc}</span>
            <span className="db-modulo__arrow">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}