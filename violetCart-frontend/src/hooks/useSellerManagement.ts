import type {Seller} from "@/components/common/types.ts";
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useSellerManagement = () => {
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSellers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Adjust API URL path according to your backend AdminUserController mapping
            const response = await axios.get<Seller[]>('/api/v1/admin/users/sellers');
            setSellers(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch seller accounts.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSellers();
    }, [fetchSellers]);

    return {
        sellers,
        loading,
        error,
        refetchSellers: fetchSellers
    };
};