
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/Login';
import Admin from "../pages/Admin.tsx";
import {ProtectedRoute} from "./ProtectedRoute";
import Customer from "../pages/Customer.tsx";
import Seller from "../pages/Seller.tsx";
import Register from "../pages/Register.tsx";

export function AppRoutes(): React.JSX.Element {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />

            <Route element={<ProtectedRoute requiredRole="ROLE_ADMIN" />}>
                <Route path="/admin" element={<Admin />} />
            </Route>
            <Route element={<ProtectedRoute requiredRole="ROLE_SELLER" />}>
                <Route path="/seller" element={<Seller />} />
            </Route>
            <Route element={<ProtectedRoute requiredRole="ROLE_CUSTOMER" />}>
                <Route path="/customer" element={<Customer />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}