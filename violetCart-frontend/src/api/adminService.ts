import { api } from './axios';
import type {Seller, UpdateStatusRequest} from "@/components/common/types.ts";
import type {ApiResponse, User} from "@/types/auth.ts";

export const adminService = {
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

};