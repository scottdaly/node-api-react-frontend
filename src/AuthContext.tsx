import React, { createContext, useState, useContext, useEffect } from "react";
import { User } from "./types";
import * as api from "./api";

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    name: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  authLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication. AuthLoading: ", authLoading);
        const userData = await api.getUserInfo();
        setUser(userData);
        setAuthLoading(false);
        console.log("Authentication checked. AuthLoading: ", authLoading);
      } catch (error) {
        console.error("Not authenticated", error);
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const { user } = await api.login(email, password);
    setUser(user);
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    name: string
  ) => {
    const { user } = await api.register(username, email, password, name);
    setUser(user);
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, authLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
