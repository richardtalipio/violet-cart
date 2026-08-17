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
    const [categories, setCategories] = useState<string[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);
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
            category: 'All',
            page: 0,
            size: 8,
            sort: 'productName,ASC',
        },
    });

    const onSubmit = useCallback(async (data: SearchProductFormData) => {
        setLoading(true);
        setError(null);
        try {
            const searchParams = { ...data };
            if (searchParams.category === 'All') {
                delete searchParams.category;
            }
            const response = await sellerDashboardService.fetchProducts(searchParams);

            // Extract Spring Boot Page metadata
            setProducts(response.data.content ?? []);
            setTotalPages(response.data.totalPages ?? 0);
            setTotalElements(response.data.totalElements ?? 0);

            const responseCategories = await sellerDashboardService.fetchCategories();
            setCategories(['All', ...responseCategories.data]);
        } catch (err) {
            setError('Failed to fetch products or categories');
        } finally {
            setLoading(false);
        }


    }, []);


    const handleSubmitWrapper = useMemo(() => handleSubmit(onSubmit), [handleSubmit, onSubmit]);

    return {
        products,
        setProducts,
        categories,
        totalPages,
        totalElements,
        loading,
        error,
        register,
        handleSubmit: handleSubmitWrapper,
        errors,
        setValue,
        watch
    };
};