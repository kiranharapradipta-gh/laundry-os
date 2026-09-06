import type { Customer } from "./customer";
import type { LaundryService } from "./service";
import type { StorageLocation } from "./storage";

export type OrderStatus =
  | "RECEIVED"
  | "WASHING"
  | "DRYING"
  | "IRONING"
  | "READY"
  | "PICKED_UP"
  | "CANCELLED";

export type PaymentStatus =
  | "UNPAID"
  | "PARTIAL"
  | "PAID";

export interface OrderItem {
  id: string;
  orderId: string;
  serviceId: string;
  description: string;
  quantity: number;
  weight?: number | null;
  condition?: string | null;
  notes?: string | null;
  unitPrice: number;
  subtotal: number;
  service?: LaundryService;
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  status: OrderStatus;
  note?: string | null;
  createdAt: string;
}

export interface OrderQRCode {
  id: string;
  token: string;
  createdAt: string;
  expiresAt?: string | null;
}

export interface StorageAssignment {
  id: string;
  orderId: string;
  storageLocationId: string;
  assignedAt: string;
  releasedAt?: string | null;
  storageLocation?: StorageLocation;
}

export interface Order {
  id: string;
  businessId: string;
  orderNumber: string;

  customerId: string;
  storageLocationId?: string | null;

  status: OrderStatus;

  paymentStatus: PaymentStatus;
  paidAmount: number;

  discount: number;
  subtotal: number;
  total: number;

  receivedAt?: string | null;
  readyAt?: string | null;
  pickedUpAt?: string | null;
  cancelledAt?: string | null;

  createdAt: string;
  updatedAt: string;

  customer?: Customer;
  items: OrderItem[];
  qrCodes?: OrderQRCode[];
  statusHistory?: OrderStatusHistory[];
  storageAssignments?: StorageAssignment[];
}

export interface CreateOrderItemInput {
  serviceId: string;
  description: string;
  quantity?: number;
  weight?: number | null;
  condition?: string;
  notes?: string;
}

export interface CreateOrderInput {
  customerId: string;
  storageLocationId?: string | null;
  discount?: number | null;
  items: CreateOrderItemInput[];
}

export interface UpdateOrderStatusInput {
  status: OrderStatus;
  note?: string;
}