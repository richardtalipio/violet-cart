import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { sellerDashboardService } from "@/api/sellerDashboardService.ts";
import {
    type AddProductFormInput,
    type AddProductFormData,
    addProductSchema
} from "@/schemas/sellerDashboardSchema.ts";
import type { ApiResponse } from '@/types/common';

export const useSellerDashboard = (onSuccessCallback?: () => void) => {
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<AddProductFormInput, any, AddProductFormData>({
        resolver: zodResolver(addProductSchema),
        defaultValues: {
            productName: '',
            price: '',
            stocksLeft: '',
            category: '',
            description: '',
        },
    });

    const onSubmit = async (data: AddProductFormData) => {
        try {
            setServerError(null);

            await sellerDashboardService.addProduct(data);

            reset();

            if (onSuccessCallback) {
                onSuccessCallback();
            }
        } catch (err) {
            const error = err as AxiosError<ApiResponse<null>>;

            if (error.response?.data?.message) {
                setServerError(error.response.data.message);
            } else if (error.request) {
                setServerError('Unable to connect to the backend server. Is Spring Boot running?');
            } else {
                setServerError('An unexpected error occurred while adding the product.');
            }
        }
    };

    return {
        register,
        setValue,
        watch,
        reset,
        handleSubmit: handleSubmit(onSubmit),
        errors,
        isSubmitting,
        serverError,
    };
};