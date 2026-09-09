import { apiClient } from "./client";

import type { ApiResponse } from "../../types/api";

import type {
  ChangePasswordInput,
  OperationalSettings,
  SettingsData,
  UpdateBusinessInput,
  UpdateOperationalSettingsInput,
  UpdateProfileInput,
} from "../../types/settings";

export async function getSettings(): Promise<SettingsData> {
  const response = await apiClient<ApiResponse<SettingsData>>(
    "/settings",
  );

  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
}

export async function updateProfile(
  input: UpdateProfileInput,
): Promise<SettingsData> {
  const response = await apiClient<ApiResponse<SettingsData>>(
    "/settings/profile",
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );

  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
}

export async function updateBusiness(
  input: UpdateBusinessInput,
): Promise<SettingsData["business"]> {
  const response = await apiClient<
    ApiResponse<SettingsData["business"]>
  >("/settings/business", {
    method: "PATCH",
    body: JSON.stringify(input),
  });

  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
}

export async function changePassword(
  input: ChangePasswordInput,
): Promise<void> {
  const response = await apiClient<ApiResponse<null>>(
    "/settings/password",
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );

  if (!response.success) {
    throw new Error(response.message);
  }
}

export async function updateOperationalSettings(
  input: UpdateOperationalSettingsInput,
): Promise<OperationalSettings> {
  const response = await apiClient<ApiResponse<OperationalSettings>>(
    "/settings/operational",
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );

  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
}