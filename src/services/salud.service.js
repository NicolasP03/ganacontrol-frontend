import api from "./api";

/* ─────────────────────────────────────────────
   Helpers base
───────────────────────────────────────────── */
const extraerData = (res) => res?.mensaje?.data ?? res?.data ?? null;
const extraerLista = (res) => res?.mensaje?.data ?? res?.data ?? [];

// "YYYY-MM-DD" se interpreta como fecha local (new Date("YYYY-MM-DD") es UTC
// y en Colombia mostraría el día anterior)
const aFechaLocal = (fecha) => {
  if (typeof fecha === "string" && /^d{4}-d{2}-d{2}$/.test(fecha)) {
    const [y, m, d] = fecha.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(fecha);
};

const formatearFecha = (fecha) => {
  if (!fecha) return "";
  try {
    return aFechaLocal(fecha).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return fecha;
  }
};

const formatearFechaCorta = (fecha) => {
  if (!fecha) return "";
  try {
    return aFechaLocal(fecha).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return fecha;
  }
};

const obtenerIniciales = (nombre = "") => {
  return (
    nombre
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "SN"
  );
};

const mapTipoACategoria = (tipo) => {
  const mapa = {
    Vacunacion: "Vacunación",
    Tratamiento: "Tratamiento",
    Cirugia: "Intervención",
    Diagnostico: "Diagnóstico",
    Revision: "Diagnóstico",
    Desparasitacion: "Antiparasitario",
  };

  return mapa[tipo] || tipo || "Otro";
};

const mapTipoAIcono = (tipo) => {
  const mapa = {
    Vacunacion: "💉",
    Tratamiento: "🏥",
    Cirugia: "🩺",
    Diagnostico: "🔬",
    Revision: "📋",
    Desparasitacion: "🧪",
  };

  return mapa[tipo] || "📌";
};

const calcularEstadoEvento = (item) => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  if (item?.fecha) {
    const fechaRegistro = aFechaLocal(item.fecha);
    fechaRegistro.setHours(0, 0, 0, 0);

    if (fechaRegistro > hoy) {
      return {
        estado: "Pendiente",
        estadoKey: "pendiente",
      };
    }
  }

  if (item?.proxima_fecha) {
    const proxima = aFechaLocal(item.proxima_fecha);
    proxima.setHours(0, 0, 0, 0);

    if (proxima > hoy) {
      return {
        estado: "Pendiente",
        estadoKey: "pendiente",
      };
    }

    if (proxima.toDateString() === hoy.toDateString()) {
      return {
        estado: "En Curso",
        estadoKey: "en_curso",
      };
    }
  }

  return {
    estado: "Completado",
    estadoKey: "completado",
  };
};

/* ─────────────────────────────────────────────
   Adaptadores
───────────────────────────────────────────── */
export const adaptarEventoDesdeBackend = (item) => {
  const estadoInfo = calcularEstadoEvento(item);

  const nombreVet =
    [item?.usuario?.nombres, item?.usuario?.apellidos]
      .filter(Boolean)
      .join(" ") ||
    item?.usuario?.correo ||
    "Sin asignar";

  return {
    id: item.id,
    backendId: item.id,

    ganado_id: item.ganado_id ?? "",
    usuario_id: item.usuario_id ?? "",
    producto_id: item.producto_id ?? "",

    cantidad_usada:
      item?.cantidad_usada !== null && item?.cantidad_usada !== undefined
        ? Number(item.cantidad_usada)
        : "",

    animalCod: item?.ganado?.codigo || "Sin código",
    animalNombre: item?.ganado?.nombre || "",
    tratamiento:
      item?.producto?.nombre ||
      item?.descripcion ||
      item?.tipo ||
      "Evento sanitario",

    categoria: mapTipoACategoria(item?.tipo),
    tipo: item?.tipo || "",

    vet: nombreVet,
    vetKey: obtenerIniciales(nombreVet),

    fecha: formatearFecha(item?.fecha),
    fechaISO: item?.fecha || "",

    estado: estadoInfo.estado,
    estadoKey: estadoInfo.estadoKey,

    notas: item?.descripcion || "",
    descripcion: item?.descripcion || "",
    dosis: item?.dosis || "",
    via_administracion: item?.via_administracion || "",
    costo:
      item?.costo !== null && item?.costo !== undefined
        ? Number(item.costo)
        : "",
    proxima_fecha: item?.proxima_fecha || "",

    ico: mapTipoAIcono(item?.tipo),
  };
};

