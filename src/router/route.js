import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";

const PrivateRoute = () => {
  const user = useAuth();
  debugger;
  if (user.length === 0) return <Navigate to="/login" />;
  return <Outlet />;
};

export default PrivateRoute;