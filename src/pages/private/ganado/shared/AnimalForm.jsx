import {
  RAZAS,
  CATEGORIAS_GANADO,
  ESTADOS_GENERALES,
  ESTADOS_BIOLOGICOS,
  ESTADOS_COMERCIALES,
} from "../ganado.constants";
import useCatalogos from "../hooks/useCatalogos";

const ESTADOS_SALUD = [
  "Sano",
  "En observacion",
  "Enfermo",
  "En tratamiento",
  "Recuperacion",
];

const ESTADOS_REPRODUCTIVOS = [
  "No aplica",
  "Vacia",
  "Servida",
  "Preñada",
  "Proxima al parto",
  "Lactando",
  "Seca",
];

const ORIGENES = [
  "Nacimiento en finca",
  "Compra",
  "Traslado",
  "Otro",
];

const ESTADOS_PRODUCTIVOS = [
  "Cria",
  "Levante",
  "Ceba",
  "Lechero",
  "Reproduccion",
  "Descarte",
];

function Field({ label, required, error, children, full = false }) {
  return (
    <div className={`gc-form-group${full ? " gc-form-full" : ""}`}>
      <label className="gc-form-label">
        {label}
        {required && <span>*</span>}
      </label>
      {children}
      {error && <span className="gc-form-error">{error}</span>}
    </div>
  );
}

