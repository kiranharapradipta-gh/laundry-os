export interface StorageCustomer {
  id: string;
  name: string;
  nickname?: string | null;
  phone: string;
}

export interface StorageOrder {
  id: string;
  orderNumber: string;
  status: string;
  customer?: StorageCustomer | null;
}

export interface StorageAssignment {
  id: string;
  assignedAt: string;
  order: StorageOrder;
}

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

  assignments?: StorageAssignment[];
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

// export interface StorageOccupancy {
//   orderId: string;
//   orderNumber: string;
//   customerName: string;
//   assignedAt: string;
// }

// export interface StorageLocationWithOccupancy
//   extends StorageLocation {
//   occupancy?: StorageOccupancy | null;
// }

