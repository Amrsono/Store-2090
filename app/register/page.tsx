'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function RegisterPage() {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle registration logic here
        console.log('Registering:', formData);
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
                        <h1 className="text-4xl font-black text-gradient uppercase tracking-tighter mb-2">Create Account</h1>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Join the future of fashion</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4">{t.auth.fullName}</label>
                            <input
                                type="text"
                                required
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full px-6 py-4 rounded-3xl glass bg-white/5 border border-white/10 focus:border-[var(--neon-blue)] focus:outline-none transition-all duration-300 font-medium"
                                placeholder="Jhon Doe"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4">{t.auth.email}</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-6 py-4 rounded-3xl glass bg-white/5 border border-white/10 focus:border-[var(--neon-blue)] focus:outline-none transition-all duration-300 font-medium"
                                placeholder="name@quantum-net.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4">{t.auth.password}</label>
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-6 py-4 rounded-3xl glass bg-white/5 border border-white/10 focus:border-[var(--neon-blue)] focus:outline-none transition-all duration-300 font-medium"
                                placeholder="••••••••"
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full gradient-cyber py-5 rounded-[2rem] font-black text-xl neon-glow-blue hover:neon-glow-purple transition-all duration-300 shadow-2xl uppercase tracking-tighter mt-4"
                        >
                            {t.auth.registerButton}
                        </motion.button>
                    </form>

                    <div className="mt-10 text-center">
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
