import { useEffect, useState } from "react";
import RacionForm from "../shared/RacionForm";
import { ganadoService } from "../../../../services/ganado.service";
import { inventarioService } from "../../../../services/inventario.service";

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

const validarStockDisponible = (form, productos, registroOriginal) => {
  const producto = productos.find(
    (p) => String(p.id) === String(form.producto_id)
  );

  if (!producto) return null;

  const stockActual = Number(producto.cantidad_actual || 0);
  const cantidadNueva = Number(form.cantidad_kg || 0);

  const mismoProducto =
    String(form.producto_id) === String(registroOriginal.producto_id);

  const cantidadAnterior = Number(registroOriginal.cantidad_kg || 0);

  const stockDisponibleReal = mismoProducto
    ? stockActual + cantidadAnterior
    : stockActual;

  if (cantidadNueva > stockDisponibleReal) {
    return {
      cantidad_kg: `Stock insuficiente. Disponible: ${stockDisponibleReal} kg. Solicitado: ${cantidadNueva} kg.`,
    };
  }

  return null;
};

export default function ModalEditarRacion({ registro, onClose, onGuardar }) {
  const [form, setForm] = useState({ ...registro });
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

  useEffect(() => {
    setForm({ ...registro });
    setErrors({});
  }, [registro]);

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
  // 1. Validación normal del formulario
  const erroresFront = validate(form);

  if (Object.keys(erroresFront).length) {
    setErrors(erroresFront);
    return;
  }

  // 2. Validación de stock disponible
  const errorStock = validarStockDisponible(form, productos, registro);

  if (errorStock) {
    setErrors((prev) => ({ ...prev, ...errorStock }));
    return;
  }

  setLoading(true);

  try {
    await onGuardar(form);
  } catch (err) {
    console.error("Error actualizando ración:", err);
    console.error("Mensaje:", err?.mensaje);
    console.error("Errores completos:", JSON.stringify(err?.errores, null, 2));

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
            <div className="al-modal__title">Editar Ración</div>
            <div
              className="al-modal__subtitle"
              style={{ fontFamily: "monospace", fontSize: "0.72rem" }}
            >
              ID #{registro.id}
            </div>
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
              esEdicion={false}
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
            {loading ? "⏳ Guardando…" : "💾 Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}