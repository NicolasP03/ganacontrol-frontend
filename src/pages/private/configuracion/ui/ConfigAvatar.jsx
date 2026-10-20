// ─── ui/ConfigAvatar.jsx ─────────────────────────────────────────────────────

export function ConfigAvatar({ name, size = 40 }) {
  return (
    <div
      className="cfg-avatar"
      style={{
        width: size, height: size,
        fontSize: size * 0.38,
        borderRadius: size * 0.28,
      }}
    >
      {name?.charAt(0)?.toUpperCase() ?? "?"}
    </div>
  );
}