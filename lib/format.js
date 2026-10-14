export const etb = new Intl.NumberFormat("en-ET", {
  style: "currency",
  currency: "ETB",
  maximumFractionDigits: 0,
});

export const when = new Intl.DateTimeFormat("en-ET", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Africa/Addis_Ababa",
});

export const relative = new Intl.RelativeTimeFormat("en-ET", {
  numeric: "auto",
  style: "short",
});

export function formatRelativeTime(dateValue, now = new Date()) {
  const target = new Date(dateValue).getTime();
  const deltaMs = target - now.getTime();
  const minutes = Math.round(deltaMs / 60000);

  if (Math.abs(minutes) < 60) {
    return relative.format(minutes, "minute");
  }

  const hours = Math.round(deltaMs / 3_600_000);
  if (Math.abs(hours) < 24) {
    return relative.format(hours, "hour");
  }

  const days = Math.round(deltaMs / 86_400_000);
  return relative.format(days, "day");
}