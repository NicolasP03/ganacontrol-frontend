import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoGanaControl from "../assets/icons/cow.png";

// ─── Paleta de colores refinada ────────────────────────────────────────────────
const C = {
  negro:        [10,  14,  20],   // Casi negro para texto principal
  grisOscuro:   [38,  50,  56],   // Textos secundarios
  grisMedio:    [96, 125, 139],   // Subtítulos, etiquetas
  grisClaro:    [207, 216, 220],  // Bordes sutiles
  grisFondo:    [245, 247, 248],  // Fondos alternos de fila
  verdeBase:    [22, 101,  52],   // Verde principal (más oscuro y serio)
  verdeMedio:   [21, 128,  61],   // Verde secundario
  verdePale:    [240, 253, 244],  // Fondo muy suave
  verdeAccent:  [74, 222, 128],   // Acento luminoso solo en elementos pequeños
  blanco:       [255, 255, 255],
  dorado:       [180, 140,  60],  // Acento premium para detalles
};

// ─── Utilidades ────────────────────────────────────────────────────────────────
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

// ─── Marca de agua discreta ────────────────────────────────────────────────────
const agregarMarcaAgua = (doc) => {
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  doc.saveGraphicsState();
  doc.setGState(new doc.GState({ opacity: 0.03 }));
  doc.setTextColor(...C.verdeBase);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(52);
  doc.text("GanaControl", pw / 2, ph / 2, { align: "center", angle: 32 });
  doc.restoreGraphicsState();
};

// ─── Footer de página ──────────────────────────────────────────────────────────
const agregarFooter = (doc, fecha) => {
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const total = doc.internal.getNumberOfPages();

  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    agregarMarcaAgua(doc);

    // Franja footer
    doc.setFillColor(...C.negro);
    doc.rect(0, ph - 14, pw, 14, "F");

    // Texto izquierdo
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...C.grisMedio);
    doc.text(`GanaControl · Gestión Ganadera · ${fecha}`, 14, ph - 5.5);

    // Número de página
    doc.setTextColor(...C.grisClaro);
    doc.text(`Página ${i} / ${total}`, pw - 14, ph - 5.5, { align: "right" });

    // Línea superior del footer (acento verde)
    doc.setDrawColor(...C.verdeBase);
    doc.setLineWidth(0.8);
    doc.line(0, ph - 14, pw, ph - 14);
  }
};