export default function AnimalForm({ form, errors = {}, onChange }) {
  const { potreros, animales } = useCatalogos();
  const otros = animales.filter((a) => String(a.id) !== String(form.id ?? ""));
  const hembras = otros.filter((a) => a.sexo === "Hembra");
  const machos = otros.filter((a) => a.sexo === "Macho");
  const etiqueta = (a) => [a.codigo, a.nombre].filter(Boolean).join(" · ");
  const s = (k, v) => onChange(k, v);

  const preview = form.foto_preview || form.foto || "";

  return (
    <div className="gc-form-grid">
      <div className="gc-form-section-divider">Identificación</div>

      <Field label="Código" required error={errors.codigo}>
        <input
          className={`gc-form-input${errors.codigo ? " error" : ""}`}
          placeholder="Ej: GN-001"
          value={form.codigo || ""}
          onChange={(e) => s("codigo", e.target.value)}
        />
      </Field>

      <Field label="Nombre" error={errors.nombre}>
        <input
          className={`gc-form-input${errors.nombre ? " error" : ""}`}
          placeholder="Ej: La Negra"
          value={form.nombre || ""}
          onChange={(e) => s("nombre", e.target.value)}
        />
      </Field>

      <Field label="Sexo" required error={errors.sexo}>
        <select
          className={`gc-form-select${errors.sexo ? " error" : ""}`}
          value={form.sexo || ""}
          onChange={(e) => s("sexo", e.target.value)}
        >
          <option value="">Seleccione...</option>
          <option value="Hembra">Hembra</option>
          <option value="Macho">Macho</option>
        </select>
      </Field>

      <Field label="Categoría" required error={errors.categoria}>
        <select
          className={`gc-form-select${errors.categoria ? " error" : ""}`}
          value={form.categoria || ""}
          onChange={(e) => s("categoria", e.target.value)}
        >
          <option value="">Seleccione...</option>
          {CATEGORIAS_GANADO.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Raza" error={errors.raza}>
        <select
          className={`gc-form-select${errors.raza ? " error" : ""}`}
          value={form.raza || ""}
          onChange={(e) => s("raza", e.target.value)}
        >
          <option value="">Seleccione...</option>
          {RAZAS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Foto del animal" error={errors.foto}>
        <input
          className={`gc-form-input${errors.foto ? " error" : ""}`}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            s("foto", file);
            s("foto_preview", file ? URL.createObjectURL(file) : "");
          }}
        />
        <div className="gc-form-help">
          Formatos permitidos: JPG, JPEG, PNG, WEBP. Máximo 2MB.
        </div>

        {preview && (
          <div className="gc-form-preview">
            <img
              src={preview}
              alt="Vista previa"
              className="gc-form-preview__img"
            />
          </div>
        )}
      </Field>

      <div className="gc-form-section-divider">Datos físicos</div>

      <Field label="Fecha de nacimiento" error={errors.fecha_nacimiento}>
        <input
          className={`gc-form-input${errors.fecha_nacimiento ? " error" : ""}`}
          type="date"
          value={form.fecha_nacimiento || ""}
          onChange={(e) => s("fecha_nacimiento", e.target.value)}
        />
      </Field>

      <Field label="Peso actual (kg)" error={errors.peso_actual}>
        <input
          className={`gc-form-input${errors.peso_actual ? " error" : ""}`}
          type="number"
          min="0"
          step="0.01"
          placeholder="Ej: 380"
          value={form.peso_actual ?? form.peso ?? ""}
          onChange={(e) => s("peso_actual", e.target.value)}
        />
      </Field>

      <Field label="Fecha de ingreso" error={errors.fecha_ingreso}>
        <input
          className={`gc-form-input${errors.fecha_ingreso ? " error" : ""}`}
          type="date"
          value={form.fecha_ingreso || ""}
          onChange={(e) => s("fecha_ingreso", e.target.value)}
        />
      </Field>

      <Field label="Origen" error={errors.origen}>
        <select
          className={`gc-form-select${errors.origen ? " error" : ""}`}
          value={form.origen || "Nacimiento en finca"}
          onChange={(e) => s("origen", e.target.value)}
        >
          {ORIGENES.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Potrero" error={errors.potrero_id}>
        <select
          className={`gc-form-input${errors.potrero_id ? " error" : ""}`}
          value={form.potrero_id || ""}
          onChange={(e) => s("potrero_id", e.target.value)}
        >
          <option value="">Sin potrero</option>
          {potreros.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Madre" error={errors.madre_id}>
        <select
          className={`gc-form-input${errors.madre_id ? " error" : ""}`}
          value={form.madre_id || ""}
          onChange={(e) => s("madre_id", e.target.value)}
        >
          <option value="">Sin registrar</option>
          {hembras.map((a) => (
            <option key={a.id} value={String(a.id)}>
              {etiqueta(a)}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Padre" error={errors.padre_id}>
        <select
          className={`gc-form-input${errors.padre_id ? " error" : ""}`}
          value={form.padre_id || ""}
          onChange={(e) => s("padre_id", e.target.value)}
        >
          <option value="">Sin registrar</option>
          {machos.map((a) => (
            <option key={a.id} value={String(a.id)}>
              {etiqueta(a)}
            </option>
          ))}
        </select>
      </Field>

      <div className="gc-form-section-divider">Estados</div>

      <Field label="Estado general" required error={errors.estado_general}>
        <select
          className={`gc-form-select${errors.estado_general ? " error" : ""}`}
          value={form.estado_general || "Activo"}
          onChange={(e) => s("estado_general", e.target.value)}
        >
          {ESTADOS_GENERALES.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Estado biológico" required error={errors.estado_biologico}>
        <select
          className={`gc-form-select${errors.estado_biologico ? " error" : ""}`}
          value={form.estado_biologico || "Vivo"}
          onChange={(e) => s("estado_biologico", e.target.value)}
        >
          {ESTADOS_BIOLOGICOS.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Estado comercial" required error={errors.estado_comercial}>
        <select
          className={`gc-form-select${errors.estado_comercial ? " error" : ""}`}
          value={form.estado_comercial || "Disponible"}
          onChange={(e) => s("estado_comercial", e.target.value)}
        >
          {ESTADOS_COMERCIALES.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Estado de salud" error={errors.estado_salud}>
        <select
          className={`gc-form-select${errors.estado_salud ? " error" : ""}`}
          value={form.estado_salud || "Sano"}
          onChange={(e) => s("estado_salud", e.target.value)}
        >
          {ESTADOS_SALUD.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Estado reproductivo" error={errors.estado_reproductivo}>
        <select
          className={`gc-form-select${errors.estado_reproductivo ? " error" : ""}`}
          value={form.estado_reproductivo || "No aplica"}
          onChange={(e) => s("estado_reproductivo", e.target.value)}
        >
          {ESTADOS_REPRODUCTIVOS.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Estado productivo" error={errors.estado_productivo}>
        <select
          className={`gc-form-select${errors.estado_productivo ? " error" : ""}`}
          value={form.estado_productivo || ""}
          onChange={(e) => s("estado_productivo", e.target.value)}
        >
          <option value="">Seleccione...</option>
          {ESTADOS_PRODUCTIVOS.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </Field>

      <div className="gc-form-section-divider">Reproducción</div>

      <Field label="Número de partos" error={errors.numero_partos}>
        <input
          className={`gc-form-input${errors.numero_partos ? " error" : ""}`}
          type="number"
          min="0"
          placeholder="Ej: 0"
          value={form.numero_partos ?? ""}
          onChange={(e) => s("numero_partos", e.target.value)}
        />
      </Field>

      <Field label="Fecha último parto" error={errors.fecha_ultimo_parto}>
        <input
          className={`gc-form-input${errors.fecha_ultimo_parto ? " error" : ""}`}
          type="date"
          value={form.fecha_ultimo_parto || ""}
          onChange={(e) => s("fecha_ultimo_parto", e.target.value)}
        />
      </Field>

      <Field label="Fecha probable parto" error={errors.fecha_probable_parto}>
        <input
          className={`gc-form-input${errors.fecha_probable_parto ? " error" : ""}`}
          type="date"
          value={form.fecha_probable_parto || ""}
          onChange={(e) => s("fecha_probable_parto", e.target.value)}
        />
      </Field>

      <Field label="¿Es reproductor?" error={errors.es_reproductor}>
        <select
          className={`gc-form-select${errors.es_reproductor ? " error" : ""}`}
          value={String(form.es_reproductor ?? false)}
          onChange={(e) => s("es_reproductor", e.target.value === "true")}
        >
          <option value="false">No</option>
          <option value="true">Sí</option>
        </select>
      </Field>

      <div className="gc-form-section-divider">Observaciones</div>

      <Field label="Observaciones" full error={errors.observaciones}>
        <textarea
          className={`gc-form-textarea${errors.observaciones ? " error" : ""}`}
          placeholder="Observaciones sobre el animal…"
          value={form.observaciones || form.notas || ""}
          onChange={(e) => s("observaciones", e.target.value)}
        />
      </Field>
    </div>
  );
}