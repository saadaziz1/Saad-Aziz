'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ email, password });
            toast.success('Welcome back!');
            router.push('/');
        } catch (err: any) {
            toast.error(err?.data?.message || 'Login failed');
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
            {/* Decorative blobs - preserved */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-3xl" style={{ animationDelay: '1s' }}></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[450px] glass p-10 rounded-[40px] shadow-2xl border border-white/50 relative z-10"
            >
                {/* Header - preserved */}
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
                        <div className="p-3 bg-primary rounded-2xl text-white shadow-lg shadow-primary/30 group-hover:rotate-12 transition-transform duration-300">
                            <HeartPulse size={28} />
                        </div>
                    </Link>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
                    <p className="text-slate-500 font-medium mt-2">Access your health dashboard</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                <Mail size={20} />
                            </div>
                            <input
                                type="email"
                                required
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-800 placeholder:text-slate-400"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                <Lock size={20} />
                            </div>
                            <input
                                type="password"
                                required
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-800 placeholder:text-slate-400"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        disabled={isLoading}
                        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-900/10 hover:shadow-slate-900/30 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                        {!isLoading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                    </button>

                    {error && (
                        <p className="text-red-500 text-center text-sm font-bold">
                            Login invalid. Please try again.
                        </p>
                    )}
                </form>

                <div className="mt-10 text-center">
                    <p className="text-slate-500 font-medium">
                        New here? <Link href="/signup" className="text-primary font-bold hover:underline">Create an account</Link>
                    </p>
                </div>
            </motion.div>
        </main>
    );
}
