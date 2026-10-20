export default function GanadoSearch({ busqueda, onChange }) {
  return (
    <div className="ganado-table-search">
      <span className="ganado-table-search__ico">🔍</span>
      <input
        value={busqueda}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar por código, nombre, raza o categoría…"
      />
      {busqueda && (
        <button className="ganado-table-search__clear" onClick={() => onChange("")}>
          ✕
        </button>
      )}
    </div>
  );
}