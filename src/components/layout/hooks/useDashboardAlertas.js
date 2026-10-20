import { useEffect, useState } from "react";
import { obtenerResumenDashboard } from "../../../services/dashboard.service";

export function useDashboardAlertas() {
  const [hayAlertas, setHayAlertas] = useState(false);

  useEffect(() => {
    let activo = true;

    const cargar = async () => {
      try {
        const data = await obtenerResumenDashboard();

        // Ajusta esto según la estructura real que devuelve tu backend
        const alertas =
          data?.alertas ||
          data?.mensaje?.data?.alertas ||
          data?.data?.alertas ||
          [];

        if (!activo) return;

        const activas = Array.isArray(alertas)
          ? alertas.filter((a) => a?.tipo !== "ok")
          : [];

        setHayAlertas(activas.length > 0);
      } catch (error) {
        console.error("Error cargando alertas del dashboard:", error);
        if (activo) setHayAlertas(false);
      }
    };

    cargar();

    return () => {
      activo = false;
    };
  }, []);

  return { hayAlertas };
}