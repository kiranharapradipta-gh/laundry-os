import { api } from "./client";
import type {
  CreateStorageInput,
  StorageLocation,
  UpdateStorageInput,
} from "../types/storage";

export function getStorageLocations(includeInactive = false) {
  const query = includeInactive
    ? "?includeInactive=true"
    : "";

  return api.get<StorageLocation[]>(`/storage${query}`);
}

export function getStorageLocation(id: string) {
  return api.get<StorageLocation>(`/storage/${id}`);
}

export function createStorage(input: CreateStorageInput) {
  return api.post<StorageLocation>("/storage", input);
}

export function updateStorage(
  id: string,
  input: UpdateStorageInput,
) {
  return api.put<StorageLocation>(
    `/storage/${id}`,
    input,
  );
}

// Alias supaya kompatibel dengan kode sebelumnya
export const getStorage = getStorageLocations;