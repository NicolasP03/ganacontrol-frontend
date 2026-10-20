import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { login, loginConGoogle, isAuthenticated } from "../../services/AuthService";
import GoogleLoginButton from "./GoogleLoginButton";
import "../../styles/LoginAnimado.css";

export default function Login() {
  const navigate = useNavigate();

  const [active, setActive] = useState(false);
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  if (isAuthenticated()) return <Navigate to="/dashboard" replace />;

  const entrar = async (intento) => {
    setCargando(true);
    setError("");
    try {
      const res = await intento();
      if (res?.ok) navigate("/dashboard", { replace: true });
      else setError(res?.mensaje || "Credenciales incorrectas.");
    } catch (err) {
      setError(err?.mensaje || "Error al conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!correo.trim() || !contrasena) {
      setError("Ingresa tu correo y contraseña.");
      return;
    }
    entrar(() => login(correo.trim(), contrasena));
  };

  const handleGoogle = (credential) => {
    if (credential) entrar(() => loginConGoogle(credential));
  };

  return (
    <div className="login-anim">
      <div className={`container ${active ? "right-panel-active" : ""}`} id="container">

        {/* Solicitar acceso: las cuentas las crea el administrador de la finca */}
        <div className="form-container register-container">
          <form onSubmit={(e) => e.preventDefault()}>
            <h1>Solicitar acceso</h1>
            <p className="login-info">
              Las cuentas de GanaControl las crea el administrador de la finca.
              Comunícate con él para que te asigne un usuario y un rol.
            </p>
            <button type="button" onClick={() => setActive(false)}>Volver</button>
          </form>
        </div>

        {/* Login */}
        <div className="form-container login-container">
          <form onSubmit={handleSubmit} noValidate>
            <h1>Iniciar Sesión</h1>

            <input
              type="email"
              placeholder="Correo Electrónico"
              autoComplete="username"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
            <input
              type="password"
              placeholder="Contraseña"
              autoComplete="current-password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />

            {error && <p className="login-error" role="alert">{error}</p>}

            <div className="content">
              <div className="pass-link">
                <a href="#/forgot-password">¿Olvidaste tu contraseña?</a>
              </div>
            </div>

            <button type="submit" disabled={cargando}>
              {cargando ? "Ingresando..." : "Ingresar"}
            </button>

            <GoogleLoginButton onCredential={handleGoogle} disabled={cargando} />

            <span>Ingresa tus datos para continuar</span>
          </form>
        </div>

        {/* Overlay */}
        <div className="overlay-container">
          <div className="overlay">

            <div className="overlay-panel overlay-left">
              <h1>Bienvenido de nuevo!</h1>
              <p>
                Para mantenerse conectado con nosotros, por favor inicie sesión
                con su información personal
              </p>
              <button type="button" className="ghost" onClick={() => setActive(false)}>
                Iniciar Sesión
              </button>
            </div>

            <div className="overlay-panel overlay-right">
              <h1 className="title">Tu finca, en tus manos</h1>
              <p>¿Aún no tienes cuenta? Solicita acceso al administrador de tu finca</p>
              <button type="button" className="ghost" onClick={() => setActive(true)}>
                Solicitar acceso
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
