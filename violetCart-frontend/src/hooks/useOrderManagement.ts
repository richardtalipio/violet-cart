import { useState, useCallback } from 'react';
import { orderService } from '@/api/orderService';
import type { CheckoutFormData } from '@/schemas/orderSchema';
import type { CheckoutResponse } from '@/types/orderTypes';
import type { ApiResponse } from '@/types/common';
import { AxiosError } from 'axios';

interface UseOrderManagementReturn {
    isLoading: boolean;
    error: String | null;
    checkoutResult: CheckoutResponse | null;
    processCheckout: (data: CheckoutFormData) => Promise<CheckoutResponse | null>;
    resetOrderState: () => void;
}

export const useOrderManagement = (): UseOrderManagementReturn => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [checkoutResult, setCheckoutResult] = useState<CheckoutResponse | null>(null);

    const resetOrderState = useCallback(() => {
        setIsLoading(false);
        setError(null);
        setCheckoutResult(null);
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

    return {
        isLoading,
        error,
        checkoutResult,
        processCheckout,
        resetOrderState,
    };
};