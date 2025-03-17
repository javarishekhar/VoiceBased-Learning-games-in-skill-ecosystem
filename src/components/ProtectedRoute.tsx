
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "@/services/userService";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      toast.error("Please log in to access this page");
    }
  }, [currentUser]);

  if (!currentUser) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
