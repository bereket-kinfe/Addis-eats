export function escapeCsvCell(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return "";

  const headers = Object.keys(rows[0]);
  const body = rows.map((row) =>
    headers.map((header) => escapeCsvCell(row[header])).join(","),
  );

  return [headers.join(","), ...body].join("\n");
}

export function downloadCsv(text, filename) {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
