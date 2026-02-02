import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config";

const ADMIN_TOKEN_KEY = "sos_admin_token";
const ADMIN_USER_KEY = "sos_admin_user";

export interface AdminUser {
  username: string;
  role: 'admin' | 'moderator' | 'editor'; // Add other roles as needed
}

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isPasswordSet, setIsPasswordSet] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    const savedUser = localStorage.getItem(ADMIN_USER_KEY);
    
    if (token) {
      setIsAuthenticated(true);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("Failed to parse user data", e);
        }
      }
    }
    setIsLoading(false);
  }, []);

  // Deprecated, kept for compatibility
  const setPassword = useCallback((password: string): boolean => {
    return true;
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
        
        const userData = { username: data.username, role: data.role };
        localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(userData));
        setUser(userData as AdminUser);
        
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<boolean> => {
    // If user is not present but authenticated, try to use stored username or prompt relogin
    if (!user) {
      toast.error("User session invalid. Please log out and log in again.");
      return false;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: user.username,
          currentPassword, 
          newPassword 
        }),
      });

      if (response.ok) {
        toast.success("Password changed successfully");
        return true;
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to change password");
        return false;
      }
    } catch (error) {
      console.error('Change password failed:', error);
      toast.error("An error occurred while changing password");
      return false;
    }
  }, [user]);

  const resetPassword = useCallback(() => {
    logout();
  }, [logout]);

  return {
    isAuthenticated,
    user,
    isPasswordSet,
    isLoading,
    setPassword,
    login,
    logout,
    changePassword,
    resetPassword,
  };
}
