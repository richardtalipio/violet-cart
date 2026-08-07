import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import {Customer} from '../components/storefront/Customer';
import { ProtectedRoute } from './ProtectedRoute';
import { GuestRoute } from './GuestRoute';
import { Admin } from '../components/admin/Admin';
import {SellerDashboard} from "@/components/seller/SellerDashboard.tsx";
export const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Guest-Only Routes */}
            <Route element={<GuestRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute requiredRole="ROLE_ADMIN" />}>
                <Route path="/admin" element={<Admin />} />
            </Route>
            <Route element={<ProtectedRoute requiredRole="ROLE_SELLER" />}>
                <Route path="/seller" element={<SellerDashboard />} />
            </Route>
            <Route element={<ProtectedRoute requiredRole="ROLE_CUSTOMER" />}>
                <Route path="/customer" element={<Customer />} />
            </Route>

            {/* Default Catch-all */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};