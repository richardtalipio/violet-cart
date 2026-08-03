import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { authService } from '../api/authService';
import type { ApiResponse } from '../types/auth';
import {type RegisterFormData, registerSchema} from "../schemas/authSchemas.ts";

export const useRegisterForm = () => {
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            role: 'ROLE_CUSTOMER',
            email: '',
            password: '',
            storeDescription: ''
        },
    });

    const password = watch('password');
    const onSubmit = async (data: RegisterFormData) => {
        try {
            setServerError('');
            setSuccessMsg('');
            setLoading(true);

            const response = await authService.register(data);

            const apiResponse = response.data;
            if (apiResponse.role === 'ROLE_SELLER') {
                setSuccessMsg('Seller application submitted! Your account is pending admin approval.');
            } else {
                setSuccessMsg('Account created successfully! You can now log in.');
            }
            reset();
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
        }finally {
            setLoading(false);
        }
    };

    return {
        register,
        reset,
        password,
        handleSubmit: handleSubmit(onSubmit),
        errors,
        serverError,
        successMsg,
        loading
    };
};