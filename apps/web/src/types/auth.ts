export type UserRole = "OWNER" | "EMPLOYEE";

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  businessId: string;
  businessName: string;
}

export interface LoginInput {
  phone: string;
  password: string;
}

export interface LoginResult {
  token: string;
  user: AuthUser;
}