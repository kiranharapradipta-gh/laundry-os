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

export interface ServiceOrder {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  customer: {
    id: string;
    name: string;
    nickname?: string | null;
    phone?: string | null;
  };
  quantity: number;
  weight?: number | null;
  unitPrice: number | string;
  subtotal: number | string;
  notes?: string | null;
  createdAt: string;
}

export interface ServiceDetail extends Service {
  orders: ServiceOrder[];
}