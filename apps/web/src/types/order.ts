import type { PaginationMeta } from "./api";
import type { Customer } from "./customer";

export type OrderStatus =
  | "RECEIVED"
  | "WASHING"
  | "DRYING"
  | "IRONING"
  | "READY"
  | "PICKED_UP"
  | "CANCELLED";

export interface OrderService {
  id: string;
  name: string;
  price?: number | null;
}

export interface OrderItem {
  id: string;
  description?: string | null;
  quantity?: number | null;
  weight?: number | null;
  condition?: string | null;
  notes?: string | null;
  service?: OrderService | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;

  customer?: Customer | null;

  items?: OrderItem[];

  subtotal?: number | null;
  discount?: number | null;
  total?: number | null;

  createdAt: string;
  updatedAt?: string | null;

  receivedAt?: string | null;
  readyAt?: string | null;
  pickedUpAt?: string | null;
  cancelledAt?: string | null;
}

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus | "ALL";
  customerId?: string;
}

export interface GetOrdersResult {
  data: Order[];
  meta: PaginationMeta;
}

export interface CreateOrderItemInput {
  serviceId: string;
  description: string;
  quantity: number;
  notes?: string;
}

export interface CreateOrderInput {
  customerId: string;
  discount?: number;
  items: CreateOrderItemInput[];
}