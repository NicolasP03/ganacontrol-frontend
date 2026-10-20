import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/AuthService";
import "../../styles/ForgotPassword.css";

import cowIcon from "../../assets/icons/cow.png";
import userIcon from "../../assets/icons/configuracion.png";
import enlaceIcon from "../../assets/icons/enlace.png";
import datosEncriptadosIcon from "../../assets/icons/datos-encriptados.png";
import controlDeAccesoIcon from "../../assets/icons/control-de-accesso.png";
import soporteTecnicoIcon from "../../assets/icons/soporte-tecnico.png";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [paso, setPaso] = useState(1);
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleEnviarCorreo = async (e) => {
    e.preventDefault();

    if (!correo) {
      setError("Por favor ingresa tu correo electrónico.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(correo)) {
      setError("Ingresa un correo válido.");
      return;
    }

    try {
      setCargando(true);
      setError("");
      setMensaje("");

      const res = await forgotPassword(correo);

      if (!res?.ok) {
        setError(res?.mensaje || "No se pudo enviar el correo de recuperación.");
        return;
      }

      setMensaje(
        res?.mensaje ||
          "Si el correo existe, se enviaron instrucciones para recuperar la contraseña."
      );
      setPaso(2);
    } catch (err) {
      setError(err?.mensaje || "No se pudo procesar la solicitud.");
    } finally {
      setCargando(false);
    }
  };

  const Sidebar = () => (
    <div className="fp-visual">
      <div className="fp-visual__grid" />
      <div className="fp-visual__glow" />

      <div className="fp-visual__logo">
        <div className="fp-visual__logo-icon">
          <img src={cowIcon} alt="logo" />
        </div>
        <div>
          <span className="fp-visual__logo-name">GanaControl</span>
          <span className="fp-visual__logo-tag">Gestión Ganadera</span>
        </div>
      </div>

      <div className="fp-visual__content">
        <h1 className="fp-visual__h1">
          Seguridad que<span> protege su negocio.</span>
        </h1>
        <p className="fp-visual__p">
          Su cuenta está protegida con cifrado de nivel bancario. Recupere
          el acceso de forma segura desde su correo electrónico.
        </p>

        <div className="fp-visual__features">
          {[
            [enlaceIcon, "Enlace seguro de recuperación"],
            [datosEncriptadosIcon, "Datos cifrados extremo a extremo"],
            [controlDeAccesoIcon, "Acceso seguro desde cualquier lugar"],
            [soporteTecnicoIcon, "Soporte técnico especializado"],
          ].map(([ico, txt]) => (
            <div key={txt} className="fp-visual__feature">
              <img src={ico} alt="" className="fp-visual__feature-ico" />
              <span className="fp-visual__feature-text">{txt}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="fp-visual__footer">© 2025 GanaControl — Hecho en Colombia</div>
    </div>
  );

  if (paso === 1) {
    return (
      <div className="fp-page">
        <Sidebar />

        <div className="fp-form-panel">
          <div className="fp-form-box fp-animate">
            <button className="fp-back" onClick={() => navigate("/login")}>
              ← Volver al inicio de sesión
            </button>

            <div className="fp-eyebrow">
              <div className="fp-eyebrow-badge">
                <span className="fp-eyebrow-ico">🔐</span>
                Recuperación segura
              </div>
            </div>

            <h1 className="fp-h1">¿Olvidaste tu contraseña?</h1>
            <p className="fp-sub">
              Ingresa el correo asociado a tu cuenta y te enviaremos un enlace
              para restablecer tu contraseña.
            </p>

            <form onSubmit={handleEnviarCorreo}>
              <div className="fp-field">
                <label className="fp-label">Correo electrónico</label>
                <div className="fp-input-wrap">
                  <img src={userIcon} alt="" className="fp-input-ico" />
                  <input
                    className="fp-input"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    disabled={cargando}
                    autoFocus
                  />
                </div>
              </div>

              {error && <div className="fp-error">⚠ {error}</div>}

              <button className="fp-submit" type="submit" disabled={cargando}>
                {cargando ? (
                  <>
                    <div className="fp-spinner" /> Enviando enlace...
                  </>
                ) : (
                  "Enviar enlace de recuperación →"
                )}
              </button>
            </form>

            <div className="fp-info-card">
              <span className="fp-info-ico">📬</span>
              <p>
                Recibirás un correo con un enlace seguro. Revisa también tu
                carpeta de spam.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fp-page">
      <Sidebar />

      <div className="fp-form-panel">
        <div className="fp-form-box fp-animate fp-success-box">
          <div className="fp-success-icon">
            <div className="fp-success-ring" />
            <span>✓</span>
          </div>

          <h1 className="fp-h1">Revisa tu correo</h1>
          <p className="fp-sub">
            {mensaje ||
              "Si el correo existe, te enviamos un enlace para restablecer tu contraseña."}
          </p>

          <div className="fp-success-detail">
            <span>📩</span>
            <p>Abre el enlace enviado a tu correo para continuar el proceso.</p>
          </div>

          <button
            className="fp-submit fp-submit--success"
            onClick={() => navigate("/login")}
          >
            Volver al inicio de sesión →
          </button>
        </div>
      </div>
    </div>
  );
}