import type { Seller } from "@/components/common/types.ts";
import { useState, useEffect, useCallback } from 'react';
import { userService } from '../api/userService.ts';
import type {StoreProfile} from "@/types/auth.ts";

export const useUserManagement = () => {
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [store, setStore] = useState<StoreProfile | null>(null);

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

    const fetchStore = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = (await userService.fetchStore()).data;
            setStore(data);
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

    useEffect(() => {
        fetchStore();
    }, [fetchStore]);
    return {
        store,
        sellers,
        setSellers,
        loading,
        error,
        refetchSellers: fetchSellers,
        updateSellerStatus,
        refetchStore: fetchStore
    };
};