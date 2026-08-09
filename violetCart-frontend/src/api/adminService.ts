import { api } from './axios';
import type {Seller, UpdateStatusRequest} from "@/components/common/types.ts";

export const adminService = {
    getSellers: async (): Promise<Seller[]> => {
        const response = await api.get<Seller[]>('/users/sellers');
        return response.data;
    },

    updateStatus: async (email: string, status: Seller['userStatus']): Promise<void> => {
        await api.patch(`/users/${encodeURIComponent(email)}/status`, {
            status,
        } as UpdateStatusRequest);
    },

};