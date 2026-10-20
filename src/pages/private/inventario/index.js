// Barrel exports – Módulo Inventario
export { default as ListadoInventario }      from "./ListadoInventario";
export { default as InventarioHero }         from "./components/InventarioHero";
export { default as InventarioKPIs }         from "./components/InventarioKPIs";
export { default as InventarioSuministros }  from "./components/InventarioSuministros";
export { default as InventarioTabla }        from "./components/InventarioTabla";
export { default as InventarioModalDetalle } from "./modals/InventarioModalDetalle";
export { default as InventarioModalForm }    from "./modals/InventarioModalForm";
export { useInventario }                     from "./hooks/useInventario";
export * as inventarioService                from "../../../services/inventario.service";