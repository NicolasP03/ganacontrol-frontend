import { useEffect, useRef, useState } from "react";
import AnimalForm from "../shared/AnimalForm";

const EMPTY = {
  codigo: "",
  nombre: "",
  sexo: "",
  categoria: "",
  raza: "",
  fecha_nacimiento: "",
  peso_actual: "",
  foto: null,
  foto_preview: "",

  estado_general: "Activo",
  estado_biologico: "Vivo",
  estado_comercial: "Disponible",
  estado_salud: "Sano",
  estado_reproductivo: "No aplica",

  fecha_ultimo_parto: "",
  fecha_probable_parto: "",
  numero_partos: "",
  estado_productivo: "",
  es_reproductor: false,

  potrero_id: "",
  madre_id: "",
  padre_id: "",
  origen: "Nacimiento en finca",
  fecha_ingreso: "",

  observaciones: "",
};

const validate = (f) => {
  const e = {};

  if (!f.codigo?.trim()) e.codigo = "El código es requerido";
  if (!f.sexo?.trim()) e.sexo = "El sexo es requerido";
  if (!f.categoria?.trim()) e.categoria = "La categoría es requerida";

  if (f.peso_actual !== "" && Number(f.peso_actual) < 0) {
    e.peso_actual = "El peso no puede ser negativo";
  }

  if (f.numero_partos !== "" && Number(f.numero_partos) < 0) {
    e.numero_partos = "El número de partos no puede ser negativo";
  }

  if (f.potrero_id !== "" && Number(f.potrero_id) < 1) {
    e.potrero_id = "Potrero inválido";
  }

  if (f.madre_id !== "" && Number(f.madre_id) < 1) {
    e.madre_id = "Madre inválida";
  }

  if (f.padre_id !== "" && Number(f.padre_id) < 1) {
    e.padre_id = "Padre inválido";
  }

  if (f.foto) {
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(f.foto.type)) {
      e.foto = "La imagen debe ser jpg, jpeg, png o webp";
    }

    if (f.foto.size > 2 * 1024 * 1024) {
      e.foto = "La imagen no puede superar los 2MB";
    }
  }

  return e;
};

const mapearErroresBackend = (errores = []) => {
  const obj = {};
  errores.forEach((err) => {
    if (err?.campo) obj[err.campo] = err.mensaje;
  });
  return obj;
};

export default function ModalNuevoRegistro({ onClose, onGuardar }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const modalRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (modalRef.current) modalRef.current.scrollTop = 0;
      if (bodyRef.current) bodyRef.current.scrollTop = 0;
    });
  }, []);

  const handleChange = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
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
    } catch (err) {
      setErrors(mapearErroresBackend(err?.errores));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gc-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="gc-modal" ref={modalRef}>
        <div className="gc-modal__header">
          <div>
            <div className="gc-modal__title">Nuevo Registro</div>
            <div className="gc-modal__subtitle">
              Complete los datos del animal para agregarlo al hato
            </div>
          </div>
          <button className="gc-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="gc-modal__body" ref={bodyRef}>
          <AnimalForm form={form} errors={errors} onChange={handleChange} />
        </div>

        <div className="gc-modal__footer">
          <button className="gc-btn gc-btn--secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button className="gc-btn gc-btn--primary" onClick={handleGuardar} disabled={loading}>
            {loading ? "⏳ Guardando…" : "✅ Guardar Registro"}
          </button>
        </div>
      </div>
    </div>
  );
}