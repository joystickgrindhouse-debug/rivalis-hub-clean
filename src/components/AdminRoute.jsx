
import React from "react";
import { Navigate } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";

export default function AdminRoute({ children }) {

  const { isAdmin, loading } = useAdmin();

  if (loading) {
    return <div style={{ padding: "40px", color: "#fff" }}>Loading admin...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;

}

