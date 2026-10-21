export function toCsv(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escapeCell = (v) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.map(escapeCell).join(","), ...rows.map((row) => headers.map((key) => escapeCell(row[key])).join(","))].join("\n");
}

export function downloadCsv(csvContent, filename) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportOrdersToCSV(orders) {
  const rows = orders.map(({ id, customer, area, total, placedAt }) => ({
    "Order ID": id,
    Customer: customer,
    Area: area,
    "Total (ETB)": total,
    "Placed At": placedAt,
  }));
  downloadCsv(toCsv(rows), `addis-eats-orders-${new Date().toISOString().slice(0, 10)}.csv`);
}
