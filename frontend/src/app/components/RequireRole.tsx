import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { getStoredAuth } from "../lib/api";

type RequireRoleProps = {
  allowedRole: "student" | "technician" | "admin";
};

export const RequireRole: React.FC<RequireRoleProps> = ({ allowedRole }) => {
  const location = useLocation();
  const auth = getStoredAuth();

  if (!auth) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (auth.user.role !== allowedRole) {
    return <Navigate to={`/${auth.user.role}`} replace />;
  }

  return <Outlet />;
};
