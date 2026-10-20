import { useEffect, useRef, useState } from "react";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GSI_SRC = "https://accounts.google.com/gsi/client";

// Carga el script de Google Identity Services una sola vez
let gsiPromise = null;
function cargarGsi() {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (!gsiPromise) {
    gsiPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = GSI_SRC;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = () => {
        gsiPromise = null;
        reject(new Error("No se pudo cargar Google"));
      };
      document.head.appendChild(script);
    });
  }
  return gsiPromise;
}

// Botón oficial "Continuar con Google". onCredential recibe el ID token (JWT) de Google.
export default function GoogleLoginButton({ onCredential, disabled = false }) {
  const contenedor = useRef(null);
  const callbackRef = useRef(onCredential);
  const [error, setError] = useState("");

  useEffect(() => {
    callbackRef.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    if (!CLIENT_ID) return undefined;
    let activo = true;

    cargarGsi()
      .then(() => {
        if (!activo || !contenedor.current) return;
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: (respuesta) => callbackRef.current?.(respuesta.credential),
          ux_mode: "popup",
        });
        const ancho = Math.min(contenedor.current.offsetWidth || 360, 400);
        window.google.accounts.id.renderButton(contenedor.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "pill",
          logo_alignment: "center",
          locale: "es",
          width: ancho,
        });
      })
      .catch(() => activo && setError("No se pudo cargar el inicio con Google."));

    return () => {
      activo = false;
    };
  }, []);

  if (!CLIENT_ID) return null;

  return (
    <div className="login-google">
      <div className="login-google__divider">
        <span>o</span>
      </div>
      <div
        ref={contenedor}
        className="login-google__btn"
        style={disabled ? { pointerEvents: "none", opacity: 0.6 } : undefined}
      />
      {error && <p className="login-google__error">{error}</p>}
    </div>
  );
}
