// ─── ui/ConfiguracionTabs.jsx ────────────────────────────────────────────────
import { TABS } from "../configuracion.constants";

export function ConfiguracionTabs({ tab, setTab }) {
  return (
    <nav className="cfg-tabs" role="tablist">
      {TABS.map(({ id, icon, label }) => (
        <button
          key={id}
          role="tab"
          aria-selected={tab === id}
          onClick={() => setTab(id)}
          className={`cfg-tab${tab === id ? " cfg-tab--active" : ""}`}
        >
          <span className="cfg-tab__icon">{icon}</span>
          <span className="cfg-tab__label">{label}</span>
        </button>
      ))}
    </nav>
  );
}