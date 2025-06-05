import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  login as apiLogin,
  getSession as apiGetSession,
  logout as apiLogout,
} from "../services/authService";

interface User {
  email: string;
}

interface Session {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  isLoading: false,
  error: null,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const initSess = apiGetSession();
  const [user, setUser] = useState<User | null>(
    initSess ? initSess.user : null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const sess: Session = await apiLogin(email, password);
      setUser(sess.user);
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || "Giriş başarısız");
      setIsLoading(false);
      throw err;
    }
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};