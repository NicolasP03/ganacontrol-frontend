// src/pages/private/alimentacion/components/AlimentacionSearch.jsx

export default function AlimentacionSearch({ busqueda, onChange }) {
  return (
    <div className="al-search">
      <span className="al-search__ico">🔍</span>
      <input
        value={busqueda}
        onChange={e => onChange(e.target.value)}
        placeholder="Buscar por animal, alimento, tipo…"
      />
      {busqueda && (
        <button className="al-search__clear" onClick={() => onChange("")}>✕</button>
      )}
    </div>
  );
}