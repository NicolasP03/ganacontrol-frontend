// src/pages/private/reproduccion/components/ReproduccionPaginacion.jsx

export default function ReproduccionPaginacion({ pagina, totalPags, totalFiltrados, perPage, onChange }) {
  const desde = Math.min((pagina - 1) * perPage + 1, totalFiltrados);
  const hasta  = Math.min(pagina * perPage, totalFiltrados);
  const nums   = Array.from({ length: totalPags }, (_, i) => i + 1)
    .filter(p => Math.abs(p - pagina) <= 2);

  return (
    <div className="rp-paginacion">
      <span className="rp-paginacion__info">
        Mostrando {desde}–{hasta} de {totalFiltrados} registros
      </span>
      <div className="rp-pag">
        <button className="rp-pag-btn" disabled={pagina === 1}         onClick={() => onChange(1)}>«</button>
        <button className="rp-pag-btn" disabled={pagina === 1}         onClick={() => onChange(pagina - 1)}>‹</button>
        {nums.map(p => (
          <button key={p} className={`rp-pag-btn${p === pagina ? " active" : ""}`} onClick={() => onChange(p)}>{p}</button>
        ))}
        <button className="rp-pag-btn" disabled={pagina === totalPags} onClick={() => onChange(pagina + 1)}>›</button>
        <button className="rp-pag-btn" disabled={pagina === totalPags} onClick={() => onChange(totalPags)}>»</button>
      </div>
    </div>
  );
}