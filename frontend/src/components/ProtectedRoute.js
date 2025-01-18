import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;  // Show a loading state while checking authentication
  }

  if (!isAuthenticated) {
    // Redirect to the landing page if not authenticated
    return <Navigate to="/landingpage" />;
  }

  // If authenticated, render the children (the protected page)
  return children;
};

export default ProtectedRoute;