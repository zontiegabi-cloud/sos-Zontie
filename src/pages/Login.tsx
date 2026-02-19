import { Navigate } from "react-router-dom";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { useAdminAuth } from "@/hooks/use-admin-auth";

export default function Login() {
  const {
    isAuthenticated,
    isPasswordSet,
    setPassword,
    login,
    register,
  } = useAdminAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSetPassword = (password: string) => {
    setPassword(password);
  };

  const handleLogin = async (username: string, password: string) => {
    return await login(username, password);
  };

  const handleRegister = async (email: string, password: string, username?: string) => {
    return await register(email, password, username);
  };

  return (
    <AdminLogin
      isPasswordSet={isPasswordSet}
      onLogin={handleLogin}
      onSetPassword={handleSetPassword}
      onRegister={handleRegister}
    />
  );
}

