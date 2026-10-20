import { useCallback, useEffect, useState } from "react";
import { mensajeError } from "../services/api";

// Carga datos del API: devuelve { datos, cargando, error, recargar }
export default function useDatos(cargar, inicial = []) {
  const [datos,    setDatos]    = useState(inicial);
  const [cargando, setCargando] = useState(true);
  const [error,    setError]    = useState("");

  const recargar = useCallback(async () => {
    setCargando(true);
    try {
      const res = await cargar();
      setDatos(res ?? inicial);
      setError("");
    } catch (e) {
      setError(mensajeError(e));
    } finally {
      setCargando(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cargar]);

  useEffect(() => { recargar(); }, [recargar]);

  return { datos, cargando, error, recargar };
}
