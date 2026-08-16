import { useState } from 'react';
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
        formState: { errors },
    } = useForm<SearchProductFormInput, any, SearchProductFormData>({
        resolver: zodResolver(searchProductSchema),
        defaultValues: {
            productName: '',
            category: '',
            page: 0,
            size: 10,
            sort: 'productName,ASC',
        },
    });

    const onSubmit = async (data: SearchProductFormData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await sellerDashboardService.fetchProducts(data);
            setProducts(response.data);
        } catch (err) {
            setError('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    return {
        products,
        loading,
        error,
        register,
        handleSubmit: handleSubmit(onSubmit),
        errors,
    };
};
