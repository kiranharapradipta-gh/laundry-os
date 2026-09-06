export interface StorageLocation {
  id: string;
  businessId: string;
  zone?: string | null;
  rack?: string | null;
  shelf?: string | null;
  slot?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStorageInput {
  zone?: string;
  rack?: string;
  shelf?: string;
  slot?: string;
}

export interface UpdateStorageInput {
  zone?: string;
  rack?: string;
  shelf?: string;
  slot?: string;
  isActive?: boolean;
}

export interface LaundryService {
  id: string;
  businessId: string;
  name: string;
  description?: string | null;
  price: number;
  unit?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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