import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const PrivateRoute = () => {
  const context = useAuth();

  if (!context.token) return <Navigate to="/" />;

  return <Outlet />;
};

export default PrivateRoute;
