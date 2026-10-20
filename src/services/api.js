const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/$/, "");

const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  // Sesión vencida: solo redirige si había una sesión iniciada
  if (res.status === 401 && token) {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/login";
    return;
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw data || { mensaje: `Error ${res.status}` };
  return data;
};

// Texto legible a partir de un error del API
export const mensajeError = (e) =>
  [e?.mensaje || e?.message || "Error inesperado", ...(e?.detalles || [])].join(" — ");

export default api;
