// InventarioModalForm.jsx
import { useState } from "react";
import "../../../../styles/modules/Inventario.css";

const TIPOS = ["Alimento", "Medicamento", "Insumo"];
const UBICACIONES = ["Finca principal", "Casa administrador"];

export default function InventarioModalForm({ producto, onClose, onGuardar }) {
  const esEdicion = !!producto?.id;

  const [f, setF] = useState({
    id: producto?.id ?? null,
    nombre: producto?.nombre ?? "",
    tipo: producto?.tipo ?? "Alimento",
    unidad: producto?.unidad ?? "kg",
    cantidad_actual: producto?.cantidad_actual ?? 0,
    cantidad_min: producto?.cantidad_min ?? 0,
    proveedor: producto?.proveedor ?? "",
    ubicacion: producto?.ubicacion ?? "Finca principal",
    precio_unitario:
      producto?.precio_unitario !== undefined && producto?.precio_unitario !== null
        ? String(producto.precio_unitario)
        : "",
    notas: producto?.notas ?? "",
    fecha_registro: producto?.fechaISO ?? "",
    categoria: producto?.categoria ?? "",
    activo: producto?.activo ?? true,
  });

  const set = (campo, valor) => {
    setF((prev) => ({ ...prev, [campo]: valor }));
  };

  const cerrarModal = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    onClose?.();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    if (!f.nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    const payload = {
      id: f.id,
      nombre: f.nombre.trim(),
      tipo: f.tipo,
      categoria: f.categoria?.trim() || null,
      unidad: f.unidad?.trim() || "kg",
      cantidad_actual: Number(f.cantidad_actual || 0),
      cantidad_min: Number(f.cantidad_min || 0),
      proveedor: f.proveedor?.trim() || null,
      ubicacion: f.ubicacion || "Finca principal",
      precio_unitario: f.precio_unitario !== "" ? Number(f.precio_unitario) : null,
      notas: f.notas?.trim() || null,
      fecha_registro: f.fecha_registro || null,
      activo: Boolean(f.activo),
    };

    onGuardar?.(payload);
  };

  return (
    <div className="iv-modal-overlay" onClick={handleOverlayClick}>
      <form
        className="iv-modal iv-modal--form"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="iv-modal__header">
          <div className="iv-modal__head-text">
            <p className="iv-modal__pre">
              {esEdicion ? "Editar Producto" : "Nuevo Producto"}
            </p>
            <h2 className="iv-modal__title">
              {esEdicion ? f.nombre || "Editar producto" : "Registro de Inventario"}
            </h2>
          </div>

          <button
            type="button"
            className="iv-modal__close"
            onClick={cerrarModal}
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        <div className="iv-modal__body iv-form">
          <div className="iv-form__row">
            <label className="iv-form__label">Nombre *</label>
            <input
              className="iv-form__input"
              placeholder="Nombre del producto"
              value={f.nombre}
              onChange={(e) => set("nombre", e.target.value)}
            />
          </div>

          <div className="iv-form__grid-2">
            <div className="iv-form__row">
              <label className="iv-form__label">Tipo</label>
              <select
                className="iv-form__select"
                value={f.tipo}
                onChange={(e) => set("tipo", e.target.value)}
              >
                {TIPOS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="iv-form__row">
              <label className="iv-form__label">Unidad</label>
              <input
                className="iv-form__input"
                placeholder="kg, und, ml"
                value={f.unidad}
                onChange={(e) => set("unidad", e.target.value)}
              />
            </div>
          </div>

          <div className="iv-form__grid-2">
            <div className="iv-form__row">
              <label className="iv-form__label">Cantidad actual</label>
              <input
                className="iv-form__input"
                type="number"
                min="0"
                value={f.cantidad_actual}
                onChange={(e) => set("cantidad_actual", e.target.value)}
              />
            </div>

            <div className="iv-form__row">
              <label className="iv-form__label">Cantidad mínima</label>
              <input
                className="iv-form__input"
                type="number"
                min="0"
                value={f.cantidad_min}
                onChange={(e) => set("cantidad_min", e.target.value)}
              />
            </div>
          </div>

          <div className="iv-form__grid-2">
            <div className="iv-form__row">
              <label className="iv-form__label">Ubicación</label>
              <select
                className="iv-form__select"
                value={f.ubicacion}
                onChange={(e) => set("ubicacion", e.target.value)}
              >
                {UBICACIONES.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div className="iv-form__row">
              <label className="iv-form__label">Fecha</label>
              <input
                className="iv-form__input"
                type="date"
                value={f.fecha_registro}
                onChange={(e) => set("fecha_registro", e.target.value)}
              />
            </div>
          </div>

          <div className="iv-form__grid-2">
            <div className="iv-form__row">
              <label className="iv-form__label">Precio unitario</label>
              <input
                className="iv-form__input"
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                value={f.precio_unitario}
                onChange={(e) => set("precio_unitario", e.target.value)}
              />
            </div>

            <div className="iv-form__row">
              <label className="iv-form__label">Proveedor</label>
              <input
                className="iv-form__input"
                placeholder="Proveedor"
                value={f.proveedor}
                onChange={(e) => set("proveedor", e.target.value)}
              />
            </div>
          </div>

          <div className="iv-form__row">
            <label className="iv-form__label">Notas</label>
            <textarea
              className="iv-form__textarea"
              rows={3}
              placeholder="Observaciones"
              value={f.notas}
              onChange={(e) => set("notas", e.target.value)}
            />
          </div>
        </div>

        <div className="iv-modal__footer">
          <button
            type="button"
            className="iv-btn iv-btn--ghost"
            onClick={cerrarModal}
          >
            Cancelar
          </button>

          <button type="submit" className="iv-btn iv-btn--primary">
            {esEdicion ? "Guardar Cambios" : "Crear Producto"}
          </button>
        </div>
      </form>
    </div>
  );
}