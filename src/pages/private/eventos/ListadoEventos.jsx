import { useState } from "react";
import { getEventos, crearEvento, editarEvento, eliminarEvento, getGanado } from "../../../services/GanadoService";
import { getProductos } from "../../../services/ProductoService";
import { mensajeError } from "../../../services/api";
import useDatos from "../../../hooks/useDatos";
import { num, pesos, animal, hoyISO, diasHasta, limpiarForm } from "../../../utils/formato";

// tabla: evento_sanitario
// campos: ganado_id, usuario_id, tipo, producto_id, descripcion, dosis,
//         via_administracion, fecha, costo, proxima_fecha
const TIPO_COLOR = {
  Vacunacion:"cat-blue", Tratamiento:"cat-green", Cirugia:"cat-rust",
  Diagnostico:"cat-earth", Revision:"cat-gray", Desparasitacion:"cat-earth"
};

const VACIO = { ganado_id:"", tipo:"Vacunacion", fecha:"", descripcion:"", producto_id:"", dosis:"", via_administracion:"", costo:"", proxima_fecha:"" };

const ProximaFecha = ({ fecha }) => {
  if (!fecha) return <span style={{color:"var(--text-xs)"}}>—</span>;
  const d = diasHasta(fecha);
  const clase = d < 0 ? "est-warn" : d <= 15 ? "est-blue" : "est-gray";
  const texto = d < 0 ? `vencido hace ${-d} d` : d === 0 ? "hoy" : `en ${d} d`;
  return <span>{fecha} <span className={`mod-estado ${clase}`} style={{marginLeft:4}}>{texto}</span></span>;
};

