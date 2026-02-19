import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config";

const ADMIN_TOKEN_KEY = "sos_admin_token";
const ADMIN_USER_KEY = "sos_admin_user";

export interface AdminUser {
  username: string;
  role: 'admin' | 'moderator' | 'editor' | 'member';
  displayName?: string;
  avatarUrl?: string | null;
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
        
        const userData = {
          username: data.username,
          role: data.role,
          displayName: data.displayName ?? data.username,
          avatarUrl: typeof data.avatarUrl !== 'undefined' ? data.avatarUrl : null,
        };
        localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(userData));
        setUser(userData as AdminUser);
        
        setIsAuthenticated(true);
        return true;
      } else {
        const data = await response.json();
        if (data.error) {
          toast.error(data.error);
        }
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Error connecting to server');
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

  const updateProfile = useCallback(
    async (updates: { newUsername?: string; displayName?: string; avatarUrl?: string | null }): Promise<boolean> => {
      if (!user) {
        toast.error("You must be logged in to update your profile");
        return false;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/update-profile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: user.username,
            newUsername: updates.newUsername,
            displayName: updates.displayName,
            avatarUrl: typeof updates.avatarUrl === 'undefined' ? user.avatarUrl ?? null : updates.avatarUrl,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const updatedUser: AdminUser = {
            username: data.username,
            role: data.role,
            displayName: data.displayName ?? data.username,
            avatarUrl: typeof data.avatarUrl !== 'undefined' ? data.avatarUrl : null,
          };
          setUser(updatedUser);
          localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(updatedUser));
          toast.success("Profile updated");
          return true;
        } else {
          const data = await response.json();
          toast.error(data.error || "Failed to update profile");
          return false;
        }
      } catch (error) {
        console.error('Update profile failed:', error);
        toast.error("An error occurred while updating profile");
        return false;
      }
    },
    [user]
  );

  const register = useCallback(
    async (email: string, password: string, username?: string): Promise<boolean> => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, username }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem(ADMIN_TOKEN_KEY, data.token);

          const userData = {
            username: data.username,
            role: data.role,
            displayName: data.displayName ?? data.username,
            avatarUrl: typeof data.avatarUrl !== 'undefined' ? data.avatarUrl : null,
          };
          localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(userData));
          setUser(userData as AdminUser);
          setIsAuthenticated(true);
          toast.success(
            data.role === 'admin'
              ? 'Admin account created and logged in'
              : 'Account created and logged in'
          );
          return true;
        } else {
          const data = await response.json();
          toast.error(data.error || 'Registration failed');
          return false;
        }
      } catch (error) {
        console.error('Registration failed:', error);
        toast.error('Error connecting to server');
        return false;
      }
    },
    []
  );

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
    register,
    updateProfile,
  };
}
