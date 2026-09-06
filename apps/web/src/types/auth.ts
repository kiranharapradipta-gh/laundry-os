export type UserRole = "OWNER" | "EMPLOYEE";

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  businessId: string;
  businessName: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}