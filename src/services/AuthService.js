import api from "./api";

const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  console.error("VITE_API_URL no está definida. Revisa el archivo .env");
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

const extraerPayload = (res) => {
  return res?.data || res?.mensaje?.data || res?.mensaje || res || null;
};

const guardarSesion = ({ accessToken, refreshToken, usuario }) => {
  if (accessToken) {
    localStorage.setItem("token", accessToken);
  }

  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }

  if (usuario) {
    localStorage.setItem(
      "usuario",
      JSON.stringify({
        ...usuario,
        permisos: Array.isArray(usuario.permisos) ? usuario.permisos : [],
      })
    );
  }
};

const construirErrorDesdeJson = (data, status) => ({
  status,
  ok: false,
  mensaje:
    data?.mensaje?.mensaje ||
    data?.mensaje ||
    data?.message ||
    "Ocurrió un error en la solicitud.",
  errores: data?.mensaje?.errores || data?.errores || [],
  data: data?.data ?? null,
});

export const login = async (correo, contrasena) => {
  try {
    const res = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ correo, contrasena }),
    });

    const payload = extraerPayload(res);

    const accessToken = payload?.accessToken || payload?.token || "";
    const refreshToken = payload?.refreshToken || "";
    const usuario = payload?.usuario || null;

    if (res?.ok && accessToken) {
      guardarSesion({
        accessToken,
        refreshToken,
        usuario,
      });
    }

    return {
      ok: true,
      mensaje: res?.mensaje || "Login exitoso",
      data: payload,
    };
  } catch (error) {
    return {
      ok: false,
      mensaje:
        error?.mensaje ||
        error?.errores?.[0]?.mensaje ||
        "Error al iniciar sesión.",
    };
  }
};

// Inicio con Google: el backend verifica el ID token y solo admite cuentas ya registradas
export const loginConGoogle = async (credential) => {
  try {
    const res = await api("/auth/google", {
      method: "POST",
      body: JSON.stringify({ credential }),
    });

    const payload = extraerPayload(res);
    const accessToken = payload?.accessToken || payload?.token || "";

    if (res?.ok && accessToken) {
      guardarSesion({
        accessToken,
        refreshToken: payload?.refreshToken || "",
        usuario: payload?.usuario || null,
      });
      return { ok: true, mensaje: res?.mensaje || "Login exitoso", data: payload };
    }

    return { ok: false, mensaje: res?.mensaje || "No se pudo iniciar sesión con Google." };
  } catch (error) {
    return {
      ok: false,
      mensaje:
        error?.mensaje ||
        error?.errores?.[0]?.mensaje ||
        "No se pudo iniciar sesión con Google.",
    };
  }
};

export const forgotPassword = async (correo) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correo }),
    });

    const data = await res.json();

    if (!res.ok || !data?.ok) {
      throw construirErrorDesdeJson(data, res.status);
    }

    return {
      ok: true,
      mensaje:
        data?.mensaje ||
        "Si el correo existe, se enviaron instrucciones.",
      data: data?.data ?? null,
    };
  } catch (error) {
    return {
      ok: false,
      mensaje:
        error?.mensaje ||
        error?.errores?.[0]?.mensaje ||
        "No se pudo procesar la solicitud.",
    };
  }
};

export const resetPassword = async (token, nuevaContrasena) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, nuevaContrasena }),
    });

    const data = await res.json();

    if (!res.ok || !data?.ok) {
      throw construirErrorDesdeJson(data, res.status);
    }

    limpiarSesion();

    return {
      ok: true,
      mensaje: data?.mensaje || "Contraseña actualizada correctamente",
      data: data?.data ?? null,
    };
  } catch (error) {
    return {
      ok: false,
      mensaje:
        error?.mensaje ||
        error?.errores?.[0]?.mensaje ||
        "No se pudo restablecer la contraseña.",
    };
  }
};

export const logout = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    const token = localStorage.getItem("token");

    if (refreshToken && token) {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ refreshToken }),
      });
    }
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  } finally {
    limpiarSesion();
    redirigirLoginSiCorresponde();
  }
};

export const getUsuarioActual = () => {
  try {
    return JSON.parse(localStorage.getItem("usuario") || "null");
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const me = async () => {
  try {
    const res = await api("/auth/me", {
      method: "GET",
    });

    const usuario = extraerPayload(res);

    if (res?.ok && usuario) {
      localStorage.setItem(
        "usuario",
        JSON.stringify({
          ...usuario,
          permisos: Array.isArray(usuario.permisos) ? usuario.permisos : [],
        })
      );
    }

    return {
      ok: true,
      mensaje: res?.mensaje || "Usuario autenticado",
      data: usuario,
    };
  } catch (error) {
    return {
      ok: false,
      mensaje:
        error?.mensaje ||
        error?.errores?.[0]?.mensaje ||
        "No se pudo obtener el usuario autenticado.",
    };
  }
};