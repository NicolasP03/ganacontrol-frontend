import { useState, useMemo } from "react";
import { PER_PAGE } from "../reproduccion.constants";

const FILTROS_VACIOS = { estados: [], tipos: [] };

export default function useTablaReproduccion(registros = []) {
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState(FILTROS_VACIOS);
  const [filtroOpen, setFiltroOpen] = useState(false);
  const [sortCol, setSortCol] = useState("id");
  const [sortDir, setSortDir] = useState("asc");
  const [paginaPedida, setPagina] = useState(1);

  const toggleFiltro = (key, val) => {
    setFiltros((f) => ({
      ...f,
      [key]: f[key].includes(val)
        ? f[key].filter((x) => x !== val)
        : [...f[key], val],
    }));
    setPagina(1);
  };

  const limpiarFiltros = () => {
    setFiltros(FILTROS_VACIOS);
    setPagina(1);
  };

  const handleSort = (col) => {
    if (sortCol === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  const filtrados = useMemo(() => {
    let arr = registros.filter((r) => {
      const q = busqueda.toLowerCase().trim();

      const coincideBusqueda =
        !q ||
        String(r?.vaca?.nombre ?? "").toLowerCase().includes(q) ||
        String(r?.vaca?.codigo ?? "").toLowerCase().includes(q) ||
        String(r?.toro?.nombre ?? "").toLowerCase().includes(q) ||
        String(r?.toro?.codigo ?? "").toLowerCase().includes(q) ||
        String(r?.cria_codigo ?? "").toLowerCase().includes(q) ||
        String(r?.tipo_servicio ?? "").toLowerCase().includes(q) ||
        String(r?.estado ?? "").toLowerCase().includes(q) ||
        String(r?.id ?? "").toLowerCase().includes(q);

      const coincideEstado =
        !filtros.estados.length || filtros.estados.includes(r?.estado);

      const coincideTipo =
        !filtros.tipos.length || filtros.tipos.includes(r?.tipo_servicio);

      return coincideBusqueda && coincideEstado && coincideTipo;
    });

    if (sortCol) {
      arr = [...arr].sort((a, b) => {
        let va = a?.[sortCol];
        let vb = b?.[sortCol];

        if (sortCol === "vaca") {
          va = a?.vaca?.nombre ?? "";
          vb = b?.vaca?.nombre ?? "";
        }

        if (sortCol === "toro") {
          va = a?.toro?.nombre ?? "";
          vb = b?.toro?.nombre ?? "";
        }

        const na = Number(va);
        const nb = Number(vb);

        if (!Number.isNaN(na) && !Number.isNaN(nb) && va !== "" && vb !== "") {
          return sortDir === "asc" ? na - nb : nb - na;
        }

        return sortDir === "asc"
          ? String(va ?? "").localeCompare(String(vb ?? ""))
          : String(vb ?? "").localeCompare(String(va ?? ""));
      });
    }

    return arr;
  }, [registros, busqueda, filtros, sortCol, sortDir]);

  const totalPags = Math.max(1, Math.ceil(filtrados.length / PER_PAGE));
  // La página nunca excede el total (p. ej. al filtrar o eliminar), sin usar efectos
  const pagina = Math.min(paginaPedida, totalPags);
  const paginados = filtrados.slice((pagina - 1) * PER_PAGE, pagina * PER_PAGE);
  const filtrosActivos = filtros.estados.length + filtros.tipos.length;


  return {
    busqueda,
    setBusqueda,
    filtros,
    filtroOpen,
    setFiltroOpen,
    toggleFiltro,
    limpiarFiltros,
    filtrosActivos,
    sortCol,
    sortDir,
    handleSort,
    filtrados,
    paginados,
    totalPags,
    pagina,
    setPagina,
  };
}