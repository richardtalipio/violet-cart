import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore'; // Or read from local storage / state

interface ProtectedRouteProps {
    requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
    const user = useAuthStore((state) => state.user);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole) {
        const userRole = user.role.replace('ROLE_', '');
        const expectedRole = requiredRole.replace('ROLE_', '');

        if (userRole !== expectedRole) {
            return <Navigate to="/login" replace />;
        }
    }

    return <Outlet />;
};