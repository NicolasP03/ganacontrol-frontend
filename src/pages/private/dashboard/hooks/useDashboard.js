import { useEffect, useMemo, useState, useCallback } from "react";
import { getUsuarioActual } from "../../../../services/AuthService";
import {
  MODULOS_DATA,
  getSaludo,
  getFechaFormateada,
  obtenerResumenDashboard,
  obtenerAlertasDashboard,
  icoCow,
  icoAlerta,
  icoFinanzas,
  icoSalud,
  icoVerificacion,
  icoReproduccion,
} from "../../../../services/dashboard.service";

import { notify } from "../../../../services/notify.service";
import { getErrorMessage } from "../../../../utils/handleRequest";

const formatearMoneda = (valor) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(valor || 0));

export function useDashboard() {
  const usuario = getUsuarioActual();

  const nombre = usuario?.nombres || "Usuario";
  const rol = usuario?.rol || "Administrador";
  const finca = usuario?.finca?.nombre || usuario?.finca || "La Ceiva";
  const inicial = nombre.charAt(0).toUpperCase();
  const saludo = getSaludo();
  const fecha = getFechaFormateada();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [kpis, setKpis] = useState([]);
  const [alertas, setAlertas] = useState([]);

  const cargarDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [resumen, alertasBackend] = await Promise.all([
        obtenerResumenDashboard(),
        obtenerAlertasDashboard(),
      ]);

      const kpisBackend = resumen?.kpis || {};

      const kpisAdaptados = [
        {
          label: kpisBackend?.ganadoTotal?.label || "Ganado Total",
          value: kpisBackend?.ganadoTotal?.value ?? 0,
          sub: kpisBackend?.ganadoTotal?.sub || "Sin información",
          trend: kpisBackend?.ganadoTotal?.trend || "up",
          barPct: kpisBackend?.ganadoTotal?.barPct ?? 0,
          icon: icoCow,
        },
        {
          label: kpisBackend?.alertasActivas?.label || "Alertas Activas",
          value: kpisBackend?.alertasActivas?.value ?? 0,
          sub: kpisBackend?.alertasActivas?.sub || "Sin información",
          trend: kpisBackend?.alertasActivas?.trend || "down",
          barPct: kpisBackend?.alertasActivas?.barPct ?? 0,
          icon: icoAlerta,
        },
        {
          label: kpisBackend?.ingresosMes?.label || "Ingresos del mes",
          value: formatearMoneda(kpisBackend?.ingresosMes?.value ?? 0),
          sub: kpisBackend?.ingresosMes?.sub || "Sin información",
          trend: kpisBackend?.ingresosMes?.trend || "up",
          barPct: kpisBackend?.ingresosMes?.barPct ?? 0,
          icon: icoFinanzas,
        },
        {
          label: kpisBackend?.tasaVacunacion?.label || "Tasa Vacunación",
          value: `${kpisBackend?.tasaVacunacion?.value ?? 0}%`,
          sub: kpisBackend?.tasaVacunacion?.sub || "Sin información",
          trend: kpisBackend?.tasaVacunacion?.trend || "up",
          barPct: kpisBackend?.tasaVacunacion?.barPct ?? 0,
          icon: icoSalud,
        },
      ];

      const alertasAdaptadas = (alertasBackend || []).map((a) => {
        let icono = icoAlerta;

        if (a?.tipo === "ok") {
          icono = icoVerificacion;
        } else if (a?.titulo?.toLowerCase().includes("parto")) {
          icono = icoReproduccion;
        } else if (a?.titulo?.toLowerCase().includes("vacun")) {
          icono = icoSalud;
        }

        return {
          ...a,
          ico: icono,
        };
      });

      setKpis(kpisAdaptados);
      setAlertas(alertasAdaptadas);
    } catch (err) {
      console.error("Error cargando dashboard:", err);

      const mensaje = getErrorMessage(err) || "No se pudo cargar el dashboard.";
      setError(mensaje);
      setKpis([]);
      setAlertas([]);
      notify.error(mensaje);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDashboard();
  }, [cargarDashboard]);

  const alertasActivas = useMemo(() => {
    return alertas.filter((a) => a.tipo !== "ok").length;
  }, [alertas]);

  return {
    nombre,
    rol,
    finca,
    inicial,
    saludo,
    fecha,
    kpis,
    alertas,
    modulos: MODULOS_DATA,
    alertasActivas,
    loading,
    error,
    recargarDashboard: cargarDashboard,
  };
}

export default useDashboard;