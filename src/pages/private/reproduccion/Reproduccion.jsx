import { useState } from "react";
import { getReproducciones, crearReproduccion, editarReproduccion, eliminarReproduccion, getGanado } from "../../../services/GanadoService";
import { mensajeError } from "../../../services/api";
import useDatos from "../../../hooks/useDatos";
import { animal, hoyISO, diasHasta, limpiarForm } from "../../../utils/formato";

// tabla: reproduccion
// campos: vaca_id, tipo_servicio, toro_id, proveedor_genetico,
//         fecha_servicio, fecha_probable_parto (trigger auto +283d),
//         fecha_parto, estado, cria_codigo
const EST_COLOR  = { Pendiente:"est-gray", Gestante:"est-blue", Parto:"est-ok", Fallida:"est-warn", Aborto:"est-warn" };
const SERV_COLOR = { Monta_Natural:"cat-green", Inseminacion:"cat-blue" };

const VACIO = { vaca_id:"", tipo_servicio:"Monta_Natural", toro_id:"", proveedor_genetico:"", fecha_servicio:"", estado:"Pendiente", fecha_parto:"", cria_codigo:"" };

// Días de gestación transcurridos desde el servicio
const diasGestacion = (fechaServicio) => -diasHasta(fechaServicio);

export default function Reproduccion() {
  const { datos: registros, cargando, error, recargar } = useDatos(getReproducciones);
  const { datos: ganado } = useDatos(getGanado);

  const [filtroEst,    setFiltroEst]    = useState("Todos");
  const [busqueda,     setBusqueda]     = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando,     setEditando]     = useState(null);
  const [form,         setForm]         = useState(VACIO);
  const [guardando,    setGuardando]    = useState(false);
  const [errorForm,    setErrorForm]    = useState("");
  const [errorAccion,  setErrorAccion]  = useState("");
  const [aviso,        setAviso]        = useState("");

  const filtrados = registros.filter(r => {
    const matchB = animal(r.vaca).toLowerCase().includes(busqueda.toLowerCase());
    const matchE = filtroEst==="Todos" || r.estado===filtroEst;
    return matchB && matchE;
  });

  const vacas = ganado.filter(g => g.sexo === "Hembra" && g.estado_general === "Activo" && g.categoria !== "Ternero");
  const toros = ganado.filter(g => g.sexo === "Macho"  && g.estado_general === "Activo" && g.categoria === "Toro");

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const abrirNuevo = () => {
    setEditando(null);
    setForm({ ...VACIO, fecha_servicio: hoyISO(), toro_id: toros[0]?.id ?? "" });
    setErrorForm(""); setMostrarModal(true);
  };
  const abrirEditar = (r) => {
    setEditando(r);
    setForm(Object.fromEntries(Object.keys(VACIO).map(k => [k, r[k] ?? ""])));
    setErrorForm(""); setMostrarModal(true);
  };

  const guardar = async () => {
    setErrorForm("");
    if (!form.vaca_id || !form.fecha_servicio) { setErrorForm("Vaca y fecha de servicio son obligatorias."); return; }
    if (form.estado === "Parto" && !form.fecha_parto) { setErrorForm("Indica la fecha del parto."); return; }
    setGuardando(true);
    try {
      const datos = limpiarForm({
        ...form,
        toro_id:            form.tipo_servicio === "Monta_Natural" ? form.toro_id : "",
        proveedor_genetico: form.tipo_servicio === "Inseminacion"  ? form.proveedor_genetico : "",
        cria_codigo:        form.cria_codigo.trim(),
      });
      if (editando) await editarReproduccion(editando.id, datos);
      else          await crearReproduccion(datos);
      setMostrarModal(false);
      setAviso(datos.estado === "Parto" && datos.cria_codigo
        ? `Parto registrado. La cría ${datos.cria_codigo} se agregó automáticamente al módulo de Ganado (trigger trg_crear_cria).`
        : "");
      recargar();
    } catch (e) {
      setErrorForm(e?.mensaje === "Registro duplicado" ? `Ya existe un animal con el código ${form.cria_codigo}.` : mensajeError(e));
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (r) => {
    if (!window.confirm(`¿Eliminar el servicio de ${animal(r.vaca)} del ${r.fecha_servicio}?`)) return;
    setErrorAccion("");
    try { await eliminarReproduccion(r.id); recargar(); }
    catch (e) { setErrorAccion(mensajeError(e)); }
  };

  const cerrado = editando && editando.estado === "Parto" && editando.cria_codigo;

  return (
    <div className="mod-page">
      <div className="mod-header">
        <div>
          <div className="mod-breadcrumb">Dashboard / <span>Reproducción</span></div>
          <h1 className="mod-title">🧬 Reproducción y Genética</h1>
          <p className="mod-subtitle">Tabla <code>reproduccion</code> — servicios, gestaciones y partos</p>
        </div>
        <button className="mod-btn-primary" onClick={abrirNuevo}>+ Registrar Servicio</button>
      </div>

      {/* KPIs */}
      <div className="mod-kpis">
        <div className="mod-kpi"><span className="mod-kpi-ico">📋</span><div><div className="mod-kpi-val">{registros.length}</div><div className="mod-kpi-lbl">Total registros</div></div></div>
        <div className="mod-kpi"><span className="mod-kpi-ico">🤰</span><div><div className="mod-kpi-val">{registros.filter(r=>r.estado==="Gestante").length}</div><div className="mod-kpi-lbl">Gestantes activas</div></div></div>
        <div className="mod-kpi"><span className="mod-kpi-ico">🍼</span><div><div className="mod-kpi-val">{registros.filter(r=>r.estado==="Parto").length}</div><div className="mod-kpi-lbl">Partos registrados</div></div></div>
        <div className="mod-kpi"><span className="mod-kpi-ico">🧬</span><div><div className="mod-kpi-val">{registros.filter(r=>r.tipo_servicio==="Inseminacion").length}</div><div className="mod-kpi-lbl">Inseminaciones</div></div></div>
      </div>

      {aviso       && <div className="mod-info-bar">✅ {aviso}</div>}
      {error       && <div className="mod-error">No se pudieron cargar los registros: {error}</div>}
      {errorAccion && <div className="mod-error">{errorAccion}</div>}

      {/* Filtros */}
      <div className="mod-filtros">
        <input className="mod-search" placeholder="🔍  Buscar vaca..." value={busqueda} onChange={e=>setBusqueda(e.target.value)} />
        <div className="mod-filtro-btns">
          {["Todos","Pendiente","Gestante","Parto","Fallida","Aborto"].map(s=>(
            <button key={s} className={`mod-filtro-btn ${filtroEst===s?"active":""}`} onClick={()=>setFiltroEst(s)}>{s}</button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div className="mod-tabla-wrap">
        <table className="mod-tabla">
          <thead>
            <tr>
              <th>Vaca</th><th>Servicio</th><th>Toro / Proveedor</th>
              <th>Fecha servicio</th><th>Parto probable ⚡</th><th>Días gest.</th>
              <th>Fecha parto</th><th>Estado</th><th>Cría</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map(r=>{
              const faltan = r.fecha_probable_parto ? diasHasta(r.fecha_probable_parto) : null;
              return (
                <tr key={r.id}>
                  <td><span className="mod-codigo">{animal(r.vaca)}</span></td>
                  <td><span className={`mod-cat ${SERV_COLOR[r.tipo_servicio]}`}>{r.tipo_servicio.replace("_"," ")}</span></td>
                  <td>
                    {r.tipo_servicio==="Monta_Natural"
                      ? <span className="mod-codigo" style={{fontSize:"0.72rem"}}>{animal(r.toro)}</span>
                      : <span style={{color:"var(--sky)",fontSize:"0.8rem"}}>{r.proveedor_genetico || "—"}</span>
                    }
                  </td>
                  <td>{r.fecha_servicio}</td>
                  <td>
                    <span style={{display:"flex",alignItems:"center",gap:"4px",whiteSpace:"nowrap"}}>
                      <span className="mod-est-badge">⚡</span>
                      {r.fecha_probable_parto || "—"}
                      {r.estado==="Gestante" && faltan!=null && faltan<=30 && (
                        <span className="mod-estado est-warn" style={{marginLeft:4}}>{faltan<0 ? `+${-faltan} d` : `en ${faltan} d`}</span>
                      )}
                    </span>
                  </td>
                  <td>
                    {r.estado==="Gestante"
                      ? <strong>{diasGestacion(r.fecha_servicio)} / 283</strong>
                      : <span style={{color:"var(--text-xs)"}}>—</span>}
                  </td>
                  <td>{r.fecha_parto || <span style={{color:"var(--text-xs)"}}>—</span>}</td>
                  <td><span className={`mod-estado ${EST_COLOR[r.estado]||"est-gray"}`}>{r.estado}</span></td>
                  <td>
                    {r.cria_codigo
                      ? <span className="mod-codigo" style={{background:"rgba(46,125,46,0.15)"}}>{r.cria_codigo}</span>
                      : <span style={{color:"var(--text-xs)"}}>—</span>}
                  </td>
                  <td>
                    <div className="mod-acciones">
                      <button className="mod-acc-btn" title={r.estado==="Parto" && r.cria_codigo ? "Ver" : "Actualizar estado / registrar parto"} onClick={()=>abrirEditar(r)}>{r.estado==="Parto" && r.cria_codigo ? "👁" : "✏️"}</button>
                      <button className="mod-acc-btn mod-acc-del" title="Eliminar" onClick={()=>eliminar(r)}>🗑</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {cargando && registros.length===0 && <div className="mod-empty">Cargando registros...</div>}
        {!cargando && filtrados.length===0 && <div className="mod-empty">No se encontraron registros.</div>}
      </div>

      {/* Modal */}
      {mostrarModal && (
        <div className="mod-overlay" onClick={()=>setMostrarModal(false)}>
          <div className="mod-modal" onClick={e=>e.stopPropagation()}>
            <div className="mod-modal-header">
              <h2>{editando ? `Servicio de ${animal(editando.vaca)}` : "Registrar Servicio Reproductivo"}</h2>
              <button className="mod-modal-close" onClick={()=>setMostrarModal(false)}>✕</button>
            </div>
            <div className="mod-modal-body">
              {errorForm && <div className="mod-error">{errorForm}</div>}
              {cerrado ? (
                <div className="mod-info-bar">🍼 Parto cerrado el {editando.fecha_parto}. La cría <strong>{editando.cria_codigo}</strong> ya está registrada en Ganado.</div>
              ) : (
                <div className="mod-info-bar">
                  ⚡ <strong>Parto probable</strong> se calcula con el trigger <code>trg_fecha_parto</code> (fecha de servicio + 283 días).
                  Al pasar a <strong>Parto</strong> con código de cría, <code>trg_crear_cria</code> registra la cría en Ganado.
                </div>
              )}
              <fieldset disabled={!!cerrado} style={{border:"none",padding:0,margin:0}}>
                <div className="mod-form-grid">
                  <div className="mod-field"><label>Vaca <span className="mod-req">*</span></label>
                    <select value={form.vaca_id} onChange={set("vaca_id")} disabled={!!editando}>
                      <option value="">— Selecciona —</option>
                      {(editando ? [editando.vaca] : vacas).map(g=><option key={g.id} value={g.id}>{animal(g)}</option>)}
                    </select>
                  </div>
                  <div className="mod-field"><label>Tipo de servicio <span className="mod-req">*</span></label>
                    <select value={form.tipo_servicio} onChange={set("tipo_servicio")}><option value="Monta_Natural">Monta natural</option><option value="Inseminacion">Inseminación</option></select>
                  </div>
                  {form.tipo_servicio==="Monta_Natural" ? (
                    <div className="mod-field"><label>Toro</label>
                      <select value={form.toro_id} onChange={set("toro_id")}>
                        <option value="">— Sin especificar —</option>
                        {toros.map(g=><option key={g.id} value={g.id}>{animal(g)}</option>)}
                      </select>
                    </div>
                  ) : (
                    <div className="mod-field"><label>Proveedor genético</label><input placeholder="Ej: ABS Global" value={form.proveedor_genetico} onChange={set("proveedor_genetico")} /></div>
                  )}
                  <div className="mod-field"><label>Fecha de servicio <span className="mod-req">*</span></label><input type="date" value={form.fecha_servicio} onChange={set("fecha_servicio")} disabled={!!editando} /></div>
                  <div className="mod-field"><label>Estado</label>
                    <select value={form.estado} onChange={set("estado")}><option>Pendiente</option><option>Gestante</option><option>Fallida</option><option>Parto</option><option>Aborto</option></select>
                  </div>
                  {form.estado==="Parto" && <>
                    <div className="mod-field"><label>Fecha de parto <span className="mod-req">*</span></label><input type="date" value={form.fecha_parto} onChange={set("fecha_parto")} /></div>
                    <div className="mod-field"><label>Código de la cría</label><input placeholder="Ej: GN-052" value={form.cria_codigo} onChange={set("cria_codigo")} /></div>
                  </>}
                </div>
              </fieldset>
            </div>
            <div className="mod-modal-footer">
              <button className="mod-btn-ghost" onClick={()=>setMostrarModal(false)}>{cerrado ? "Cerrar" : "Cancelar"}</button>
              {!cerrado && <button className="mod-btn-primary" onClick={guardar} disabled={guardando}>{guardando ? "Guardando..." : "Guardar"}</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
