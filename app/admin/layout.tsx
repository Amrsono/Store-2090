'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const navItems = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Orders', href: '/admin/orders', icon: '📦' },
    { name: 'Products', href: '/admin/products', icon: '🛍️' },
    { name: 'Customers', href: '/admin/customers', icon: '👥' },
];

import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        if (!user?.isAdmin) {
            router.push('/login');
        }
    }, [user, router]);

    if (!user?.isAdmin) return null;

    return (
        <div className="min-h-screen bg-[var(--obsidian)]">
            {/* Sidebar */}
            <motion.aside
                initial={{ x: -300 }}
                animate={{ x: sidebarOpen ? 0 : -250 }}
                className={cn(
                    'fixed left-0 top-0 h-full glass-strong border-r border-white/10 z-50 transition-all duration-300',
                    sidebarOpen ? 'w-64' : 'w-16'
                )}
            >
                {/* Logo */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg gradient-cyber flex items-center justify-center neon-glow-purple">
                            <span className="text-2xl font-bold">C</span>
                        </div>
                        {sidebarOpen && (
                            <div>
                                <h1 className="text-xl font-bold text-gradient">CYBER</h1>
                                <p className="text-xs text-gray-400">Admin Panel</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <motion.div
                                    whileHover={{ x: 5 }}
                                    className={cn(
                                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300',
                                        isActive
                                            ? 'glass neon-glow-blue'
                                            : 'hover:glass hover:neon-glow-purple'
                                    )}
                                >
                                    <span className="text-2xl">{item.icon}</span>
                                    {sidebarOpen && (
                                        <span className="font-medium">{item.name}</span>
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Toggle Button */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="absolute -right-3 top-20 w-6 h-6 rounded-full glass flex items-center justify-center hover:neon-glow-blue transition-all duration-300"
                >
                    <span className="text-xs">{sidebarOpen ? '←' : '→'}</span>
                </button>

                {/* User Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full gradient-cyber flex items-center justify-center">
                            <span className="text-sm font-bold">A</span>
                        </div>
                        {sidebarOpen && (
                            <div className="flex-1">
                                <p className="text-sm font-semibold">Admin</p>
                                <p className="text-xs text-gray-400">admin@cyber.com</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className={cn(
                'transition-all duration-300',
                sidebarOpen ? 'ml-64' : 'ml-16'
            )}>
                {/* Top Bar */}
                <header className="glass-strong border-b border-white/10 p-4 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gradient">
                            {navItems.find(item => item.href === pathname)?.name || 'Dashboard'}
                        </h2>
                        <div className="flex items-center gap-4">
                            <Link href="/">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="glass px-4 py-2 rounded-lg text-sm hover:neon-glow-blue transition-all duration-300"
                                >
                                    View Store
                                </motion.button>
                            </Link>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={logout}
                                className="gradient-cyber px-4 py-2 rounded-lg text-sm neon-glow-purple"
                            >
                                Logout
                            </motion.button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
