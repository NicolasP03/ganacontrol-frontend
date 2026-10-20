import { useEffect, useState } from "react";
import { getSistema } from "../../../../services/ConfiguracionService";
import { SISTEMA_ICONOS } from "../configuracion.constants";
import { notify } from "../../../../services/notify.service";
import { getErrorMessage } from "../../../../utils/handleRequest";

export function ConfigSistema() {
  const [sistema, setSistema] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getSistema();
        setSistema(Array.isArray(data) ? data : []);
      } catch (e) {
        setSistema([]);
        notify.error(getErrorMessage(e) || "No se pudo cargar el estado del sistema");
      }
    };

    cargar();
  }, []);

  return (
    <div className="gc-card cfg-card-section">
      <div className="cfg-card-section__head">
        <span className="cfg-section-icon">🖥️</span>
        <h3 className="cfg-section-title">Estado del Sistema</h3>
      </div>

      <div className="cfg-sistema-list">
        {sistema.map(({ clave, valor }) => (
          <div key={clave} className="cfg-sistema-row">
            <span className="cfg-sistema-icon">{SISTEMA_ICONOS[clave] ?? "⚙️"}</span>
            <span className="cfg-sistema-clave">{clave}</span>
            <span className="cfg-sistema-valor">{valor}</span>
          </div>
        ))}

        {sistema.length === 0 && (
          <div className="cfg-empty">No se pudo cargar el estado del sistema</div>
        )}
      </div>
    </div>
  );
}