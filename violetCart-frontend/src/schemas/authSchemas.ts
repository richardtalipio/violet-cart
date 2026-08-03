import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z
    .object({
        firstName: z
            .string()
            .min(1, 'First name is required')
            .max(50, 'First name must not exceed 50 characters'),
        lastName: z
            .string()
            .min(1, 'Last name is required')
            .max(50, 'Last name must not exceed 50 characters'),
        email: z
            .string()
            .min(1, 'Email is required')
            .email('Please enter a valid email address'),
        password: z
            .string()
            .min(1, 'Password is required')
            .min(6, 'Password must be at least 6 characters'),
        role: z.enum(['ROLE_CUSTOMER', 'ROLE_SELLER'], {
            errorMap: () => ({ message: 'Please select a valid role' }),
        }),
        storeDescription: z.string().optional(),
    })
    .refine(
        (data) => {
            if (data.role === 'ROLE_SELLER') {
                return (
                    data.storeDescription !== undefined &&
                    data.storeDescription.trim().length > 0
                );
            }
            return true;
        },
        {
            message: 'Store description is required for sellers',
            path: ['storeDescription'],
        }
    );

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;