import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const GuestRoute: React.FC = () => {
    const user = useAuthStore((state) => state.user);

    // If logged in, send them to their dashboard
    if (user) {
        const role = user.role;
        if (role === 'ROLE_ADMIN') {
            return <Navigate to="/admin" replace />;
        }
        if (role === 'ROLE_SELLER') {
            return <Navigate to="/seller" replace />;
        }
        if (role === 'ROLE_CUSTOMER') {
            return <Navigate to="/customer" replace />;
        }
        return <Navigate to="/" replace />;
    }

    // No session? Allow access to guest pages (Login / Register)
    return <Outlet />;
};