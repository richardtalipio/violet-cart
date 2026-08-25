import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { orderService } from '@/api/orderService';
import { type CheckoutFormData, type OrderSearchFormData, type OrderSearchFormInput, orderSearchSchema } from '@/schemas/orderSchema';
import type { CheckoutResponse, OrderResponse } from '@/types/orderTypes';
import type { ApiResponse } from '@/types/common';
import { AxiosError } from 'axios';

interface UseOrderManagementReturn {
    isLoading: boolean;
    error: string | null;
    checkoutResult: CheckoutResponse | null;
    userOrders: OrderResponse[] | null;
    selectedOrder: OrderResponse | null;
    processCheckout: (data: CheckoutFormData) => Promise<CheckoutResponse | null>;
    getUserOrders: (criteria?: OrderSearchFormData) => Promise<OrderResponse[] | null>;
    getOrderById: (orderId: string) => Promise<OrderResponse | null>;
    resetOrderState: () => void;
    searchForm: any;
    handleSearchSubmit: () => void;
}

export const useOrderManagement = (): UseOrderManagementReturn => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [checkoutResult, setCheckoutResult] = useState<CheckoutResponse | null>(null);
    const [userOrders, setUserOrders] = useState<OrderResponse[] | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);

    const searchForm = useForm<OrderSearchFormInput, any, OrderSearchFormData>({
        resolver: zodResolver(orderSearchSchema),
        defaultValues: {
            customerName: '',
            page: 0,
            size: 10,
            sort: 'orderDate,DESC',
        },
    });

    const resetOrderState = useCallback(() => {
        setIsLoading(false);
        setError(null);
        setCheckoutResult(null);
        setUserOrders(null);
        setSelectedOrder(null);
    }, []);

    const processCheckout = async (data: CheckoutFormData): Promise<CheckoutResponse | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await orderService.checkout(data);

            if (response.success && response.data) {
                setCheckoutResult(response.data);
                return response.data;
            } else {
                const errorMessage = response.message || 'Checkout failed. Please try again.';
                setError(errorMessage);
                return null;
            }
        } catch (err) {
            let message = 'An unexpected error occurred during checkout.';

            if (err instanceof AxiosError && err.response?.data) {
                const apiError = err.response.data as ApiResponse<unknown>;
                message = apiError.message || message;
            } else if (err instanceof Error) {
                message = err.message;
            }

            setError(message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const getUserOrders = useCallback(async (criteria?: OrderSearchFormData): Promise<OrderResponse[] | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await orderService.getUserOrders(criteria);

            if (response.success && response.data) {
                // Assuming backend returns Page<OrderResponse>
                // Adjusting based on existing getUserOrders implementation which returns OrderResponse[]
                // Need to verify if orderService.getUserOrders accepts criteria
                setUserOrders(response.data.content ?? response.data);
                return response.data.content ?? response.data;
            } else {
                const errorMessage = response.message || 'Failed to fetch user orders.';
                setError(errorMessage);
                return null;
            }
        } catch (err) {
            let message = 'An unexpected error occurred while fetching user orders.';

            if (err instanceof AxiosError && err.response?.data) {
                const apiError = err.response.data as ApiResponse<unknown>;
                message = apiError.message || message;
            } else if (err instanceof Error) {
                message = err.message;
            }

            setError(message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [orderService]);

    const onSubmitSearch = useCallback(async (data: OrderSearchFormData) => {
        await getUserOrders(data);
    }, [getUserOrders]);

    const handleSearchSubmit = searchForm.handleSubmit(onSubmitSearch);

    const getOrderById = async (orderId: string): Promise<OrderResponse | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await orderService.getOrderById(orderId);

            if (response.success && response.data) {
                setSelectedOrder(response.data);
                return response.data;
            } else {
                const errorMessage = response.message || 'Failed to fetch order.';
                setError(errorMessage);
                return null;
            }
        } catch (err) {
            let message = 'An unexpected error occurred while fetching order.';

            if (err instanceof AxiosError && err.response?.data) {
                const apiError = err.response.data as ApiResponse<unknown>;
                message = apiError.message || message;
            } else if (err instanceof Error) {
                message = err.message;
            }

            setError(message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        checkoutResult,
        userOrders,
        selectedOrder,
        processCheckout,
        getUserOrders,
        getOrderById,
        resetOrderState,
        searchForm,
        handleSearchSubmit,
    };
};