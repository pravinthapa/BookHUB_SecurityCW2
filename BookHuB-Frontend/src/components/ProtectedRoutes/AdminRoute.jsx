import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

export default function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }
  return <div className="min-h-screen">{children}</div>;
} 