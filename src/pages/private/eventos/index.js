// Barrel exports – Módulo Salud & Sanidad
export { default as ListadoEventos }    from "./ListadoEventos";
export { default as SaludHero }         from "./components/SaludHero";
export { default as SaludKPIs }         from "./components/SaludKPIs";
export { default as SaludHistorial }    from "./components/SaludHistorial";
export { default as SaludProximos }     from "./components/SaludProximos";
export { default as SaludEstatus }      from "./components/SaludEstatus";
export { default as SaludModalDetalle } from "./modals/SaludModalDetalle";
export { default as SaludModalForm }    from "./modals/SaludModalForm";
export { useSalud }                     from "./hooks/useSalud";
export * as saludService               from "../../../services/salud.service";