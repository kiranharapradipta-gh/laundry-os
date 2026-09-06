import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { getMe, login as loginApi } from "../api/auth.api";
import type { AuthUser } from "../types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("laundry_token"),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const savedToken = localStorage.getItem("laundry_token");

      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const me = await getMe();
        setUser(me);
      } catch {
        localStorage.removeItem("laundry_token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function login(phone: string, password: string) {
    const result = await loginApi({
      phone,
      password,
    });

    localStorage.setItem("laundry_token", result.token);

    setToken(result.token);
    setUser(result.user);
  }

  function logout() {
    localStorage.removeItem("laundry_token");

    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth harus digunakan di dalam AuthProvider",
    );
  }

  return context;
}