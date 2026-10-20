export function generarAnalisisInventario(productos = []) {
  const total = productos.length;
  const criticos = productos.filter(p => p.estadoKey === "critico");
  const bajos = productos.filter(p => p.estadoKey === "stock_bajo");
  const agotados = productos.filter(p => p.estadoKey === "agotado");

  const valorTotal = productos.reduce((acc, p) => {
    const cantidad = Number(p.cantidad_actual || 0);
    const precio = Number(p.precio_unitario || 0);
    return acc + (cantidad * precio);
  }, 0);

  const productosPorValor = [...productos]
    .map(p => ({
      ...p,
      valor: Number(p.cantidad_actual || 0) * Number(p.precio_unitario || 0),
    }))
    .sort((a, b) => b.valor - a.valor);

  const masValioso = productosPorValor[0] || null;

  const recomendaciones = [];

  if (criticos.length > 0) {
    recomendaciones.push(
      `Reabastecer de inmediato ${criticos.map(p => p.nombre).join(", ")}.`
    );
  }

  if (bajos.length > 0) {
    recomendaciones.push(
      `Monitorear ${bajos.map(p => p.nombre).join(", ")} porque están por debajo del nivel recomendado.`
    );
  }

  if (agotados.length > 0) {
    recomendaciones.push(
      `Hay productos agotados: ${agotados.map(p => p.nombre).join(", ")}.`
    );
  }

  if (masValioso) {
    recomendaciones.push(
      `El producto con mayor impacto económico es ${masValioso.nombre}.`
    );
  }

  if (recomendaciones.length === 0) {
    recomendaciones.push("El inventario se encuentra en estado estable.");
  }

  return {
    total,
    criticos: criticos.length,
    bajos: bajos.length,
    agotados: agotados.length,
    valorTotal,
    masValioso,
    recomendaciones,
  };
}