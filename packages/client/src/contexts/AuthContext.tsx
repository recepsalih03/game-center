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
} from "../services/authService";

interface User {
  username: string;
}

interface Session {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  isLoading: true,
  error: null,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const currentSession = apiGetSession();
      if (currentSession) {
        setUser(currentSession.user);
      }
    } catch (e) {
      console.error("Geçersiz oturum bilgisi:", e);
      apiLogout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const sess: Session = await apiLogin(username, password);
      setUser(sess.user);
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
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};