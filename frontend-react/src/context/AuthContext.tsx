import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { loginUser, registerUser } from "../api/authApi";

import { setAccessToken } from "../api/apiClient";

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = useCallback(() => {
    setAccessToken(null);
    setIsAuthenticated(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      const response = await loginUser({ email, password });

      setAccessToken(response.accessToken);
      setIsAuthenticated(true);
    },
    [],
  );

  const register = useCallback(
    async (email: string, password: string): Promise<void> => {
      await registerUser({ email, password });
    },
    [],
  );

  useEffect(() => {
    const handleSessionExpired = (): void => {
      logout();
    };

    window.addEventListener("auth:session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("auth:session-expired", handleSessionExpired);
    };
  }, [logout]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
