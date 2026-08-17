import { useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { productService } from '@/api/productService.ts';
import {
    type SearchProductFormInput,
    type SearchProductFormData,
    searchProductSchema
} from "@/schemas/sellerDashboardSchema.ts";
import {
    type AddProductFormInput,
    type AddProductFormData,
    addProductSchema
} from "@/schemas/sellerDashboardSchema.ts";
import type { Product } from "@/components/common/types.ts";
import type { ApiResponse } from '@/types/common';

export const useProductManagement = (onSuccessCallback?: () => void) => {
    // Search/List state
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Add state
    const [serverError, setServerError] = useState<string | null>(null);

    // Search Form
    const searchForm = useForm<SearchProductFormInput, any, SearchProductFormData>({
        resolver: zodResolver(searchProductSchema),
        defaultValues: {
            productName: '',
            category: 'All',
            page: 0,
            size: 8,
            sort: 'productName,ASC',
        },
    });

    // Add Form
    const addForm = useForm<AddProductFormInput, any, AddProductFormData>({
        resolver: zodResolver(addProductSchema),
        defaultValues: {
            productName: '',
            price: '',
            stocksLeft: '',
            category: '',
            description: '',
        },
    });

    const onSubmitSearch = useCallback(async (data: SearchProductFormData) => {
        setLoading(true);
        setError(null);
        try {
            const searchParams = { ...data };
            if (searchParams.category === 'All') {
                delete searchParams.category;
            }
            const response = await productService.fetchProducts(searchParams);

            // Extract Spring Boot Page metadata
            setProducts(response.data.content ?? []);
            setTotalPages(response.data.totalPages ?? 0);
            setTotalElements(response.data.totalElements ?? 0);

            const responseCategories = await productService.fetchCategories();
            setCategories(['All', ...responseCategories.data]);
        } catch (err) {
            setError('Failed to fetch products or categories');
        } finally {
            setLoading(false);
        }
    }, []);

    const onSubmitAdd = async (data: AddProductFormData) => {
        try {
            setServerError(null);

            await productService.addProduct(data);

            addForm.reset();

            if (onSuccessCallback) {
                onSuccessCallback();
            }
        } catch (err) {
            const error = err as AxiosError<ApiResponse<null>>;

            if (error.response?.data?.message) {
                setServerError(error.response.data.message);
            } else if (error.request) {
                setServerError('Unable to connect to the backend server. Is Spring Boot running?');
            } else {
                setServerError('An unexpected error occurred while adding the product.');
            }
        }
    };

    const handleSearchSubmit = useMemo(() => searchForm.handleSubmit(onSubmitSearch), [searchForm, onSubmitSearch]);

    return {
        // Search/List
        products,
        setProducts,
        categories,
        totalPages,
        totalElements,
        loading,
        error,
        searchForm,
        handleSearchSubmit,

        // Add
        addForm,
        handleAddSubmit: addForm.handleSubmit(onSubmitAdd),
        serverError,
    };
};
