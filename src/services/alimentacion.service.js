// src/services/alimentacion.service.js

import api from "./api";

/* ──────────────────────────────────────────────────────────
   Helpers
────────────────────────────────────────────────────────── */
const extraerLista = (res) => {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res)) return res;
  return [];
};

const extraerData = (res) => {
  if (res?.data) return res.data;
  return res ?? null;
};

const construirError = (error) => ({
  status: error?.status || 500,
  ok: false,
  mensaje:
    error?.mensaje ||
    error?.message ||
    "Ocurrió un error en el módulo de alimentación.",
  errores: error?.errores || [],
  data: error?.data || null,
});

/* ──────────────────────────────────────────────────────────
   Backend → Front
────────────────────────────────────────────────────────── */
const adaptarDesdeBackend = (item) => ({
  id: item.id,
  animal_id: item.ganado_id,
  producto_id: item.producto_id ?? null,

  tipo_animal: item.tipo_animal || "",
  nombre_alimento: item.nombre_alimento || item.producto?.nombre || "",
  tipo_alimento: item.tipo_alimento || "Otro",
  cantidad_kg: item.cantidad ?? "",
  frecuencia: item.frecuencia || "",
  fecha_registro: item.fecha || "",
  observaciones: item.observacion || "",

  animal: item.ganado
    ? {
        id: item.ganado.id,
        codigo: item.ganado.codigo,
        nombre: item.ganado.nombre,
        raza: item.ganado.raza || "",
      }
    : null,

  producto: item.producto
    ? {
        id: item.producto.id,
        nombre: item.producto.nombre,
        tipo: item.producto.tipo,
      }
    : null,
});

/* ──────────────────────────────────────────────────────────
   Front → Backend
────────────────────────────────────────────────────────── */
const adaptarHaciaBackend = (form) => ({
  ganado_id: form.animal_id,
  producto_id: form.producto_id || null,
  tipo_animal: form.tipo_animal,
  fecha: form.fecha_registro,
  cantidad: form.cantidad_kg,
  frecuencia: form.frecuencia,
  observacion: form.observaciones || null,
});

export const alimentacionService = {
  async listar() {
    try {
      const res = await api("/alimentacion", {
        method: "GET",
      });

      return extraerLista(res).map(adaptarDesdeBackend);
    } catch (error) {
      throw construirError(error);
    }
  },

  async crear(form) {
    try {
      const payload = adaptarHaciaBackend(form);

      const res = await api("/alimentacion", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      return adaptarDesdeBackend(extraerData(res));
    } catch (error) {
      throw construirError(error);
    }
  },

  async actualizar(form) {
    try {
      if (!form?.id) {
        throw {
          status: 400,
          mensaje: "El id del registro es obligatorio para actualizar.",
          errores: [{ campo: "id", mensaje: "Falta el id del registro" }],
          data: null,
        };
      }

      const payload = adaptarHaciaBackend(form);

      const res = await api(`/alimentacion/${form.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      return adaptarDesdeBackend(extraerData(res));
    } catch (error) {
      throw construirError(error);
    }
  },

  async eliminar(id) {
    try {
      if (!id) {
        throw {
          status: 400,
          mensaje: "El id es obligatorio para eliminar.",
          errores: [{ campo: "id", mensaje: "Falta el id del registro" }],
          data: null,
        };
      }

      return await api(`/alimentacion/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      throw construirError(error);
    }
  },
};