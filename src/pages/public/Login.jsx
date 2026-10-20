import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, loginConGoogle } from "../../services/AuthService";
import GoogleLoginButton from "./GoogleLoginButton";
import "../../styles/Login.css";

// ICONOS
import cowIcon from "../../assets/icons/cow.png";
import saludIcon from "../../assets/icons/salud.png";
import finanzasIcon from "../../assets/icons/finanzas.png";
import dashboardIcon from "../../assets/icons/dashboard.png";

// reutilizados para inputs (puedes cambiarlos después)
import userIcon from "../../assets/icons/configuracion.png";
import lockIcon from "../../assets/icons/contraseña.png";

export default function Login() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleLogin = async () => {
    if (!correo || !contrasena) {
      setError("Por favor ingresa correo y contraseña.");
      return;
    }

    setCargando(true);
    setError("");

    try {
      const res = await login(correo, contrasena);

      if (res?.ok) {
        navigate("/dashboard");
      } else {
        setError(res?.mensaje || "Credenciales incorrectas.");
      }
    } catch (err) {
      setError(err?.mensaje || "Error al conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  const handleGoogle = async (credential) => {
    if (!credential) return;
    setCargando(true);
    setError("");

    const res = await loginConGoogle(credential);
    setCargando(false);

    if (res?.ok) {
      navigate("/dashboard");
    } else {
      setError(res?.mensaje || "No se pudo iniciar sesión con Google.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin();
  };

  return (
    <div className="login-page">
      <div className="login-visual">
        <div className="login-visual__grid"></div>
        <div className="login-visual__glow"></div>

        {/* LOGO */}
        <div className="login-visual__logo">
          <div className="login-visual__logo-icon">
            <img src={cowIcon} alt="logo" />
          </div>
          <div>
            <span className="login-visual__logo-name">GanaControl</span>
            <span className="login-visual__logo-tag">Gestión Ganadera</span>
          </div>
        </div>

        <div className="login-visual__content">
          <h1 className="login-visual__h1">
            El control total de<span> su finca, digital.</span>
          </h1>

          <p className="login-visual__p">
            Gestione ganado, reproducción, sanidad, inventario y finanzas
            desde una sola plataforma diseñada para el campo colombiano.
          </p>

          {/* FEATURES */}
          <div className="login-visual__features">
            {[
              [cowIcon, "Trazabilidad bovina completa"],
              [saludIcon, "Alertas sanitarias automáticas"],
              [finanzasIcon, "Facturación sin errores"],
              [dashboardIcon, "Reportes ejecutivos en tiempo real"],
            ].map(([ico, txt]) => (
              <div key={txt} className="login-visual__feature">
                <img src={ico} alt="" className="login-visual__feature-ico" />
                <span className="login-visual__feature-text">{txt}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="login-visual__footer">
          © 2025 GanaControl — Hecho en Colombia
        </div>
      </div>

      <div className="login-form-panel">
        <div className="login-form-box">
          <button
            type="button"
            className="login-form-box__back"
            onClick={() => navigate("/")}
          >
            ← Volver al inicio
          </button>

          <div className="login-form-box__eyebrow">Bienvenido de nuevo</div>
          <h1 className="login-form-box__h1">Iniciar Sesión</h1>
          <p className="login-form-box__sub">
            Ingresa tus credenciales para acceder al sistema.
          </p>

          <form onSubmit={handleSubmit}>
            {/* CORREO */}
            <div className="login-field">
              <label className="login-label">Correo electrónico</label>
              <div className="login-input-wrap">
                <img src={userIcon} alt="" className="login-input-ico" />
                <input
                  className="login-input"
                  type="email"
                  name="correo"
                  autoComplete="email"
                  placeholder="correo@ejemplo.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  disabled={cargando}
                />
              </div>
            </div>

            {/* CONTRASEÑA */}
            <div className="login-field">
              <label className="login-label">Contraseña</label>
              <div className="login-input-wrap">
                <img src={lockIcon} alt="" className="login-input-ico" />
                <input
                  className="login-input"
                  type="password"
                  name="contrasena"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  disabled={cargando}
                />
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="login-error">
                <span className="login-error-icon"></span>
                {error}
              </div>
            )}

            <div className="login-opts">
              <label className="login-opts__remember">
                <input type="checkbox" /> Recordarme
              </label>
              <span
                className="login-opts__forgot"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/forgot-password")}
              >
                ¿Olvidaste tu contraseña?
              </span>
            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={cargando}
            >
              {cargando ? (
                <>
                  <div className="login-spinner"></div> Ingresando...
                </>
              ) : (
                "Ingresar al sistema →"
              )}
            </button>
          </form>

          <GoogleLoginButton onCredential={handleGoogle} disabled={cargando} />
        </div>
      </div>
    </div>
  );
}