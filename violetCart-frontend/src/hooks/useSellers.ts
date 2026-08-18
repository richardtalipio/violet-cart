import { useState, useEffect, useCallback } from 'react';
import { userService } from '../api/userService.ts';
import type { Seller } from "@/components/common/types.ts";

export const useSellers = () => {
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSellers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = (await userService.getSellers()).data;
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
            await userService.updateStatus(email, status);
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

    return { sellers, loading, error, refetchSellers: fetchSellers, updateSellerStatus };
};