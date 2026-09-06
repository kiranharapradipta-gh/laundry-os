import { api } from "./client";
import type {
  CreateServiceInput,
  LaundryService,
  UpdateServiceInput,
} from "../types/service";

export function getServices(includeInactive = false) {
  const query = includeInactive
    ? "?includeInactive=true"
    : "";

  return api.get<LaundryService[]>(`/services${query}`);
}

export function getService(id: string) {
  return api.get<LaundryService>(`/services/${id}`);
}

export function createService(input: CreateServiceInput) {
  return api.post<LaundryService>("/services", input);
}

export function updateService(
  id: string,
  input: UpdateServiceInput,
) {
  return api.put<LaundryService>(
    `/services/${id}`,
    input,
  );
}