const API_URL = import.meta.env.VITE_API_URL || "";

function getToken() {
  return localStorage.getItem("token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers = new Headers(
    options.headers
  );

  headers.set(
    "Content-Type",
    "application/json"
  );

  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`
    );
  }

  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...options,
      headers,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ||
        "Terjadi kesalahan pada server"
    );
  }

  return data;
}

export interface ScannedOrder {
  orderNumber: string;
  status: string;
  paymentStatus: string;

  customer: {
    name: string;
    nickname: string | null;
    phone: string;
  };

  items: Array<{
    description: string;
    quantity: string | number;
    unitPrice: string | number;
    subtotal: string | number;
    notes: string | null;

    service: {
      name: string;
      unit: string;
    } | null;
  }>;

  storage: {
    zone: string | null;
    rack: string | null;
    shelf: string | null;
    slot: string | null;
  } | null;

  subtotal: string | number;
  discount: string | number;
  total: string | number;
  paidAmount: string | number;

  readyAt: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export async function scanOrderQr(
  token: string
) {
  const response =
    await request<ApiResponse<ScannedOrder>>(
      `/api/qr/order/${encodeURIComponent(token)}/scan`
    );

  return response.data;
}

export async function pickupOrderByQr(
  token: string
) {
  const response =
    await request<
      ApiResponse<{
        id: string;
        orderNumber: string;
        status: string;
      }>
    >(
      `/api/qr/order/${encodeURIComponent(token)}/pickup`,
      {
        method: "POST",
      }
    );

  return response;
}

// ===============================================================================
// LOGIN
// ===============================================================================

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  role: string;
  businessId: string;
  businessName: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export async function login(
  phone: string,
  password: string
) {
  const response =
    await request<ApiResponse<LoginResponse>>(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify({
          phone,
          password,
        }),
      }
    );

  localStorage.setItem(
    "token",
    response.data.token
  );

  localStorage.setItem(
    "user",
    JSON.stringify(response.data.user)
  );

  return response.data;
}

// ================================================================================
// ORDERS
// ================================================================================

export interface OrderItem {
  id: string;
  description: string;
  quantity: number | string;
  unitPrice: number | string;
  subtotal: number | string;
  notes: string | null;

  service: {
    id: string;
    name: string;
    unit: string;
  } | null;

  photos: Array<{
    id: string;
    url?: string;
    path?: string;
    createdAt: string;
  }>;
}

export interface Order {
  id: string;
  orderNumber: string;

  status:
    | "RECEIVED"
    | "WASHING"
    | "DRYING"
    | "IRONING"
    | "READY"
    | "PICKED_UP"
    | "CANCELLED";

  paymentStatus: string;

  subtotal: number | string;
  discount: number | string;
  total: number | string;
  paidAmount: number | string;

  notes: string | null;

  createdAt: string;
  readyAt: string | null;
  pickedUpAt: string | null;
  cancelledAt: string | null;

  customer: {
    id: string;
    name: string;
    nickname: string | null;
    phone: string;
  };

  items: OrderItem[];

  qrCodes: Array<{
    id: string;
    token: string;
    type: string;
    isActive: boolean;
  }>;

  statusHistory: Array<{
    id: string;
    fromStatus: string | null;
    toStatus: string;
    note: string | null;
    createdAt: string;
  }>;

  storageAssignments: Array<{
    id: string;
    releasedAt: string | null;

    storageLocation: {
      id: string;
      zone: string | null;
      rack: string | null;
      shelf: string | null;
      slot: string | null;
    };
  }>;
}

export async function getOrders() {
  const response =
    await request<ApiResponse<Order[]>>(
      "/api/orders"
    );

  return response.data;
}

export async function getOrderById(
  orderId: string
) {
  const response =
    await request<ApiResponse<Order>>(
      `/api/orders/${encodeURIComponent(orderId)}`
    );

  return response.data;
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"],
  note?: string
) {
  const response =
    await request<ApiResponse<Order>>(
      `/api/orders/${encodeURIComponent(orderId)}/status`,
      {
        method: "PUT",
        body: JSON.stringify({
          status,
          note,
        }),
      }
    );

  return response.data;
}

// =====================================================================================
// CUSTOMER
// =====================================================================================

export interface Customer {
  id: string;
  phone: string;
  name: string;
  nickname: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function getCustomers(
  search?: string
) {
  const query = search
    ? `?search=${encodeURIComponent(search)}`
    : "";

  const response =
    await request<ApiResponse<Customer[]>>(
      `/api/customers${query}`
    );

  return response.data;
}

export async function getCustomerById(
  customerId: string
) {
  const response =
    await request<ApiResponse<Customer>>(
      `/api/customers/${encodeURIComponent(
        customerId
      )}`
    );

  return response.data;
}

export async function createCustomer(
  input: {
    phone: string;
    name: string;
    nickname?: string;
  }
) {
  const response =
    await request<ApiResponse<Customer>>(
      "/api/customers",
      {
        method: "POST",
        body: JSON.stringify(input),
      }
    );

  return response.data;
}

export async function updateCustomer(
  customerId: string,
  input: {
    phone?: string;
    name?: string;
    nickname?: string;
  }
) {
  const response =
    await request<ApiResponse<Customer>>(
      `/api/customers/${encodeURIComponent(
        customerId
      )}`,
      {
        method: "PUT",
        body: JSON.stringify(input),
      }
    );

  return response.data;
}

// =========================
// SERVICE
// =========================

export interface Service {
  id: string;
  name: string;
  description: string | null;
  price: string | number;
  unit: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getServices() {
  const response =
    await request<ApiResponse<Service[]>>(
      "/api/services"
    );

  return response.data;
}

// =========================
// STORAGE
// =========================

export interface StorageLocation {
  id: string;
  zone: string | null;
  rack: string | null;
  shelf: string | null;
  slot: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getStorageLocations() {
  const response =
    await request<
      ApiResponse<StorageLocation[]>
    >("/api/storage");

  return response.data;
}

// =========================
// CREATE ORDER
// =========================

export interface CreateOrderItemInput {
  serviceId: string;
  description: string;
  quantity: number;
  notes?: string;
}

export interface CreateOrderInput {
  customerId: string;
  storageLocationId?: string;
  discount?: number;
  notes?: string;
  items: CreateOrderItemInput[];
}

export async function createOrder(
  input: CreateOrderInput
) {
  const response =
    await request<ApiResponse<any>>(
      "/api/orders",
      {
        method: "POST",
        body: JSON.stringify(input),
      }
    );

  return response.data;
}