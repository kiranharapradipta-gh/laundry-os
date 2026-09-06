import { api } from "./client";
import type {
  CreateOrderInput,
  Order,
  UpdateOrderStatusInput,
} from "../types/order";

export function getOrders() {
  return api.get<Order[]>("/orders");
}

export function getOrder(id: string) {
  return api.get<Order>(`/orders/${id}`);
}

export function createOrder(input: CreateOrderInput) {
  return api.post<Order>("/orders", input);
}

export function updateOrderStatus(
  id: string,
  input: UpdateOrderStatusInput,
) {
  return api.put<Order>(
    `/orders/${id}/status`,
    input,
  );
}