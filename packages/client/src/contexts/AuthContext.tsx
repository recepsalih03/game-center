import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  login as loginService,
  getSession,
  logout as logoutService,
} from "../services/authService";

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const sess = getSession();
    if (sess) {
      setUser(sess.user);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const sess = await loginService(email, password);
    setUser(sess.user);
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};