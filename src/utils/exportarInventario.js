import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const C = {
  negro: [10, 14, 20],
  grisFondo: [245, 247, 248],
  verdeBase: [22, 101, 52],
  blanco: [255, 255, 255],
};

const formatCOP = (v) =>
  Number(v || 0).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });

const fechaActual = () =>
  new Date().toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const sufijoArchivo = () => {
  const d = new Date();
  const p = (x) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

const valorProducto = (p) =>
  Number(p.cantidad_actual || 0) * Number(p.precio_unitario || 0);

const filas = (productos) =>
  productos.map((p) => ({
    Producto: p.nombre,
    Tipo: p.tipo,
    Categoría: p.categoria || "",
    "Cantidad actual": Number(p.cantidad_actual || 0),
    Unidad: p.unidad,
    "Cantidad mínima": Number(p.cantidad_min || 0),
    Estado: p.estado,
    Proveedor: p.proveedor === "Sin proveedor" ? "" : p.proveedor,
    Ubicación: p.ubicacion,
    "Precio unitario": p.precio_unitario === "" ? null : p.precio_unitario,
    "Valor en inventario": valorProducto(p),
    Activo: p.activo ? "Sí" : "No",
  }));

export function exportarInventarioExcel(productos = []) {
  const wb = XLSX.utils.book_new();

  const hoja = XLSX.utils.json_to_sheet(filas(productos));
  hoja["!cols"] = [
    { wch: 32 }, { wch: 13 }, { wch: 16 }, { wch: 15 }, { wch: 8 }, { wch: 15 },
    { wch: 12 }, { wch: 20 }, { wch: 19 }, { wch: 15 }, { wch: 19 }, { wch: 8 },
  ];
  XLSX.utils.book_append_sheet(wb, hoja, "Inventario");

  const valorTotal = productos.reduce((s, p) => s + valorProducto(p), 0);
  const resumen = [
    { Indicador: "Fecha del reporte", Valor: fechaActual() },
    { Indicador: "Total de productos", Valor: productos.length },
    { Indicador: "Agotados", Valor: productos.filter((p) => p.estadoKey === "agotado").length },
    { Indicador: "Nivel crítico", Valor: productos.filter((p) => p.estadoKey === "critico").length },
    { Indicador: "Stock bajo", Valor: productos.filter((p) => p.estadoKey === "stock_bajo").length },
    { Indicador: "Valor total del inventario", Valor: valorTotal },
  ];
  const hojaResumen = XLSX.utils.json_to_sheet(resumen);
  hojaResumen["!cols"] = [{ wch: 30 }, { wch: 24 }];
  XLSX.utils.book_append_sheet(wb, hojaResumen, "Resumen");

  const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `inventario-ganacontrol-${sufijoArchivo()}.xlsx`
  );
}

export function exportarInventarioPDF(productos = [], usuario = null) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();

  doc.setFillColor(...C.negro);
  doc.rect(0, 0, pw, 26, "F");
  doc.setTextColor(...C.blanco);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("GanaControl · Inventario", 14, 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const quien = [usuario?.nombres || usuario?.nombre, usuario?.rol, usuario?.finca]
    .filter(Boolean)
    .join(" · ");
  doc.text(`${fechaActual()}${quien ? "  |  " + quien : ""}`, 14, 19);

  const valorTotal = productos.reduce((s, p) => s + valorProducto(p), 0);
  const criticos = productos.filter(
    (p) => p.estadoKey === "critico" || p.estadoKey === "agotado"
  ).length;
  doc.setTextColor(...C.verdeBase);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(
    `Productos: ${productos.length}    Críticos/agotados: ${criticos}    Valor total: ${formatCOP(valorTotal)}`,
    14,
    34
  );

  autoTable(doc, {
    startY: 39,
    head: [["Producto", "Tipo", "Cantidad", "Mínimo", "Estado", "Proveedor", "Ubicación", "Valor"]],
    body: productos.map((p) => [
      p.nombre,
      p.tipo,
      `${Number(p.cantidad_actual || 0)} ${p.unidad || ""}`,
      `${Number(p.cantidad_min || 0)} ${p.unidad || ""}`,
      p.estado,
      p.proveedor === "Sin proveedor" ? "—" : p.proveedor,
      p.ubicacion,
      formatCOP(valorProducto(p)),
    ]),
    headStyles: { fillColor: C.verdeBase, textColor: C.blanco, fontStyle: "bold" },
    alternateRowStyles: { fillColor: C.grisFondo },
    styles: { fontSize: 8.5, cellPadding: 2.5 },
    columnStyles: { 7: { halign: "right" } },
    didDrawPage: () => {
      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.text(
        `GanaControl · Página ${doc.internal.getNumberOfPages()}`,
        pw - 14,
        ph - 6,
        { align: "right" }
      );
    },
  });

  doc.save(`inventario-ganacontrol-${sufijoArchivo()}.pdf`);
}
