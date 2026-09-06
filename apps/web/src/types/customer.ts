export interface Customer {
  id: string;
  businessId: string;
  phone: string;
  name: string;
  nickname?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerInput {
  phone: string;
  name: string;
  nickname?: string;
}

export interface UpdateCustomerInput {
  phone?: string;
  name?: string;
  nickname?: string;
}