import { useState } from "react";
import { getAlimentacion, crearAlimentacion, eliminarAlimentacion, getProductos } from "../../../services/ProductoService";
import { getGanado } from "../../../services/GanadoService";
import { mensajeError } from "../../../services/api";
import useDatos from "../../../hooks/useDatos";
import { num, cantidad, animal, hoyISO } from "../../../utils/formato";

// tabla: alimentacion
// campos: ganado_id, producto_id, fecha, cantidad, observacion
const VACIO = { ganado_id:"", producto_id:"", fecha:"", cantidad:"", observacion:"" };

export default function Alimentacion() {
  const { datos: raciones, cargando, error, recargar } = useDatos(getAlimentacion);
  const { datos: ganado }    = useDatos(getGanado);
  const { datos: productos, recargar: recargarProductos } = useDatos(getProductos);

  const [busqueda,     setBusqueda]     = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [form,         setForm]         = useState(VACIO);
  const [guardando,    setGuardando]    = useState(false);
  const [errorForm,    setErrorForm]    = useState("");
  const [errorAccion,  setErrorAccion]  = useState("");

  const filtrados = raciones.filter(r =>
    `${animal(r.Ganado)} ${r.Producto?.nombre || ""}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  const animales  = ganado.filter(g => g.estado_general === "Activo");
  const alimentos = productos.filter(p => p.tipo === "Alimento" && p.activo);
  const elegido   = alimentos.find(p => String(p.id) === String(form.producto_id));

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const abrirNuevo = () => {
    setForm({ ...VACIO, fecha: hoyISO(), producto_id: alimentos[0]?.id ?? "" });
    setErrorForm(""); setMostrarModal(true);
  };

  const guardar = async () => {
    setErrorForm("");
    if (!form.ganado_id || !form.producto_id || !form.fecha || !(num(form.cantidad) > 0)) {
      setErrorForm("Animal, producto, fecha y una cantidad mayor a 0 son obligatorios."); return;
    }
    if (elegido && num(form.cantidad) > num(elegido.cantidad_actual)) {
      setErrorForm(`Solo hay ${cantidad(elegido.cantidad_actual)} ${elegido.unidad || ""} de ${elegido.nombre} en inventario.`); return;
    }
    setGuardando(true);
    try {
      await crearAlimentacion({ ...form, cantidad: num(form.cantidad), observacion: form.observacion || null });
      setMostrarModal(false);
      recargar();
      recargarProductos();
    } catch (e) {
      setErrorForm(mensajeError(e));
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (r) => {
    if (!window.confirm(`¿Eliminar la ración de ${animal(r.Ganado)} del ${r.fecha}? (El inventario no se devuelve automáticamente.)`)) return;
    setErrorAccion("");
    try { await eliminarAlimentacion(r.id); recargar(); }
    catch (e) { setErrorAccion(mensajeError(e)); }
  };

  return (
    <div className="mod-page">
      <div className="mod-header">
        <div>
          <div className="mod-breadcrumb">Dashboard / <span>Alimentación</span></div>
          <h1 className="mod-title">🌾 Alimentación</h1>
          <p className="mod-subtitle">Tabla <code>alimentacion</code> — raciones diarias por animal y producto</p>
        </div>
        <button className="mod-btn-primary" onClick={abrirNuevo}>+ Registrar Ración</button>
      </div>

      {/* KPIs */}
      <div className="mod-kpis">
        <div className="mod-kpi"><span className="mod-kpi-ico">🍽️</span><div><div className="mod-kpi-val">{raciones.length}</div><div className="mod-kpi-lbl">Raciones registradas</div></div></div>
        <div className="mod-kpi"><span className="mod-kpi-ico">⚖️</span><div><div className="mod-kpi-val">{cantidad(raciones.reduce((s,r)=>s+num(r.cantidad),0))}</div><div className="mod-kpi-lbl">Cantidad total suministrada</div></div></div>
        <div className="mod-kpi"><span className="mod-kpi-ico">🐄</span><div><div className="mod-kpi-val">{new Set(raciones.map(r=>r.ganado_id)).size}</div><div className="mod-kpi-lbl">Animales alimentados</div></div></div>
        <div className="mod-kpi"><span className="mod-kpi-ico">📦</span><div><div className="mod-kpi-val">{new Set(raciones.map(r=>r.producto_id)).size}</div><div className="mod-kpi-lbl">Productos usados</div></div></div>
      </div>

      {error       && <div className="mod-error">No se pudieron cargar las raciones: {error}</div>}
      {errorAccion && <div className="mod-error">{errorAccion}</div>}

      {/* Filtro */}
      <div className="mod-filtros">
        <input className="mod-search" placeholder="🔍  Buscar animal o producto..." value={busqueda} onChange={e=>setBusqueda(e.target.value)} />
      </div>

      {/* Tabla */}
      <div className="mod-tabla-wrap">
        <table className="mod-tabla">
          <thead>
            <tr><th>Animal</th><th>Producto</th><th>Fecha</th><th>Cantidad</th><th>Observación</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {filtrados.map(r=>(
              <tr key={r.id}>
                <td><span className="mod-codigo">{animal(r.Ganado)}</span></td>
                <td><strong>{r.Producto?.nombre}</strong></td>
                <td>{r.fecha}</td>
                <td><strong>{cantidad(r.cantidad)}</strong> {r.Producto?.unidad}</td>
                <td>{r.observacion || <span style={{color:"var(--text-xs)"}}>—</span>}</td>
                <td>
                  <div className="mod-acciones">
                    <button className="mod-acc-btn mod-acc-del" title="Eliminar" onClick={()=>eliminar(r)}>🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {cargando && raciones.length===0 && <div className="mod-empty">Cargando raciones...</div>}
        {!cargando && filtrados.length===0 && <div className="mod-empty">No se encontraron raciones.</div>}
      </div>

      {/* Modal */}
      {mostrarModal && (
        <div className="mod-overlay" onClick={()=>setMostrarModal(false)}>
          <div className="mod-modal" onClick={e=>e.stopPropagation()}>
            <div className="mod-modal-header">
              <h2>Registrar Ración</h2>
              <button className="mod-modal-close" onClick={()=>setMostrarModal(false)}>✕</button>
            </div>
            <div className="mod-modal-body">
              {errorForm && <div className="mod-error">{errorForm}</div>}
              <div className="mod-info-bar">La ración descuenta el producto del inventario (movimiento de <strong>SALIDA</strong>).</div>
              <div className="mod-form-grid">
                <div className="mod-field"><label>Animal <span className="mod-req">*</span></label>
                  <select value={form.ganado_id} onChange={set("ganado_id")}>
                    <option value="">— Selecciona —</option>
                    {animales.map(g=><option key={g.id} value={g.id}>{animal(g)}</option>)}
                  </select>
                </div>
                <div className="mod-field"><label>Producto <span className="mod-req">*</span></label>
                  <select value={form.producto_id} onChange={set("producto_id")}>
                    {alimentos.map(p=><option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select>
                </div>
                <div className="mod-field"><label>Fecha <span className="mod-req">*</span></label><input type="date" value={form.fecha} onChange={set("fecha")} /></div>
                <div className="mod-field">
                  <label>Cantidad {elegido?.unidad && `(${elegido.unidad})`} <span className="mod-req">*</span></label>
                  <input type="number" min="0" step="0.01" placeholder="0" value={form.cantidad} onChange={set("cantidad")} />
                  {elegido && <small style={{color:"var(--text-xs)"}}>Disponible: {cantidad(elegido.cantidad_actual)} {elegido.unidad}</small>}
                </div>
                <div className="mod-field mod-field-full"><label>Observación</label><input placeholder="Notas sobre la ración..." value={form.observacion} onChange={set("observacion")} /></div>
              </div>
            </div>
            <div className="mod-modal-footer">
              <button className="mod-btn-ghost" onClick={()=>setMostrarModal(false)}>Cancelar</button>
              <button className="mod-btn-primary" onClick={guardar} disabled={guardando}>{guardando ? "Guardando..." : "Guardar Ración"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
