const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const TOKEN_KEY = "laundry_os_token";

interface RequestOptions extends RequestInit {
  token?: string;
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiClient<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    token,
    headers: customHeaders,
    ...requestOptions
  } = options;

  const headers = new Headers(customHeaders);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const authToken = token ?? getStoredToken();

  if (authToken) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...requestOptions,
    headers,
  });

  let body: unknown;

  try {
    body = await response.json();
  } catch {
    throw new Error(
      `Server returned ${response.status} without JSON response`,
    );
  }

  if (!response.ok) {
    if (
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof body.message === "string"
    ) {
      const error = new Error(body.message);

      if (response.status === 401) {
        clearStoredToken();
      }

      throw error;
    }

    if (response.status === 401) {
      clearStoredToken();
    }

    throw new Error(
      `Request failed with status ${response.status}`,
    );
  }

  return body as T;
}