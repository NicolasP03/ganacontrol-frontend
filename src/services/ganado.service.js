import api from "./api";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";

const LOGO_BASE64 = "data:image/png;base64,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";

const API_URL = import.meta.env.VITE_API_URL || "";

const C = {
  negro: [10, 14, 20],
  grisOscuro: [38, 50, 56],
  grisMedio: [96, 125, 139],
  grisClaro: [207, 216, 220],
  verdeBase: [22, 101, 52],
  verdeMedio: [21, 128, 61],
  blanco: [255, 255, 255],
  azul: [37, 99, 235],
  naranja: [180, 83, 9],
};

const getUploadsBase = () =>
  API_URL.replace(/\/api\/?$/, "").replace(/\/$/, "");

const construirUrlImagen = (fotoUrl) => {
  if (!fotoUrl) return "";

  const ruta = String(fotoUrl).trim();
  if (!ruta || ruta === "null" || ruta === "undefined") return "";
  if (ruta.startsWith("http://") || ruta.startsWith("https://")) return ruta;

  const path = ruta.startsWith("/") ? ruta : `/${ruta}`;
  return `${getUploadsBase()}${path}`;
};

const extraerData = (res) => res?.mensaje?.data ?? res?.data ?? null;
const extraerLista = (res) => res?.mensaje?.data ?? res?.data ?? [];

const estadoDesdeBackend = (item) => {
  if (item?.estado_biologico === "Muerto") return "Muerto";
  if (item?.estado_comercial === "Vendido") return "Vendido";
  if (item?.estado_comercial === "Descartado") return "Descartado";
  return item?.estado_general || "Activo";
};

const numeroONull = (valor) => {
  if (valor === "" || valor === null || valor === undefined) return null;
  const n = Number(valor);
  return Number.isNaN(n) ? null : n;
};

const texto = (valor, fallback = "") => {
  if (valor === null || valor === undefined || valor === "") return fallback;
  return valor;
};

const fechaArchivo = () => new Date().toISOString().slice(0, 10);

const fechaLarga = () =>
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

