'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
    const { t } = useLanguage();
    const login = useAuthStore((state) => state.login);
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const query = `
                mutation Login($email: String!, $password: String!) {
                    login(input: {
                        email: $email,
                        password: $password
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
                email,
                password,
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
                throw new Error(`Server returned ${response.status}. Please check logs.`);
            }

            const result = await response.json();

            if (!response.ok) {
                console.error("Server Error:", result);
                throw new Error(result.errors?.[0]?.message || `Server Error: ${response.status}`);
            }

            if (result.errors) {
                throw new Error(result.errors[0].message);
            }

            const { user, accessToken } = result.data.login;

            // Store token if needed (e.g., localStorage)
            // localStorage.setItem('token', accessToken);

            login(user.id, user.email, user.isAdmin || false);

            if (user.isAdmin) {
                router.push('/admin');
            } else {
                router.push('/');
            }

        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || 'Invalid credentials');
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
                className="relative z-10 w-full max-w-md"
            >
                <div className="glass-strong rounded-[4rem] p-12 shadow-2xl border border-white/10 floating-island m-0">
                    <div className="text-center mb-10">
                        <Link href="/">
                            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl gradient-cyber flex items-center justify-center neon-glow-purple shadow-lg cursor-pointer">
                                <span className="text-3xl font-bold text-white uppercase">C</span>
                            </div>
                        </Link>
                        <h1 className="text-4xl font-black text-gradient uppercase tracking-tighter mb-2">{t.auth.login}</h1>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Sync your identity with the grid</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-[2rem] text-sm text-center font-bold"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4">{t.auth.email}</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-6 py-4 rounded-3xl glass bg-white/5 border border-white/10 focus:border-[var(--neon-blue)] focus:outline-none transition-all duration-300 font-medium"
                                placeholder="name@quantum-net.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4">{t.auth.password}</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-6 py-4 rounded-3xl glass bg-white/5 border border-white/10 focus:border-[var(--neon-blue)] focus:outline-none transition-all duration-300 font-medium"
                                placeholder="••••••••"
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full gradient-cyber py-5 rounded-[2rem] font-black text-xl neon-glow-blue hover:neon-glow-purple transition-all duration-300 shadow-2xl uppercase tracking-tighter mt-4 disabled:opacity-50"
                        >
                            {isLoading ? t.common.loading : t.auth.loginButton}
                        </motion.button>
                    </form>

                    <div className="mt-12 text-center space-y-4">
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">
                            {t.auth.noAccount}{' '}
                            <Link href="/register" className="text-[var(--neon-blue)] hover:text-[var(--quantum-purple)] transition-colors">
                                {t.auth.register}
                            </Link>
                        </p>

                        {/* Admin Prompt */}
                        <div className="mt-8 pt-8 border-t border-white/5">
                            <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em] font-black">
                                DB_ACCESS: admin@cyber.com / admin123
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
