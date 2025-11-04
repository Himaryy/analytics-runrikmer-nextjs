export function formatRupiah(value: number) {
  // Kenapa: format ID konsisten tanpa lib eksternal.
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDateID(date: string | Date | null | undefined) {
  if (!date) return "-";

  const dt = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short", // kalau mau full -> "long"
    year: "numeric",
  }).format(dt);
}
