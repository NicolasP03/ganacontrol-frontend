import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ── Íconos PNG ───────────────────────────────────────────────────
import icoCow from "../../assets/icons/cow.png";
import icoReproduccion from "../../assets/icons/reproduccion.png";
import icoSalud from "../../assets/icons/salud.png";
import icoInventario from "../../assets/icons/inventario.png";
import icoPotreros from "../../assets/icons/potreros.png";
import icoFinanzas from "../../assets/icons/finanzas.png";
import icoAlimentacion from "../../assets/icons/alimentacion.png";
import icoDashboard from "../../assets/icons/dashboard.png";
import icoObjetivo from "../../assets/icons/objetivo.png";
import icoVision from "../../assets/icons/vision.png";
import icoVaca from "../../assets/icons/vaca.png";

// ── Imágenes equipo ──────────────────────────────────────────────
import imgJair from "../../assets/icons/Jair.png";
import imgDavid from "../../assets/icons/David.png";
import imgNicolas from "../../assets/icons/Nicolas.png";
import imgMichaell from "../../assets/icons/Michaell.png";

import "../../styles/Home.css";

// ── Datos ────────────────────────────────────────────────────────
const MODULOS = [
  {
    img: icoCow,
    nombre: "Control Ganadero",
    desc: "Registro completo de cada animal con trazabilidad total desde nacimiento hasta venta.",
  },
  {
    img: icoReproduccion,
    nombre: "Reproducción y Genética",
    desc: "Gestión de servicios, gestaciones y partos con cálculo automático de fechas.",
  },
  {
    img: icoSalud,
    nombre: "Salud y Sanidad",
    desc: "Vacunaciones, tratamientos y eventos sanitarios con alertas de próximas fechas.",
  },
  {
    img: icoInventario,
    nombre: "Inventario Inteligente",
    desc: "Control de alimentos, medicamentos e insumos con alertas de stock mínimo.",
  },
  {
    img: icoPotreros,
    nombre: "Potreros",
    desc: "Gestión de potreros, rotación de pasturas y capacidad de carga por hectárea.",
  },
  {
    img: icoFinanzas,
    nombre: "Cockpit Financiero",
    desc: "Ventas, facturación automática e ingresos consolidados por período.",
  },
  {
    img: icoAlimentacion,
    nombre: "Alimentación",
    desc: "Raciones diarias por animal con control de consumo y observaciones.",
  },
  {
    img: icoDashboard,
    nombre: "Mando Central",
    desc: "Vista ejecutiva con KPIs clave, alertas activas y resumen de la operación.",
  },
];

const EQUIPO = [
  {
    img: imgJair,
    nombre: "Jair Arias",
    rol: "Scrum Master",
    desc: "Garantiza la agilidad del equipo, elimina impedimentos y asegura que cada sprint entregue valor real al ganadero colombiano.",
    badge: "⚡ Ágil",
  },
  {
    img: imgDavid,
    nombre: "David Lopez",
    rol: "Backend Developer",
    desc: "Arquitecto de datos y lógica de negocio. Construye la columna vertebral del sistema con APIs robustas y base de datos optimizada.",
    badge: "🔧 Backend",
  },
  {
    img: imgNicolas,
    nombre: "Nicolás Peña",
    rol: "Product Owner",
    desc: "Visionario del producto. Traduce las necesidades del campo en funcionalidades concretas que transforman la gestión ganadera.",
    badge: "🚀 Visión",
  },
  {
    img: imgMichaell,
    nombre: "Michaell Gomez",
    rol: "Frontend Developer",
    desc: "Da vida a la interfaz con experiencias fluidas e intuitivas. Cada pixel está pensado para que el ganadero opere con confianza y rapidez.",
    badge: "🎨 Frontend",
  },
];

