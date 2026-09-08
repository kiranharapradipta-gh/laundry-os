export interface Service {
  id: string;
  name: string;
  description?: string | null;
  price: number | string;
  unit?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}