const imagenABase64 = async (url) => {
  if (!url) return null;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;

    const blob = await res.blob();

    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

const adaptarDesdeBackend = (item) => ({
  id: item.id,
  codigo: item.codigo || "",
  nombre: item.nombre || "",
  raza: item.raza || "",
  sexo: item.sexo || "",
  categoria: item.categoria || "",
  fecha_nacimiento: item.fecha_nacimiento || "",

  peso:
    item.peso_actual !== null && item.peso_actual !== undefined
      ? Number(item.peso_actual)
      : "",

  peso_actual:
    item.peso_actual !== null && item.peso_actual !== undefined
      ? Number(item.peso_actual)
      : "",

  estado: estadoDesdeBackend(item),
  estado_general: item.estado_general || "Activo",
  estado_biologico: item.estado_biologico || "Vivo",
  estado_comercial: item.estado_comercial || "Disponible",
  estado_salud: item.estado_salud || "Sano",
  estado_reproductivo: item.estado_reproductivo || "No aplica",

  fecha_ultimo_parto: item.fecha_ultimo_parto || "",
  fecha_probable_parto: item.fecha_probable_parto || "",
  numero_partos: item.numero_partos ?? "",
  estado_productivo: item.estado_productivo || "",
  es_reproductor: Boolean(item.es_reproductor),

  potrero: item.potrero?.nombre || "",
  potrero_id: item.potrero_id ? String(item.potrero_id) : "",
  madre_id: item.madre_id ? String(item.madre_id) : "",
  padre_id: item.padre_id ? String(item.padre_id) : "",
  madre: item.madre ? [item.madre.codigo, item.madre.nombre].filter(Boolean).join(" · ") : "",
  padre: item.padre ? [item.padre.codigo, item.padre.nombre].filter(Boolean).join(" · ") : "",
  origen: item.origen || "Nacimiento en finca",
  fecha_ingreso: item.fecha_ingreso || "",

  notas: item.observaciones || "",
  observaciones: item.observaciones || "",
  creado_en: item.creado_en || null,

  foto_url: item.foto_url || "",
  foto: construirUrlImagen(item.foto_url),
});

const adaptarHaciaBackend = (data) => ({
  codigo: data.codigo || "",
  nombre: data.nombre || null,
  sexo: data.sexo || null,
  categoria: data.categoria || null,
  raza: data.raza || null,
  fecha_nacimiento: data.fecha_nacimiento || null,
  peso_actual: numeroONull(data.peso_actual ?? data.peso),

  estado_general: data.estado_general || "Activo",
  estado_biologico: data.estado_biologico || "Vivo",
  estado_comercial: data.estado_comercial || "Disponible",
  estado_salud: data.estado_salud || "Sano",
  estado_reproductivo: data.estado_reproductivo || "No aplica",

  fecha_ultimo_parto: data.fecha_ultimo_parto || null,
  fecha_probable_parto: data.fecha_probable_parto || null,
  numero_partos: numeroONull(data.numero_partos),
  estado_productivo: data.estado_productivo || null,
  es_reproductor:
    data.es_reproductor === true || data.es_reproductor === "true",

  potrero_id: numeroONull(data.potrero_id),
  madre_id: numeroONull(data.madre_id),
  padre_id: numeroONull(data.padre_id),
  origen: data.origen || "Nacimiento en finca",
  fecha_ingreso: data.fecha_ingreso || null,

  observaciones: data.observaciones || data.notas || null,
});

// Al editar se envían también los campos vacíos ("") para que el backend los borre;
// al crear se omiten.
const crearFormDataGanado = (data, { incluirVacios = false } = {}) => {
  const payload = adaptarHaciaBackend(data);
  const fd = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      fd.append(key, value);
    } else if (incluirVacios) {
      fd.append(key, "");
    }
  });

  if (data.foto instanceof File) {
    fd.append("foto", data.foto);
  }

  return fd;
};

const prepararDataExportacion = (rows = []) =>
  rows.map((a) => ({
    Código: texto(a.codigo),
    Nombre: texto(a.nombre, "Sin nombre"),
    Sexo: texto(a.sexo),
    Categoría: texto(a.categoria),
    Raza: texto(a.raza),
    "Peso actual kg": texto(a.peso_actual ?? a.peso),
    "Fecha nacimiento": texto(a.fecha_nacimiento),
    "Fecha ingreso": texto(a.fecha_ingreso),
    Origen: texto(a.origen),
    Estado: texto(a.estado),
    "Estado general": texto(a.estado_general),
    "Estado biológico": texto(a.estado_biologico),
    "Estado comercial": texto(a.estado_comercial),
    "Estado salud": texto(a.estado_salud),
    "Estado reproductivo": texto(a.estado_reproductivo),
    "Estado productivo": texto(a.estado_productivo),
    "Número partos": texto(a.numero_partos),
    "Último parto": texto(a.fecha_ultimo_parto),
    "Probable parto": texto(a.fecha_probable_parto),
    "Es reproductor": a.es_reproductor ? "Sí" : "No",
    Potrero: texto(a.potrero),
    Madre: texto(a.madre || a.madre_id),
    Padre: texto(a.padre || a.padre_id),
    Observaciones: texto(a.observaciones || a.notas),
  }));

const exportarCSV = (data, fecha) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(ws);

  saveAs(
    new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    }),
    `ganado_${fecha}.csv`
  );
};

const exportarJSON = (data, fecha) => {
  saveAs(
    new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json;charset=utf-8;",
    }),
    `ganado_${fecha}.json`
  );
};

