const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  console.error("VITE_API_URL no está definida. Revisa tu .env");
}

const limpiarSesion = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("usuario");
};

const redirigirLoginSiCorresponde = () => {
  if (window.location.hash !== "#/login") {
    window.location.href = "/#/login";
  }
};

const api = async (endpoint, options = {}) => {
  if (!BASE_URL) {
    throw {
      status: 500,
      mensaje: "La URL base de la API no está configurada.",
      errores: [],
      data: null,
    };
  }

  const token = localStorage.getItem("token");

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const isFormData = options.body instanceof FormData;

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const config = {
    method: options.method || "GET",
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    let data = null;
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = {
        ok: false,
        mensaje: "La respuesta del servidor no vino en JSON.",
        data: null,
        errores: [],
      };
    }

    if (response.status === 401) {
      limpiarSesion();
      redirigirLoginSiCorresponde();
    }

    if (!response.ok) {
      throw {
        status: response.status,
        mensaje:
          data?.mensaje?.mensaje ||
          data?.mensaje ||
          "Ocurrió un error en la solicitud.",
        errores:
          data?.mensaje?.errores ||
          data?.errores ||
          [],
        data:
          data?.mensaje?.data ||
          data?.data ||
          null,
      };
    }

    return data;
  } catch (error) {
    throw {
      status: error?.status || 500,
      mensaje: error?.mensaje || "Error de conexión con el servidor.",
      errores: error?.errores || [],
      data: error?.data || null,
    };
  }
};

export default api;