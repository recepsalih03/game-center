import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import {
  login as apiLogin,
  getSession as apiGetSession,
  logout as apiLogout,
  Session,
} from "../services/authService";
import { setAuthToken } from "../api/axios";

interface User {
  username: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
  isLoading: true,
  error: null,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const currentSession = apiGetSession();
    if (currentSession && currentSession.accessToken) {
      setUser(currentSession.user);
      setToken(currentSession.accessToken);
      setAuthToken(currentSession.accessToken);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const sess: Session = await apiLogin(username, password);
      setUser(sess.user);
      setToken(sess.accessToken);
      setAuthToken(sess.accessToken);
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || "Giriş başarısız");
      setIsLoading(false);
      throw err;
    }
  };

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
    setToken(null);
    setAuthToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};