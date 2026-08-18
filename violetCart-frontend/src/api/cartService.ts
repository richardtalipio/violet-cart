import { api } from './axios';
import type { ApiResponse } from "@/types/common.ts";
import type { AddToCartRequest, CartItemResponse } from "@/components/storefront/types.ts";

export const cartService = {
    getCart: async (userId: number): Promise<ApiResponse<CartItemResponse[]>> => {
        const response = await api.get<ApiResponse<CartItemResponse[]>>('/cart', { params: { userId } });
        return response.data;
    },

    addToCart: async (userId: number, request: AddToCartRequest): Promise<ApiResponse<CartItemResponse>> => {
        const response = await api.post<ApiResponse<CartItemResponse>>('/cart/add', request, { params: { userId } });
        return response.data;
    },

    updateQuantity: async (cartItemId: string, quantity: number): Promise<ApiResponse<void>> => {
        const response = await api.put<ApiResponse<void>>(`/cart/${cartItemId}`, null, { params: { quantity } });
        return response.data;
    },

    removeItem: async (cartItemId: string): Promise<ApiResponse<void>> => {
        const response = await api.delete<ApiResponse<void>>(`/cart/${cartItemId}`);
        return response.data;
    }
};
