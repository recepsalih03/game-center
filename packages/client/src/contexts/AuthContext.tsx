import React, {
  createContext,
  useState,
  ReactNode,
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
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const initSession = apiGetSession();
  const [user, setUser] = useState<User | null>(
    initSession ? initSession.user : null
  );

  const login = async (email: string, password: string) => {
    const sess: Session = await apiLogin(email, password);
    setUser(sess.user);
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};