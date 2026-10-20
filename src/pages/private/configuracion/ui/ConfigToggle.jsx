// ─── ui/ConfigToggle.jsx ─────────────────────────────────────────────────────

export function ConfigToggle({ checked, onChange, disabled = false }) {
  return (
    <label className="cfg-toggle" title={checked ? "Desactivar" : "Activar"}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <span className="cfg-toggle__slider" />
    </label>
  );
}