export default function ListadoEventos() {
  const { datos: eventos, cargando, error, recargar } = useDatos(getEventos);
  const { datos: ganado }    = useDatos(getGanado);
  const { datos: productos } = useDatos(getProductos);

  const [busqueda,     setBusqueda]     = useState("");
  const [filtroTipo,   setFiltroTipo]   = useState("Todos");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando,     setEditando]     = useState(null);
  const [form,         setForm]         = useState(VACIO);
  const [guardando,    setGuardando]    = useState(false);
  const [errorForm,    setErrorForm]    = useState("");
  const [errorAccion,  setErrorAccion]  = useState("");

  const filtrados = eventos.filter(ev => {
    const texto  = `${animal(ev.Ganado)} ${ev.descripcion || ""}`.toLowerCase();
    const matchB = texto.includes(busqueda.toLowerCase());
    const matchT = filtroTipo==="Todos" || ev.tipo===filtroTipo;
    return matchB && matchT;
  });

  const totalCosto = filtrados.reduce((s,e)=>s+num(e.costo),0);
  const pendientes = eventos.filter(e=>e.proxima_fecha && diasHasta(e.proxima_fecha) <= 15).length;

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const animalesActivos = ganado.filter(g => g.estado_general === "Activo" || String(g.id) === String(form.ganado_id));
  const medicamentos    = productos.filter(p => ["Medicamento","Insumo"].includes(p.tipo));

  const abrirNuevo = () => {
    setEditando(null);
    setForm({ ...VACIO, fecha: hoyISO() });
    setErrorForm(""); setMostrarModal(true);
  };
  const abrirEditar = (ev) => {
    setEditando(ev);
    setForm(Object.fromEntries(Object.keys(VACIO).map(k => [k, ev[k] ?? ""])));
    setErrorForm(""); setMostrarModal(true);
  };

  const guardar = async () => {
    if (!form.ganado_id || !form.fecha) { setErrorForm("Animal y fecha son obligatorios."); return; }
    setGuardando(true); setErrorForm("");
    try {
      const datos = limpiarForm(form);
      if (editando) await editarEvento(editando.id, datos);
      else          await crearEvento(datos);
      setMostrarModal(false);
      recargar();
    } catch (e) {
      setErrorForm(mensajeError(e));
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (ev) => {
    if (!window.confirm(`¿Eliminar el evento "${ev.tipo}" de ${animal(ev.Ganado)}?`)) return;
    setErrorAccion("");
    try { await eliminarEvento(ev.id); recargar(); }
    catch (e) { setErrorAccion(mensajeError(e)); }
  };

  return (
    <div className="mod-page">
      <div className="mod-header">
        <div>
          <div className="mod-breadcrumb">Dashboard / <span>Eventos Sanitarios</span></div>
          <h1 className="mod-title">💉 Salud y Sanidad</h1>
          <p className="mod-subtitle">Tabla <code>evento_sanitario</code> — vacunaciones, tratamientos y controles</p>
        </div>
        <button className="mod-btn-primary" onClick={abrirNuevo}>+ Registrar Evento</button>
      </div>

      {/* KPIs */}
      <div className="mod-kpis">
        <div className="mod-kpi"><span className="mod-kpi-ico">📋</span><div><div className="mod-kpi-val">{eventos.length}</div><div className="mod-kpi-lbl">Total eventos</div></div></div>
        <div className="mod-kpi"><span className="mod-kpi-ico">💉</span><div><div className="mod-kpi-val">{eventos.filter(e=>e.tipo==="Vacunacion").length}</div><div className="mod-kpi-lbl">Vacunaciones</div></div></div>
        <div className="mod-kpi"><span className="mod-kpi-ico">⏰</span><div><div className="mod-kpi-val" style={{color:pendientes?"var(--rust)":undefined}}>{pendientes}</div><div className="mod-kpi-lbl">Pendientes (≤ 15 días)</div></div></div>
        <div className="mod-kpi"><span className="mod-kpi-ico">💰</span><div><div className="mod-kpi-val">{pesos(eventos.reduce((s,e)=>s+num(e.costo),0))}</div><div className="mod-kpi-lbl">Costo total</div></div></div>
      </div>

      {error       && <div className="mod-error">No se pudieron cargar los eventos: {error}</div>}
      {errorAccion && <div className="mod-error">{errorAccion}</div>}

      {/* Filtros */}
      <div className="mod-filtros">
        <input className="mod-search" placeholder="🔍  Buscar animal o descripción..." value={busqueda} onChange={e=>setBusqueda(e.target.value)} />
        <div className="mod-filtro-btns">
          {["Todos","Vacunacion","Tratamiento","Cirugia","Diagnostico","Revision","Desparasitacion"].map(t=>(
            <button key={t} className={`mod-filtro-btn ${filtroTipo===t?"active":""}`} onClick={()=>setFiltroTipo(t)}>{t}</button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div className="mod-tabla-wrap">
        <table className="mod-tabla">
          <thead>
            <tr><th>Animal</th><th>Tipo</th><th>Descripción</th><th>Producto usado</th><th>Dosis</th><th>Vía</th><th>Fecha</th><th>Costo</th><th>Próxima fecha</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {filtrados.map(ev=>(
              <tr key={ev.id}>
                <td><span className="mod-codigo">{animal(ev.Ganado)}</span></td>
                <td><span className={`mod-cat ${TIPO_COLOR[ev.tipo]||"cat-gray"}`}>{ev.tipo}</span></td>
                <td>{ev.descripcion || <span style={{color:"var(--text-xs)"}}>—</span>}</td>
                <td>{ev.Producto?.nombre || <span style={{color:"var(--text-xs)"}}>—</span>}</td>
                <td>{ev.dosis || "—"}</td>
                <td>{ev.via_administracion || "—"}</td>
                <td>{ev.fecha}</td>
                <td><strong>{ev.costo != null ? pesos(ev.costo) : "—"}</strong></td>
                <td><ProximaFecha fecha={ev.proxima_fecha} /></td>
                <td>
                  <div className="mod-acciones">
                    <button className="mod-acc-btn" title="Editar" onClick={()=>abrirEditar(ev)}>✏️</button>
                    <button className="mod-acc-btn mod-acc-del" title="Eliminar" onClick={()=>eliminar(ev)}>🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          {filtrados.length>0 && (
            <tfoot>
              <tr>
                <td colSpan={7} style={{textAlign:"right",fontWeight:700,padding:"0.7rem 1rem",color:"var(--text-lt)",fontSize:"0.82rem"}}>COSTO TOTAL FILTRADO:</td>
                <td style={{fontWeight:900,padding:"0.7rem 1rem",color:"var(--green-dk)"}}>{pesos(totalCosto)}</td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          )}
        </table>
        {cargando && eventos.length===0 && <div className="mod-empty">Cargando eventos...</div>}
        {!cargando && filtrados.length===0 && <div className="mod-empty">No se encontraron eventos.</div>}
      </div>

      {/* Modal */}
      {mostrarModal && (
        <div className="mod-overlay" onClick={()=>setMostrarModal(false)}>
          <div className="mod-modal" onClick={e=>e.stopPropagation()}>
            <div className="mod-modal-header">
              <h2>{editando ? "Editar Evento Sanitario" : "Registrar Evento Sanitario"}</h2>
              <button className="mod-modal-close" onClick={()=>setMostrarModal(false)}>✕</button>
            </div>
            <div className="mod-modal-body">
              {errorForm && <div className="mod-error">{errorForm}</div>}
              <div className="mod-form-grid">
                <div className="mod-field mod-field-full"><label>Animal <span className="mod-req">*</span></label>
                  <select value={form.ganado_id} onChange={set("ganado_id")}>
                    <option value="">— Selecciona un animal —</option>
                    {animalesActivos.map(g=><option key={g.id} value={g.id}>{animal(g)}</option>)}
                  </select>
                </div>
                <div className="mod-field"><label>Tipo <span className="mod-req">*</span></label>
                  <select value={form.tipo} onChange={set("tipo")}><option>Vacunacion</option><option>Tratamiento</option><option>Cirugia</option><option>Diagnostico</option><option>Revision</option><option>Desparasitacion</option></select>
                </div>
                <div className="mod-field"><label>Fecha <span className="mod-req">*</span></label><input type="date" value={form.fecha} onChange={set("fecha")} /></div>
                <div className="mod-field mod-field-full"><label>Descripción</label><input placeholder="Describe el procedimiento..." value={form.descripcion} onChange={set("descripcion")} /></div>
                <div className="mod-field"><label>Producto</label>
                  <select value={form.producto_id} onChange={set("producto_id")}>
                    <option value="">— Sin producto —</option>
                    {medicamentos.map(p=><option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select>
                </div>
                <div className="mod-field"><label>Dosis</label><input placeholder="Ej: 5 ml" value={form.dosis} onChange={set("dosis")} /></div>
                <div className="mod-field"><label>Vía de administración</label><input placeholder="Ej: Subcutánea" value={form.via_administracion} onChange={set("via_administracion")} /></div>
                <div className="mod-field"><label>Costo ($)</label><input type="number" min="0" placeholder="0" value={form.costo} onChange={set("costo")} /></div>
                <div className="mod-field"><label>Próxima fecha</label><input type="date" value={form.proxima_fecha} onChange={set("proxima_fecha")} /></div>
              </div>
            </div>
            <div className="mod-modal-footer">
              <button className="mod-btn-ghost" onClick={()=>setMostrarModal(false)}>Cancelar</button>
              <button className="mod-btn-primary" onClick={guardar} disabled={guardando}>{guardando ? "Guardando..." : "Guardar Evento"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
