import { useEffect, useState } from "react";
import RacionForm from "../shared/RacionForm";
import { ganadoService } from "../../../../services/ganado.service";
import { inventarioService } from "../../../../services/inventario.service";

const EMPTY = {
  tipo_animal: "",
  animal_id: "",
  producto_id: "",
  cantidad_kg: "",
  frecuencia: "",
  fecha_registro: new Date().toISOString().split("T")[0],
  observaciones: "",
};

const validate = (f) => {
  const e = {};

  if (!f.tipo_animal) e.tipo_animal = "El tipo de animal es requerido";
  if (!f.animal_id) e.animal_id = "El animal es requerido";
  if (!f.producto_id) e.producto_id = "Debe seleccionar un alimento";

  if (!f.cantidad_kg) e.cantidad_kg = "La cantidad es requerida";
  else if (Number(f.cantidad_kg) <= 0) e.cantidad_kg = "La cantidad debe ser mayor que 0";

  if (!f.frecuencia) e.frecuencia = "La frecuencia es requerida";
  if (!f.fecha_registro) e.fecha_registro = "La fecha es requerida";

  return e;
};

const validarStockDisponible = (form, productos) => {
  const producto = productos.find(
    (p) => String(p.id) === String(form.producto_id)
  );

  if (!producto) return null;

  const stockDisponible = Number(producto.cantidad_actual || 0);
  const cantidadSolicitada = Number(form.cantidad_kg || 0);

  if (cantidadSolicitada > stockDisponible) {
    return {
      cantidad_kg: `Stock insuficiente. Disponible: ${stockDisponible} kg. Solicitado: ${cantidadSolicitada} kg.`,
    };
  }

  return null;
};

export default function ModalNuevaRacion({ onClose, onGuardar }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [animales, setAnimales] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoadingData(true);

        const [listaAnimales, listaProductos] = await Promise.all([
          ganadoService.listar(),
          inventarioService.getProductos(),
        ]);

        setAnimales(Array.isArray(listaAnimales) ? listaAnimales : []);
        setProductos(Array.isArray(listaProductos) ? listaProductos : []);
      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setLoadingData(false);
      }
    };

    cargar();
  }, []);

  const handleChange = (k, v) => {
    setForm((prev) => ({ ...prev, [k]: v }));
    setErrors((prev) => ({ ...prev, [k]: "" }));
  };

  const mapearErroresBackend = (listaErrores = []) => {
    const nuevos = {};

    listaErrores.forEach((err) => {
      const campo = err?.campo;
      const mensaje = err?.mensaje || "Valor inválido";

      if (!campo) return;

      if (campo === "ganado_id") nuevos.animal_id = mensaje;
      else if (campo === "cantidad") nuevos.cantidad_kg = mensaje;
      else if (campo === "fecha") nuevos.fecha_registro = mensaje;
      else if (campo === "observacion") nuevos.observaciones = mensaje;
      else nuevos[campo] = mensaje;
    });

    return nuevos;
  };

  const handleGuardar = async () => {
    const erroresFront = validate(form);

    if (Object.keys(erroresFront).length) {
      setErrors(erroresFront);
      return;
    }

    const errorStock = validarStockDisponible(form, productos);

    if (errorStock) {
      setErrors((prev) => ({ ...prev, ...errorStock }));
      return;
    }

    setLoading(true);

    try {
      await onGuardar(form);
    } catch (err) {
      console.error("Error guardando ración:", err);

      if (Array.isArray(err?.errores) && err.errores.length) {
        const nuevos = mapearErroresBackend(err.errores);
        setErrors((prev) => ({ ...prev, ...nuevos }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="al-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="al-modal">
        <div className="al-modal__header">
          <div>
            <div className="al-modal__title">Nueva Ración</div>
            <div className="al-modal__subtitle">Registrar alimentación de un animal</div>
          </div>
          <button className="al-modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="al-modal__body">
          {loadingData ? (
            <p>Cargando datos...</p>
          ) : (
            <RacionForm
              form={form}
              errors={errors}
              onChange={handleChange}
              animales={animales}
              productos={productos}
            />
          )}
        </div>

        <div className="al-modal__footer">
          <button
            className="al-btn al-btn--secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            className="al-btn al-btn--primary"
            onClick={handleGuardar}
            disabled={loading || loadingData}
          >
            {loading ? "⏳ Guardando…" : "✅ Guardar Ración"}
          </button>
        </div>
      </div>
    </div>
  );
}