import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { login, isAuthenticated } from "../../services/AuthService";
import { mensajeError } from "../../services/api";
import "../../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [active,     setActive]     = useState(false);
  const [correo,     setCorreo]     = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error,      setError]      = useState("");
  const [cargando,   setCargando]   = useState(false);
  const [aviso,      setAviso]      = useState("");

  if (isAuthenticated()) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!correo || !contrasena) {
      setError("Ingresa tu correo y contraseña.");
      return;
    }
    setCargando(true);
    try {
      await login(correo.trim(), contrasena);
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (err) {
      setError(err?.mensaje === "Credenciales inválidas"
        ? "Correo o contraseña incorrectos."
        : `No se pudo iniciar sesión: ${mensajeError(err)}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-page">
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
              <a href="#" onClick={(e) => { e.preventDefault(); setAviso("Pídele al administrador de la finca que restablezca tu contraseña."); }}>
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>
          {aviso && <p className="login-info" style={{ margin: "0 0 10px", fontSize: 13 }}>{aviso}</p>}

          <button type="submit" disabled={cargando}>
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>

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
              <i className="lni lni-arrow-left login"></i>
            </button>
          </div>

          <div className="overlay-panel overlay-right">
            <h1 className="title">Tu finca, en tus manos</h1>
            <p>
              ¿Aún no tienes cuenta? Solicita acceso al administrador de tu finca
            </p>

            <button type="button" className="ghost" onClick={() => setActive(true)}>
              Solicitar acceso
              <i className="lni lni-arrow-right register"></i>
            </button>
          </div>

        </div>
      </div>

    </div>
    </div>
  );
}
