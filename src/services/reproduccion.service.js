import api from "./api";

const extraerLista = (res) => res?.data ?? [];
const extraerData = (res) => res?.data ?? null;

const adaptarDesdeBackend = (item) => ({
  id: item.id,
  vaca_id: item.vaca_id,
  toro_id: item.toro_id ?? null,
  tipo_servicio: item.tipo_servicio || "",
  proveedor_genetico: item.proveedor_genetico ?? "",
  fecha_servicio: item.fecha_servicio || "",
  fecha_probable_parto: item.fecha_probable_parto ?? "",
  fecha_parto: item.fecha_parto ?? "",
  estado: item.estado || "Pendiente",
  cria_codigo: item.cria_codigo ?? "",

  vaca: item.vaca
    ? {
        id: item.vaca.id,
        codigo: item.vaca.codigo || "",
        nombre: item.vaca.nombre || "",
        raza: item.vaca.raza || "",
        categoria: item.vaca.categoria || "",
      }
    : null,

  toro: item.toro
    ? {
        id: item.toro.id,
        codigo: item.toro.codigo || "",
        nombre: item.toro.nombre || "",
        raza: item.toro.raza || "",
        categoria: item.toro.categoria || "",
      }
    : null,
});

const toIntOrNull = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isInteger(n) ? n : null;
};

const limpiarStringONull = (value) => {
  if (value === null || value === undefined || value === "") return null;
  return String(value).trim();
};

const validarPayload = (payload) => {
  const errores = [];

  if (!payload.vaca_id) {
    errores.push({
      campo: "vaca_id",
      mensaje: "La vaca es obligatoria",
    });
  }

  if (!payload.tipo_servicio) {
    errores.push({
      campo: "tipo_servicio",
      mensaje: "El tipo de servicio es obligatorio",
    });
  }

  if (!payload.fecha_servicio) {
    errores.push({
      campo: "fecha_servicio",
      mensaje: "La fecha de servicio es obligatoria",
    });
  }

  if (errores.length > 0) {
    throw {
      status: 400,
      mensaje: "Validación fallida",
      errores,
      data: null,
    };
  }
};

const adaptarHaciaBackend = (data) => {
  const payload = {
    vaca_id: toIntOrNull(data.vaca_id),
    tipo_servicio: limpiarStringONull(data.tipo_servicio),
    fecha_servicio: limpiarStringONull(data.fecha_servicio),
    estado: limpiarStringONull(data.estado) || "Pendiente",
    toro_id: toIntOrNull(data.toro_id),
    proveedor_genetico: limpiarStringONull(data.proveedor_genetico),
    fecha_probable_parto: limpiarStringONull(data.fecha_probable_parto),
    fecha_parto: limpiarStringONull(data.fecha_parto),
    cria_codigo: limpiarStringONull(data.cria_codigo),
  };

  if (payload.tipo_servicio === "Monta_Natural") {
    payload.proveedor_genetico = null;
  }

  if (payload.tipo_servicio === "Inseminacion") {
    payload.toro_id = null;
  }

  Object.keys(payload).forEach((key) => {
    if (payload[key] === "" || payload[key] === undefined) {
      payload[key] = null;
    }
  });

  return payload;
};

export const reproduccionService = {
  listar: async () => {
    const res = await api("/reproduccion", { method: "GET" });
    const rows = extraerLista(res);
    return Array.isArray(rows) ? rows.map(adaptarDesdeBackend) : [];
  },

  obtenerPorId: async (id) => {
    const res = await api(`/reproduccion/${id}`, { method: "GET" });
    const row = extraerData(res);
    return row ? adaptarDesdeBackend(row) : null;
  },

  crear: async (data) => {
    const payload = adaptarHaciaBackend(data);

    validarPayload(payload);

    const res = await api("/reproduccion", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const row = extraerData(res);
    return row ? adaptarDesdeBackend(row) : null;
  },

  actualizar: async (data) => {
    const payload = adaptarHaciaBackend(data);

    validarPayload(payload);

    const res = await api(`/reproduccion/${data.id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    const row = extraerData(res);
    return row ? adaptarDesdeBackend(row) : null;
  },

  eliminar: async (id) => {
    const res = await api(`/reproduccion/${id}`, { method: "DELETE" });
    const row = extraerData(res);
    return row ?? { ok: true, id };
  },
};