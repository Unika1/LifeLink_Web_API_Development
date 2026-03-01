"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface UserData {
  _id: string;
  email: string;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      setLoading(true);

      // Check for token in cookies or localStorage
      const token =
        Cookies.get("lifelink_token") ||
        (typeof window !== "undefined"
          ? window.localStorage.getItem("lifelink_token")
          : null);

      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      // Try to get user data from cookies or localStorage
      const userDataStr =
        Cookies.get("lifelink_user") ||
        (typeof window !== "undefined"
          ? window.localStorage.getItem("lifelink_user")
          : null);

      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);

      // Clear cookies
      Cookies.remove("lifelink_token");
      Cookies.remove("lifelink_user");

      // Clear localStorage
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("lifelink_token");
        window.localStorage.removeItem("lifelink_user");
      }

      setIsAuthenticated(false);
      setUser(null);

      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        loading,
        setLoading,
        checkAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
