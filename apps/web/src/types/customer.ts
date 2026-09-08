export interface Customer {
  id: string;
  phone: string;
  name: string;
  nickname?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateCustomerInput {
  phone?: string;
  name?: string;
  nickname?: string;
}