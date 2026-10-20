import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../services/AuthService";
import "../../styles/ForgotPassword.css";

import cowIcon from "../../assets/icons/cow.png";
import restablecerIcon from "../../assets/icons/restablecer-la-contrasena.png";
import cerrarSesionIcon from "../../assets/icons/cerrar-sesion.png";
import controlAccesoIcon from "../../assets/icons/control-de-accesso.png";
import plataformaIcon from "../../assets/icons/plataforma.png";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [nuevaPass, setNuevaPass] = useState("");
  const [confirmarPass, setConfirmarPass] = useState("");
  const [mostrarPass, setMostrarPass] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(false);

  const fortaleza = (() => {
    if (!nuevaPass) return 0;
    let f = 0;
    if (nuevaPass.length >= 8) f++;
    if (/[A-Z]/.test(nuevaPass)) f++;
    if (/[0-9]/.test(nuevaPass)) f++;
    if (/[^A-Za-z0-9]/.test(nuevaPass)) f++;
    return f;
  })();

  const fortalezaLabel = ["", "Débil", "Regular", "Buena", "Fuerte"][fortaleza];
  const fortalezaColor = ["", "#e74c3c", "#f39c12", "#2ecc71", "#27ae60"][fortaleza];

  const handleCambiarPassword = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("El enlace no es válido o no contiene token.");
      return;
    }

    if (!nuevaPass || !confirmarPass) {
      setError("Completa ambos campos.");
      return;
    }

    if (nuevaPass.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (nuevaPass !== confirmarPass) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setCargando(true);
      setError("");

      const res = await resetPassword(token, nuevaPass);

      if (res?.ok) {
        setExito(true);
      } else {
        setError(res?.mensaje || "No se pudo restablecer la contraseña.");
      }
    } catch (err) {
      setError(err?.mensaje || "No se pudo restablecer la contraseña.");
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
          Estás a un paso de recuperar el acceso a tu cuenta de forma segura.
        </p>

        <div className="fp-visual__features">
          {[
            [restablecerIcon, "Restablecimiento seguro"],
            [cerrarSesionIcon, "Sesiones revocadas automáticamente"],
            [controlAccesoIcon, "Protección de acceso"],
            [plataformaIcon, "Plataforma lista para su operación"],
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

  if (exito) {
    return (
      <div className="fp-page">
        <Sidebar />
        <div className="fp-form-panel">
          <div className="fp-form-box fp-animate fp-success-box">
            <div className="fp-success-icon">
              <div className="fp-success-ring" />
              <span>✓</span>
            </div>

            <h1 className="fp-h1">¡Contraseña restablecida!</h1>
            <p className="fp-sub">
              Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar
              sesión con tus nuevas credenciales.
            </p>

            <div className="fp-success-detail">
              <span>🛡</span>
              <p>Por seguridad, todas las sesiones activas han sido cerradas.</p>
            </div>

            <button
              className="fp-submit fp-submit--success"
              onClick={() => navigate("/login")}
            >
              Ir al inicio de sesión →
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              <span className="fp-eyebrow-ico">🔑</span>
              Crear nueva contraseña
            </div>
          </div>

          <h1 className="fp-h1">Nueva contraseña</h1>
          <p className="fp-sub">
            Crea una contraseña segura para tu cuenta. Te recomendamos usar
            letras, números y símbolos.
          </p>

          <form onSubmit={handleCambiarPassword}>
            <div className="fp-field">
              <label className="fp-label">Nueva contraseña</label>
              <div className="fp-input-wrap">
                <span className="fp-input-ico fp-ico-text">🔒</span>
                <input
                  className="fp-input"
                  type={mostrarPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={nuevaPass}
                  onChange={(e) => setNuevaPass(e.target.value)}
                  disabled={cargando}
                  autoFocus
                />
                <button
                  type="button"
                  className="fp-toggle-pass"
                  onClick={() => setMostrarPass(!mostrarPass)}
                >
                  {mostrarPass ? "🙈" : "👁"}
                </button>
              </div>

              {nuevaPass && (
                <div className="fp-strength">
                  <div className="fp-strength-bar">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className="fp-strength-seg"
                        style={{
                          background: fortaleza >= n ? fortalezaColor : "var(--fp-border)",
                        }}
                      />
                    ))}
                  </div>
                  <span className="fp-strength-label" style={{ color: fortalezaColor }}>
                    {fortalezaLabel}
                  </span>
                </div>
              )}
            </div>

            <div className="fp-field">
              <label className="fp-label">Confirmar contraseña</label>
              <div className="fp-input-wrap">
                <span className="fp-input-ico fp-ico-text">🔒</span>
                <input
                  className="fp-input"
                  type={mostrarPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmarPass}
                  onChange={(e) => setConfirmarPass(e.target.value)}
                  disabled={cargando}
                />
                {confirmarPass && (
                  <span className="fp-match-ico">
                    {nuevaPass === confirmarPass ? "✅" : "❌"}
                  </span>
                )}
              </div>
            </div>

            <div className="fp-requisitos">
              {[
                [nuevaPass.length >= 8, "Mínimo 8 caracteres"],
                [/[A-Z]/.test(nuevaPass), "Una letra mayúscula"],
                [/[0-9]/.test(nuevaPass), "Un número"],
                [/[^A-Za-z0-9]/.test(nuevaPass), "Un símbolo especial"],
              ].map(([ok, txt]) => (
                <div key={txt} className={`fp-req ${ok ? "ok" : ""}`}>
                  <span>{ok ? "✓" : "○"}</span> {txt}
                </div>
              ))}
            </div>

            {error && <div className="fp-error">⚠ {error}</div>}

            <button className="fp-submit" type="submit" disabled={cargando}>
              {cargando ? (
                <>
                  <div className="fp-spinner" /> Cambiando contraseña...
                </>
              ) : (
                "Cambiar contraseña →"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}