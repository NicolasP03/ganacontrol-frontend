// Barrel de exports del módulo Cockpit
export { default as CockpitFinanciero }   from "./CockpitFinanciero";
export { default as CockpitHero }         from "./components/CockpitHero";
export { default as CockpitKPIs }         from "./components/CockpitKPIs";
export { default as CockpitGrafico }      from "./components/CockpitGrafico";
export { default as CockpitLiquidacion }  from "./components/CockpitLiquidacion";
export { default as CockpitTransacciones }from "./components/CockpitTransacciones";
export { default as CockpitModalDetalle } from "./components/CockpitModalDetalle";
export { useCockpit }                     from "./hooks/useCockpit";
export * as cockpitService from "../../../services/cockpit.service";