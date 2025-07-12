import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface AdminProtectedRouteProps {
    children: React.ReactNode;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({
    children,
}) => {
    const { isAuthenticated } = useAuth();
    const userType = localStorage.getItem("userType");
    const isAdmin = userType === "admin";

    if (!isAuthenticated) {
        return <Navigate to="/admin" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
