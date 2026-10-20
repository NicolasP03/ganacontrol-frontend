import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoGanaControl from "../assets/icons/cow.png";

const C = {
  negro: [10, 14, 20],
  grisOscuro: [38, 50, 56],
  grisMedio: [96, 125, 139],
  grisClaro: [207, 216, 220],
  grisFondo: [245, 247, 248],
  verdeBase: [22, 101, 52],
  verdeMedio: [21, 128, 61],
  blanco: [255, 255, 255],
  dorado: [180, 140, 60],
};

const formatCOP = (valor) => {
  const n = Number(valor || 0);
  return n.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
};

const fechaActual = () =>
  new Date().toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const horaActual = () =>
  new Date().toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });

const cargarImagenBase64 = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d").drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });

const agregarMarcaAgua = (doc) => {
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();

  doc.saveGraphicsState();
  doc.setGState(new doc.GState({ opacity: 0.03 }));
  doc.setTextColor(...C.verdeBase);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(52);
  doc.text("GanaControl", pw / 2, ph / 2, {
    align: "center",
    angle: 32,
  });
  doc.restoreGraphicsState();
};

const agregarFooter = (doc, fecha) => {
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const total = doc.internal.getNumberOfPages();

  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    agregarMarcaAgua(doc);

    doc.setFillColor(...C.negro);
    doc.rect(0, ph - 14, pw, 14, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...C.grisMedio);
    doc.text(`GanaControl · Gestión Ganadera · ${fecha}`, 14, ph - 5.5);

    doc.setTextColor(...C.grisClaro);
    doc.text(`Página ${i} / ${total}`, pw - 14, ph - 5.5, {
      align: "right",
    });

    doc.setDrawColor(...C.verdeBase);
    doc.setLineWidth(0.8);
    doc.line(0, ph - 14, pw, ph - 14);
  }
};

const limpiarMoneda = (valor) => {
  if (typeof valor === "number") return valor;

  return Number(
    String(valor || "0")
      .replace(/\$/g, "")
      .replace(/\./g, "")
      .replace(/,/g, ".")
      .replace(/[^\d.]/g, "")
  );
};

