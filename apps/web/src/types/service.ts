export interface Service {
  id: string;
  name: string;
  description?: string | null;
  price: number | string;
  unit?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

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