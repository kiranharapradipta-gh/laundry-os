import { api } from "./client";
import type { LoginResponse, AuthUser } from "../types/auth";

export interface LoginInput {
  phone: string;
  password: string;
}

export function login(input: LoginInput) {
  return api.post<LoginResponse>("/auth/login", input);
}

export function getMe() {
  return api.get<AuthUser>("/auth/me");
}