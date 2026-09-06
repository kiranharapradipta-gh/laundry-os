const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("laundry_token");

  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  let body: ApiResponse<T> | null = null;

  try {
    body = await response.json();
  } catch {
    // Response tidak memiliki JSON body.
  }

  if (!response.ok) {
    throw new ApiError(
      body?.message || `Request gagal (${response.status})`,
      response.status,
    );
  }

  if (!body?.success) {
    throw new ApiError(
      body?.message || "Request gagal",
      response.status,
    );
  }

  return body.data;
}

export const api = {
  get: <T>(path: string) =>
    request<T>(path),

  post: <T>(path: string, data?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: data instanceof FormData
        ? data
        : data !== undefined
          ? JSON.stringify(data)
          : undefined,
    }),

  put: <T>(path: string, data?: unknown) =>
    request<T>(path, {
      method: "PUT",
      body: data instanceof FormData
        ? data
        : data !== undefined
          ? JSON.stringify(data)
          : undefined,
    }),

  delete: <T>(path: string) =>
    request<T>(path, {
      method: "DELETE",
    }),
};