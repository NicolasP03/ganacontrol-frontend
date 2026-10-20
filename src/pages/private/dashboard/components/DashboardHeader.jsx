// DashboardHeader.jsx
import "../../../../styles/modules/Dashboard.css";

export default function DashboardHeader({ saludo, nombre, fecha, finca, inicial, rol }) {
  return (
    <div className="db-header">
      <div className="db-header__left">
        <p className="db-header__saludo">{saludo},</p>
        <h1 className="db-header__nombre">{nombre}</h1>
        <p className="db-header__fecha">
          Finca <strong>{finca}</strong> — {fecha}
        </p>
      </div>

      <div className="db-header__perfil">
        <div className="db-header__avatar">{inicial}</div>
        <div className="db-header__perfil-info">
          <span className="db-header__perfil-nombre">{nombre}</span>
          <span className="db-header__perfil-rol">{rol}</span>
          <span className="db-header__perfil-finca">{finca}</span>
        </div>
      </div>
    </div>
  );
}