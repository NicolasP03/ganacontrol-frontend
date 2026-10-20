// src/pages/private/finanzas/index.js

// Página principal
export { default as ListadoVentas } from "./ListadoVentas";

// Componentes
export { default as VentasHero } from "./components/VentasHero";
export { default as VentasKPIs } from "./components/VentasKPIs";
export { default as VentasTabla } from "./components/VentasTabla";

// Modales
export { default as VentasModalDetalle } from "./modals/VentasModalDetalle";
export { default as VentasModalForm } from "./modals/VentasModalForm";

// Hook
export { default as useVentas } from "./hooks/useVentas";

// Servicio
export * as ventasService from "../../../services/ventas.service";