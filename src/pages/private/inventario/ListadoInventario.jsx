import { useState } from "react";
import { getProductos, crearProducto, editarProducto, eliminarProducto, crearMovimiento } from "../../../services/ProductoService";
import { mensajeError } from "../../../services/api";
import useDatos from "../../../hooks/useDatos";
import { num, cantidad, limpiarForm } from "../../../utils/formato";

const TIPO_COLOR = { Alimento:"cat-green", Medicamento:"cat-blue", Insumo:"cat-earth", Herramienta:"cat-gray", Equipo:"cat-rust", Otro:"cat-gray" };
const ESTADO_EQ  = { Operativo:"est-ok", En_Reparacion:"est-warn", Dañado:"est-warn", Baja:"est-gray" };

const PRODUCTO_VACIO   = { nombre:"", tipo:"Alimento", categoria:"", unidad:"kg", cantidad_min:"", estado:"Operativo", activo:true };
const MOVIMIENTO_VACIO = { producto_id:"", tipo:"ENTRADA", cantidad:"" };

const bajo = (p) => p.activo && num(p.cantidad_actual) <= num(p.cantidad_min) && num(p.cantidad_min) > 0;

export default function ListadoInventario() {
  const { datos: productos, cargando, error, recargar } = useDatos(getProductos);

  const [busqueda,     setBusqueda]     = useState("");
  const [filtroTipo,   setFiltroTipo]   = useState("Todos");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modalTipo,    setModalTipo]    = useState("producto");
  const [editando,     setEditando]     = useState(null);
  const [form,         setForm]         = useState(PRODUCTO_VACIO);
  const [mov,          setMov]          = useState(MOVIMIENTO_VACIO);
  const [guardando,    setGuardando]    = useState(false);
  const [errorForm,    setErrorForm]    = useState("");
  const [errorAccion,  setErrorAccion]  = useState("");

  const filtrados = productos.filter(p => {
    const matchB = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const matchT = filtroTipo==="Todos" || p.tipo===filtroTipo;
    return matchB && matchT;
  });

  const stockBajo = productos.filter(bajo).length;

  const abrirProducto = (p = null) => {
    setEditando(p);
    setForm(p ? Object.fromEntries(Object.keys(PRODUCTO_VACIO).map(k => [k, p[k] ?? ""])) : PRODUCTO_VACIO);
    setModalTipo("producto"); setErrorForm(""); setMostrarModal(true);
  };
  const abrirMovimiento = (p = null) => {
    setMov({ ...MOVIMIENTO_VACIO, producto_id: p ? String(p.id) : (productos[0]?.id ?? "") });
    setModalTipo("movimiento"); setErrorForm(""); setMostrarModal(true);
  };

  const guardar = async () => {
    setErrorForm("");
    if (modalTipo==="producto" && !form.nombre.trim()) { setErrorForm("El nombre es obligatorio."); return; }
    if (modalTipo==="movimiento" && !(num(mov.cantidad) > 0 || (mov.tipo==="AJUSTE" && mov.cantidad!==""))) {
      setErrorForm("Indica una cantidad válida."); return;
    }
    setGuardando(true);
    try {
      if (modalTipo==="producto") {
        const datos = limpiarForm({ ...form, nombre: form.nombre.trim(), cantidad_min: form.cantidad_min || 0 });
        if (editando) await editarProducto(editando.id, datos);
        else          await crearProducto(datos);
      } else {
        await crearMovimiento({ producto_id: Number(mov.producto_id), tipo: mov.tipo, cantidad: num(mov.cantidad) });
      }
      setMostrarModal(false);
      recargar();
    } catch (e) {
      setErrorForm(e?.mensaje === "Registro duplicado" ? `Ya existe un producto llamado "${form.nombre}".` : mensajeError(e));
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (p) => {
    if (!window.confirm(`¿Eliminar "${p.nombre}"?`)) return;
    setErrorAccion("");
    try {
      await eliminarProducto(p.id);
      recargar();
    } catch (e) {
      setErrorAccion(e?.mensaje?.startsWith("No se puede eliminar")
        ? `"${p.nombre}" tiene movimientos o consumos registrados. En lugar de eliminarlo, edítalo y desmarca "Activo".`
        : mensajeError(e));
    }
  };

  const unidadMov = productos.find(p => String(p.id) === String(mov.producto_id))?.unidad || "";

  return (
    <div className="mod-page">
      <div className="mod-header">
        <div>
          <div className="mod-breadcrumb">Dashboard / <span>Inventario</span></div>
          <h1 className="mod-title">📦 Inventario General</h1>
          <p className="mod-subtitle">Tabla <code>producto</code> — alimentos, medicamentos, insumos y equipos</p>
        </div>
        <div style={{display:"flex",gap:"0.7rem",flexWrap:"wrap"}}>
          <button className="mod-btn-ghost" onClick={()=>abrirMovimiento()} disabled={!productos.length}>↕ Registrar Movimiento</button>
          <button className="mod-btn-primary" onClick={()=>abrirProducto()}>+ Nuevo Producto</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="mod-kpis">
        <div className="mod-kpi"><span className="mod-kpi-ico">📦</span><div><div className="mod-kpi-val">{productos.length}</div><div className="mod-kpi-lbl">Productos</div></div></div>
        <div className="mod-kpi"><span className="mod-kpi-ico">⚠️</span><div><div className="mod-kpi-val" style={{color:"var(--rust)"}}>{stockBajo}</div><div className="mod-kpi-lbl">Stock bajo (≤ mínimo)</div></div></div>
        <div className="mod-kpi"><span className="mod-kpi-ico">✅</span><div><div className="mod-kpi-val">{productos.filter(p=>p.activo && !bajo(p)).length}</div><div className="mod-kpi-lbl">En nivel óptimo</div></div></div>
        <div className="mod-kpi"><span className="mod-kpi-ico">🔧</span><div><div className="mod-kpi-val">{productos.filter(p=>p.estado!=="Operativo").length}</div><div className="mod-kpi-lbl">En reparación/baja</div></div></div>
      </div>

      {stockBajo>0 && (
        <div className="mod-alerta-stock">
          ⚠️ <strong>{stockBajo} producto{stockBajo>1?"s":""}</strong> con <code>cantidad_actual ≤ cantidad_min</code> — requieren reposición.
        </div>
      )}
      {error       && <div className="mod-error">No se pudo cargar el inventario: {error}</div>}
      {errorAccion && <div className="mod-error">{errorAccion}</div>}

      {/* Filtros */}
      <div className="mod-filtros">
        <input className="mod-search" placeholder="🔍  Buscar producto..." value={busqueda} onChange={e=>setBusqueda(e.target.value)} />
        <div className="mod-filtro-btns">
          {["Todos","Alimento","Medicamento","Insumo","Herramienta","Equipo","Otro"].map(t=>(
            <button key={t} className={`mod-filtro-btn ${filtroTipo===t?"active":""}`} onClick={()=>setFiltroTipo(t)}>{t}</button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div className="mod-tabla-wrap">
        <table className="mod-tabla">
          <thead>
            <tr><th>Nombre</th><th>Tipo</th><th>Categoría</th><th>Cantidad actual</th><th>Mínimo</th><th>Unidad</th><th>Estado equipo</th><th>Activo</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {filtrados.map(p=>(
              <tr key={p.id} className={bajo(p)?"row-warn":""}>
                <td><strong>{p.nombre}</strong></td>
                <td><span className={`mod-cat ${TIPO_COLOR[p.tipo]||"cat-gray"}`}>{p.tipo}</span></td>
                <td>{p.categoria || "—"}</td>
                <td><strong style={{color:bajo(p)?"var(--rust)":"inherit"}}>{cantidad(p.cantidad_actual)}</strong></td>
                <td>{cantidad(p.cantidad_min)}</td>
                <td>{p.unidad || "—"}</td>
                <td><span className={`mod-estado ${ESTADO_EQ[p.estado]||"est-gray"}`}>{p.estado.replace("_"," ")}</span></td>
                <td><span className={`mod-estado ${p.activo?"est-ok":"est-gray"}`}>{p.activo?"Sí":"No"}</span></td>
                <td>
                  <div className="mod-acciones">
                    <button className="mod-acc-btn" title="Registrar movimiento" onClick={()=>abrirMovimiento(p)}>↕</button>
                    <button className="mod-acc-btn" title="Editar" onClick={()=>abrirProducto(p)}>✏️</button>
                    <button className="mod-acc-btn mod-acc-del" title="Eliminar" onClick={()=>eliminar(p)}>🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {cargando && productos.length===0 && <div className="mod-empty">Cargando inventario...</div>}
        {!cargando && filtrados.length===0 && <div className="mod-empty">No se encontraron productos.</div>}
      </div>

      {/* Modal */}
      {mostrarModal && (
        <div className="mod-overlay" onClick={()=>setMostrarModal(false)}>
          <div className="mod-modal" onClick={e=>e.stopPropagation()}>
            <div className="mod-modal-header">
              <h2>{modalTipo==="producto" ? (editando ? `Editar ${editando.nombre}` : "Nuevo Producto") : "Registrar Movimiento"}</h2>
              <button className="mod-modal-close" onClick={()=>setMostrarModal(false)}>✕</button>
            </div>
            <div className="mod-modal-body">
              {errorForm && <div className="mod-error">{errorForm}</div>}
              {modalTipo==="producto" ? (
                <>
                  {!editando && (
                    <div className="mod-info-bar">
                      El producto se crea con stock en 0. Usa <strong>↕ Registrar Movimiento</strong> (ENTRADA) para cargar existencias — el trigger <code>trg_movimiento_producto</code> actualiza la cantidad.
                    </div>
                  )}
                  <div className="mod-form-grid">
                    <div className="mod-field mod-field-full"><label>Nombre <span className="mod-req">*</span></label><input placeholder="Ej: Concentrado Premium" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} /></div>
                    <div className="mod-field"><label>Tipo <span className="mod-req">*</span></label>
                      <select value={form.tipo} onChange={e=>setForm({...form,tipo:e.target.value})}><option>Alimento</option><option>Medicamento</option><option>Insumo</option><option>Herramienta</option><option>Equipo</option><option>Otro</option></select>
                    </div>
                    <div className="mod-field"><label>Categoría</label><input placeholder="Ej: Forraje, Antibiótico..." value={form.categoria} onChange={e=>setForm({...form,categoria:e.target.value})} /></div>
                    <div className="mod-field"><label>Unidad</label>
                      <select value={form.unidad} onChange={e=>setForm({...form,unidad:e.target.value})}><option>kg</option><option>ml</option><option>lts</option><option>und</option><option>dosis</option><option>bulto</option></select>
                    </div>
                    <div className="mod-field"><label>Cantidad mínima</label><input type="number" min="0" step="0.01" placeholder="0" value={form.cantidad_min} onChange={e=>setForm({...form,cantidad_min:e.target.value})} /></div>
                    <div className="mod-field"><label>Estado</label>
                      <select value={form.estado} onChange={e=>setForm({...form,estado:e.target.value})}><option value="Operativo">Operativo</option><option value="En_Reparacion">En reparación</option><option value="Dañado">Dañado</option><option value="Baja">Baja</option></select>
                    </div>
                    <div className="mod-field"><label>Activo</label>
                      <select value={form.activo ? "1" : "0"} onChange={e=>setForm({...form,activo:e.target.value==="1"})}><option value="1">Sí</option><option value="0">No</option></select>
                    </div>
                  </div>
                </>
              ) : (
                // tabla: movimiento_producto — campos: producto_id, tipo, cantidad
                <>
                  <div className="mod-info-bar">
                    <strong>ENTRADA</strong> suma y <strong>SALIDA</strong> resta (trigger <code>trg_movimiento_producto</code>). <strong>AJUSTE</strong> fija la cantidad contada físicamente.
                  </div>
                  <div className="mod-form-grid">
                    <div className="mod-field mod-field-full"><label>Producto <span className="mod-req">*</span></label>
                      <select value={mov.producto_id} onChange={e=>setMov({...mov,producto_id:e.target.value})}>
                        {productos.map(p=><option key={p.id} value={p.id}>{p.nombre} (actual: {cantidad(p.cantidad_actual)} {p.unidad})</option>)}
                      </select>
                    </div>
                    <div className="mod-field"><label>Tipo <span className="mod-req">*</span></label>
                      <select value={mov.tipo} onChange={e=>setMov({...mov,tipo:e.target.value})}><option>ENTRADA</option><option>SALIDA</option><option>AJUSTE</option></select>
                    </div>
                    <div className="mod-field"><label>{mov.tipo==="AJUSTE" ? "Cantidad final" : "Cantidad"} {unidadMov && `(${unidadMov})`} <span className="mod-req">*</span></label>
                      <input type="number" min="0" step="0.01" placeholder="0" value={mov.cantidad} onChange={e=>setMov({...mov,cantidad:e.target.value})} />
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="mod-modal-footer">
              <button className="mod-btn-ghost" onClick={()=>setMostrarModal(false)}>Cancelar</button>
              <button className="mod-btn-primary" onClick={guardar} disabled={guardando}>{guardando ? "Guardando..." : "Guardar"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
