import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import type {SubmitHandler} from 'react-hook-form';

// Enums matching your backend Role types
type Role = 'ROLE_CUSTOMER' | 'ROLE_SELLER';

// Form input types
interface RegisterFormInputs {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword?: string;
    storeDescription?: string;
}

// Payload matching Spring Boot RegisterRequest DTO
interface RegisterPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: Role;
    storeDescription?: string | null;
}

// API Response wrapper type
interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
}

export const Register: React.FC = () => {
    const [selectedRole, setSelectedRole] = useState<Role>('ROLE_CUSTOMER');
    const [serverError, setServerError] = useState<string>('');
    const [successMsg, setSuccessMsg] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm<RegisterFormInputs>();

    const password = watch('password');

    const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
        setServerError('');
        setSuccessMsg('');
        setLoading(true);

        const payload: RegisterPayload = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            role: selectedRole,
            storeDescription: selectedRole === 'ROLE_SELLER' ? data.storeDescription : null,
        };

        try {
            const response = await fetch('http://localhost:8080/api/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const resData: ApiResponse = await response.json();

            if (!response.ok) {
                throw new Error(resData.message || 'Registration failed');
            }

            if (selectedRole === 'ROLE_SELLER') {
                setSuccessMsg('Seller application submitted! Your account is pending admin approval.');
            } else {
                setSuccessMsg('Account created successfully! You can now log in.');
            }
            reset();
        } catch (err) {
            if (err instanceof Error) {
                setServerError(err.message);
            } else {
                setServerError('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md border border-gray-100">
                <div>
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Join <span className="font-semibold text-purple-600">VioletCart</span> today
                    </p>
                </div>

                {/* Role Toggle Selector */}
                <div className="flex rounded-lg bg-gray-100 p-1">
                    <button
                        type="button"
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                            selectedRole === 'ROLE_CUSTOMER'
                                ? 'bg-white text-purple-700 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setSelectedRole('ROLE_CUSTOMER')}
                    >
                        Customer
                    </button>
                    <button
                        type="button"
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                            selectedRole === 'ROLE_SELLER'
                                ? 'bg-white text-purple-700 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setSelectedRole('ROLE_SELLER')}
                    >
                        Become a Seller
                    </button>
                </div>

                {/* Feedback Messages */}
                {serverError && (
                    <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
                        {serverError}
                    </div>
                )}
                {successMsg && (
                    <div className="p-3 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm rounded">
                        {successMsg}
                    </div>
                )}

                <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    {/* First & Last Name Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">First Name</label>
                            <input
                                type="text"
                                {...register('firstName', { required: 'First name is required' })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                placeholder="Jane"
                            />
                            {errors.firstName && (
                                <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Last Name</label>
                            <input
                                type="text"
                                {...register('lastName', { required: 'Last name is required' })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                placeholder="Doe"
                            />
                            {errors.lastName && (
                                <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Email address</label>
                        <input
                            type="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                            placeholder="jane@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Conditional Seller Store Description Field */}
                    {selectedRole === 'ROLE_SELLER' && (
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Store Description</label>
                            <textarea
                                rows={3}
                                {...register('storeDescription', {
                                    required:
                                        selectedRole === 'ROLE_SELLER' ? 'Store description is required for sellers' : false,
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                placeholder="Describe what kind of items you plan to sell..."
                            />
                            {errors.storeDescription && (
                                <p className="text-red-500 text-xs mt-1">{errors.storeDescription.message}</p>
                            )}
                        </div>
                    )}

                    {/* Password */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 8, message: 'Password must be at least 8 characters' },
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            {...register('confirmPassword', {
                                required: 'Please confirm your password',
                                validate: (val) => val === password || 'Passwords do not match',
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                            placeholder="••••••••"
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Creating account...' : selectedRole === 'ROLE_SELLER' ? 'Apply as Seller' : 'Sign Up'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;