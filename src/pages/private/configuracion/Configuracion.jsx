import { useEffect, useState } from "react";
import { ConfiguracionTabs } from "./ui/ConfiguracionTabs";
import { ConfigFinca } from "./components/ConfigFinca";
import { ConfigUsuarios } from "./components/ConfigUsuarios";
import { ConfigRoles } from "./components/ConfigRoles";
import { ConfigSistema } from "./components/ConfigSistema";
import { getRolActual } from "../../../services/ConfiguracionService";
import "../../../styles/modules/Modulos.css";
import "../../../styles/modules/ConfiguracionRoles.css";

export default function Configuracion() {
  const [tab, setTab] = useState("Finca");
  const [esAdmin, setEsAdmin] = useState(false);

  useEffect(() => {
    const cargarRol = async () => {
      try {
        const rol = await getRolActual();
        setEsAdmin(rol === "Administrador");
      } catch {
        setEsAdmin(false);
      }
    };

    cargarRol();
  }, []);

  const VIEWS = {
    Finca: <ConfigFinca esAdmin={esAdmin} />,
    Usuarios: <ConfigUsuarios esAdmin={esAdmin} />,
    Roles: <ConfigRoles esAdmin={esAdmin} />,
    Sistema: <ConfigSistema />,
  };

  return (
    <div className="gc-animate-in">
      <div className="cfg-page-header">
        <div>
          <h1 className="gc-page-title">Configuración</h1>
          <p className="gc-page-sub">
            Administre la información de la finca, usuarios y roles del sistema.
          </p>
        </div>

        {esAdmin && (
          <div className="cfg-header-badge">
            <span className="cfg-header-badge__dot" />
            🛡️ Modo Administrador
          </div>
        )}
      </div>

      <ConfiguracionTabs tab={tab} setTab={setTab} />

      <div className="cfg-tab-content">{VIEWS[tab]}</div>
    </div>
  );
}