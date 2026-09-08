import { apiClient } from "./client";
import type { ApiResponse } from "../../types/api";
import type { Service } from "../../types/service";

export interface CreateServiceInput {
  name: string;
  description?: string;
  price: number;
  unit?: string;
}

export interface UpdateServiceInput {
  name?: string;
  description?: string;
  price?: number;
  unit?: string;
  isActive?: boolean;
}

export async function getServices(
  includeInactive = false,
): Promise<Service[]> {
  const query = includeInactive
    ? "?includeInactive=true"
    : "";

  const response = await apiClient<ApiResponse<Service[]>>(
    `/services${query}`,
  );

  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
}

export async function getService(
  id: string,
): Promise<Service> {
  const response = await apiClient<ApiResponse<Service>>(
    `/services/${id}`,
  );

  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
}

export async function createService(
  input: CreateServiceInput,
): Promise<Service> {
  const response = await apiClient<ApiResponse<Service>>(
    "/services",
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

export async function updateService(
  id: string,
  input: UpdateServiceInput,
): Promise<Service> {
  const response = await apiClient<ApiResponse<Service>>(
    `/services/${id}`,
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