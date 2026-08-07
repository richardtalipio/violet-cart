import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, User, Mail, Phone, Lock, Store, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useRegisterForm } from "../hooks/useRegisterForm.ts";

export const Register: React.FC = () => {
    const {
        register,
        handleSubmit,
        errors,
        isSubmitting,
        serverError,
        successMsg,
        selectedRole,
        handleRoleChange
    } = useRegisterForm();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-8 space-y-6">

                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-violet-600/20 text-violet-400 mb-2">
                        <UserPlus className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Create Account</h1>
                    <p className="text-sm text-slate-400">Join <span className="font-medium text-violet-400">VioletCart</span> today</p>
                </div>

                {/* Role Toggle Selector */}
                <div className="flex rounded-lg bg-slate-800/80 p-1 border border-slate-700/50">
                    <button
                        type="button"
                        className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                            selectedRole === 'ROLE_CUSTOMER'
                                ? 'bg-violet-600 text-white shadow-sm'
                                : 'text-slate-400 hover:text-slate-200'
                        }`}
                        onClick={() => handleRoleChange('ROLE_CUSTOMER')}
                    >
                        Customer
                    </button>
                    <button
                        type="button"
                        className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                            selectedRole === 'ROLE_SELLER'
                                ? 'bg-violet-600 text-white shadow-sm'
                                : 'text-slate-400 hover:text-slate-200'
                        }`}
                        onClick={() => handleRoleChange('ROLE_SELLER')}
                    >
                        Become a Seller
                    </button>
                </div>

                {/* Feedback Messages */}
                {serverError && (
                    <div className="flex items-center gap-3 p-3 text-sm text-red-400 bg-red-950/50 border border-red-800/50 rounded-lg">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>{serverError}</p>
                    </div>
                )}
                {successMsg && (
                    <div className="flex items-center gap-3 p-3 text-sm text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                        <p>{successMsg}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    {/* First & Last Name Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                First Name
                            </label>
                            <div className="relative">
                                <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    {...register('firstName')}
                                    type="text"
                                    placeholder="Jane"
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/60 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
                                />
                            </div>
                            {errors.firstName && (
                                <p className="text-xs text-red-400 mt-1">{errors.firstName.message}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                Last Name
                            </label>
                            <div className="relative">
                                <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    {...register('lastName')}
                                    type="text"
                                    placeholder="Doe"
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/60 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
                                />
                            </div>
                            {errors.lastName && (
                                <p className="text-xs text-red-400 mt-1">{errors.lastName.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Email & Contact Number Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    {...register('email')}
                                    type="email"
                                    placeholder="jane@example.com"
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/60 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                Contact Number
                            </label>
                            <div className="relative">
                                <Phone className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    {...register('contactNumber')}
                                    type="tel"
                                    placeholder="+63 917 123 4567"
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/60 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
                                />
                            </div>
                            {errors.contactNumber && (
                                <p className="text-xs text-red-400 mt-1">{errors.contactNumber.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                {...register('password')}
                                type="password"
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/60 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
                            />
                        </div>
                        {errors.password && (
                            <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                {...register('confirmPassword')}
                                type="password"
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/60 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
                            />
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-xs text-red-400 mt-1">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {/* Seller Specific Fields */}
                    {selectedRole === 'ROLE_SELLER' && (
                        <>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                    Store Name
                                </label>
                                <div className="relative">
                                    <Store className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input
                                        {...register('storeName')}
                                        type="text"
                                        placeholder="Ana's Craft Shop"
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800/60 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
                                    />
                                </div>
                                {errors.storeName && (
                                    <p className="text-xs text-red-400 mt-1">{errors.storeName.message}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                    Store Description
                                </label>
                                <div className="relative">
                                    <FileText className="w-5 h-5 absolute left-3 top-3 text-slate-500" />
                                    <textarea
                                        {...register('storeDescription')}
                                        rows={3}
                                        placeholder="Describe what kind of items you plan to sell..."
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800/60 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
                                    />
                                </div>
                                {errors.storeDescription && (
                                    <p className="text-xs text-red-400 mt-1">{errors.storeDescription.message}</p>
                                )}
                            </div>
                        </>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2.5 px-4 mt-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-medium text-sm rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20"
                    >
                        {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : selectedRole === 'ROLE_SELLER' ? (
                            'Apply as Seller'
                        ) : (
                            'Sign Up'
                        )}
                    </button>
                </form>

                {/* Footer Links */}
                <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
                    Already have an account?{' '}
                    <Link to="/login" className="text-violet-400 hover:underline font-medium">
                        Sign in
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Register;