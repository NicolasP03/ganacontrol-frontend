// src/pages/private/reproduccion/components/ReproduccionSearch.jsx

export default function ReproduccionSearch({ busqueda, onChange }) {
  return (
    <div className="rp-search">
      <span className="rp-search__ico">🔍</span>
      <input
        value={busqueda}
        onChange={e => onChange(e.target.value)}
        placeholder="Buscar por vaca, toro, tipo…"
      />
      {busqueda && (
        <button className="rp-search__clear" onClick={() => onChange("")}>✕</button>
      )}
    </div>
  );
}