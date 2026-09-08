import { apiClient } from "./client";
import type { ApiResponse } from "../../types/api";
import type {
  AuthUser,
  LoginInput,
  LoginResult,
} from "../../types/auth";

export async function login(
  input: LoginInput,
): Promise<LoginResult> {
  const response = await apiClient<
    ApiResponse<LoginResult>
  >("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });

  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
}

export async function getMe(): Promise<AuthUser> {
  const response = await apiClient<ApiResponse<AuthUser>>(
    "/auth/me",
  );

  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
}