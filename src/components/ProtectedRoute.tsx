
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { userService } from "@/services/userService";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const location = useLocation();
  const isLoggedIn = userService.isLoggedIn();
  const isAdmin = userService.isAdmin();
  
  // If admin access is required, check both logged in and admin status
  if (requireAdmin && (!isLoggedIn || !isAdmin)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // For regular protected routes, just check if logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
