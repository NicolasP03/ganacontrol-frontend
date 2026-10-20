import { useState } from "react";
import { ganadoService } from "../../../../services/ganado.service";
import { notify } from "../../../../services/notify.service";
import { getErrorMessage } from "../../../../utils/handleRequest";

const OPCIONES = [
  { fmt: "csv", label: "CSV", ico: "📄", desc: "Valores separados por coma. Compatible con Excel y Sheets." },
  { fmt: "excel", label: "Excel", ico: "📊", desc: "Libro de Excel (.xlsx) con formato." },
  { fmt: "pdf", label: "PDF", ico: "🗒️", desc: "Reporte imprimible en PDF." },
  { fmt: "json", label: "JSON", ico: "💾", desc: "Datos estructurados para integraciones." },
];

export default function ModalExportar({ animales = [], onClose }) {
  const [loading, setLoading] = useState(null);

  const handleExport = async (fmt) => {
    try {
      setLoading(fmt);

      if (!animales.length) {
        notify.error("No hay registros para exportar");
        return;
      }

      await ganadoService.exportar(fmt, animales);
      notify.success(`${fmt.toUpperCase()} exportado — ${animales.length} registros`);
    } catch (err) {
      notify.error(getErrorMessage(err) || `No se pudo exportar en ${fmt}`);
    } finally {
      setLoading(null);
      onClose();
    }
  };

  return (
    <div
      className="gc-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="gc-modal gc-modal--md">
        <div className="gc-modal__header">
          <div>
            <div className="gc-modal__title">Exportar Inventario</div>
            <div className="gc-modal__subtitle">
              {animales.length} registros listos para exportar
            </div>
          </div>

          <button className="gc-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="gc-modal__body">
          <div className="gc-export-opts">
            {OPCIONES.map((o) => (
              <button
                key={o.fmt}
                type="button"
                className="gc-export-opt"
                onClick={() => handleExport(o.fmt)}
                disabled={Boolean(loading)}
              >
                <div className="gc-export-opt__ico">
                  {loading === o.fmt ? "⏳" : o.ico}
                </div>

                <div>
                  <div className="gc-export-opt__name">{o.fmt}</div>
                  <div className="gc-export-opt__desc">{o.desc}</div>
                </div>

                <span className="gc-export-opt__arrow">→</span>
              </button>
            ))}
          </div>
        </div>

        <div className="gc-modal__footer">
          <button
            className="gc-btn gc-btn--secondary"
            onClick={onClose}
            disabled={Boolean(loading)}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}