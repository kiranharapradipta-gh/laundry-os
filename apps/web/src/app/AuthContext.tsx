import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from "../services/api/client";

import {
  getMe,
  login as loginRequest,
} from "../services/api/auth";

import type {
  AuthUser,
  LoginInput,
} from "../types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<void>;
  logout: () => void;
}

const AuthContext =
  createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(
    getStoredToken(),
  );
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    clearStoredToken();
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(
    async (input: LoginInput) => {
      const result = await loginRequest(input);

      setStoredToken(result.token);

      setToken(result.token);
      setUser(result.user);
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const storedToken = getStoredToken();

      if (!storedToken) {
        if (!cancelled) {
          setIsLoading(false);
        }

        return;
      }

      try {
        const currentUser = await getMe();

        if (!cancelled) {
          setToken(storedToken);
          setUser(currentUser);
        }
      } catch {
        if (!cancelled) {
          clearStoredToken();
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isLoading,
      login,
      logout,
    }),
    [user, token, isLoading, login, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }

  return context;
}