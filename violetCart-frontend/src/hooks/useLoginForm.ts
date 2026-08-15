import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { loginSchema } from '../schemas/authSchemas';
import type { LoginFormData } from '../schemas/authSchemas';
import { authService } from '../api/authService';
import { useAuthStore } from '../store/useAuthStore';
import type { ApiResponse } from '../types/common';

export const useLoginForm = () => {
    const [serverError, setServerError] = useState<string | null>(null);
    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setServerError(null);
            const response = await authService.login(data);

            const { token, email, role, status } = response.data;

            // Store auth session in Zustand
            setAuth(token, { id: 0, email, firstName: '', lastName: '', role, status });
            console.log(role);
            if (role === 'ROLE_ADMIN') {
                console.log("TESTING");
                navigate('/admin', { replace: true })
            } else if (role === 'ROLE_SELLER') {
                navigate('/seller');
            } else if (role === 'ROLE_CUSTOMER') {
                navigate('/customer');
            } else {
                navigate('/');
            }


        } catch (err) {
            const error = err as AxiosError<ApiResponse<null>>;

            if (error.response?.data?.message) {
                // Error response returned by backend (e.g. 401 Bad Credentials)
                setServerError(error.response.data.message);
            } else if (error.request) {
                // Request made but no response received (CORS / Backend down)
                setServerError('Unable to connect to the backend server. Is Spring Boot running?');
            } else {
                setServerError('An unexpected error occurred.');
            }
        }
    };

    return {
        register,
        handleSubmit: handleSubmit(onSubmit),
        errors,
        isSubmitting,
        serverError,
    };
};