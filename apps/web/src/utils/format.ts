export function formatRupiah(
  value: number | null | undefined,
) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

export function formatNumber(
  value: number | null | undefined,
) {
  return new Intl.NumberFormat("id-ID").format(
    value ?? 0,
  );
}

export function formatDate(
  value: string | null | undefined,
) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(
  value: string | null | undefined,
) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}