export const adaptarEventoHaciaBackend = (form) => ({
  ganado_id: Number(form.ganado_id),
  producto_id: form.producto_id ? Number(form.producto_id) : null,
  cantidad_usada:
    form.producto_id &&
    form.cantidad_usada !== "" &&
    form.cantidad_usada !== null &&
    form.cantidad_usada !== undefined
      ? Number(form.cantidad_usada)
      : null,
  tipo: form.tipo || "Revision",
  descripcion: form.descripcion || form.notas || null,
  dosis: form.dosis || null,
  via_administracion: form.via_administracion || null,
  fecha: form.fechaISO || null,
  costo:
    form.costo === "" || form.costo === null || form.costo === undefined
      ? null
      : Number(form.costo),
  proxima_fecha: form.proxima_fecha || null,
});

/* ─────────────────────────────────────────────
   Endpoints reales
───────────────────────────────────────────── */
export const listarEventos = async () => {
  const res = await api("/eventos-sanitarios", { method: "GET" });
  const rows = extraerLista(res);
  return Array.isArray(rows) ? rows.map(adaptarEventoDesdeBackend) : [];
};

export const obtenerEventoPorId = async (id) => {
  const res = await api(`/eventos-sanitarios/${id}`, { method: "GET" });
  const row = extraerData(res);
  return row ? adaptarEventoDesdeBackend(row) : null;
};

