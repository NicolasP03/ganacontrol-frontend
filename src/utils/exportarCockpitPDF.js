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
  verdePale: [240, 253, 244],
  blanco: [255, 255, 255],
  azul: [37, 99, 235],
};

const formatCOP = (valor) =>
  Number(valor || 0).toLocaleString("es-CO", {
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
  doc.setGState(new doc.GState({ opacity: 0.035 }));
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
    doc.setTextColor(...C.grisClaro);
    doc.text(`GanaControl · Cockpit Financiero · ${fecha}`, 14, ph - 5.5);

    doc.text(`Página ${i} / ${total}`, pw - 14, ph - 5.5, {
      align: "right",
    });

    doc.setDrawColor(...C.verdeBase);
    doc.setLineWidth(0.8);
    doc.line(0, ph - 14, pw, ph - 14);
  }
};

export async function exportarCockpitPDF({
  kpis = [],
  barras = [],
  liquidacion = [],
  transacciones = [],
  usuario = {},
  periodoActivo = "Mes",
} = {}) {
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
  doc.text("REPORTE COCKPIT FINANCIERO", pw / 2 + 4, 21);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...C.grisMedio);
  doc.text(`Generado: ${fecha} · ${hora}`, pw / 2 + 4, 28);

  doc.setFillColor(...C.verdeBase);
  doc.roundedRect(pw / 2 + 4, 32, 28, 8, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(...C.blanco);
  doc.text("FINANZAS", pw / 2 + 18, 37.2, { align: "center" });

  doc.setFillColor(248, 249, 250);
  doc.rect(0, 52, pw, 22, "F");
  doc.setDrawColor(...C.grisClaro);
  doc.line(0, 74, pw, 74);

  const info = [
    ["RESPONSABLE", usuario?.nombres || usuario?.nombre || "Usuario"],
    ["ROL", usuario?.rol || "Administrador"],
    ["FINCA", usuario?.finca || "La Ceiva"],
    ["PERIODO", periodoActivo],
  ];

  info.forEach(([label, value], i) => {
    const x = 14 + i * ((pw - 28) / 4);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.setTextColor(...C.grisMedio);
    doc.text(label, x, 59);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.3);
    doc.setTextColor(...C.grisOscuro);
    doc.text(String(value), x, 67);
  });

  const cardY = 82;
  const cardH = 25;
  const cardW = (pw - 28) / 4;

  const kpiCards = kpis.slice(0, 4);

  kpiCards.forEach((k, i) => {
    const x = 14 + i * cardW;

    doc.setFillColor(...C.blanco);
    doc.setDrawColor(...C.grisClaro);
    doc.roundedRect(x, cardY, cardW - 3, cardH, 2, 2, "FD");

    doc.setFillColor(...C.verdeBase);
    doc.roundedRect(x, cardY, cardW - 3, 3, 1, 1, "F");
    doc.rect(x, cardY + 1.5, cardW - 3, 1.5, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.7);
    doc.setTextColor(...C.grisMedio);
    doc.text(String(k.label || "KPI").toUpperCase(), x + 4, cardY + 9);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(String(k.value || "").length > 11 ? 9 : 12);
    doc.setTextColor(...C.verdeBase);
    doc.text(String(k.value || "--"), x + 4, cardY + 18.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...C.grisMedio);
    doc.text(String(k.delta || ""), x + 4, cardY + 23);
  });

  const chartY = cardY + cardH + 14;

  doc.setFillColor(...C.negro);
  doc.rect(14, chartY, pw - 28, 10, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...C.blanco);
  doc.text(`ANÁLISIS DE CRECIMIENTO · ${periodoActivo.toUpperCase()}`, 20, chartY + 6.5);

  const barrasValidas = barras || [];
  const chartTop = chartY + 20;
  const chartBase = chartTop + 55;
  const gap = 5;
  const barW = Math.min(10, (pw - 40) / Math.max(barrasValidas.length, 1) - gap);

  barrasValidas.forEach((b, i) => {
    const x = 18 + i * ((pw - 36) / Math.max(barrasValidas.length, 1));
    const altura = Math.max(0, Math.min(Number(b.altura || 0), 100));
    const h = altura > 0 ? Math.max(5, (altura / 100) * 50) : 0;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.setTextColor(...C.grisMedio);

    const valor = Number(b.valor || 0);
    const txt =
      valor >= 1000000
        ? `$${Math.round(valor / 1000000)}M`
        : valor > 0
          ? formatCOP(valor)
          : "$0";

    doc.text(txt, x + barW / 2, chartTop - 2, { align: "center" });

    doc.setFillColor(...C.verdePale);
    doc.roundedRect(x, chartTop, barW, 55, 3, 3, "F");

    if (h > 0) {
      doc.setFillColor(...(b.activo ? C.verdeMedio : [180, 230, 195]));
      doc.roundedRect(x, chartBase - h, barW, h, 3, 3, "F");
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.8);
    doc.setTextColor(...(b.activo ? C.verdeBase : C.grisMedio));
    doc.text(String(b.label || ""), x + barW / 2, chartBase + 7, {
      align: "center",
    });
  });

  const liqY = chartBase + 20;

  doc.setFillColor(...C.negro);
  doc.rect(14, liqY, pw - 28, 10, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...C.blanco);
  doc.text("ESTADO DE LIQUIDACIÓN", 20, liqY + 6.5);

  const liqRows = liquidacion.map((l) => [
    l.label || "-",
    l.tipo || "-",
    l.desc || "-",
    l.cliente || "-",
    l.val || "-",
  ]);

  autoTable(doc, {
    startY: liqY + 14,
    head: [["Factura", "Tipo", "Detalle", "Cliente", "Valor"]],
    body: liqRows.length ? liqRows : [["-", "-", "Sin registros", "-", "-"]],
    theme: "plain",
    margin: { left: 14, right: 14 },
    headStyles: {
      fillColor: C.verdeBase,
      textColor: C.blanco,
      fontStyle: "bold",
      fontSize: 7,
      halign: "center",
    },
    styles: {
      font: "helvetica",
      fontSize: 7,
      cellPadding: 3,
      textColor: C.grisOscuro,
      lineColor: C.grisClaro,
      lineWidth: 0.15,
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    columnStyles: {
      0: { fontStyle: "bold", textColor: C.verdeBase },
      4: { halign: "right", fontStyle: "bold", textColor: C.verdeBase },
    },
  });

  const txY = doc.lastAutoTable.finalY + 12;

  doc.setFillColor(...C.negro);
  doc.rect(14, txY, pw - 28, 10, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...C.blanco);
  doc.text("TRANSACCIONES RECIENTES", 20, txY + 6.5);

  const txRows = transacciones.map((t) => [
    t.id || "-",
    t.lote || "-",
    t.cliente || "-",
    t.fecha || "-",
    t.estado || "-",
    t.monto || "-",
  ]);

  autoTable(doc, {
    startY: txY + 14,
    head: [["ID", "Lote / Factura", "Cliente", "Fecha", "Estado", "Monto"]],
    body: txRows.length ? txRows : [["-", "-", "Sin transacciones", "-", "-", "-"]],
    theme: "plain",
    margin: { left: 14, right: 14 },
    headStyles: {
      fillColor: C.negro,
      textColor: C.blanco,
      fontStyle: "bold",
      fontSize: 7,
    },
    styles: {
      font: "helvetica",
      fontSize: 7,
      cellPadding: 3,
      textColor: C.grisOscuro,
      lineColor: C.grisClaro,
      lineWidth: 0.15,
      overflow: "linebreak",
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    columnStyles: {
      0: { fontStyle: "bold", textColor: C.verdeBase },
      5: { halign: "right", fontStyle: "bold", textColor: C.verdeBase },
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
  doc.text("Documento financiero generado por GanaControl.", pw - 14, firmaY + 9, {
    align: "right",
  });
  doc.text("Reporte automático del módulo Cockpit.", pw - 14, firmaY + 14, {
    align: "right",
  });

  agregarFooter(doc, fecha);

  doc.save(`reporte-cockpit-${new Date().toISOString().split("T")[0]}.pdf`);
}