import { useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { sellerDashboardService } from '@/api/sellerDashboardService';
import {
    type SearchProductFormInput,
    type SearchProductFormData,
    searchProductSchema
} from "@/schemas/sellerDashboardSchema.ts";
import type { Product } from "@/components/common/types.ts";

export const useSellerDashboard = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<SearchProductFormInput, any, SearchProductFormData>({
        resolver: zodResolver(searchProductSchema),
        defaultValues: {
            productName: '',
            category: 'All', // Set default to 'All'
            page: 0,
            size: 8,
            sort: 'productName,ASC',
        },
    });

    const onSubmit = useCallback(async (data: SearchProductFormData) => {
        setLoading(true);
        setError(null);
        try {
            // Adjust category before sending
            const searchParams = { ...data };
            if (searchParams.category === 'All') {
                delete searchParams.category;
            }
            const response = await sellerDashboardService.fetchProducts(searchParams);
            setProducts(response.data.content);
        } catch (err) {
            setError('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    }, [setProducts, setLoading, setError]);

    const handleSubmitWrapper = useMemo(() => handleSubmit(onSubmit), [handleSubmit, onSubmit]);

    return {
        products,
        setProducts,
        loading,
        error,
        register,
        handleSubmit: handleSubmitWrapper,
        errors,
        setValue,
        watch
    };
};
