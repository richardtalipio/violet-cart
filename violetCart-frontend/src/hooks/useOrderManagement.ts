import { useState, useCallback } from 'react';
import { orderService } from '@/api/orderService';
import type { CheckoutFormData } from '@/schemas/orderSchema';
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
    getUserOrders: () => Promise<OrderResponse[] | null>;
    getOrderById: (orderId: string) => Promise<OrderResponse | null>;
    resetOrderState: () => void;
}

export const useOrderManagement = (): UseOrderManagementReturn => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [checkoutResult, setCheckoutResult] = useState<CheckoutResponse | null>(null);
    const [userOrders, setUserOrders] = useState<OrderResponse[] | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);

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

    const getUserOrders = async (): Promise<OrderResponse[] | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await orderService.getUserOrders();

            if (response.success && response.data) {
                setUserOrders(response.data);
                return response.data;
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
    };

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
    };
};