import { api } from './axios';
import type { ApiResponse } from '@/types/common';
import type {CheckoutFormData} from "@/schemas/orderSchema.ts";
import type {CheckoutResponse} from "@/types/orderTypes.ts";

export const orderService = {
    checkout: async (
        checkoutData: CheckoutFormData
    ): Promise<ApiResponse<CheckoutResponse>> => {
        const response = await api.post<ApiResponse<CheckoutResponse>>(
            '/v1/orders/checkout',
            checkoutData
        );
        return response.data;
    },
};