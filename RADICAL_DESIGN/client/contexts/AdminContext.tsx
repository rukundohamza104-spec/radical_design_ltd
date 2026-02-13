import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AdminContextType {
  isAuthenticated: boolean;
  sessionId: string | null;
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user has valid session on mount
  useEffect(() => {
    const savedSessionId = localStorage.getItem("adminSessionId");
    if (savedSessionId) {
      setSessionId(savedSessionId);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      setSessionId(data.sessionId);
      localStorage.setItem("adminSessionId", data.sessionId);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      if (sessionId) {
        await fetch("/api/admin/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setSessionId(null);
      localStorage.removeItem("adminSessionId");
      setIsAuthenticated(false);
    }
  };

  return (
    <AdminContext.Provider value={{ isAuthenticated, sessionId, login, logout, loading }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
}
