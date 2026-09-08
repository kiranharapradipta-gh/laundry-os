import type { Service } from "../types/service";

export function formatServicePrice(
  service: Service,
): string {
  const price = Number(service.price);

  if (!Number.isFinite(price)) {
    return "Rp0";
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function getServiceUnitLabel(
  unit: string | null | undefined,
): string {
  if (!unit) return "-";

  const labels: Record<string, string> = {
    kg: "Kg",
    pcs: "Pcs",
    item: "Item",
    meter: "Meter",
    liter: "Liter",
  };

  return labels[unit.toLowerCase()] ?? unit;
}