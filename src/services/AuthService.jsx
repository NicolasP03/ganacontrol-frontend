import api from "./api";

// Login — guarda token y usuario en localStorage
export const login = async (correo, contrasena) => {
  const data = await api("/auth/login", {
    method: "POST",
    body: JSON.stringify({ correo, contrasena }),
  });
  if (data?.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(data.usuario || {}));
  }
  return data;
};

// Cerrar sesión
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
};

// Obtener usuario actual desde localStorage
export const getUsuarioActual = () => {
  const u = localStorage.getItem("usuario");
  if (!u) return null;
  const usuario = JSON.parse(u);
  return { ...usuario, nombre: [usuario.nombres, usuario.apellidos].filter(Boolean).join(" ") };
};

// Verificar si hay sesión activa
export const isAuthenticated = () => !!localStorage.getItem("token");
