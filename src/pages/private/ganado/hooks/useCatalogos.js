import { useEffect, useState } from "react";
import api from "../../../../services/api";
import { ganadoService } from "../../../../services/ganado.service";

// Potreros y animales para selects y filtros. Se cargan una vez y se comparten.
let cache = null;

const cargar = async () => {
  const [resPotreros, animales] = await Promise.all([
    api("/potreros").catch(() => null),
    ganadoService.listar().catch(() => []),
  ]);
  const lista = resPotreros?.mensaje?.data ?? resPotreros?.data ?? [];
  return {
    potreros: Array.isArray(lista) ? lista.map((p) => ({ id: String(p.id), nombre: p.nombre })) : [],
    animales,
  };
};

export const invalidarCatalogos = () => {
  cache = null;
};

export default function useCatalogos() {
  const [catalogos, setCatalogos] = useState({ potreros: [], animales: [] });

  useEffect(() => {
    let activo = true;
    if (!cache) cache = cargar();
    cache.then((c) => activo && setCatalogos(c)).catch(() => {});
    return () => {
      activo = false;
    };
  }, []);

  return catalogos;
}
