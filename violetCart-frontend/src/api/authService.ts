import { api } from './axios';
import type { AuthResponse, ApiResponse } from '../types/auth';
import type { LoginFormData } from '../schemas/authSchemas';

export const authService = {
    login: async (credentials: LoginFormData): Promise<ApiResponse<AuthResponse>> => {
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
        return response.data;
    },
};