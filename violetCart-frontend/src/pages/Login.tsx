import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { useLoginForm } from '../hooks/useLoginForm';

export const Login: React.FC = () => {
    const { register, handleSubmit, errors, isSubmitting, serverError } = useLoginForm();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-8 space-y-6">

                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-violet-600/20 text-violet-400 mb-2">
                        <LogIn className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Welcome Back</h1>
                    <p className="text-sm text-slate-400">Sign in to your VioletCart account</p>
                </div>

                {/* Global Error Banner */}
                {serverError && (
                    <div className="flex items-center gap-3 p-3 text-sm text-red-400 bg-red-950/50 border border-red-800/50 rounded-lg">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>{serverError}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    {/* Email */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                {...register('email')}
                                type="email"
                                placeholder="you@example.com"
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/60 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
                        )}
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

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2.5 px-4 mt-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-medium text-sm rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20"
                    >
                        {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                {/* Footer Links */}
                <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-violet-400 hover:underline font-medium">
                        Create one
                    </Link>
                </div>

            </div>
        </div>
    );
};