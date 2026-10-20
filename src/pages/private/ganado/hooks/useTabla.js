import { useState, useMemo } from "react";
import { PER_PAGE } from "../ganado.constants";

const FILTROS_VACIOS = { estados: [], potreros: [], razas: [] };

export default function useTabla(animales = []) {
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
    let arr = animales.filter((a) => {
      const q = busqueda.toLowerCase().trim();

      const coincideBusqueda =
        !q ||
        String(a?.codigo ?? "").toLowerCase().includes(q) ||
        String(a?.nombre ?? "").toLowerCase().includes(q) ||
        String(a?.raza ?? "").toLowerCase().includes(q) ||
        String(a?.categoria ?? "").toLowerCase().includes(q);

      const coincideEstado =
        !filtros.estados.length || filtros.estados.includes(a?.estado);

      const coincidePotrero =
        !filtros.potreros.length ||
        filtros.potreros.includes(String(a?.potrero_id ?? ""));

      const coincideRaza =
        !filtros.razas.length || filtros.razas.includes(a?.raza);

      return (
        coincideBusqueda &&
        coincideEstado &&
        coincidePotrero &&
        coincideRaza
      );
    });

    if (sortCol) {
      arr = [...arr].sort((a, b) => {
        const va = a?.[sortCol];
        const vb = b?.[sortCol];

        const aNum = Number(va);
        const bNum = Number(vb);

        const ambosNumeros =
          !Number.isNaN(aNum) &&
          !Number.isNaN(bNum) &&
          va !== "" &&
          vb !== "" &&
          va !== null &&
          vb !== null;

        if (ambosNumeros) {
          return sortDir === "asc" ? aNum - bNum : bNum - aNum;
        }

        return sortDir === "asc"
          ? String(va ?? "").localeCompare(String(vb ?? ""))
          : String(vb ?? "").localeCompare(String(va ?? ""));
      });
    }

    return arr;
  }, [animales, busqueda, filtros, sortCol, sortDir]);

  const totalPags = Math.max(1, Math.ceil(filtrados.length / PER_PAGE));
  // La página nunca excede el total (p. ej. al filtrar o eliminar), sin usar efectos
  const pagina = Math.min(paginaPedida, totalPags);
  const paginados = filtrados.slice((pagina - 1) * PER_PAGE, pagina * PER_PAGE);
  const filtrosActivos =
    filtros.estados.length + filtros.potreros.length + filtros.razas.length;


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