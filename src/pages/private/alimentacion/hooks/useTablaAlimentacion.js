import { useState, useMemo } from "react";
import { PER_PAGE } from "../alimentacion.constants";

const FILTROS_VACIOS = { alimentos: [], tiposAnimal: [] };

export default function useTablaAlimentacion(registros) {
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState(FILTROS_VACIOS);
  const [filtroOpen, setFiltroOpen] = useState(false);
  const [sortCol, setSortCol] = useState("id");
  const [sortDir, setSortDir] = useState("asc");
  const [pagina, setPagina] = useState(1);

  const toggleFiltro = (key, val) => {
    setFiltros(f => ({
      ...f,
      [key]: f[key].includes(val)
        ? f[key].filter(x => x !== val)
        : [...f[key], val],
    }));
    setPagina(1);
  };

  const limpiarFiltros = () => {
    setFiltros(FILTROS_VACIOS);
    setPagina(1);
  };

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  const filtrados = useMemo(() => {
    let arr = registros.filter(r => {
      const q = busqueda.toLowerCase().trim();
      const nombreAlimento = r.nombre_alimento || r.producto?.nombre || "";

      const coincideBusqueda =
        !q ||
        String(r.animal?.nombre ?? "").toLowerCase().includes(q) ||
        String(r.animal?.codigo ?? "").toLowerCase().includes(q) ||
        String(r.tipo_animal ?? "").toLowerCase().includes(q) ||
        String(nombreAlimento).toLowerCase().includes(q) ||
        String(r.frecuencia ?? "").toLowerCase().includes(q) ||
        String(r.observaciones ?? "").toLowerCase().includes(q);

      const coincideAlimento =
        !filtros.alimentos.length || filtros.alimentos.includes(nombreAlimento);

      const coincideTipoAnimal =
        !filtros.tiposAnimal.length || filtros.tiposAnimal.includes(r.tipo_animal);

      return coincideBusqueda && coincideAlimento && coincideTipoAnimal;
    });

    if (sortCol) {
      arr = [...arr].sort((a, b) => {
        let va = a[sortCol];
        let vb = b[sortCol];

        if (sortCol === "animal") {
          va = a.animal?.nombre ?? "";
          vb = b.animal?.nombre ?? "";
        }

        if (sortCol === "nombre_alimento") {
          va = a.nombre_alimento || a.producto?.nombre || "";
          vb = b.nombre_alimento || b.producto?.nombre || "";
        }

        const na = Number(va), nb = Number(vb);
        if (!isNaN(na) && !isNaN(nb) && va !== "" && vb !== "") {
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
  const paginados = filtrados.slice((pagina - 1) * PER_PAGE, pagina * PER_PAGE);
  const filtrosActivos = filtros.alimentos.length + filtros.tiposAnimal.length;

  return {
    busqueda, setBusqueda,
    filtros, filtroOpen, setFiltroOpen,
    toggleFiltro, limpiarFiltros, filtrosActivos,
    sortCol, sortDir, handleSort,
    filtrados, paginados, totalPags, pagina, setPagina,
  };
}