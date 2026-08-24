import { api } from './axios';
import type {Seller, UpdateStatusRequest} from "@/components/common/types.ts";
import type {StoreProfile, User} from "@/types/auth.ts";
import type {ApiResponse} from "@/types/common.ts";

export const userService = {
    getSellers: async (): Promise<ApiResponse<Seller[]>> => {
        const response = await api.get<ApiResponse<Seller[]>>('/users/sellers');
        return response.data;
    },

    updateStatus: async (email: string, status: Seller['userStatus']): Promise<ApiResponse<User>> => {
        const response = await api.patch<ApiResponse<User>>(`/users/${encodeURIComponent(email)}/status`, {
            status,
        } as UpdateStatusRequest);
        return response.data;
    },

    fetchStore: async (): Promise<ApiResponse<StoreProfile>> => {
        const response = await api.get<ApiResponse<StoreProfile>>('/users/myStore');
        return response.data;
    },

    fetchMyAccount: async (): Promise<ApiResponse<User>> => {
        const response = await api.get<ApiResponse<User>>('/users/me');
        return response.data;
    },


};