import { useState } from "react";
import { getVentas, crearVenta } from "../../../services/VentaService";
import { getGanado } from "../../../services/GanadoService";
import { mensajeError } from "../../../services/api";
import useDatos from "../../../hooks/useDatos";
import { num, pesos, cantidad, animal, hoyISO } from "../../../utils/formato";

// tabla principal: venta
// campos: finca_id, cliente, numero_factura (trigger auto), fecha, total
// tabla detalle: detalle_venta_ganado — venta_id, ganado_id, precio
const NUEVA = { cliente:"", fecha:"", items:[{ ganado_id:"", precio:"" }] };

// Nombre legible de una línea de detalle_venta_producto
const lineaProducto = (d) =>
  d.Producto ? d.Producto.nombre : d.Produccion ? `Producción de ${d.Produccion.tipo.toLowerCase()} #${d.Produccion.id}` : "Ítem";

export default function ListadoVentas() {
  const { datos: ventas, cargando, error, recargar } = useDatos(getVentas);
  const { datos: ganado, recargar: recargarGanado } = useDatos(getGanado);

  const [busqueda,     setBusqueda]     = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [ventaDetalle, setVentaDetalle] = useState(null);
  const [form,         setForm]         = useState(NUEVA);
  const [guardando,    setGuardando]    = useState(false);
  const [errorForm,    setErrorForm]    = useState("");
  const [aviso,        setAviso]        = useState("");

  const filtrados = ventas.filter(v =>
    `${v.cliente} ${v.numero_factura || ""}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalFacturado = ventas.reduce((s,v)=>s+num(v.total),0);
  const animalesVendidos = ventas.reduce((s,v)=>s+(v.DetalleVentaGanados?.length || 0),0);

  const disponibles = ganado.filter(g => g.estado_comercial === "Disponible" && g.estado_general === "Activo");
  const elegidos    = form.items.map(it => String(it.ganado_id));
  const totalNueva  = form.items.reduce((s,it)=>s+num(it.precio),0);

  const abrirNueva = () => { setForm({ ...NUEVA, fecha: hoyISO() }); setErrorForm(""); setMostrarModal(true); };

  const setItem = (i, campo, valor) =>
    setForm({ ...form, items: form.items.map((it, j) => j === i ? { ...it, [campo]: valor } : it) });
  const agregarItem = () => setForm({ ...form, items: [...form.items, { ganado_id:"", precio:"" }] });
  const quitarItem  = (i) => setForm({ ...form, items: form.items.filter((_, j) => j !== i) });

  const guardar = async () => {
    setErrorForm("");
    const items = form.items.filter(it => it.ganado_id);
    if (!form.cliente.trim() || !form.fecha) { setErrorForm("Cliente y fecha son obligatorios."); return; }
    if (!items.length) { setErrorForm("Agrega al menos un animal."); return; }
    if (items.some(it => !(num(it.precio) > 0))) { setErrorForm("Cada animal debe tener un precio mayor a 0."); return; }
    setGuardando(true);
    try {
      const venta = await crearVenta({
        cliente: form.cliente.trim(),
        fecha: form.fecha,
        ganadoItems: items.map(it => ({ ganado_id: Number(it.ganado_id), precio: num(it.precio) })),
      });
      setMostrarModal(false);
      setAviso(`Venta registrada con factura ${venta.numero_factura} por ${pesos(venta.total)}. Los animales quedaron como "Vendido".`);
      recargar();
      recargarGanado();
    } catch (e) {
      setErrorForm(mensajeError(e));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="mod-page">
      <div className="mod-header">
        <div>
          <div className="mod-breadcrumb">Dashboard / <span>Ventas</span></div>
          <h1 className="mod-title">💰 Ventas</h1>
          <p className="mod-subtitle">Tabla <code>venta</code> + <code>detalle_venta_ganado</code> — facturación automática por trigger</p>
        </div>
        <button className="mod-btn-primary" onClick={abrirNueva}>+ Nueva Venta</button>
      </div>

      {/* KPIs */}
      <div className="mod-kpis">
        <div className="mod-kpi"><span className="mod-kpi-ico">📄</span><div><div className="mod-kpi-val">{ventas.length}</div><div className="mod-kpi-lbl">Facturas emitidas</div></div></div>
        <div className="mod-kpi"><span className="mod-kpi-ico">💵</span><div><div className="mod-kpi-val">${(totalFacturado/1000000).toFixed(1)}M</div><div className="mod-kpi-lbl">Total facturado</div></div></div>
        <div className="mod-kpi"><span className="mod-kpi-ico">🐄</span><div><div className="mod-kpi-val">{animalesVendidos}</div><div className="mod-kpi-lbl">Animales vendidos</div></div></div>
        <div className="mod-kpi"><span className="mod-kpi-ico">👤</span><div><div className="mod-kpi-val">{new Set(ventas.map(v=>v.cliente)).size}</div><div className="mod-kpi-lbl">Clientes distintos</div></div></div>
      </div>

      {/* Nota trigger */}
      <div className="mod-info-bar">
        ⚡ <strong>numero_factura</strong> se genera automáticamente con el trigger <code>trg_numero_factura</code> al insertar en <code>venta</code>
      </div>
      {aviso && <div className="mod-info-bar">✅ {aviso}</div>}
      {error && <div className="mod-error">No se pudieron cargar las ventas: {error}</div>}

      {/* Filtro */}
      <div className="mod-filtros">
        <input className="mod-search" placeholder="🔍  Buscar por cliente o número de factura..." value={busqueda} onChange={e=>setBusqueda(e.target.value)} />
      </div>

      {/* Tabla */}
      <div className="mod-tabla-wrap">
        <table className="mod-tabla">
          <thead>
            <tr><th>N° factura</th><th>Cliente</th><th>Fecha</th><th>Detalle</th><th>Total</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {filtrados.map(v=>(
              <tr key={v.id}>
                <td><span className="mod-codigo">{v.numero_factura}</span></td>
                <td><strong>{v.cliente}</strong></td>
                <td>{v.fecha}</td>
                <td>
                  <div style={{display:"flex",gap:"4px",flexWrap:"wrap"}}>
                    {v.DetalleVentaGanados?.map(d=>(
                      <span key={d.id} className="mod-codigo" style={{fontSize:"0.7rem"}}>{d.Ganado?.codigo}</span>
                    ))}
                    {v.DetalleVentaProductos?.map(d=>(
                      <span key={d.id} className="mod-cat cat-earth" style={{fontSize:"0.7rem"}}>{lineaProducto(d)}</span>
                    ))}
                  </div>
                </td>
                <td><strong style={{color:"var(--green-corp)"}}>{pesos(v.total)}</strong></td>
                <td>
                  <div className="mod-acciones">
                    <button className="mod-acc-btn" title="Ver detalle" onClick={()=>setVentaDetalle(v)}>👁</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          {filtrados.length>0 && (
            <tfoot>
              <tr>
                <td colSpan={4} style={{textAlign:"right",fontWeight:700,padding:"0.7rem 1rem",color:"var(--text-lt)",fontSize:"0.82rem"}}>TOTAL:</td>
                <td style={{fontWeight:900,padding:"0.7rem 1rem",color:"var(--green-dk)"}}>{pesos(filtrados.reduce((s,v)=>s+num(v.total),0))}</td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
        {cargando && ventas.length===0 && <div className="mod-empty">Cargando ventas...</div>}
        {!cargando && filtrados.length===0 && <div className="mod-empty">No se encontraron ventas.</div>}
      </div>

      {/* Modal detalle venta */}
      {ventaDetalle && (
        <div className="mod-overlay" onClick={()=>setVentaDetalle(null)}>
          <div className="mod-modal" onClick={e=>e.stopPropagation()}>
            <div className="mod-modal-header">
              <h2>Factura {ventaDetalle.numero_factura}</h2>
              <button className="mod-modal-close" onClick={()=>setVentaDetalle(null)}>✕</button>
            </div>
            <div className="mod-modal-body">
              <div className="mod-detalle-fila"><span>Cliente</span><strong>{ventaDetalle.cliente}</strong></div>
              <div className="mod-detalle-fila"><span>Fecha</span><strong>{ventaDetalle.fecha}</strong></div>
              <div className="mod-detalle-fila"><span>N° factura</span><span className="mod-codigo">{ventaDetalle.numero_factura}</span></div>
              <div style={{marginTop:"1rem"}}>
                <table className="mod-tabla" style={{fontSize:"0.82rem"}}>
                  <thead><tr><th>Ítem</th><th>Cantidad</th><th>Precio</th></tr></thead>
                  <tbody>
                    {ventaDetalle.DetalleVentaGanados?.map(d=>(
                      <tr key={`g${d.id}`}>
                        <td><span className="mod-codigo">{animal(d.Ganado)}</span></td>
                        <td>1 animal</td>
                        <td><strong>{pesos(d.precio)}</strong></td>
                      </tr>
                    ))}
                    {ventaDetalle.DetalleVentaProductos?.map(d=>(
                      <tr key={`p${d.id}`}>
                        <td>{lineaProducto(d)}</td>
                        <td>{cantidad(d.cantidad)} {d.Producto?.unidad || d.Produccion?.unidad} × {pesos(d.precio_unitario)}</td>
                        <td><strong>{pesos(d.subtotal)}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mod-detalle-total">
                <span>TOTAL</span>
                <strong>{pesos(ventaDetalle.total)}</strong>
              </div>
            </div>
            <div className="mod-modal-footer">
              <button className="mod-btn-ghost" onClick={()=>setVentaDetalle(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal nueva venta */}
      {mostrarModal && (
        <div className="mod-overlay" onClick={()=>setMostrarModal(false)}>
          <div className="mod-modal" onClick={e=>e.stopPropagation()}>
            <div className="mod-modal-header">
              <h2>Nueva Venta</h2>
              <button className="mod-modal-close" onClick={()=>setMostrarModal(false)}>✕</button>
            </div>
            <div className="mod-modal-body">
              {errorForm && <div className="mod-error">{errorForm}</div>}
              <div className="mod-info-bar">
                ⚡ <code>numero_factura</code> se asigna automáticamente al guardar. Los animales vendidos pasan a estado <strong>Vendido</strong>.
              </div>
              <div className="mod-form-grid">
                <div className="mod-field mod-field-full"><label>Cliente <span className="mod-req">*</span></label><input placeholder="Nombre o razón social del comprador" value={form.cliente} onChange={e=>setForm({...form,cliente:e.target.value})} /></div>
                <div className="mod-field"><label>Fecha <span className="mod-req">*</span></label><input type="date" value={form.fecha} onChange={e=>setForm({...form,fecha:e.target.value})} /></div>
              </div>

              <div style={{fontWeight:700,fontSize:"0.75rem",textTransform:"uppercase",letterSpacing:"1px",color:"var(--text-lt)",margin:"1.2rem 0 0.6rem"}}>Animales a vender</div>
              {form.items.map((it, i) => (
                <div key={i} className="mod-form-grid" style={{gridTemplateColumns:"minmax(0,2fr) minmax(0,1fr) auto",alignItems:"end",marginBottom:"0.6rem"}}>
                  <div className="mod-field"><label>Animal</label>
                    <select value={it.ganado_id} onChange={e=>setItem(i,"ganado_id",e.target.value)}>
                      <option value="">— Selecciona —</option>
                      {disponibles.filter(g => String(g.id)===String(it.ganado_id) || !elegidos.includes(String(g.id))).map(g=>(
                        <option key={g.id} value={g.id}>{animal(g)} — {g.categoria}{g.peso_actual ? `, ${cantidad(g.peso_actual)} kg` : ""}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mod-field"><label>Precio ($)</label><input type="number" min="0" placeholder="0" value={it.precio} onChange={e=>setItem(i,"precio",e.target.value)} /></div>
                  <button className="mod-acc-btn mod-acc-del" title="Quitar" style={{marginBottom:4}} onClick={()=>quitarItem(i)} disabled={form.items.length===1}>✕</button>
                </div>
              ))}
              <button className="mod-btn-ghost" onClick={agregarItem} disabled={form.items.length >= disponibles.length}>+ Agregar otro animal</button>

              <div className="mod-detalle-total">
                <span>TOTAL</span>
                <strong>{pesos(totalNueva)}</strong>
              </div>
            </div>
            <div className="mod-modal-footer">
              <button className="mod-btn-ghost" onClick={()=>setMostrarModal(false)}>Cancelar</button>
              <button className="mod-btn-primary" onClick={guardar} disabled={guardando}>{guardando ? "Guardando..." : "Guardar Venta"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
