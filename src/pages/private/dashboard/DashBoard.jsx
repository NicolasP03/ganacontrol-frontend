import { useNavigate } from "react-router-dom";
import { getUsuarioActual } from "../../../services/AuthService";
import { getResumen } from "../../../services/VentaService";
import useDatos from "../../../hooks/useDatos";
import { pesos, cantidad, animal, diasHasta } from "../../../utils/formato";
import "./DashBoard.css";

const MODULOS = [
  { ico: "🐄", label: "Control Ganadero",        href: "/ganado",       desc: "Registro y trazabilidad del hato",      color: "mod-green" },
  { ico: "🧬", label: "Reproducción y Genética",  href: "/reproduccion", desc: "Servicios, gestaciones y partos",        color: "mod-emerald" },
  { ico: "💉", label: "Salud y Sanidad",           href: "/eventos",      desc: "Vacunaciones y eventos sanitarios",     color: "mod-teal" },
  { ico: "📦", label: "Inventario",               href: "/inventario",   desc: "Productos, stock y movimientos",        color: "mod-green" },
  { ico: "🌾", label: "Alimentación",             href: "/alimentacion", desc: "Raciones diarias por animal",           color: "mod-emerald" },
  { ico: "💰", label: "Ventas",                   href: "/ventas",       desc: "Facturación de animales y producción",  color: "mod-teal" },
];

const enDias = (fecha) => {
  const d = diasHasta(fecha);
  return d < 0 ? `vencido hace ${-d} día${-d===1?"":"s"}` : d === 0 ? "hoy" : `en ${d} día${d===1?"":"s"}`;
};

// Arma la lista de alertas a partir del resumen del backend
function construirAlertas(alertas) {
  if (!alertas) return [];
  const lista = [];
  const { stockBajo, partosProximos, eventosPendientes } = alertas;

  if (stockBajo.length) {
    lista.push({
      tipo: "warn", ico: "⚠️", modulo: "/inventario",
      titulo: `Stock bajo (${stockBajo.length})`,
      desc: stockBajo.slice(0, 3).map(p => `${p.nombre}: ${cantidad(p.cantidad_actual)} ${p.unidad || ""}`).join(" · "),
    });
  }
  partosProximos.slice(0, 2).forEach(r => lista.push({
    tipo: "warn", ico: "🤰", modulo: "/reproduccion",
    titulo: "Parto próximo",
    desc: `${animal(r.vaca)} — parto estimado ${enDias(r.fecha_probable_parto)} (${r.fecha_probable_parto})`,
  }));
  if (eventosPendientes.length) {
    lista.push({
      tipo: "info", ico: "💉", modulo: "/eventos",
      titulo: `Sanidad pendiente (${eventosPendientes.length})`,
      desc: eventosPendientes.slice(0, 2).map(e => `${e.Ganado.codigo} ${e.tipo.toLowerCase()} ${enDias(e.proxima_fecha)}`).join(" · "),
    });
  }
  if (!lista.length) {
    lista.push({ tipo: "ok", ico: "✅", modulo: "/ganado", titulo: "Todo en orden", desc: "No hay alertas activas en la finca." });
  }
  return lista;
}

export default function DashBoard() {
  const navigate = useNavigate();
  const usuario  = getUsuarioActual();
  const nombre   = usuario?.nombre || "Usuario";
  const rol      = usuario?.rol    || "Administrador";
  const finca    = usuario?.finca  || "—";
  const inicial  = nombre.charAt(0).toUpperCase();

  const { datos: resumen, cargando, error } = useDatos(getResumen, null);
  const alertas = construirAlertas(resumen?.alertas);

  const hora    = new Date().getHours();
  const saludo  = hora < 12 ? "Buenos días" : hora < 18 ? "Buenas tardes" : "Buenas noches";

  const kpis = resumen ? [
    { ico: "🐄", val: resumen.ganado.activos,              lbl: "Animales activos" },
    { ico: "🤰", val: resumen.ganado.gestantes,            lbl: "Vacas gestantes" },
    { ico: "💰", val: resumen.ganado.disponibles,          lbl: "Disponibles para venta" },
    { ico: "💵", val: pesos(resumen.ventas.ingresos),      lbl: `Ingresos totales (${resumen.ventas.total} facturas)` },
  ] : [];

  return (
    <div className="dash-page">

      {/* ══ HEADER ══════════════════════════════════════════ */}
      <div className="dash-header">
        <div>
          <p className="dash-saludo">{saludo},</p>
          <h1 className="dash-nombre">{nombre}</h1>
          <p className="dash-sub">
            Finca <strong>{finca}</strong> —{" "}
            {new Date().toLocaleDateString("es-CO", {
              weekday: "long", year: "numeric", month: "long", day: "numeric",
            })}
          </p>
        </div>

        {/* Tarjeta de perfil */}
        <div className="dash-perfil">
          <div className="dash-perfil-avatar">{inicial}</div>
          <div className="dash-perfil-info">
            <div className="dash-perfil-nombre">{nombre}</div>
            <div className="dash-perfil-rol">{rol}</div>
            <div className="dash-perfil-finca">🏠 {finca}</div>
          </div>
        </div>
      </div>

      {/* ══ KPIs ═══════════════════════════════════════════ */}
      {error && <div className="mod-error">No se pudo cargar el resumen: {error}</div>}
      <div className="mod-kpis">
        {cargando && !resumen
          ? [1,2,3,4].map(i => <div key={i} className="mod-kpi"><span className="mod-kpi-ico">⏳</span><div><div className="mod-kpi-val">—</div><div className="mod-kpi-lbl">Cargando...</div></div></div>)
          : kpis.map(k => (
            <div key={k.lbl} className="mod-kpi"><span className="mod-kpi-ico">{k.ico}</span><div><div className="mod-kpi-val">{k.val}</div><div className="mod-kpi-lbl">{k.lbl}</div></div></div>
          ))}
      </div>

      {/* ══ ALERTAS ════════════════════════════════════════ */}
      <div className="dash-section-label">
        <span className="dash-section-ico">🔔</span> Alertas activas
        <span className="dash-badge-count">{alertas.filter(a => a.tipo !== "ok").length}</span>
      </div>
      <div className="dash-alertas">
        {alertas.map((a, i) => (
          <div
            key={i}
            className={`dash-alerta dash-alerta-${a.tipo}`}
            onClick={() => navigate(a.modulo)}
          >
            <span className="dash-alerta-ico">{a.ico}</span>
            <div className="dash-alerta-body">
              <div className="dash-alerta-titulo">{a.titulo}</div>
              <div className="dash-alerta-desc">{a.desc}</div>
            </div>
            <span className="dash-alerta-arrow">→</span>
          </div>
        ))}
      </div>

      {/* ══ MÓDULOS ════════════════════════════════════════ */}
      <div className="dash-section-label" style={{ marginTop: "2rem" }}>
        <span className="dash-section-ico">⚡</span> Acceso rápido a módulos
      </div>
      <div className="dash-modulos">
        {MODULOS.map((m, i) => (
          <button
            key={i}
            className={`dash-modulo ${m.color}`}
            onClick={() => navigate(m.href)}
          >
            <span className="dash-modulo-ico">{m.ico}</span>
            <span className="dash-modulo-label">{m.label}</span>
            <span className="dash-modulo-desc">{m.desc}</span>
            <span className="dash-modulo-arrow">→</span>
          </button>
        ))}
      </div>

    </div>
  );
}
