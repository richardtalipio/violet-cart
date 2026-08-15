import type { Seller } from "@/components/common/types.ts";
import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../api/adminService';

export const useSellerManagement = () => {
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSellers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = (await adminService.getSellers()).data;
            setSellers(Array.isArray(data) ? data : []);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch seller accounts.');
            setSellers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateSellerStatus = async (email: string, status: Seller['userStatus']) => {
        setError(null);
        try {
            await adminService.updateStatus(email, status);
            setSellers((prev) =>
                prev.map((s) => (s.email === email ? { ...s, userStatus: status } : s))
            );
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to update seller status.';
            setError(msg);
            throw err;
        }
    };

    useEffect(() => {
        fetchSellers();
    }, [fetchSellers]);

    return {
        sellers,
        setSellers,
        loading,
        error,
        refetchSellers: fetchSellers,
        updateSellerStatus,
    };
};