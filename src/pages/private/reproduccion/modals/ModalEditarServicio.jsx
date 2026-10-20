import { useEffect, useState } from "react";
import ServicioForm from "../shared/ServicioForm";
import { ganadoService } from "../../../../services/ganado.service";

const validate = (f) => {
  const e = {};

  if (!f.vaca_id) {
    e.vaca_id = "La vaca es requerida";
  }

  if (!f.tipo_servicio) {
    e.tipo_servicio = "El tipo es requerido";
  }

  if (!f.fecha_servicio) {
    e.fecha_servicio = "La fecha es requerida";
  }

  if (f.tipo_servicio === "Monta_Natural" && !f.toro_id) {
    e.toro_id = "Debes seleccionar un toro";
  }

  return e;
};

export default function ModalEditarServicio({ registro, onClose, onGuardar }) {
  const [form, setForm] = useState({
    ...registro,
    vaca_id: registro?.vaca_id || "",
    toro_id: registro?.toro_id || "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [ganado, setGanado] = useState([]);
  const [loadingGanado, setLoadingGanado] = useState(true);

  useEffect(() => {
    const cargarGanado = async () => {
      try {
        setLoadingGanado(true);
        const lista = await ganadoService.listar();
        setGanado(lista);
      } catch (error) {
        console.error("Error cargando ganado:", error);
      } finally {
        setLoadingGanado(false);
      }
    };

    cargarGanado();
  }, []);

  const vacas = ganado.filter((g) => g.sexo === "Hembra");
  const toros = ganado.filter((g) => g.sexo === "Macho");

  const handleChange = (k, v) => {
    setForm((prev) => {
      const next = { ...prev, [k]: v };

      if (k === "tipo_servicio") {
        if (v === "Monta_Natural") {
          next.proveedor_genetico = "";
        }
        if (v === "Inseminacion") {
          next.toro_id = "";
        }
      }

      return next;
    });

    setErrors((prev) => ({ ...prev, [k]: "" }));
  };

  const handleGuardar = async () => {
    const e = validate(form);
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setLoading(true);
    try {
      await onGuardar(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rp-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="rp-modal">
        <div className="rp-modal__header">
          <div>
            <div className="rp-modal__title">Editar Servicio</div>
            <div
              className="rp-modal__subtitle"
              style={{ fontFamily: "monospace", fontSize: "0.72rem" }}
            >
              ID #{registro.id} · {registro.vaca?.nombre || `Vaca ${registro.vaca_id}`}
            </div>
          </div>

          <button className="rp-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="rp-modal__body">
          {loadingGanado ? (
            <p>Cargando ganado...</p>
          ) : (
            <ServicioForm
              form={form}
              errors={errors}
              onChange={handleChange}
              esEdicion
              vacas={vacas}
              toros={toros}
            />
          )}
        </div>

        <div className="rp-modal__footer">
          <button
            className="rp-btn rp-btn--secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            className="rp-btn rp-btn--primary"
            onClick={handleGuardar}
            disabled={loading || loadingGanado}
          >
            {loading ? "⏳ Guardando…" : "💾 Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}