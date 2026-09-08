import { apiClient } from "./client";
import type { ApiResponse } from "../../types/api";
import type { Customer } from "../../types/customer";

export async function getCustomers(search?: string): Promise<Customer[]> {
  const params = new URLSearchParams();

  if (search?.trim()) {
    params.set("search", search.trim());
  }

  const query = params.toString();

  const response = await apiClient<ApiResponse<Customer[]>>(
    `/customers${query ? `?${query}` : ""}`,
  );

  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
}

export interface CreateCustomerInput {
  phone: string;
  name: string;
  nickname?: string;
}

export async function createCustomer(
  input: CreateCustomerInput,
): Promise<Customer> {
  const response = await apiClient<ApiResponse<Customer>>("/customers", {
    method: "POST",
    body: JSON.stringify(input),
  });

  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
}

export async function getCustomer(id: string): Promise<Customer> {
  const response = await apiClient<ApiResponse<Customer>>(
    `/customers/${id}`,
  );

  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
}

export interface UpdateCustomerInput {
  phone?: string;
  name?: string;
  nickname?: string;
}

export async function updateCustomer(
  id: string,
  input: UpdateCustomerInput,
): Promise<Customer> {
  const response = await apiClient<ApiResponse<Customer>>(
    `/customers/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    },
  );

  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
}