const exportarExcel = (rows, fecha) => {
  const data = prepararDataExportacion(rows);
  const wb = XLSX.utils.book_new();

  const ws = XLSX.utils.json_to_sheet(data, { origin: "A4" });
  const headers = Object.keys(data[0] || {});

  ws["!cols"] = headers.map((h) => ({
    wch: Math.max(h.length + 4, 18),
  }));

  ws["A1"] = { v: "GanaControl · Inventario Ganadero", t: "s" };
  ws["A2"] = { v: `Exportado: ${fechaLarga()} · ${horaActual()}`, t: "s" };
  ws["A3"] = { v: `Total registros: ${rows.length}`, t: "s" };

  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: Math.max(headers.length - 1, 0) } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: Math.max(headers.length - 1, 0) } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: Math.max(headers.length - 1, 0) } },
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Inventario");

  const activos = rows.filter((r) => r.estado_general === "Activo").length;
  const inactivos = rows.filter((r) => r.estado_general === "Inactivo").length;
  const vendidos = rows.filter((r) => r.estado_comercial === "Vendido").length;
  const muertos = rows.filter((r) => r.estado_biologico === "Muerto").length;
  const machos = rows.filter((r) => r.sexo === "Macho").length;
  const hembras = rows.filter((r) => r.sexo === "Hembra").length;

  const pesoTotal = rows.reduce(
    (s, r) => s + Number(r.peso_actual || r.peso || 0),
    0
  );

  const pesoPromedio = rows.length ? (pesoTotal / rows.length).toFixed(1) : 0;

  const resumenData = [
    ["GanaControl · Resumen de Inventario", ""],
    [`Fecha: ${fechaLarga()}`, ""],
    ["", ""],
    ["MÉTRICA", "VALOR"],
    ["Total animales", rows.length],
    ["Activos", activos],
    ["Inactivos", inactivos],
    ["Vendidos", vendidos],
    ["Muertos", muertos],
    ["Machos", machos],
    ["Hembras", hembras],
    ["Peso total kg", pesoTotal],
    ["Peso promedio kg", pesoPromedio],
  ];

  const wsR = XLSX.utils.aoa_to_sheet(resumenData);
  wsR["!cols"] = [{ wch: 30 }, { wch: 18 }];

  XLSX.utils.book_append_sheet(wb, wsR, "Resumen");
  XLSX.writeFile(wb, `ganado_${fecha}.xlsx`);
};

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

const agregarFooter = (doc, fecha, hora) => {
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const total = doc.internal.getNumberOfPages();

  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    agregarMarcaAgua(doc);

    doc.setFillColor(...C.negro);
    doc.rect(0, ph - 14, pw, 14, "F");

    doc.setDrawColor(...C.verdeBase);
    doc.setLineWidth(0.8);
    doc.line(0, ph - 14, pw, ph - 14);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...C.grisMedio);
    doc.text(`GanaControl · Gestión Ganadera · ${fecha} · ${hora}`, 14, ph - 5.5);

    doc.setTextColor(...C.grisClaro);
    doc.text(`Página ${i} / ${total}`, pw - 14, ph - 5.5, {
      align: "right",
    });
  }
};

