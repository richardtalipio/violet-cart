import { useState, useEffect, useCallback } from 'react';
import { userService } from '../api/userService.ts';
import type { StoreProfile } from "@/types/auth.ts";

export const useStoreProfile = () => {
    const [store, setStore] = useState<StoreProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStore = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = (await userService.fetchStore()).data;
            setStore(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch store profile.');
            setStore(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStore();
    }, [fetchStore]);

    return { store, loading, error, refetchStore: fetchStore };
};