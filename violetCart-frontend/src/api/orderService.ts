import { api } from './axios';
import type { ApiResponse } from '@/types/common';
import type { CheckoutFormData, OrderSearchFormData } from '@/schemas/orderSchema';
import type { CheckoutResponse, OrderResponse } from '@/types/orderTypes';

export const orderService = {
    checkout: async (
        checkoutData: CheckoutFormData
    ): Promise<ApiResponse<CheckoutResponse>> => {
        const response = await api.post<ApiResponse<CheckoutResponse>>(
            '/orders/checkout',
            checkoutData
        );
        return response.data;
    },

    getUserOrders: async (
        criteria?: OrderSearchFormData
    ): Promise<ApiResponse<any>> => {
        const response = await api.get<ApiResponse<any>>('/orders', {
            params: criteria,
        });
        return response.data;
    },

    getOrderById: async (
        orderId: string
    ): Promise<ApiResponse<OrderResponse>> => {
        const response = await api.get<ApiResponse<OrderResponse>>(
            `/orders/${orderId}`
        );
        return response.data;
    },
};