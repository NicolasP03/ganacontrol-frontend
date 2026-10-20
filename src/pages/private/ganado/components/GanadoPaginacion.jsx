export default function GanadoPaginacion({ pagina, totalPags, totalFiltrados, perPage, onChange }) {
  const desde = Math.min((pagina - 1) * perPage + 1, totalFiltrados);
  const hasta = Math.min(pagina * perPage, totalFiltrados);
  const nums = Array.from({ length: totalPags }, (_, i) => i + 1).filter(
    (p) => Math.abs(p - pagina) <= 2
  );

  return (
    <div className="ganado-table-footer">
      <span className="ganado-table-footer__info">
        Mostrando {desde}–{hasta} de {totalFiltrados} registros
      </span>
      <div className="gc-pag">
        <button className="gc-pag-btn" disabled={pagina === 1} onClick={() => onChange(1)}>
          «
        </button>
        <button className="gc-pag-btn" disabled={pagina === 1} onClick={() => onChange(pagina - 1)}>
          ‹
        </button>
        {nums.map((p) => (
          <button
            key={p}
            className={`gc-pag-btn${p === pagina ? " active" : ""}`}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ))}
        <button className="gc-pag-btn" disabled={pagina === totalPags} onClick={() => onChange(pagina + 1)}>
          ›
        </button>
        <button className="gc-pag-btn" disabled={pagina === totalPags} onClick={() => onChange(totalPags)}>
          »
        </button>
      </div>
    </div>
  );
}