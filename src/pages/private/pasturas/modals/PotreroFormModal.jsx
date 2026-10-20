import { useState } from "react";
import { FORM_INICIAL_POTRERO, POTRERO_ESTADOS } from "../potrero.constants";

export default function PotreroFormModal({
  open,
  modo = "crear",
  initialData = null,
  onClose,
  onSubmit,
  loading = false,
}) {
  const [form, setForm] = useState(() =>
    initialData
      ? {
          nombre: initialData.nombre ?? "",
          hectareas: initialData.hectareas ?? "",
          tipo_pasto: initialData.tipo_pasto ?? "",
          capacidad_animales: initialData.capacidad_animales ?? "",
          estado: initialData.estado ?? "Disponible",
        }
      : FORM_INICIAL_POTRERO
  );
  const [errores, setErrores] = useState({});

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: "" }));
  };

  const validar = () => {
    const nuevo = {};

    if (!form.nombre.trim()) nuevo.nombre = "El nombre es obligatorio.";

    if (form.hectareas !== "" && Number(form.hectareas) < 0) {
      nuevo.hectareas = "Las hectáreas no pueden ser negativas.";
    }

    if (form.capacidad_animales !== "" && Number(form.capacidad_animales) < 0) {
      nuevo.capacidad_animales = "La capacidad no puede ser negativa.";
    }

    setErrores(nuevo);
    return Object.keys(nuevo).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validar()) return;
    onSubmit(form);
  };

  return (
    <div className="pt-modal-backdrop">
      <div className="pt-modal">
        <div className="pt-modal__header">
          <div>
            <h3>{modo === "editar" ? "Editar potrero" : "Nuevo potrero"}</h3>
            <p>Completa la información del potrero.</p>
          </div>
          <button className="pt-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="pt-modal__body pt-form-grid">
            <div className="pt-form-group">
              <label>Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className={errores.nombre ? "error" : ""}
              />
              {errores.nombre && <small>{errores.nombre}</small>}
            </div>

            <div className="pt-form-group">
              <label>Hectáreas</label>
              <input
                type="number"
                min="0"
                step="0.01"
                name="hectareas"
                value={form.hectareas}
                onChange={handleChange}
                className={errores.hectareas ? "error" : ""}
              />
              {errores.hectareas && <small>{errores.hectareas}</small>}
            </div>

            <div className="pt-form-group">
              <label>Tipo de pasto</label>
              <input
                type="text"
                name="tipo_pasto"
                value={form.tipo_pasto}
                onChange={handleChange}
              />
            </div>

            <div className="pt-form-group">
              <label>Capacidad de animales</label>
              <input
                type="number"
                min="0"
                step="1"
                name="capacidad_animales"
                value={form.capacidad_animales}
                onChange={handleChange}
                className={errores.capacidad_animales ? "error" : ""}
              />
              {errores.capacidad_animales && <small>{errores.capacidad_animales}</small>}
            </div>

            <div className="pt-form-group">
              <label>Estado</label>
              <select name="estado" value={form.estado} onChange={handleChange}>
                {POTRERO_ESTADOS.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-modal__footer">
            <button type="button" className="pt-btn pt-btn--ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="pt-btn pt-btn--primary" disabled={loading}>
              {loading ? "Guardando..." : modo === "editar" ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}