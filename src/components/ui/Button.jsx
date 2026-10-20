/**
 * Button — Botón reutilizable con variantes
 *
 * Props:
 *  - children  : ReactNode
 *  - variant   : "primary" | "secondary" | "ghost" | "danger"
 *  - size      : "sm" | "md" | "lg"
 *  - onClick   : fn
 *  - disabled  : boolean
 *  - fullWidth : boolean
 *  - type      : "button" | "submit"
 */
export default function Button({
  children,
  variant  = "primary",
  size     = "md",
  onClick,
  disabled = false,
  fullWidth = false,
  type     = "button",
}) {
  const classes = [
    "gc-btn",
    `gc-btn--${variant}`,
    size !== "md" ? `gc-btn--${size}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      style={{ width: fullWidth ? "100%" : undefined }}
    >
      {children}
    </button>
  );
}