'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Mock login logic
        setTimeout(() => {
            if (email === 'admin@cyber.com' && password === 'admin123') {
                // Redirect to admin dashboard
                router.push('/admin');
            } else if (email && password) {
                // Mock regular user login
                router.push('/');
            } else {
                setError('Invalid quantum credentials');
            }
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[var(--obsidian)] flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full gradient-mesh opacity-20 z-0" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-strong rounded-3xl p-8 md:p-12 max-w-md w-full relative z-10"
            >
                <div className="text-center mb-10">
                    <Link href="/">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl gradient-cyber flex items-center justify-center neon-glow-purple cursor-pointer">
                            <span className="text-3xl font-bold text-white">C</span>
                        </div>
                    </Link>
                    <h1 className="text-3xl font-bold text-gradient mb-2">Access Portal</h1>
                    <p className="text-gray-400">Sync your identity with the grid</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400 ml-1">Quantum Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@grid.com"
                            className="w-full px-4 py-3 rounded-xl glass border-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--neon-blue)] transition-all"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400 ml-1">Security Key</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-xl glass border-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--neon-blue)] transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full gradient-cyber py-4 rounded-xl font-bold text-white neon-glow-blue hover:neon-glow-purple transition-all duration-300 disabled:opacity-50"
                    >
                        {isLoading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center space-y-4">
                    <p className="text-sm text-gray-400">
                        Forgot your <span className="text-[var(--neon-blue)] cursor-pointer hover:underline">access key</span>?
                    </p>
                    <p className="text-sm text-gray-400">
                        New to the grid? <span className="text-[var(--neon-blue)] cursor-pointer hover:underline font-bold">Register</span>
                    </p>
                </div>

                {/* Hint for admin */}
                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                        Admin Hint: admin@cyber.com / admin123
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
