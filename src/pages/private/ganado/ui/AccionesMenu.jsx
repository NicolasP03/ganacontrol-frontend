const OPCIONES = [
  {
    accion: "ver",
    label: "Ver detalle",
    danger: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    accion: "editar",
    label: "Editar",
    danger: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
  },
  {
    accion: "eliminar",
    label: "Eliminar",
    danger: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4h6v2" />
      </svg>
    ),
  },
];

export default function AccionesMenu({ animal, onVer, onEditar, onEliminar }) {
  const handlers = { ver: onVer, editar: onEditar, eliminar: onEliminar };

  return (
    <div className="gc-acciones-inline">
      {OPCIONES.map(({ accion, label, danger, icon }) => (
        <div key={accion} style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {/* separador antes de la acción peligrosa */}
          {danger && <div className="gc-acciones-sep" />}

          <button
            title={label}
            className={`gc-btn-accion${danger ? " gc-btn-accion--danger" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              handlers[accion]?.(animal);
            }}
          >
            <span className="gc-btn-accion__tooltip">{label}</span>
            {icon}
          </button>
        </div>
      ))}
    </div>
  );
}