export async function exportarVentasPDF(ventas = [], usuario = {}) {
  const doc = new jsPDF("p", "mm", "a4");
  const pw = doc.internal.pageSize.getWidth();
  const fecha = fechaActual();
  const hora = horaActual();

  const logoBase64 = await cargarImagenBase64(logoGanaControl);

  doc.setFillColor(...C.negro);
  doc.rect(0, 0, pw, 52, "F");

  doc.setFillColor(...C.verdeBase);
  doc.rect(0, 0, 4, 52, "F");

  if (logoBase64) {
    doc.setFillColor(...C.verdeBase);
    doc.roundedRect(12, 11, 22, 22, 3, 3, "F");
    doc.addImage(logoBase64, "PNG", 16, 15, 14, 14);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...C.blanco);
  doc.text("GanaControl", 40, 21);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...C.grisMedio);
  doc.text("Sistema de Gestión Ganadera", 40, 28);

  doc.setDrawColor(...C.grisOscuro);
  doc.line(pw / 2 - 10, 13, pw / 2 - 10, 42);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...C.blanco);
  doc.text("REPORTE GENERAL DE VENTAS", pw / 2 + 4, 21);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...C.grisMedio);
  doc.text(`Generado: ${fecha} · ${hora}`, pw / 2 + 4, 28);

  doc.setFillColor(...C.verdeBase);
  doc.roundedRect(pw / 2 + 4, 32, 26, 8, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(...C.blanco);
  doc.text("OFICIAL", pw / 2 + 17, 37.2, { align: "center" });

  doc.setFillColor(248, 249, 250);
  doc.rect(0, 52, pw, 22, "F");
  doc.setDrawColor(...C.grisClaro);
  doc.line(0, 74, pw, 74);

  const infoItems = [
    { label: "RESPONSABLE", value: usuario?.nombres || usuario?.nombre || "Sin usuario" },
    { label: "ROL", value: usuario?.rol || "Administrador" },
    { label: "FINCA", value: usuario?.finca || "La Ceiva" },
    { label: "FECHA", value: fecha },
  ];

  infoItems.forEach((item, i) => {
    const x = 14 + (i * (pw - 28)) / 4;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.setTextColor(...C.grisMedio);
    doc.text(item.label, x, 59);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...C.grisOscuro);
    doc.text(String(item.value), x, 67);
  });

  const totalVentas = ventas.length;
  const completadas = ventas.filter((v) => v.estadoKey === "completado").length;
  const pendientes = ventas.filter((v) => v.estadoKey === "pendiente").length;
  const ingresos = ventas.reduce(
    (acc, v) => acc + Number(v.totalNumber ?? limpiarMoneda(v.total)),
    0
  );
  const ticketPromedio = totalVentas > 0 ? ingresos / totalVentas : 0;

  const metricas = [
    { label: "TOTAL VENTAS", valor: String(totalVentas), color: C.verdeBase },
    { label: "COMPLETADAS", valor: String(completadas), color: C.verdeMedio },
    { label: "PENDIENTES", valor: String(pendientes), color: [180, 83, 9] },
    { label: "INGRESOS", valor: formatCOP(ingresos), color: C.negro },
    { label: "TICKET PROM.", valor: formatCOP(ticketPromedio), color: C.dorado },
  ];

  const cardW = (pw - 28) / 5;
  const cardY = 80;
  const cardH = 26;

  metricas.forEach((m, i) => {
    const x = 14 + i * cardW;

    doc.setFillColor(...C.blanco);
    doc.setDrawColor(...C.grisClaro);
    doc.roundedRect(x, cardY, cardW - 2, cardH, 2, 2, "FD");

    doc.setFillColor(...m.color);
    doc.roundedRect(x, cardY, cardW - 2, 3, 1, 1, "F");
    doc.rect(x, cardY + 1.5, cardW - 2, 1.5, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.5);
    doc.setTextColor(...C.grisMedio);
    doc.text(m.label, x + (cardW - 2) / 2, cardY + 9, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(m.valor.length > 11 ? 7.2 : 11);
    doc.setTextColor(...m.color);
    doc.text(m.valor, x + (cardW - 2) / 2, cardY + 20, { align: "center" });
  });

  const ySeccion = cardY + cardH + 12;

  doc.setFillColor(...C.negro);
  doc.rect(14, ySeccion - 1, pw - 28, 11, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...C.blanco);
  doc.text("DETALLE DEL HISTORIAL DE VENTAS", 20, ySeccion + 6.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...C.grisMedio);
  doc.text(`${totalVentas} registro${totalVentas !== 1 ? "s" : ""}`, pw - 18, ySeccion + 6.5, {
    align: "right",
  });

  const rows = ventas.map((v) => [
    v.id || "-",
    v.cliente || "-",
    v.fecha || v.fechaISO || "-",
    v.categoria || "General",
    v.itemsTexto || v.items || "Venta registrada",
    v.estado || "-",
    v.totalNumber ? formatCOP(v.totalNumber) : v.total || "$0",
  ]);

  autoTable(doc, {
    startY: ySeccion + 14,
    head: [[
      "Factura",
      "Cliente",
      "Fecha",
      "Categoría",
      "Descripción",
      "Estado",
      "Total",
    ]],
    body: rows,
    theme: "plain",
    margin: { left: 14, right: 14 },
    headStyles: {
      fillColor: C.negro,
      textColor: C.blanco,
      fontStyle: "bold",
      halign: "center",
      fontSize: 7,
      cellPadding: { top: 4, bottom: 4, left: 2, right: 2 },
    },
    styles: {
      font: "helvetica",
      fontSize: 7,
      cellPadding: { top: 3.5, bottom: 3.5, left: 2.5, right: 2.5 },
      overflow: "linebreak",
      valign: "middle",
      textColor: C.grisOscuro,
      lineColor: C.grisClaro,
      lineWidth: 0.15,
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    columnStyles: {
      0: { cellWidth: 24, fontStyle: "bold", textColor: C.verdeBase },
      1: { cellWidth: 32 },
      2: { cellWidth: 24, halign: "center" },
      3: { cellWidth: 22, halign: "center" },
      4: { cellWidth: 45 },
      5: { cellWidth: 22, halign: "center" },
      6: { cellWidth: 27, halign: "right", fontStyle: "bold", textColor: C.verdeBase },
    },
    didDrawCell: (data) => {
      if (data.section === "head" && data.row.index === 0) {
        doc.setDrawColor(...C.verdeBase);
        doc.setLineWidth(0.8);
        doc.line(
          data.cell.x,
          data.cell.y + data.cell.height,
          data.cell.x + data.cell.width,
          data.cell.y + data.cell.height
        );
      }
    },
  });

  let firmaY = doc.lastAutoTable.finalY + 18;

  if (firmaY > 255) {
    doc.addPage();
    firmaY = 30;
  }

  doc.setFillColor(...C.grisFondo);
  doc.setDrawColor(...C.grisClaro);
  doc.roundedRect(14, firmaY, 90, 38, 3, 3, "FD");

  doc.setFillColor(...C.verdeBase);
  doc.roundedRect(14, firmaY, 3, 38, 2, 2, "F");
  doc.rect(15.5, firmaY, 1.5, 38, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...C.grisMedio);
  doc.text("FIRMA RESPONSABLE", 22, firmaY + 9);

  doc.setDrawColor(...C.grisOscuro);
  doc.line(22, firmaY + 26, 96, firmaY + 26);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...C.negro);
  doc.text(usuario?.nombres || usuario?.nombre || "Usuario responsable", 22, firmaY + 32);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...C.grisMedio);
  doc.text(usuario?.rol || "Administrador", 22, firmaY + 37);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(6.5);
  doc.setTextColor(...C.grisMedio);
  doc.text("Documento oficial generado por GanaControl.", pw - 14, firmaY + 9, {
    align: "right",
  });
  doc.text("Reporte automático del módulo de ventas.", pw - 14, firmaY + 14, {
    align: "right",
  });

  agregarFooter(doc, fecha);

  doc.save(`reporte-ventas-${new Date().toISOString().split("T")[0]}.pdf`);
}