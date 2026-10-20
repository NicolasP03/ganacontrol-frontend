import { useNavigate } from "react-router-dom";

// Marcador para módulos que aún no están implementados
export default function EnConstruccion({ ico = "🚧", titulo, descripcion }) {
  const navigate = useNavigate();
  return (
    <div className="mod-page">
      <div className="mod-header">
        <div>
          <div className="mod-breadcrumb">Dashboard / <span>{titulo}</span></div>
          <h1 className="mod-title">{ico} {titulo}</h1>
        </div>
      </div>
      <div className="mod-tabla-wrap">
        <div className="mod-empty" style={{ padding: "3.5rem 1rem" }}>
          <div style={{ fontSize: "2.4rem", marginBottom: "0.6rem" }}>🚧</div>
          <div style={{ fontWeight: 700, color: "var(--text-mid)", marginBottom: "0.4rem" }}>Módulo en construcción</div>
          <div style={{ marginBottom: "1.2rem" }}>{descripcion}</div>
          <button className="mod-btn-ghost" onClick={() => navigate("/dashboard")}>← Volver al Dashboard</button>
        </div>
      </div>
    </div>
  );
}
