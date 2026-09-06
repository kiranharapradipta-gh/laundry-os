import { api } from "./client";
import type {
  Customer,
  CreateCustomerInput,
  UpdateCustomerInput,
} from "../types/customer";

export function getCustomers(search?: string) {
  const query = search?.trim()
    ? `?search=${encodeURIComponent(search.trim())}`
    : "";

  return api.get<Customer[]>(`/customers${query}`);
}

export function getCustomer(id: string) {
  return api.get<Customer>(`/customers/${id}`);
}

export function createCustomer(input: CreateCustomerInput) {
  return api.post<Customer>("/customers", input);
}

export function updateCustomer(
  id: string,
  input: UpdateCustomerInput,
) {
  return api.put<Customer>(`/customers/${id}`, input);
}