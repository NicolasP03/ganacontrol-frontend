// src/pages/private/alimentacion/components/AlimentacionPaginacion.jsx

export default function AlimentacionPaginacion({ pagina, totalPags, totalFiltrados, perPage, onChange }) {
  const desde = Math.min((pagina - 1) * perPage + 1, totalFiltrados);
  const hasta  = Math.min(pagina * perPage, totalFiltrados);
  const nums   = Array.from({ length: totalPags }, (_, i) => i + 1)
    .filter(p => Math.abs(p - pagina) <= 2);

  return (
    <div className="al-paginacion">
      <span className="al-paginacion__info">
        Mostrando {desde}–{hasta} de {totalFiltrados} registros
      </span>
      <div className="al-pag">
        <button className="al-pag-btn" disabled={pagina === 1}         onClick={() => onChange(1)}>«</button>
        <button className="al-pag-btn" disabled={pagina === 1}         onClick={() => onChange(pagina - 1)}>‹</button>
        {nums.map(p => (
          <button key={p} className={`al-pag-btn${p === pagina ? " active" : ""}`} onClick={() => onChange(p)}>{p}</button>
        ))}
        <button className="al-pag-btn" disabled={pagina === totalPags} onClick={() => onChange(pagina + 1)}>›</button>
        <button className="al-pag-btn" disabled={pagina === totalPags} onClick={() => onChange(totalPags)}>»</button>
      </div>
    </div>
  );
}