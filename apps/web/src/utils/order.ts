import type { OrderStatus } from "../types/order";

export const ORDER_STATUSES: Array<{
  value: OrderStatus;
  label: string;
}> = [
  {
    value: "RECEIVED",
    label: "Diterima",
  },
  {
    value: "WASHING",
    label: "Dicuci",
  },
  {
    value: "DRYING",
    label: "Dikeringkan",
  },
  {
    value: "IRONING",
    label: "Disetrika",
  },
  {
    value: "READY",
    label: "Siap Diambil",
  },
  {
    value: "PICKED_UP",
    label: "Sudah Diambil",
  },
  {
    value: "CANCELLED",
    label: "Dibatalkan",
  },
];

export function getOrderStatusLabel(
  status: OrderStatus,
): string {
  return (
    ORDER_STATUSES.find(
      (item) => item.value === status,
    )?.label ?? status
  );
}

export function getOrderStatusVariant(
  status: OrderStatus,
): "default" | "success" | "warning" | "danger" {
  switch (status) {
    case "RECEIVED":
      return "default";

    case "WASHING":
    case "DRYING":
    case "IRONING":
      return "warning";

    case "READY":
      return "success";

    case "PICKED_UP":
      return "success";

    case "CANCELLED":
      return "danger";

    default:
      return "default";
  }
}

export function getNextOrderStatuses(
  status: OrderStatus,
): OrderStatus[] {
  switch (status) {
    case "RECEIVED":
      return ["WASHING", "CANCELLED"];

    case "WASHING":
      return ["DRYING", "CANCELLED"];

    case "DRYING":
      return ["IRONING", "CANCELLED"];

    case "IRONING":
      return ["READY", "CANCELLED"];

    case "READY":
      return ["PICKED_UP", "CANCELLED"];

    case "PICKED_UP":
    case "CANCELLED":
      return [];

    default:
      return [];
  }
}