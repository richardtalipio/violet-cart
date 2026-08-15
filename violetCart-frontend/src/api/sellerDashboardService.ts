import { api } from './axios';
import type { AddProductFormData, AddProductResponse } from "@/schemas/sellerDashboardSchema.ts";
import type { ApiResponse } from "@/types/common.ts";

export const sellerDashboardService = {
    addProduct: async (formData: AddProductFormData): Promise<ApiResponse<AddProductResponse>> => {
        // Create FormData to send file and form fields
        const data = new FormData();
        data.append('imageFile', formData.imageFile);
        data.append('productName', formData.productName);
        data.append('price', formData.price.toString());
        data.append('stocksLeft', formData.stocksLeft.toString());
        data.append('category', formData.category);
        data.append('description', formData.description);

        const response = await api.post<ApiResponse<AddProductResponse>>('/products', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
};
