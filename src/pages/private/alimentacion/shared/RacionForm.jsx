import { TIPOS_ANIMAL } from "../alimentacion.constants";

function Field({ label, required, error, children }) {
  return (
    <div className="al-form-group">
      <label className="al-form-label">
        {label}
        {required && <span>*</span>}
      </label>
      {children}
      {error && <span className="al-form-error">{error}</span>}
    </div>
  );
}

export default function RacionForm({
  form,
  errors = {},
  onChange,
  esEdicion = false,
  animales = [],
  productos = [],
}) {
  const s = (k, v) => onChange(k, v);

  const animalesFiltrados = form.tipo_animal
    ? animales.filter(
        (a) =>
          a.tipo === form.tipo_animal ||
          a.tipo_animal === form.tipo_animal ||
          a.categoria === form.tipo_animal
      )
    : animales;

  const productosAlimento = productos.filter(
    (p) => String(p.tipo || "").toLowerCase() === "alimento"
  );

  return (
    <div className="al-form-grid">
      <div className="al-form-section-divider">Animal</div>

      <Field label="Tipo de Animal" required error={errors.tipo_animal}>
        <select
          className={`al-form-select${errors.tipo_animal ? " error" : ""}`}
          value={form.tipo_animal || ""}
          onChange={(e) => {
            s("tipo_animal", e.target.value);
            s("animal_id", "");
          }}
          disabled={esEdicion}
        >
          <option value="">Seleccionar tipo…</option>
          {TIPOS_ANIMAL.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Animal" required error={errors.animal_id}>
        <select
          className={`al-form-select${errors.animal_id ? " error" : ""}`}
          value={form.animal_id || ""}
          onChange={(e) => s("animal_id", e.target.value)}
          disabled={esEdicion || !form.tipo_animal}
        >
          <option value="">
            {!form.tipo_animal ? "Primero selecciona el tipo…" : "Seleccionar animal…"}
          </option>
          {animalesFiltrados.map((a) => (
            <option key={a.id} value={a.id}>
              {a.codigo} - {a.nombre || "Sin nombre"} - {a.raza || "Sin raza"}
            </option>
          ))}
        </select>
      </Field>

      <div className="al-form-section-divider">Alimento</div>

      <Field label="Producto Alimenticio" required error={errors.producto_id}>
        <select
          className={`al-form-select${errors.producto_id ? " error" : ""}`}
          value={form.producto_id || ""}
          onChange={(e) => s("producto_id", e.target.value)}
        >
          <option value="">Seleccionar alimento…</option>
          {productosAlimento.map((p) => (
            <option
              key={p.id}
              value={p.id}
              disabled={Number(p.cantidad_actual || 0) <= 0}
            >
              {p.nombre}
              {p.cantidad_actual != null ? ` - Stock: ${p.cantidad_actual}` : ""}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Cantidad (kg)" required error={errors.cantidad_kg}>
        <input
          className={`al-form-input${errors.cantidad_kg ? " error" : ""}`}
          type="number"
          min="0"
          step="0.1"
          placeholder="Ej: 5.5"
          value={form.cantidad_kg || ""}
          onChange={(e) => s("cantidad_kg", e.target.value)}
        />
      </Field>

      <Field label="Frecuencia" required error={errors.frecuencia}>
        <select
          className={`al-form-select${errors.frecuencia ? " error" : ""}`}
          value={form.frecuencia || ""}
          onChange={(e) => s("frecuencia", e.target.value)}
        >
          <option value="">Seleccionar frecuencia...</option>
          <option value="Diaria">Diaria</option>
          <option value="Dos_veces_al_dia">Dos veces al día</option>
          <option value="Semanal">Semanal</option>
          <option value="Quincenal">Quincenal</option>
          <option value="Mensual">Mensual</option>
        </select>
      </Field>

      <div className="al-form-section-divider">Fecha y Notas</div>

      <Field label="Fecha de Registro" required error={errors.fecha_registro}>
        <input
          className={`al-form-input${errors.fecha_registro ? " error" : ""}`}
          type="date"
          value={form.fecha_registro || ""}
          onChange={(e) => s("fecha_registro", e.target.value)}
        />
      </Field>

      <Field label="Observaciones" error={errors.observaciones}>
        <textarea
          className="al-form-textarea"
          placeholder="Notas adicionales..."
          value={form.observaciones || ""}
          onChange={(e) => s("observaciones", e.target.value)}
          rows={3}
        />
      </Field>
    </div>
  );
}