// ─── Función principal ─────────────────────────────────────────────────────────
export async function exportarHistorialSaludPDF(eventos = [], usuario = {}) {
  const doc = new jsPDF("p", "mm", "a4");
  const pw = doc.internal.pageSize.getWidth();
  const fecha = fechaActual();
  const hora = horaActual();

  const logoBase64 = await cargarImagenBase64(logoGanaControl);

  // ── 1. FRANJA DE FONDO SUPERIOR (header negro elegante) ────────────────────
  doc.setFillColor(...C.negro);
  doc.rect(0, 0, pw, 52, "F");

  // Acento verde lateral izquierdo
  doc.setFillColor(...C.verdeBase);
  doc.rect(0, 0, 4, 52, "F");

  // Logo
  if (logoBase64) {
    doc.setFillColor(...C.verdeBase);
    doc.roundedRect(12, 11, 22, 22, 3, 3, "F");
    doc.addImage(logoBase64, "PNG", 16, 15, 14, 14);
  }

  // Nombre de la app
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...C.blanco);
  doc.text("GanaControl", 40, 21);

  // Tagline
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...C.grisMedio);
  doc.text("Sistema de Gestión Ganadera", 40, 28);

  // Separador vertical entre logo/nombre y el título del reporte
  doc.setDrawColor(...C.grisOscuro);
  doc.setLineWidth(0.4);
  doc.line(pw / 2 - 10, 13, pw / 2 - 10, 42);

  // Título del reporte (lado derecho del header)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...C.blanco);
  doc.text("HISTORIAL CLÍNICO SANITARIO", pw / 2 + 4, 21);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...C.grisMedio);
  doc.text(`Generado: ${fecha} · ${hora}`, pw / 2 + 4, 28);

  // Badge "OFICIAL"
  doc.setFillColor(...C.verdeBase);
  doc.roundedRect(pw / 2 + 4, 32, 22, 8, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(...C.blanco);
  doc.text("OFICIAL", pw / 2 + 15, 37.2, { align: "center" });

  // ── 2. BARRA DE IDENTIFICACIÓN (fondo gris muy suave) ──────────────────────
  doc.setFillColor(248, 249, 250);
  doc.rect(0, 52, pw, 22, "F");
  doc.setDrawColor(...C.grisClaro);
  doc.setLineWidth(0.3);
  doc.line(0, 74, pw, 74);

  const infoItems = [
    { label: "RESPONSABLE", value: usuario?.nombres || usuario?.nombre || "Sin usuario" },
    { label: "ROL",         value: usuario?.rol  || "Administrador" },
    { label: "FINCA",       value: usuario?.finca || "La Ceiva" },
    { label: "FECHA",       value: fecha },
  ];

  infoItems.forEach((item, i) => {
    const x = 14 + i * (pw - 28) / 4;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.setTextColor(...C.grisMedio);
    doc.text(item.label, x, 59);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...C.grisOscuro);
    doc.text(item.value, x, 67);
  });

  // ── 3. TARJETAS DE MÉTRICAS ────────────────────────────────────────────────
  const totalEventos = eventos.length;
  const completados  = eventos.filter((e) => e.estadoKey === "completado").length;
  const pendientes   = eventos.filter((e) => e.estadoKey === "pendiente").length;
  const enCurso      = eventos.filter((e) => e.estadoKey === "en_curso").length;
  const costoTotal   = eventos.reduce((acc, e) => acc + Number(e.costo || 0), 0);

  const metricas = [
    { label: "TOTAL EVENTOS",  valor: String(totalEventos),   color: C.verdeBase   },
    { label: "COMPLETADOS",    valor: String(completados),    color: [21, 128, 61] },
    { label: "EN CURSO",       valor: String(enCurso),        color: [37, 99, 235] },
    { label: "PENDIENTES",     valor: String(pendientes),     color: [180, 83,  9] },
    { label: "COSTO TOTAL",    valor: formatCOP(costoTotal),  color: C.negro       },
  ];

  const cardW = (pw - 28) / 5;
  const cardY = 80;
  const cardH = 26;

  metricas.forEach((m, i) => {
    const x = 14 + i * cardW;

    // Fondo blanco con borde sutil
    doc.setFillColor(...C.blanco);
    doc.setDrawColor(...C.grisClaro);
    doc.setLineWidth(0.25);
    doc.roundedRect(x, cardY, cardW - 2, cardH, 2, 2, "FD");

    // Acento superior coloreado
    doc.setFillColor(...m.color);
    doc.roundedRect(x, cardY, cardW - 2, 3, 1, 1, "F");
    // Tapa las esquinas redondeadas de abajo del acento
    doc.rect(x, cardY + 1.5, cardW - 2, 1.5, "F");

    // Label
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.5);
    doc.setTextColor(...C.grisMedio);
    doc.text(m.label, x + (cardW - 2) / 2, cardY + 9, { align: "center" });

    // Valor
    const fontSize = m.valor.length > 10 ? 8 : 12;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(fontSize);
    doc.setTextColor(...m.color);
    doc.text(m.valor, x + (cardW - 2) / 2, cardY + 20, { align: "center" });
  });

  // ── 4. SECCIÓN TABLA ───────────────────────────────────────────────────────
  const ySeccion = cardY + cardH + 12;

  // Título de sección
  doc.setFillColor(...C.negro);
  doc.rect(14, ySeccion - 1, pw - 28, 11, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...C.blanco);
  doc.text("DETALLE DEL HISTORIAL CLÍNICO", 20, ySeccion + 6.5);

  // Cantidad de registros (lado derecho)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...C.grisMedio);
  doc.text(`${totalEventos} registro${totalEventos !== 1 ? "s" : ""}`, pw - 18, ySeccion + 6.5, { align: "right" });

  // ── 5. TABLA PRINCIPAL ─────────────────────────────────────────────────────
  const rows = eventos.map((ev) => [
    ev.id || ev.backendId || "-",
    ev.animalCod || "-",
    ev.animalNombre || "-",
    ev.tipo || ev.categoria || "-",
    ev.tratamiento || ev.descripcion || ev.notas || "-",
    ev.vet || "—",
    ev.fecha || ev.fechaISO || "-",
    ev.estado || "-",
    ev.cantidad_usada ? String(ev.cantidad_usada) : "-",
    ev.costo ? formatCOP(ev.costo) : "-",
  ]);

  autoTable(doc, {
    startY: ySeccion + 14,
    head: [[
      "ID", "Código", "Animal", "Tipo",
      "Tratamiento / Descripción", "Veterinario",
      "Fecha", "Estado", "Cant.", "Costo",
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
    bodyStyles: {
      fillColor: C.blanco,
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 10,  fontStyle: "bold", textColor: C.grisMedio },
      1: { cellWidth: 16,    fontStyle: "bold", textColor: C.verdeBase },
      2: { cellWidth: 22 },
      3: { cellWidth: 20 },
      4: { cellWidth: 35 },
      5: { cellWidth: 26 },
      6: { cellWidth: 20,   halign: "center" },
      7: { cellWidth: 18,   halign: "center" },
      8: { cellWidth: 11,   halign: "center" },
      9: { cellWidth: 22,   halign: "right",  fontStyle: "bold", textColor: C.verdeBase },
    },
    // Línea separadora entre header y primera fila
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

  // ── 6. SECCIÓN DE FIRMA ────────────────────────────────────────────────────
  let firmaY = doc.lastAutoTable.finalY + 18;

  if (firmaY > 255) {
    doc.addPage();
    firmaY = 30;
  }

  // Caja de firma
  doc.setFillColor(...C.grisFondo);
  doc.setDrawColor(...C.grisClaro);
  doc.setLineWidth(0.3);
  doc.roundedRect(14, firmaY, 90, 38, 3, 3, "FD");

  // Acento izquierdo verde
  doc.setFillColor(...C.verdeBase);
  doc.roundedRect(14, firmaY, 3, 38, 2, 2, "F");
  doc.rect(15.5, firmaY, 1.5, 38, "F"); // tapa esquina derecha del acento

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...C.grisMedio);
  doc.text("FIRMA RESPONSABLE", 22, firmaY + 9);

  // Línea de firma
  doc.setDrawColor(...C.grisOscuro);
  doc.setLineWidth(0.5);
  doc.line(22, firmaY + 26, 96, firmaY + 26);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...C.negro);
  doc.text(usuario?.nombres || usuario?.nombre || "Usuario responsable", 22, firmaY + 32);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...C.grisMedio);
  doc.text(usuario?.rol || "Administrador", 22, firmaY + 37);

  // Nota legal a la derecha
  doc.setFont("helvetica", "italic");
  doc.setFontSize(6.5);
  doc.setTextColor(...C.grisMedio);
  const notaX = pw - 14;
  doc.text("Este documento es de carácter oficial.", notaX, firmaY + 9, { align: "right" });
  doc.text("Generado automáticamente por GanaControl.", notaX, firmaY + 14, { align: "right" });
  doc.text("No requiere firma digital adicional.", notaX, firmaY + 19, { align: "right" });

  // ── 7. FOOTER EN TODAS LAS PÁGINAS ────────────────────────────────────────
  agregarFooter(doc, fecha);

  // ── 8. GUARDAR ─────────────────────────────────────────────────────────────
  doc.save(`historial-salud-${new Date().toISOString().split("T")[0]}.pdf`);
}