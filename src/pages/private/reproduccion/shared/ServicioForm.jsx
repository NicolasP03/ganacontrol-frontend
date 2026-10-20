import { TIPOS_SERVICIO, ESTADOS_REPRODUCCION } from "../reproduccion.constants";

function Field({ label, required, error, children }) {
  return (
    <div className="rp-form-group">
      <label className="rp-form-label">
        {label}
        {required && <span>*</span>}
      </label>
      {children}
      {error && <span className="rp-form-error">{error}</span>}
    </div>
  );
}

export default function ServicioForm({
  form,
  errors = {},
  onChange,
  esEdicion = false,
  vacas = [],
  toros = [],
}) {
  const s = (k, v) => onChange(k, v);
  const esMonta = form.tipo_servicio === "Monta_Natural";

  return (
    <div className="rp-form-grid">
      <div className="rp-form-section-divider">Identificación</div>

      <Field label="Vaca" required error={errors.vaca_id}>
        <select
          className={`rp-form-select${errors.vaca_id ? " error" : ""}`}
          value={form.vaca_id || ""}
          onChange={(e) => s("vaca_id", e.target.value)}
          disabled={esEdicion}
        >
          <option value="">Seleccionar vaca…</option>
          {vacas.map((v) => (
            <option key={v.id} value={v.id}>
              {v.codigo} - {v.nombre || "Sin nombre"} - {v.raza || "Sin raza"}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Tipo de Servicio" required error={errors.tipo_servicio}>
        <select
          className={`rp-form-select${errors.tipo_servicio ? " error" : ""}`}
          value={form.tipo_servicio || ""}
          onChange={(e) => s("tipo_servicio", e.target.value)}
        >
          <option value="">Seleccionar…</option>
          {TIPOS_SERVICIO.map((t) => (
            <option key={t} value={t}>
              {t.replace("_", " ")}
            </option>
          ))}
        </select>
      </Field>

      {esMonta ? (
        <Field label="Toro" error={errors.toro_id}>
          <select
            className={`rp-form-select${errors.toro_id ? " error" : ""}`}
            value={form.toro_id || ""}
            onChange={(e) => s("toro_id", e.target.value)}
          >
            <option value="">Seleccionar toro…</option>
            {toros.map((t) => (
              <option key={t.id} value={t.id}>
                {t.codigo} - {t.nombre || "Sin nombre"} - {t.raza || "Sin raza"}
              </option>
            ))}
          </select>
        </Field>
      ) : (
        <Field label="Proveedor Genético">
          <input
            className="rp-form-input"
            placeholder="Nombre del proveedor"
            value={form.proveedor_genetico || ""}
            onChange={(e) => s("proveedor_genetico", e.target.value)}
          />
        </Field>
      )}

      <Field label="Estado" required>
        <select
          className="rp-form-select"
          value={form.estado || "Pendiente"}
          onChange={(e) => s("estado", e.target.value)}
        >
          {ESTADOS_REPRODUCCION.map((estado) => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </select>
      </Field>

      <div className="rp-form-section-divider">Fechas</div>

      <Field label="Fecha de Servicio" required error={errors.fecha_servicio}>
        <input
          className={`rp-form-input${errors.fecha_servicio ? " error" : ""}`}
          type="date"
          value={form.fecha_servicio || ""}
          onChange={(e) => s("fecha_servicio", e.target.value)}
        />
      </Field>

      <Field label="Fecha Probable de Parto">
        <input
          className="rp-form-input"
          type="date"
          value={form.fecha_probable_parto || ""}
          onChange={(e) => s("fecha_probable_parto", e.target.value)}
        />
      </Field>

      <Field label="Fecha Real de Parto">
        <input
          className="rp-form-input"
          type="date"
          value={form.fecha_parto || ""}
          onChange={(e) => s("fecha_parto", e.target.value)}
        />
      </Field>

      <Field label="Código de Cría">
        <input
          className="rp-form-input"
          placeholder="Ej: 003"
          value={form.cria_codigo || ""}
          onChange={(e) => s("cria_codigo", e.target.value)}
        />
      </Field>
    </div>
  );
}