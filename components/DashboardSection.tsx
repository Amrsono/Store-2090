'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: string;
    delay: number;
}

function StatCard({ title, value, change, trend, icon, delay }: StatCardProps) {
    const [count, setCount] = useState(0);
    const targetValue = parseInt(value.replace(/[^0-9]/g, ''));

    useEffect(() => {
        let start = 0;
        const duration = 2000;
        const increment = targetValue / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= targetValue) {
                setCount(targetValue);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [targetValue]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay }}
            className="glass shadow-xl rounded-[2.5rem] p-8 hover-lift group cursor-pointer border border-white/5"
        >
            <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl gradient-cyber flex items-center justify-center shadow-lg group-hover:neon-glow-purple transition-all duration-300">
                    <span className="text-3xl">{icon}</span>
                </div>
                <div className={cn(
                    'flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-bold shadow-inner',
                    trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                )}>
                    <span>{trend === 'up' ? '↑' : '↓'}</span>
                    <span>{change}</span>
                </div>
            </div>
            <h3 className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-3">{title}</h3>
            <p className="text-4xl font-bold text-gradient">
                {value.includes('K') || value.includes('M') ? count + value.slice(-1) : count}
            </p>
        </motion.div>
    );
}

function ChartBar({ height, delay, label, value }: { height: number; delay: number; label: string; value: string }) {
    return (
        <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, delay }}
            className="flex flex-col items-center gap-2 origin-bottom"
        >
            <div className="relative w-full group cursor-pointer">
                <motion.div
                    whileHover={{ scaleY: 1.1 }}
                    style={{ height: `${height}px` }}
                    className="w-full rounded-t-lg gradient-cyber neon-glow-blue group-hover:neon-glow-purple transition-all duration-300"
                />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="glass px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap">
                        {value}
                    </div>
                </div>
            </div>
            <span className="text-xs text-gray-400">{label}</span>
        </motion.div>
    );
}

import { useLanguage } from '@/contexts/LanguageContext';

export default function DashboardSection() {
    const { t } = useLanguage();

    const stats = [
        { title: t.trending.totalSales, value: '2.4M', change: '+12.5%', trend: 'up' as const, icon: '🛍️' },
        { title: t.trending.happyCustomers, value: '48K', change: '+8.2%', trend: 'up' as const, icon: '👥' },
        { title: t.trending.itemsSold, value: '3.2K', change: '+15.3%', trend: 'up' as const, icon: '📦' },
        { title: t.trending.avgRating, value: '4.9', change: '+0.2', trend: 'up' as const, icon: '⭐' },
    ];

    const chartData = [
        { label: 'Jan', value: '1.2K', height: 120 },
        { label: 'Feb', value: '1.8K', height: 180 },
        { label: 'Mar', value: '1.5K', height: 150 },
        { label: 'Apr', value: '2.2K', height: 220 },
        { label: 'May', value: '2.8K', height: 280 },
        { label: 'Jun', value: '2.4K', height: 240 },
    ];

    return (
        <div id="dashboard" className="relative">
            <div className="relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <motion.h2
                        className="text-4xl md:text-7xl font-bold text-gradient mb-6"
                    >
                        {t.trending.title}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
                    >
                        {t.trending.subtitle}
                    </motion.p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, index) => (
                        <StatCard key={stat.title} {...stat} delay={index * 0.1} />
                    ))}
                </div>

                {/* Chart Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="glass rounded-[3rem] p-8 border border-white/5"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                        <div>
                            <h3 className="text-2xl font-bold text-gradient mb-2">{t.trending.salesOverview}</h3>
                            <p className="text-gray-400">{t.trending.monthlyItemsSold}</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="glass px-4 py-2 rounded-xl text-sm hover:neon-glow-blue transition-all duration-300">
                                {t.trending.week}
                            </button>
                            <button className="gradient-cyber px-4 py-2 rounded-xl text-sm neon-glow-blue">
                                {t.trending.month}
                            </button>
                            <button className="glass px-4 py-2 rounded-xl text-sm hover:neon-glow-blue transition-all duration-300">
                                {t.trending.year}
                            </button>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="flex items-end justify-between gap-4 h-64 md:h-80 px-4">
                        {chartData.map((data, index) => (
                            <ChartBar
                                key={data.label}
                                {...data}
                                delay={0.6 + index * 0.1}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Activity Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="glass-strong rounded-[2.5rem] p-8 border border-white/5"
                    >
                        <h3 className="text-xl font-bold text-gradient mb-6">{t.trending.recentOrders}</h3>
                        <div className="space-y-4">
                            {[
                                { action: 'New order placed', time: '2 min ago', icon: '👤' },
                                { action: 'Payment received', time: '15 min ago', icon: '💳' },
                                { action: 'Product purchased', time: '1 hour ago', icon: '🛍️' },
                                { action: 'Item shipped', time: '3 hours ago', icon: '✅' },
                            ].map((activity, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: false }}
                                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                                    className="flex items-center gap-4 p-4 rounded-2xl glass hover:neon-glow-blue transition-all duration-300 cursor-pointer border border-white/5"
                                >
                                    <div className="w-12 h-12 rounded-xl gradient-cyber flex items-center justify-center">
                                        <span className="text-xl">{activity.icon}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold">{activity.action}</p>
                                        <p className="text-xs text-gray-400">{activity.time}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="glass-strong rounded-[2.5rem] p-8 border border-white/5"
                    >
                        <h3 className="text-xl font-bold text-gradient mb-6">{t.trending.bestsellers}</h3>
                        <div className="space-y-6">
                            {[
                                { name: 'Neon Streetwear Jacket', sales: '1,234', revenue: '615K', progress: 85 },
                                { name: 'Cyber Running Shoes', sales: '892', revenue: '311K', progress: 65 },
                                { name: 'Quantum Tech Backpack', sales: '756', revenue: '452K', progress: 55 },
                                { name: 'Holographic Sneakers', sales: '543', revenue: '151K', progress: 40 },
                            ].map((product, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: false }}
                                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                                    className="space-y-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold">{product.name}</p>
                                        <p className="text-xs text-gradient-yellow">{t.common.currency} {product.revenue}</p>
                                    </div>
                                    <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${product.progress}%` }}
                                            viewport={{ once: false }}
                                            transition={{ duration: 1, delay: 1 + index * 0.1 }}
                                            className="h-full gradient-cyber"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400">{product.sales} sales</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
