import { Navigate } from "react-router-dom";
import { isAuthenticated, getCurrentUser } from "../services/auth.service";

/**
 * Component to protect routes based on authentication and role
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {Array<string>} props.allowedRoles - Array of roles allowed to access this route
 */
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const authenticated = isAuthenticated();
  const user = getCurrentUser();

  // Not authenticated - redirect to login
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect to home page (billing page) if user doesn't have permission
    return <Navigate to="/" replace />;
  }

  // Authorized - render children
  return children;
}
