import { api } from './axios';
import type { AddProductFormData, SearchProductFormData } from "@/schemas/sellerDashboardSchema.ts";
import type { ApiResponse } from "@/types/common.ts";
import type { Page } from "@/types/page.ts";
import type {Product} from "@/components/common/types.ts";

export const sellerDashboardService = {
    addProduct: async (formData: AddProductFormData): Promise<ApiResponse<Product>> => {
        // Create FormData to send file and form fields
        const data = new FormData();
        data.append('imageFile', formData.imageFile);
        data.append('productName', formData.productName);
        data.append('price', formData.price.toString());
        data.append('stocksLeft', formData.stocksLeft.toString());
        data.append('category', formData.category);
        data.append('description', formData.description);

        const response = await api.post<ApiResponse<Product>>('/products', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    fetchProducts: async (params: SearchProductFormData): Promise<ApiResponse<Page<Product>>> => {
        const response = await api.get<ApiResponse<Page<Product>>>('/products', { params });
        return response.data;
    },

    fetchImageBlob: async (filename: string): Promise<string> => {
        // If it's already an absolute URL (e.g., Unsplash mock data), return directly
        if (!filename || filename.startsWith('http://') || filename.startsWith('https://')) {
            return filename;
        }

        // Axios fetches image binary data with auth headers attached
        const response = await api.get(`/images/${filename}`, {
            responseType: 'blob',
        });

        // Convert binary blob to temporary object URL for <img> tags
        return URL.createObjectURL(response.data);
    },
};