// ── Componente ───────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("gc-animate-in");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.1 }
    );

    document
      .querySelectorAll(".home-reveal")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-page">
      {/* ── Navbar ── */}
      <nav className="home-nav">
        <div className="home-nav__logo">
          <div className="home-nav__logo-icon">
            <img
              src={icoCow}
              alt="GanaControl"
              style={{
                width: 26,
                height: 26,
                objectFit: "contain",
              }}
            />
          </div>

          <div>
            <span className="home-nav__logo-name">GanaControl</span>
            <span className="home-nav__logo-tag">Gestión Ganadera</span>
          </div>
        </div>

        <ul className="home-nav__links">
          <li>
            <a href="#modulos">Módulos</a>
          </li>
          <li>
            <a href="#mision">Misión y Visión</a>
          </li>
          <li>
            <a href="#equipo">Equipo</a>
          </li>
          <li>
            <a href="#contacto">Contacto</a>
          </li>
        </ul>

        <button
          className="gc-btn gc-btn--primary"
          onClick={() => navigate("/login")}
        >
          Iniciar Sesión
        </button>
      </nav>

      {/* ── Hero ── */}
      <section className="home-hero">
        <div className="home-hero__grid" />

        <div className="home-hero__inner">
          <div>
            <div className="home-hero__badge">
              <span className="home-hero__badge-dot" />
              Plataforma Ganadera Profesional
            </div>

            <h1 className="home-hero__h1">
              La plataforma que su
              <span>finca necesitaba</span>
            </h1>

            <p className="home-hero__p">
              GanaControl integra ganado, reproducción, sanidad, inventario,
              pasturas y finanzas en un solo sistema robusto diseñado para
              ganaderos colombianos que exigen precisión y control total.
            </p>

            <div className="home-hero__btns">
              <button
                className="home-hero__btn-main"
                onClick={() => navigate("/login")}
              >
                Iniciar Sesión →
              </button>

              <button
                className="home-hero__btn-ghost"
                onClick={() =>
                  document
                    .getElementById("modulos")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Ver módulos
              </button>
            </div>

            <div className="home-hero__stats">
              {[
                ["8", "Módulos"],
                ["100%", "Colombiano"],
                ["0", "Errores"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="home-hero__stat-num">{n}</div>
                  <div className="home-hero__stat-lbl">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Mockup */}
          <div className="home-hero__card">
            <div className="home-hero__card-bar">
              <div className="home-hero__card-dots">
                {["#ef4444", "#f59e0b", "#22c55e"].map((c) => (
                  <div
                    key={c}
                    className="home-hero__card-dot"
                    style={{ background: c }}
                  />
                ))}
              </div>

              <span className="home-hero__card-title">
                GanaControl — Dashboard
              </span>

              <span />
            </div>

            <div className="home-hero__card-body">
              <div className="home-hero__card-kpis">
                {[
                  ["1,247", "Ganado activo"],
                  ["$47.8M", "Ingresos"],
                  ["94%", "Al día"],
                ].map(([v, l]) => (
                  <div key={l} className="home-hero__card-kpi">
                    <div className="home-hero__card-kpi-val">{v}</div>
                    <div className="home-hero__card-kpi-lbl">{l}</div>
                  </div>
                ))}
              </div>

              <table className="home-hero__card-table">
                <thead>
                  <tr>
                    <th>Animal</th>
                    <th>Estado</th>
                    <th>Cat.</th>
                  </tr>
                </thead>

                <tbody>
                  {[
                    ["GN-001 · Cara Blanca", "ok", "Activo", "Vaca"],
                    ["GN-002 · La Negra", "warn", "Gestante", "Vaca"],
                    ["GN-007 · Lucero", "ok", "Activo", "Novillo"],
                    ["GN-012 · Torito Rey", "info", "Vacunar", "Toro"],
                  ].map(([a, e, est, c]) => (
                    <tr key={a}>
                      <td>{a}</td>
                      <td>
                        <span className={`home-pill home-pill--${e}`}>
                          {est}
                        </span>
                      </td>
                      <td>{c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── Módulos ── */}
      <div className="home-section--bg" id="modulos">
        <div className="home-section">
          <div className="home-center home-reveal">
            <span className="home-eyebrow">El sistema completo</span>
            <h2 className="home-h2">8 módulos integrados</h2>
          </div>

          <div className="home-modulos-grid">
            {MODULOS.map((m, i) => (
              <div key={i} className="home-modulo-card home-reveal">
                <img
                  src={m.img}
                  alt={m.nombre}
                  className="home-modulo-card__ico"
                  style={{
                    width: 52,
                    height: 52,
                    objectFit: "contain",
                  }}
                />

                <div className="home-modulo-card__name">{m.nombre}</div>
                <div className="home-modulo-card__desc">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Misión y Visión ── */}
      <div id="mision">
        <div className="home-section">
          <div className="home-center home-reveal">
            <span className="home-eyebrow">Quiénes somos</span>
            <h2 className="home-h2">Misión y Visión</h2>
          </div>

          <div className="home-mv-grid">
            {[
              {
                ico: icoObjetivo,
                t: "Misión",
                txt: "Proveer a los ganaderos colombianos una plataforma tecnológica integral que digitalice y optimice cada proceso de la producción bovina — desde el nacimiento hasta la comercialización — reduciendo errores, mejorando la trazabilidad y aumentando la rentabilidad de cada finca.",
              },
              {
                ico: icoVision,
                t: "Visión",
                txt: "Ser la plataforma de gestión ganadera líder en Colombia y Latinoamérica, reconocida por su robustez técnica, facilidad de uso y compromiso con la modernización del sector agropecuario hacia un modelo de agricultura de precisión sostenible y competitivo.",
              },
            ].map(({ ico, t, txt }) => (
              <div key={t} className="home-mv-card home-reveal">
                <img src={ico} alt="" className="home-mv-ico" />
                <h3 className="home-mv-title">{t}</h3>
                <div className="home-mv-line" />
                <p className="home-mv-text">{txt}</p>
              </div>
            ))}
          </div>

          <div className="home-valores">
            {[
              [
                icoDashboard,
                "Innovación",
                "Tecnología agropecuaria de vanguardia",
              ],
              [
                icoReproduccion,
                "Confiabilidad",
                "Datos íntegros y siempre disponibles",
              ],
              [
                icoVaca,
                "Sostenibilidad",
                "Apoyo al campo colombiano a largo plazo",
              ],
              [
                icoObjetivo,
                "Precisión",
                "Cero errores en facturación y trazabilidad",
              ],
            ].map(([ico, v, d]) => (
              <div key={v} className="home-valor home-reveal">
                <img src={ico} alt="" className="home-valor__ico" />
                <div className="home-valor__name">{v}</div>
                <div className="home-valor__desc">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Equipo BOOM ── */}
<div className="home-section--bg" id="equipo">
  <div className="home-section">
    <div className="home-center home-reveal">
      <span className="home-eyebrow">El equipo</span>
      <h2 className="home-h2">Quienes construyeron GanaControl</h2>
      <p className="home-equipo-subtitle">
        Un grupo de apasionados por la tecnología y el campo colombiano
      </p>
    </div>

    <div className="home-equipo-grid-boom">
      {EQUIPO.map((item, i) => (
        <div
          key={item.nombre}
          className="home-equipo-card-boom home-reveal"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <div className="home-equipo-card-boom__glow" />

          <div className="home-equipo-card-boom__inner">
            <div className="home-equipo-card-boom__avatar">
              <img src={item.img} alt={item.nombre} />
            </div>

            <h3 className="home-equipo-card-boom__name">{item.nombre}</h3>

            <span className="home-equipo-card-boom__role">{item.rol}</span>

            <div className="home-equipo-card-boom__line" />

            <p className="home-equipo-card-boom__desc">{item.desc}</p>

            <div className="home-equipo-card-boom__badge">{item.badge}</div>
          </div>
        </div>
      ))}
    </div>

    <div className="home-equipo-cta home-reveal">
      <span className="home-equipo-cta__emoji"></span>
      <p className="home-equipo-cta__text">
        <strong>¿Quieres hacer parte de este equipo?</strong>
        <br />
        Estamos construyendo el futuro de la ganadería colombiana.
      </p>
    </div>
  </div>
</div>

      {/* ── CTA ── */}
      <section className="home-cta" id="contacto">
        <div className="home-cta__ico">
          <img
            src={icoCow}
            alt="GanaControl"
            style={{
              width: 64,
              height: 64,
              objectFit: "contain",
              margin: "0 auto",
            }}
          />
        </div>

        <h2 className="home-cta__h2">Acceda al sistema ahora</h2>

        <p className="home-cta__p">
          Ingrese a GanaControl y gestione su finca de forma profesional.
        </p>

        <button
          className="home-hero__btn-main"
          onClick={() => navigate("/login")}
        >
          Iniciar Sesión →
        </button>
      </section>

      {/* ── Footer ── */}
      <footer className="home-footer">
        <div className="home-footer__brand">
          <img
            src={icoCow}
            alt="GanaControl"
            style={{
              width: 32,
              height: 32,
              objectFit: "contain",
            }}
          />

          <span className="home-footer__brand-name">GanaControl</span>
        </div>

        <ul className="home-footer__links">
          <li>
            <a href="#modulos">Módulos</a>
          </li>
          <li>
            <a href="#mision">Misión</a>
          </li>
          <li>
            <a href="#equipo">Equipo</a>
          </li>
        </ul>

        <span className="home-footer__copy">
          © 2025 GanaControl — Hecho en Colombia 🇨🇴
        </span>
      </footer>
    </div>
  );
}