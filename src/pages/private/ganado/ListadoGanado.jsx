import { useState } from "react";
import { getGanado, getPotreros, crearGanado, editarGanado, eliminarGanado } from "../../../services/GanadoService";
import { mensajeError } from "../../../services/api";
import useDatos from "../../../hooks/useDatos";
import { num, cantidad, limpiarForm } from "../../../utils/formato";

const VACIO = {
  codigo: "", nombre: "", sexo: "Hembra", categoria: "Vaca", raza: "", peso_actual: "",
  fecha_nacimiento: "", potrero_id: "", estado_general: "Activo", estado_comercial: "Disponible", observaciones: "",
};

export default function ListadoGanado() {
  const { datos: ganado, cargando, error, recargar } = useDatos(getGanado);
  const { datos: potreros } = useDatos(getPotreros);

  const [busqueda,     setBusqueda]     = useState("");
  const [filtroCateg,  setFiltroCateg]  = useState("Todos");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando,     setEditando]     = useState(null);
  const [form,         setForm]         = useState(VACIO);
  const [guardando,    setGuardando]    = useState(false);
  const [errorForm,    setErrorForm]    = useState("");
  const [errorAccion,  setErrorAccion]  = useState("");

  const filtrados = ganado.filter(a => {
    const texto  = `${a.nombre || ""} ${a.codigo}`.toLowerCase();
    const matchB = texto.includes(busqueda.toLowerCase());
    const matchC = filtroCateg  === "Todos" || a.categoria      === filtroCateg;
    const matchE = filtroEstado === "Todos" || a.estado_general === filtroEstado;
    return matchB && matchC && matchE;
  });

  const conPeso = ganado.filter(a => a.peso_actual != null);
  const pesoPromedio = conPeso.length ? Math.round(conPeso.reduce((s,a)=>s+num(a.peso_actual),0)/conPeso.length) : 0;

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const abrirNuevo = () => { setEditando(null); setForm(VACIO); setErrorForm(""); setMostrarModal(true); };
  const abrirEditar = (a) => {
    setEditando(a);
    setForm(Object.fromEntries(Object.keys(VACIO).map(k => [k, a[k] ?? ""])));
    setErrorForm("");
    setMostrarModal(true);
  };

  const guardar = async () => {
    if (!form.codigo.trim()) { setErrorForm("El código es obligatorio."); return; }
    setGuardando(true);
    setErrorForm("");
    try {
      const datos = limpiarForm({ ...form, codigo: form.codigo.trim() });
      if (editando) await editarGanado(editando.id, datos);
      else          await crearGanado(datos);
      setMostrarModal(false);
      recargar();
    } catch (e) {
      setErrorForm(e?.mensaje === "Registro duplicado" ? `Ya existe un animal con el código ${form.codigo}.` : mensajeError(e));
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (a) => {
    if (!window.confirm(`¿Eliminar a ${a.codigo}${a.nombre ? ` · ${a.nombre}` : ""}? Esta acción no se puede deshacer.`)) return;
    setErrorAccion("");
    try {
      await eliminarGanado(a.id);
      recargar();
    } catch (e) {
      setErrorAccion(e?.mensaje?.startsWith("No se puede eliminar")
        ? `${a.codigo} tiene historial (sanidad, reproducción, alimentación o ventas). En lugar de eliminarlo, márcalo como Inactivo.`
        : mensajeError(e));
    }
  };

  return (
    <div className="mod-page">
      {/* Header */}
      <div className="mod-header">
        <div>
          <div className="mod-breadcrumb">Dashboard / <span>Ganado</span></div>
          <h1 className="mod-title">🐄 Gestión de Ganado</h1>
          <p className="mod-subtitle">Registro y control de animales — tabla <code>ganado</code></p>
        </div>
        <button className="mod-btn-primary" onClick={abrirNuevo}>+ Registrar Animal</button>
      </div>

      {/* KPIs */}
      <div className="mod-kpis">
        <div className="mod-kpi"><span className="mod-kpi-ico">🐄</span><div><div className="mod-kpi-val">{ganado.length}</div><div className="mod-kpi-lbl">Total registros</div></div></div>
        <div className="mod-kpi"><span className="mod-kpi-ico">✅</span><div><div className="mod-kpi-val">{ganado.filter(a=>a.estado_general==="Activo").length}</div><div className="mod-kpi-lbl">Activos</div></div></div>
        <div className="mod-kpi"><span className="mod-kpi-ico">💰</span><div><div className="mod-kpi-val">{ganado.filter(a=>a.estado_comercial==="Disponible").length}</div><div className="mod-kpi-lbl">Disponibles venta</div></div></div>
        <div className="mod-kpi"><span className="mod-kpi-ico">⚖️</span><div><div className="mod-kpi-val">{pesoPromedio} kg</div><div className="mod-kpi-lbl">Peso promedio</div></div></div>
      </div>

      {error       && <div className="mod-error">No se pudo cargar el ganado: {error}</div>}
      {errorAccion && <div className="mod-error">{errorAccion}</div>}

      {/* Filtros */}
      <div className="mod-filtros">
        <input className="mod-search" placeholder="🔍  Buscar por nombre o código..." value={busqueda} onChange={e=>setBusqueda(e.target.value)} />
        <div className="mod-filtro-btns">
          {["Todos","Ternero","Novillo","Vaca","Toro","Otro"].map(c=>(
            <button key={c} className={`mod-filtro-btn ${filtroCateg===c?"active":""}`} onClick={()=>setFiltroCateg(c)}>{c}</button>
          ))}
        </div>
        <div className="mod-filtro-btns">
          {["Todos","Activo","Inactivo"].map(e=>(
            <button key={e} className={`mod-filtro-btn ${filtroEstado===e?"active":""}`} onClick={()=>setFiltroEstado(e)}>{e}</button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div className="mod-tabla-wrap">
        <table className="mod-tabla">
          <thead>
            <tr>
              <th>Código</th><th>Nombre</th><th>Sexo</th><th>Categoría</th><th>Raza</th>
              <th>Peso (kg)</th><th>Potrero</th><th>Estado general</th><th>Est. comercial</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map(a=>(
              <tr key={a.id}>
                <td><span className="mod-codigo">{a.codigo}</span></td>
                <td><strong>{a.nombre || "—"}</strong></td>
                <td>{a.sexo==="Hembra"?"♀ Hembra":"♂ Macho"}</td>
                <td><span className="mod-cat cat-green">{a.categoria}</span></td>
                <td>{a.raza || "—"}</td>
                <td><strong>{a.peso_actual != null ? cantidad(a.peso_actual) : "—"}</strong></td>
                <td>{a.Potrero?.nombre || "—"}</td>
                <td><span className={`mod-estado ${a.estado_general==="Activo"?"est-ok":"est-gray"}`}>{a.estado_general}</span></td>
                <td><span className={`mod-estado ${a.estado_comercial==="Disponible"?"est-blue":a.estado_comercial==="Vendido"?"est-gray":"est-warn"}`}>{a.estado_comercial}</span></td>
                <td>
                  <div className="mod-acciones">
                    <button className="mod-acc-btn" title="Editar" onClick={()=>abrirEditar(a)}>✏️</button>
                    <button className="mod-acc-btn mod-acc-del" title="Eliminar" onClick={()=>eliminar(a)}>🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {cargando && ganado.length===0 && <div className="mod-empty">Cargando animales...</div>}
        {!cargando && filtrados.length===0 && <div className="mod-empty">No se encontraron animales.</div>}
      </div>

      {/* Modal */}
      {mostrarModal && (
        <div className="mod-overlay" onClick={()=>setMostrarModal(false)}>
          <div className="mod-modal" onClick={e=>e.stopPropagation()}>
            <div className="mod-modal-header">
              <h2>{editando ? `Editar ${editando.codigo}` : "Registrar Nuevo Animal"}</h2>
              <button className="mod-modal-close" onClick={()=>setMostrarModal(false)}>✕</button>
            </div>
            <div className="mod-modal-body">
              {errorForm && <div className="mod-error">{errorForm}</div>}
              <div className="mod-form-grid">
                <div className="mod-field"><label>Código <span className="mod-req">*</span></label><input placeholder="Ej: GN-050" value={form.codigo} onChange={set("codigo")} /></div>
                <div className="mod-field"><label>Nombre</label><input placeholder="Ej: La Negra" value={form.nombre} onChange={set("nombre")} /></div>
                <div className="mod-field"><label>Sexo <span className="mod-req">*</span></label>
                  <select value={form.sexo} onChange={set("sexo")}><option value="Hembra">Hembra</option><option value="Macho">Macho</option></select>
                </div>
                <div className="mod-field"><label>Categoría <span className="mod-req">*</span></label>
                  <select value={form.categoria} onChange={set("categoria")}><option>Ternero</option><option>Novillo</option><option>Vaca</option><option>Toro</option><option>Otro</option></select>
                </div>
                <div className="mod-field"><label>Raza</label><input placeholder="Ej: Brahman" value={form.raza} onChange={set("raza")} /></div>
                <div className="mod-field"><label>Peso actual (kg)</label><input type="number" min="0" step="0.01" placeholder="0" value={form.peso_actual} onChange={set("peso_actual")} /></div>
                <div className="mod-field"><label>Fecha de nacimiento</label><input type="date" value={form.fecha_nacimiento} onChange={set("fecha_nacimiento")} /></div>
                <div className="mod-field"><label>Potrero</label>
                  <select value={form.potrero_id} onChange={set("potrero_id")}>
                    <option value="">— Sin potrero —</option>
                    {potreros.map(p=><option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select>
                </div>
                <div className="mod-field"><label>Estado general</label>
                  <select value={form.estado_general} onChange={set("estado_general")}><option>Activo</option><option>Inactivo</option></select>
                </div>
                <div className="mod-field"><label>Estado comercial</label>
                  <select value={form.estado_comercial} onChange={set("estado_comercial")}><option>Disponible</option><option>Vendido</option><option>Descartado</option></select>
                </div>
                <div className="mod-field mod-field-full"><label>Observaciones</label><input placeholder="Notas adicionales..." value={form.observaciones} onChange={set("observaciones")} /></div>
              </div>
            </div>
            <div className="mod-modal-footer">
              <button className="mod-btn-ghost" onClick={()=>setMostrarModal(false)}>Cancelar</button>
              <button className="mod-btn-primary" onClick={guardar} disabled={guardando}>{guardando ? "Guardando..." : "Guardar Animal"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
