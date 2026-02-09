'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import LanguageSwitcher from './LanguageSwitcher';
import Link from 'next/link';

export default function Navbar() {
    const { t, language } = useLanguage();
    const { getTotalItems } = useCartStore();
    const { user, logout } = useAuthStore();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: t.nav.home, href: '/' },
        { name: t.nav.shop, href: '/#products' },
        { name: t.nav.newArrivals, href: '/#features' },
        { name: t.nav.trending, href: '/#dashboard' },
        { name: t.nav.contact, href: '/#contact' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const totalItems = getTotalItems();

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                scrolled ? 'glass-strong neon-glow-blue' : 'bg-transparent'
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center space-x-2"
                        >
                            <span className="text-lg md:text-xl font-bold text-gradient truncate max-w-[150px] md:max-w-none">
                                {language === 'ar' ? 'متجر مودرن' : 'Modern Store'}
                            </span>
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-1">
                        {navLinks.map((item, index) => (
                            <motion.a
                                key={item.name}
                                href={item.href}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:glass hover:neon-glow-blue"
                            >
                                {item.name}
                            </motion.a>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <LanguageSwitcher />


                        {user ? (
                            <>
                                {user.isAdmin && (
                                    <Link href="/admin">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="glass px-5 py-2 rounded-full text-xs font-bold hover:neon-glow-blue transition-all duration-300 uppercase tracking-widest border border-[var(--neon-blue)]/30"
                                        >
                                            {t.nav.admin}
                                        </motion.button>
                                    </Link>
                                )}
                                <Link href="/orders">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="glass px-5 py-2 rounded-full text-xs font-bold hover:neon-glow-blue transition-all duration-300 uppercase tracking-widest border border-[var(--neon-blue)]/10"
                                    >
                                        {t.nav.myOrders}
                                    </motion.button>
                                </Link>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={logout}
                                    className="glass px-5 py-2 rounded-full text-xs font-bold hover:neon-glow-purple transition-all duration-300 uppercase tracking-widest"
                                >
                                    {t.nav.logout}
                                </motion.button>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="glass px-5 py-2 rounded-full text-xs font-bold hover:neon-glow-purple transition-all duration-300 uppercase tracking-widest"
                                    >
                                        {t.nav.signIn}
                                    </motion.button>
                                </Link>

                                <Link href="/register">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="glass-strong px-5 py-2 rounded-full text-xs font-bold hover:neon-glow-blue transition-all duration-300 uppercase tracking-widest border border-[var(--neon-blue)]/30"
                                    >
                                        {t.auth.register}
                                    </motion.button>
                                </Link>
                            </>
                        )}

                        <a href="#products">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="gradient-modern px-6 py-2 rounded-full text-sm font-semibold neon-glow-blue hover:neon-glow-purple transition-all duration-300"
                            >
                                {t.nav.shopNow}
                            </motion.button>
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="glass p-2 rounded-lg"
                        >
                            <div className="w-6 h-5 flex flex-col justify-between">
                                <motion.span
                                    animate={mobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                                    className="w-full h-0.5 bg-[var(--neon-blue)] rounded"
                                />
                                <motion.span
                                    animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                                    className="w-full h-0.5 bg-[var(--neon-blue)] rounded"
                                />
                                <motion.span
                                    animate={mobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                                    className="w-full h-0.5 bg-[var(--neon-blue)] rounded"
                                />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass-strong border-t border-white/10"
                    >
                        <div className="px-4 py-4 md:py-6 space-y-2 md:space-y-3">
                            <div className="flex justify-between items-center mb-6">
                                <LanguageSwitcher />
                            </div>
                            {navLinks.map((item) => (
                                <motion.a
                                    key={item.name}
                                    href={item.href}
                                    whileHover={{ x: 10 }}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-3 rounded-lg glass hover:neon-glow-blue transition-all duration-300"
                                >
                                    {item.name}
                                </motion.a>
                            ))}
                            <div className="pt-4 grid grid-cols-2 gap-4">
                                {user ? (
                                    <>
                                        {user.isAdmin && (
                                            <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                                                <button className="w-full glass-strong px-4 py-3 rounded-2xl font-bold uppercase text-[10px] tracking-widest border border-[var(--neon-blue)]/30">
                                                    {t.nav.admin}
                                                </button>
                                            </Link>
                                        )}
                                        <Link href="/orders" onClick={() => setMobileMenuOpen(false)}>
                                            <button className="w-full glass px-4 py-3 rounded-2xl font-bold uppercase text-[10px] tracking-widest mb-2 border border-[var(--neon-blue)]/10">
                                                {t.nav.myOrders}
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setMobileMenuOpen(false);
                                            }}
                                            className="w-full glass px-4 py-3 rounded-2xl font-bold uppercase text-[10px] tracking-widest"
                                        >
                                            {t.nav.logout}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                            <button className="w-full glass px-4 py-3 rounded-2xl font-bold uppercase text-[10px] tracking-widest">
                                                {t.nav.signIn}
                                            </button>
                                        </Link>
                                        <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                                            <button className="w-full glass-strong px-4 py-3 rounded-2xl font-bold uppercase text-[10px] tracking-widest border border-[var(--neon-blue)]/30">
                                                {t.auth.register}
                                            </button>
                                        </Link>
                                    </>
                                )}
                            </div>
                            <div className="pt-2">
                                <a href="#products" onClick={() => setMobileMenuOpen(false)}>
                                    <button className="w-full gradient-modern px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs neon-glow-blue">
                                        {t.nav.shopNow}
                                    </button>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