export const crearEvento = async (data) => {
  const payload = adaptarEventoHaciaBackend(data);

  const res = await api("/eventos-sanitarios", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const row = extraerData(res);
  return row ? adaptarEventoDesdeBackend(row) : null;
};

export const actualizarEvento = async (id, data) => {
  const payload = adaptarEventoHaciaBackend(data);

  const res = await api(`/eventos-sanitarios/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  const row = extraerData(res);
  return row ? adaptarEventoDesdeBackend(row) : null;
};

export const eliminarEvento = async (id) => {
  const res = await api(`/eventos-sanitarios/${id}`, {
    method: "DELETE",
  });

  return {
    ok: res?.ok ?? true,
    id,
  };
};

/* ─────────────────────────────────────────────
   Derivados desde eventos reales
───────────────────────────────────────────── */
export const construirKpisDesdeEventos = (eventos = []) => {
  const total = eventos.length;
  const vacunacion = eventos.filter((e) => e.tipo === "Vacunacion").length;
  const tratamiento = eventos.filter((e) => e.tipo === "Tratamiento").length;
  const pendientes = eventos.filter((e) => e.estadoKey === "pendiente").length;

  return [
    {
      label: "Eventos Totales",
      value: String(total),
      ico: "📋",
      sub: "Registros sanitarios",
      trend: "up",
      delta: `${total}`,
    },
    {
      label: "Vacunaciones",
      value: String(vacunacion),
      ico: "💉",
      sub: "Aplicadas en el sistema",
      trend: "up",
      delta: `${vacunacion}`,
    },
    {
      label: "Tratamientos",
      value: String(tratamiento),
      ico: "🏥",
      sub: "Tratamientos registrados",
      trend: "flat",
      delta: `${tratamiento}`,
    },
    {
      label: "Pendientes",
      value: String(pendientes),
      ico: "🚨",
      sub: "Con próxima fecha vencida o activa",
      trend: pendientes > 0 ? "down" : "up",
      delta: `${pendientes}`,
    },
  ];
};

export const construirProximosDesdeEventos = (eventos = []) => {
  return [...eventos]
    .filter((e) => e.proxima_fecha)
    .sort((a, b) => aFechaLocal(a.proxima_fecha) - aFechaLocal(b.proxima_fecha))
    .slice(0, 5)
    .map((ev) => {
      const hoy = new Date();
      const fecha = aFechaLocal(ev.proxima_fecha);
      const diff = Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24));

      let urgencia = "normal";
      if (diff < 0) urgencia = "alta";
      else if (diff <= 7) urgencia = "media";

      return {
        id: ev.id,
        titulo: ev.tratamiento,
        sub: `${ev.animalCod}${ev.animalNombre ? ` · ${ev.animalNombre}` : ""}`,
        fecha: formatearFecha(ev.proxima_fecha),
        animalCod: ev.animalCod || "",
        animalNombre: ev.animalNombre || "",
        urgencia,
        ico: ev.ico || "📌",
      };
    });
};

export const construirEstatusDesdeEventos = (eventos = []) => {
  const hoyStr = new Date().toISOString().split("T")[0];
  const total = eventos.length || 1;

  const completados = eventos.filter((e) => {
    const fechaOk = !e.fechaISO || e.fechaISO <= hoyStr;
    const proximaOk = !e.proxima_fecha || e.proxima_fecha <= hoyStr;
    return fechaOk && proximaOk;
  }).length;

  const pendientes = eventos.filter((e) => {
    const fechaFutura = e.fechaISO && e.fechaISO > hoyStr;
    const proximaFutura = e.proxima_fecha && e.proxima_fecha > hoyStr;
    return fechaFutura || proximaFutura;
  }).length;

  return [
    {
      label: "Vacunación al día",
      pct: 100,
    },
    {
      label: "Seguimientos al día",
      pct: Math.round((completados / total) * 100),
    },
    {
      label: "Pendientes sanitarios",
      pct: Math.round((pendientes / total) * 100),
    },
  ];
};

export const obtenerKpisSalud = async () => {
  const res = await api("/eventos-sanitarios/kpis", { method: "GET" });
  return extraerData(res);
};

export const obtenerProximosEventos = async () => {
  const res = await api("/eventos-sanitarios/proximos", { method: "GET" });
  const rows = extraerLista(res);

  if (!Array.isArray(rows)) return [];

  return rows.map((ev) => ({
    id: ev.id,
    titulo: ev.titulo || ev.tratamiento || ev.tipo || "Evento sanitario",
    sub: `${ev.animalCod || ev?.ganado?.codigo || ""}${
      ev.animalNombre || ev?.ganado?.nombre
        ? ` · ${ev.animalNombre || ev?.ganado?.nombre}`
        : ""
    }`,
    fecha: formatearFechaCorta(ev.proxima_fecha || ev.fecha),
    animalCod: ev.animalCod || ev?.ganado?.codigo || "",
    animalNombre: ev.animalNombre || ev?.ganado?.nombre || "",
    urgencia: ev.urgencia || "normal",
    ico: mapTipoAIcono(ev.tipo),
  }));
};

export const obtenerEstatusSalud = async () => {
  const res = await api("/eventos-sanitarios/estatus", { method: "GET" });
  return extraerData(res) ?? [];
};

export const obtenerResumenSalud = async () => {
  const res = await api("/eventos-sanitarios/resumen", { method: "GET" });
  return extraerData(res);
};

export const ESTADO_META_SALUD = {
  completado: { color: "#22c55e", label: "Completado" },
  en_curso: { color: "#3b82f6", label: "En Curso" },
  pendiente: { color: "#f59e0b", label: "Pendiente" },
  cancelado: { color: "#ef4444", label: "Cancelado" },
};

export const URGENCIA_META = {
  alta: { color: "#ef4444", label: "Alta" },
  media: { color: "#f59e0b", label: "Media" },
  normal: { color: "#22c55e", label: "Normal" },
};