const exportarPDF = async (rows, fecha) => {
  const doc = new jsPDF("landscape", "mm", "a4");
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const hora = horaActual();
  const fechaL = fechaLarga();

  const fotos = await Promise.all(rows.map((a) => imagenABase64(a.foto)));

  doc.setFillColor(...C.negro);
  doc.rect(0, 0, pw, 52, "F");

  doc.setFillColor(...C.verdeBase);
  doc.rect(0, 0, 4, 52, "F");
  doc.roundedRect(12, 11, 22, 22, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...C.blanco);
  doc.text("GanaControl", 40, 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...C.grisMedio);
  doc.text("Sistema de Gestión Ganadera", 40, 29);

  doc.setDrawColor(...C.grisOscuro);
  doc.setLineWidth(0.4);
  doc.line(pw / 2 - 10, 12, pw / 2 - 10, 43);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...C.blanco);
  doc.text("INVENTARIO GANADERO", pw / 2 + 4, 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...C.grisMedio);
  doc.text(`Generado: ${fechaL} · ${hora}`, pw / 2 + 4, 29);

  // Logo real
  try {
    doc.addImage(LOGO_BASE64, "PNG", 15.5, 14.5, 15, 15);
  } catch (e) {
    console.warn("No se pudo cargar logo:", e);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(...C.blanco);
  doc.text("OFICIAL", pw / 2 + 15, 38.2, {
    align: "center",
  });

  doc.setFillColor(248, 249, 250);
  doc.rect(0, 52, pw, 20, "F");

  doc.setDrawColor(...C.grisClaro);
  doc.setLineWidth(0.3);
  doc.line(0, 72, pw, 72);

  const infoItems = [
    { label: "FECHA EXPORTACIÓN", value: fechaL },
    { label: "TOTAL REGISTROS", value: String(rows.length) },
    { label: "FORMATO", value: "PDF Landscape A4" },
    { label: "SISTEMA", value: "GanaControl v1.0" },
  ];

  infoItems.forEach((item, i) => {
    const x = 14 + (i * (pw - 28)) / 4;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.setTextColor(...C.grisMedio);
    doc.text(item.label, x, 59);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...C.grisOscuro);
    doc.text(item.value, x, 67);
  });

  const activos = rows.filter((r) => r.estado_general === "Activo").length;
  const inactivos = rows.filter((r) => r.estado_general === "Inactivo").length;
  const vendidos = rows.filter((r) => r.estado_comercial === "Vendido").length;
  const muertos = rows.filter((r) => r.estado_biologico === "Muerto").length;
  const machos = rows.filter((r) => r.sexo === "Macho").length;
  const hembras = rows.filter((r) => r.sexo === "Hembra").length;

  const metricas = [
    { label: "TOTAL", valor: String(rows.length), color: C.verdeBase },
    { label: "ACTIVOS", valor: String(activos), color: C.verdeMedio },
    { label: "INACTIVOS", valor: String(inactivos), color: C.grisMedio },
    { label: "VENDIDOS", valor: String(vendidos), color: C.azul },
    { label: "MUERTOS", valor: String(muertos), color: C.naranja },
    { label: "MACHOS", valor: String(machos), color: C.grisOscuro },
    { label: "HEMBRAS", valor: String(hembras), color: C.verdeBase },
  ];

  const cardW = (pw - 28) / 7;
  const cardY = 78;
  const cardH = 24;

  metricas.forEach((m, i) => {
    const x = 14 + i * cardW;

    doc.setFillColor(...C.blanco);
    doc.setDrawColor(...C.grisClaro);
    doc.setLineWidth(0.25);
    doc.roundedRect(x, cardY, cardW - 2, cardH, 2, 2, "FD");

    doc.setFillColor(...m.color);
    doc.roundedRect(x, cardY, cardW - 2, 3, 1, 1, "F");
    doc.rect(x, cardY + 1.5, cardW - 2, 1.5, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.5);
    doc.setTextColor(...C.grisMedio);
    doc.text(m.label, x + (cardW - 2) / 2, cardY + 9, {
      align: "center",
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...m.color);
    doc.text(m.valor, x + (cardW - 2) / 2, cardY + 19, {
      align: "center",
    });
  });

  const ySeccion = cardY + cardH + 10;

  doc.setFillColor(...C.negro);
  doc.rect(14, ySeccion, pw - 28, 11, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...C.blanco);
  doc.text("DETALLE DEL INVENTARIO GANADERO", 20, ySeccion + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...C.grisMedio);
  doc.text(`${rows.length} registros`, pw - 18, ySeccion + 7, {
    align: "right",
  });

  autoTable(doc, {
    startY: ySeccion + 14,
    margin: { left: 14, right: 14 },
    head: [[
      "Foto",
      "Código",
      "Nombre",
      "Sexo",
      "Categoría",
      "Raza",
      "Peso kg",
      "Estado",
      "Salud",
      "Potrero",
    ]],
    body: rows.map((a) => [
      "",
      texto(a.codigo, "-"),
      texto(a.nombre, "Sin nombre"),
      texto(a.sexo, "-"),
      texto(a.categoria, "-"),
      texto(a.raza, "-"),
      texto(a.peso_actual ?? a.peso, "-"),
      texto(a.estado_general, "-"),
      texto(a.estado_salud, "-"),
      texto(a.potrero, "-"),
    ]),
    theme: "plain",
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
      minCellHeight: 17,
    },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    bodyStyles: { fillColor: C.blanco },
    columnStyles: {
      0: { cellWidth: 18, halign: "center" },
      1: { cellWidth: 18, fontStyle: "bold", textColor: C.verdeBase, halign: "center" },
      2: { cellWidth: 27 },
      3: { cellWidth: 14, halign: "center" },
      4: { cellWidth: 22 },
      5: { cellWidth: 22 },
      6: { cellWidth: 14, halign: "center", fontStyle: "bold" },
      7: { cellWidth: 21, halign: "center" },
      8: { cellWidth: 20, halign: "center" },
      9: { cellWidth: 18 },
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

      if (data.section === "body" && data.column.index === 0) {
        const img = fotos[data.row.index];
        if (!img) return;

        const x = data.cell.x + 2.5;
        const y = data.cell.y + 2;
        const w = 13;
        const h = 13;

        try {
          doc.addImage(img, "JPEG", x, y, w, h);
        } catch {
          try {
            doc.addImage(img, "PNG", x, y, w, h);
          } catch {
            // Ignora imagen dañada
          }
        }
      }
    },
  });

  const notaY = doc.lastAutoTable.finalY + 10;

  if (notaY < ph - 30) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(6.5);
    doc.setTextColor(...C.grisMedio);
    doc.text(
      "Documento generado automáticamente por GanaControl. No requiere firma adicional.",
      pw / 2,
      notaY,
      { align: "center" }
    );
  }

  agregarFooter(doc, fechaL, hora);
  doc.save(`ganado_${fecha}.pdf`);
};

