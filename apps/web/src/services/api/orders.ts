import { apiClient } from "./client";
import type { ApiResponse, PaginationMeta } from "../../types/api";
import type {
  CreateOrderInput,
  GetOrdersParams,
  GetOrdersResult,
  Order,
  OrderStatus,
} from "../../types/order";

function buildQuery(params: GetOrdersParams) {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set("page", String(params.page));
  }

  if (params.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }

  if (params.search?.trim()) {
    searchParams.set("search", params.search.trim());
  }

  if (params.status && params.status !== "ALL") {
    searchParams.set("status", params.status);
  }

  if (params.customerId) {
    searchParams.set("customerId", params.customerId);
  }

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}

export async function getOrders(
  params: GetOrdersParams = {},
): Promise<GetOrdersResult> {
  const query = buildQuery(params);

  const response = await apiClient<
    ApiResponse<Order[]> & {
      meta: PaginationMeta;
    }
  >(`/orders${query}`);

  if (!response.success) {
    throw new Error(response.message);
  }

  return {
    data: response.data,
    meta: response.meta,
  };
}

export async function getOrder(
  id: string,
): Promise<Order> {
  const response = await apiClient<ApiResponse<Order>>(
    `/orders/${id}`,
  );

  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  note?: string,
): Promise<Order> {
  const response = await apiClient<ApiResponse<Order>>(
    `/orders/${id}/status`,
    {
      method: "PUT",
      body: JSON.stringify({
        status,
        ...(note?.trim() ? { note: note.trim() } : {}),
      }),
    },
  );

  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
}

export async function createOrder(
  input: CreateOrderInput,
): Promise<Order> {
  const response = await apiClient<ApiResponse<Order>>(
    "/orders",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );

  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
}