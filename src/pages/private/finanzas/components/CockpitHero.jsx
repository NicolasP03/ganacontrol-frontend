// CockpitHero.jsx
import { useNavigate } from "react-router-dom";
import "../../../../styles/modules/Cockpit.css";

export default function CockpitHero({ onExportar, loading }) {
  const navigate = useNavigate();
  return (
    <div className="ck-hero">

      {/* ── Lado izquierdo: texto ─────────────── */}
      <div className="ck-hero__content">
        <div className="ck-hero__badge">
          <span className="ck-hero__badge-dot" />
          Cockpit Financiero
        </div>

        <h1 className="ck-hero__h1">
          Control de Ventas
          <br />
          <em className="ck-hero__h1-em">e Ingresos</em>
        </h1>

        <p className="ck-hero__p">
          Monitorización de rendimiento financiero y liquidación
          de inventario ganadero.
        </p>

        <div className="ck-hero__btns">
          <button
            className="ck-btn ck-btn--primary"
            onClick={() => navigate("/ventas")}
          >
            + Nueva Venta
          </button>
          <button
            className="ck-btn ck-btn--hero-outline"
            onClick={onExportar}
            disabled={loading}
          >
            {loading ? "Exportando…" : "📊 Exportar Reporte"}
          </button>
        </div>
      </div>

      {/* ── Lado derecho: imagen ──────────────── */}
      <div className="ck-hero__img-wrap">
        <img
          className="ck-hero__img"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtlnLmSb-CmqEfsXu_Hpf5ja59Jz_X9xvL482bGj59MVCbeuNrEkfLz6Sy-nu-todf95Yl-fE3HEm02c4pQ5LHGy4ykqXeBtWghElcZ9B3sik0Pit7RJDKl_rDKlQvRBAFi86MvZP6fW5T2CVvxl215BYh1j3HjCfebrjuxxVSFshn4tlpiEWE3dfSgB1mxf4G-Vaa5Zw4iklD_1IfXTJWQvoiSRPOFUt0k0CFkAOMRckk9UwyB1fDbb3B0_l5H6FLUhLyibMuLuA"
          alt="Cockpit financiero ganadero"
        />
      </div>

    </div>
  );
}