export const ganadoService = {
  listar: async () => {
    const res = await api("/ganado", { method: "GET" });
    const rows = extraerLista(res);
    return Array.isArray(rows) ? rows.map(adaptarDesdeBackend) : [];
  },

  obtenerPorId: async (id) => {
    const res = await api(`/ganado/${id}`, { method: "GET" });
    const row = extraerData(res);
    return row ? adaptarDesdeBackend(row) : null;
  },

  crear: async (data) => {
    const body = crearFormDataGanado(data);

    const res = await api("/ganado", {
      method: "POST",
      body,
    });

    const row = extraerData(res);
    return row ? adaptarDesdeBackend(row) : null;
  },

  actualizar: async (data) => {
    const body = crearFormDataGanado(data, { incluirVacios: true });

    const res = await api(`/ganado/${data.id}`, {
      method: "PUT",
      body,
    });

    const row = extraerData(res);
    return row ? adaptarDesdeBackend(row) : null;
  },

  eliminar: async (id) => {
    const res = await api(`/ganado/${id}`, {
      method: "DELETE",
    });

    return {
      ok: res?.ok ?? true,
      id,
    };
  },

  exportar: async (formato, rows = []) => {
    const fmt = String(formato || "").toLowerCase();
    const fecha = fechaArchivo();

    if (!rows.length) {
      throw { mensaje: "No hay registros para exportar." };
    }

    if (fmt === "csv") {
      exportarCSV(prepararDataExportacion(rows), fecha);
    } else if (fmt === "excel" || fmt === "xlsx") {
      exportarExcel(rows, fecha);
    } else if (fmt === "pdf") {
      await exportarPDF(rows, fecha);
    } else if (fmt === "json") {
      exportarJSON(prepararDataExportacion(rows), fecha);
    } else {
      throw { mensaje: `Formato no soportado: ${formato}` };
    }

    return {
      ok: true,
      formato: fmt,
      total: rows.length,
    };
  },
};