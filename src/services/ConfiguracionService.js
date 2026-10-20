import api from "./api";

const extraerData = (res) => res?.data ?? null;
const extraerLista = (res) => (Array.isArray(res?.data) ? res.data : []);

const nombreCompleto = (item) =>
  `${item?.nombres || ""} ${item?.apellidos || ""}`.trim();

const adaptarUsuario = (item) => ({
  id: item.id,
  nombre: nombreCompleto(item),
  nombres: item.nombres || "",
  apellidos: item.apellidos || "",
  correo: item.correo || "",
  rol: item.rol?.nombre || "",
  rol_id: item.rol_id || item.rol?.id || "",
  finca: item.finca?.nombre || "",
  finca_id: item.finca_id || item.finca?.id || "",
  activo: Boolean(item.activo),
  foto_url: item.foto_url || null,
});

const adaptarRol = (item) => ({
  id: item.id,
  nombre: item.nombre || "",
  desc: item.descripcion || "",
  permisos: Array.isArray(item.permisos)
    ? item.permisos.map((p) => p.codigo || p.nombre)
    : [],
});

const adaptarFinca = (item) => ({
  id: item.id,
  nombre: item.nombre || "",
  municipio: item.municipio || "",
  departamento: item.departamento || "",
  propietario: item.propietario || "",
  prefijo: item.prefijo_factura || "",
  consecutivo_factura: item.consecutivo_factura || 1,
});

const adaptarPerfil = (item) => ({
  id: item.id,
  finca_id: item.finca_id || item.finca?.id || "",
  rol_id: item.rol_id || item.rol?.id || "",
  nombres: item.nombres || "",
  apellidos: item.apellidos || "",
  nombreCompleto: nombreCompleto(item),
  correo: item.correo || "",
  rol: item.rol?.nombre || "",
  finca: item.finca?.nombre || "",
  foto_url: item.foto_url || null,
});

export async function getUsuarios() {
  const res = await api("/usuarios");
  return extraerLista(res).map(adaptarUsuario);
}

export async function createUsuario(payload) {
  const body = {
    nombres: payload.nombres,
    apellidos: payload.apellidos,
    correo: payload.correo,
    rol_id: Number(payload.rol_id),
    finca_id: Number(payload.finca_id),
    activo: payload.activo,
    contrasena: payload.contrasena,
  };

  const res = await api("/usuarios", {
    method: "POST",
    body: JSON.stringify(body),
  });

  return adaptarUsuario(extraerData(res));
}

export async function updateUsuario(id, payload) {
  const body = {
    nombres: payload.nombres,
    apellidos: payload.apellidos,
    correo: payload.correo,
    rol_id: Number(payload.rol_id),
    finca_id: Number(payload.finca_id),
    activo: payload.activo,
  };

  if (payload.contrasena) {
    body.contrasena = payload.contrasena;
  }

  const res = await api(`/usuarios/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

  return adaptarUsuario(extraerData(res));
}

export async function toggleUsuarioActivo(id, activo) {
  const res = await api(`/usuarios/${id}`, {
    method: "PUT",
    body: JSON.stringify({ activo }),
  });

  return adaptarUsuario(extraerData(res));
}

export async function deleteUsuario(id) {
  const res = await api(`/usuarios/${id}`, {
    method: "DELETE",
  });

  return res?.data ?? true;
}

export async function getRoles() {
  const res = await api("/roles");
  return extraerLista(res).map(adaptarRol);
}

export async function updateRol(id, payload) {
  const body = {
    nombre: payload.nombre,
    descripcion: payload.desc,
  };

  // Códigos de permiso marcados en el modal (ej. "ganado.ver")
  if (Array.isArray(payload.permisos)) {
    body.permisos = payload.permisos;
  }

  const res = await api(`/roles/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

  return adaptarRol(extraerData(res));
}

export async function getFinca() {
  const res = await api("/configuracion/finca");
  return adaptarFinca(extraerData(res));
}

export async function updateFinca(payload) {
  const body = {
    nombre: payload.nombre,
    municipio: payload.municipio,
    departamento: payload.departamento,
    propietario: payload.propietario,
    prefijo_factura: payload.prefijo,
  };

  const res = await api("/configuracion/finca", {
    method: "PUT",
    body: JSON.stringify(body),
  });

  return adaptarFinca(extraerData(res));
}

export async function getPerfilActual() {
  const res = await api("/configuracion/perfil");
  return adaptarPerfil(extraerData(res));
}

export async function updatePerfil(payload) {
  const body = {
    nombres: payload.nombres,
    apellidos: payload.apellidos,
    correo: payload.correo,
  };

  if (payload.contrasena) {
    body.contrasena = payload.contrasena;
  }

  const res = await api("/configuracion/perfil", {
    method: "PUT",
    body: JSON.stringify(body),
  });

  return adaptarPerfil(extraerData(res));
}

export async function getSistema() {
  const res = await api("/configuracion/sistema");
  return extraerLista(res);
}

export async function getRolActual() {
  const res = await api("/auth/me");
  const data = extraerData(res);
  return data?.rol || "";
}