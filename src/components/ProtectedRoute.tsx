import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, isLoading, isAdmin, refreshUserData } = useAuth();
  const location = useLocation();
  const [adminChecked, setAdminChecked] = useState(false);

  // If an admin-only route is hit and we *might* have stale role state,
  // refresh once before redirecting away.
  useEffect(() => {
    if (!requireAdmin) return;
    if (!user) return;
    if (isLoading) return;
    if (isAdmin) return;
    if (adminChecked) return;

    setAdminChecked(true);
    refreshUserData();
  }, [requireAdmin, user, isLoading, isAdmin, adminChecked, refreshUserData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    // If we already tried refreshing role once, then redirect.
    if (adminChecked) {
      return <Navigate to="/student-dashboard" replace />;
    }

    // Briefly show loader while role refresh happens.
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};
