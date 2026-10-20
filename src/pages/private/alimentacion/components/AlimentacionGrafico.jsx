// src/pages/private/alimentacion/components/AlimentacionGrafico.jsx

export default function AlimentacionGrafico({ registros }) {
  const mapa = {};

  registros.forEach((r) => {
    const nombre = r.nombre_alimento || r.producto?.nombre || "Sin nombre";
    const cantidad = parseFloat(r.cantidad_kg) || 0;

    if (!mapa[nombre]) mapa[nombre] = 0;
    mapa[nombre] += cantidad;
  });

  const datos = Object.entries(mapa)
    .map(([nombre, total]) => ({ nombre, total }))
    .filter(d => d.total > 0)
    .sort((a, b) => b.total - a.total);

  const MAX_KG = 100;

  return (
    <div className="al-card al-card--grafico">
      <h3 className="al-card__title">Distribución por Alimento 📊</h3>
      <p className="al-card__sub">Escala de referencia: 0 a 100 kg</p>

      {datos.length === 0 ? (
        <p className="al-empty-msg">Sin datos para graficar aún</p>
      ) : (
        <div className="al-grafico">
          {datos.map(d => {
            const pct = Math.min(Math.round(d.total), 100);

            return (
              <div key={d.nombre} className="al-grafico__row">
                <div className="al-grafico__label">
                  <span>📦</span>
                  <span>{d.nombre}</span>
                </div>

                <div className="al-grafico__bar-wrap">
                  <div
                    className="al-grafico__bar"
                    style={{ width: `${pct}%` }}
                    title={`${d.total.toFixed(1)} kg`}
                  />
                </div>

                <div className="al-grafico__val">{d.total.toFixed(1)} kg</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}