import { apiClient } from "./client";
import type { ApiResponse } from "../../types/api";
import type { Service } from "../../types/service";

export async function getServices(): Promise<Service[]> {
  const response = await apiClient<ApiResponse<Service[]>>(
    "/services",
  );

  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
}