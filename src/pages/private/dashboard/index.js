// Barrel exports – Módulo Dashboard
export { default as DashBoard }         from "./DashBoard";
export { default as DashboardHeader }   from "./components/DashboardHeader";
export { default as DashboardKPIs }     from "./components/DashboardKPIs";
export { default as DashboardAlertas }  from "./components/DashboardAlertas";
export { default as DashboardModulos }  from "./components/DashboardModulos";
export { useDashboard }                 from "./hooks/useDashboard";
export * as dashboardService           from "../../../services/dashboard.service";