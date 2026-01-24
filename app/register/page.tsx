'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuthStore } from '@/store/authStore';

export default function RegisterPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const login = useAuthStore((state) => state.login);

    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            const query = `
                mutation Register($email: String!, $username: String!, $password: String!, $fullName: String!) {
                    register(input: {
                        email: $email,
                        username: $username,
                        password: $password,
                        fullName: $fullName
                    }) {
                        accessToken
                        user {
                            id
                            email
                            username
                            isAdmin
                        }
                    }
                }
            `;

            const variables = {
                email: formData.email,
                username: formData.username,
                password: formData.password,
                fullName: formData.fullName,
            };

            const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:8000/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query, variables }),
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await response.text();
                console.error("Non-JSON Response:", response.status, text);
                throw new Error(`Server returned ${response.status}. Please checks logs.`);
            }

            const result = await response.json();

            if (!response.ok) {
                console.error("Server Error:", result);
                throw new Error(result.errors?.[0]?.message || `Server Error: ${response.status}`);
            }

            if (result.errors) {
                throw new Error(result.errors[0].message);
            }

            const { user } = result.data.register;

            // Login the user in the store
            login(user.id, user.email, user.isAdmin || false);

            // Redirect to home
            router.push('/');

        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err.message || 'Failed to create account');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--obsidian)] flex items-center justify-center px-4 relative overflow-hidden">
            {/* Funky Background Blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
                <div className="absolute top-[10%] left-[-10%] w-[50vw] h-[50vw] bg-[var(--neon-blue)] rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-[10%] right-[-10%] w-[40vw] h-[40vw] bg-[var(--quantum-purple)] rounded-full blur-[130px] animate-float" style={{ animationDuration: '15s' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 w-full max-w-md my-10"
            >
                <div className="glass-strong rounded-[4rem] p-12 shadow-2xl border border-white/10 floating-island m-0">
                    <div className="text-center mb-8">
                        <Link href="/">
                            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl gradient-cyber flex items-center justify-center neon-glow-purple shadow-lg cursor-pointer">
                                <span className="text-3xl font-bold text-white uppercase">C</span>
                            </div>
                        </Link>
                        <h1 className="text-4xl font-black text-gradient uppercase tracking-tighter mb-2">Create Account</h1>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Join the future of fashion</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-2xl text-xs font-bold text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4">{t.auth.fullName}</label>
                            <input
                                type="text"
                                required
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full px-6 py-3 rounded-3xl glass bg-white/5 border border-white/10 focus:border-[var(--neon-blue)] focus:outline-none transition-all duration-300 font-medium"
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4">Username</label>
                            <input
                                type="text"
                                required
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="w-full px-6 py-3 rounded-3xl glass bg-white/5 border border-white/10 focus:border-[var(--neon-blue)] focus:outline-none transition-all duration-300 font-medium"
                                placeholder="cyberpunk2077"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4">{t.auth.email}</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-6 py-3 rounded-3xl glass bg-white/5 border border-white/10 focus:border-[var(--neon-blue)] focus:outline-none transition-all duration-300 font-medium"
                                placeholder="name@quantum-net.com"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4">{t.auth.password}</label>
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-6 py-3 rounded-3xl glass bg-white/5 border border-white/10 focus:border-[var(--neon-blue)] focus:outline-none transition-all duration-300 font-medium"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4">Confirm Password</label>
                            <input
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full px-6 py-3 rounded-3xl glass bg-white/5 border border-white/10 focus:border-[var(--neon-blue)] focus:outline-none transition-all duration-300 font-medium"
                                placeholder="••••••••"
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full gradient-cyber py-5 rounded-[2rem] font-black text-xl neon-glow-blue hover:neon-glow-purple transition-all duration-300 shadow-2xl uppercase tracking-tighter mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? t.common.loading : t.auth.registerButton}
                        </motion.button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">
                            {t.auth.haveAccount}{' '}
                            <Link href="/login" className="text-[var(--neon-blue)] hover:text-[var(--quantum-purple)] transition-colors">
                                {t.auth.signIn}
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
