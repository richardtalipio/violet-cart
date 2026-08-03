import { api } from './axios';
import type { AuthResponse, ApiResponse } from '../types/auth';
import type { LoginFormData, RegisterFormData } from '../schemas/authSchemas';

export const authService = {
    login: async (credentials: LoginFormData): Promise<ApiResponse<AuthResponse>> => {
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
        return response.data;
    },
    register: async (credentials: RegisterFormData): Promise<ApiResponse<AuthResponse>> => {
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', credentials);
        return response.data;
    },

};