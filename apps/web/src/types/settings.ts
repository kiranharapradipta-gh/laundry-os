export interface SettingsUser {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  role: "OWNER" | "EMPLOYEE";
  businessId: string;
}

export interface SettingsBusiness {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
  logoUrl: string | null;
}

export interface SettingsData {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  role: "OWNER" | "EMPLOYEE";
  businessId: string;
  business: SettingsBusiness;
}

export interface UpdateProfileInput {
  name?: string;
  phone?: string;
  email?: string | null;
}

export interface UpdateBusinessInput {
  name?: string;
  phone?: string | null;
  address?: string | null;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}