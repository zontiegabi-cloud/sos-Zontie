import { useState, useEffect, useCallback } from "react";

const ADMIN_PASSWORD_KEY = "sos_admin_password";
const ADMIN_SESSION_KEY = "sos_admin_session";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Simple hash function for basic obfuscation (not cryptographically secure)
const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36) + password.length.toString(36);
};

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPasswordSet, setIsPasswordSet] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if password is set
    const storedHash = localStorage.getItem(ADMIN_PASSWORD_KEY);
    setIsPasswordSet(!!storedHash);

    // Check if session is valid
    const session = localStorage.getItem(ADMIN_SESSION_KEY);
    if (session) {
      const sessionData = JSON.parse(session);
      if (sessionData.expires > Date.now()) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem(ADMIN_SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const setPassword = useCallback((password: string): boolean => {
    if (password.length < 4) {
      return false;
    }
    const hash = hashPassword(password);
    localStorage.setItem(ADMIN_PASSWORD_KEY, hash);
    setIsPasswordSet(true);
    
    // Auto-login after setting password
    const session = {
      expires: Date.now() + SESSION_DURATION,
    };
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    setIsAuthenticated(true);
    
    return true;
  }, []);

  const login = useCallback((password: string): boolean => {
    const storedHash = localStorage.getItem(ADMIN_PASSWORD_KEY);
    const inputHash = hashPassword(password);
    
    if (storedHash === inputHash) {
      const session = {
        expires: Date.now() + SESSION_DURATION,
      };
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthenticated(false);
  }, []);

  const changePassword = useCallback((currentPassword: string, newPassword: string): boolean => {
    const storedHash = localStorage.getItem(ADMIN_PASSWORD_KEY);
    const currentHash = hashPassword(currentPassword);
    
    if (storedHash !== currentHash) {
      return false;
    }
    
    if (newPassword.length < 4) {
      return false;
    }
    
    const newHash = hashPassword(newPassword);
    localStorage.setItem(ADMIN_PASSWORD_KEY, newHash);
    return true;
  }, []);

  const resetPassword = useCallback(() => {
    localStorage.removeItem(ADMIN_PASSWORD_KEY);
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setIsPasswordSet(false);
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    isPasswordSet,
    isLoading,
    setPassword,
    login,
    logout,
    changePassword,
    resetPassword,
  };
}
