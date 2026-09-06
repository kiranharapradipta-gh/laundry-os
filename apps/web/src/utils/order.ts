import type { OrderStatus } from "../types/order";

export const ORDER_STATUS_LABEL: Record<
  OrderStatus,
  string
> = {
  RECEIVED: "Diterima",
  WASHING: "Dicuci",
  DRYING: "Dikeringkan",
  IRONING: "Disetrika",
  READY: "Siap Diambil",
  PICKED_UP: "Selesai",
  CANCELLED: "Dibatalkan",
};

export const ORDER_STATUS_CLASS: Record<
  OrderStatus,
  string
> = {
  RECEIVED: "status-received",
  WASHING: "status-washing",
  DRYING: "status-drying",
  IRONING: "status-ironing",
  READY: "status-ready",
  PICKED_UP: "status-picked",
  CANCELLED: "status-cancelled",
};

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "RECEIVED",
  "WASHING",
  "DRYING",
  "IRONING",
  "READY",
  "PICKED_UP",
];

export function getNextStatus(
  status: OrderStatus,
): OrderStatus | null {
  const index =
    ORDER_STATUS_FLOW.indexOf(status);

  if (
    index === -1 ||
    index === ORDER_STATUS_FLOW.length - 1
  ) {
    return null;
  }

  return ORDER_STATUS_FLOW[index + 1];
}