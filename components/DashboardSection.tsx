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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay }}
            className="glass-strong rounded-2xl p-6 hover-lift group cursor-pointer"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl gradient-cyber flex items-center justify-center neon-glow-blue group-hover:neon-glow-purple transition-all duration-300">
                    <span className="text-2xl">{icon}</span>
                </div>
                <div className={cn(
                    'flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold',
                    trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                )}>
                    <span>{trend === 'up' ? '↑' : '↓'}</span>
                    <span>{change}</span>
                </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-2">{title}</h3>
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

export default function DashboardSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

    const stats = [
        { title: 'Total Sales', value: '2.4M', change: '+12.5%', trend: 'up' as const, icon: '🛍️' },
        { title: 'Happy Customers', value: '48K', change: '+8.2%', trend: 'up' as const, icon: '👥' },
        { title: 'Items Sold', value: '3.2K', change: '+15.3%', trend: 'up' as const, icon: '📦' },
        { title: 'Avg. Rating', value: '4.9', change: '+0.2', trend: 'up' as const, icon: '⭐' },
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
        <section ref={sectionRef} id="dashboard" className="relative py-32 px-4 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--obsidian)] via-[var(--deep-space)] to-[var(--obsidian)]" />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    style={{ y }}
                    className="text-center mb-16"
                >
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-bold text-gradient mb-6"
                    >
                        Trending Now
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl text-gray-400 max-w-2xl mx-auto"
                    >
                        Real-time fashion trends and bestsellers
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
                    className="glass-strong rounded-2xl p-8"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-bold text-gradient mb-2">Sales Overview</h3>
                            <p className="text-gray-400">Monthly items sold</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="glass px-4 py-2 rounded-lg text-sm hover:neon-glow-blue transition-all duration-300">
                                Week
                            </button>
                            <button className="gradient-cyber px-4 py-2 rounded-lg text-sm neon-glow-blue">
                                Month
                            </button>
                            <button className="glass px-4 py-2 rounded-lg text-sm hover:neon-glow-blue transition-all duration-300">
                                Year
                            </button>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="flex items-end justify-between gap-4 h-80 px-4">
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="glass-strong rounded-2xl p-6"
                    >
                        <h3 className="text-xl font-bold text-gradient mb-6">Recent Orders</h3>
                        <div className="space-y-4">
                            {[
                                { action: 'New user registered', time: '2 min ago', icon: '👤' },
                                { action: 'Payment received', time: '15 min ago', icon: '💳' },
                                { action: 'Product purchased', time: '1 hour ago', icon: '🛍️' },
                                { action: 'Support ticket closed', time: '3 hours ago', icon: '✅' },
                            ].map((activity, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: false }}
                                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                                    className="flex items-center gap-4 p-3 rounded-lg glass hover:neon-glow-blue transition-all duration-300 cursor-pointer"
                                >
                                    <div className="w-10 h-10 rounded-lg gradient-cyber flex items-center justify-center">
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
                        className="glass-strong rounded-2xl p-6"
                    >
                        <h3 className="text-xl font-bold text-gradient mb-6">Bestsellers</h3>
                        <div className="space-y-4">
                            {[
                                { name: 'Quantum Analytics Pro', sales: '1,234', revenue: '$369K', progress: 85 },
                                { name: 'Neural CRM Suite', sales: '892', revenue: '$178K', progress: 65 },
                                { name: 'Cyber Security Shield', sales: '756', revenue: '$302K', progress: 55 },
                                { name: 'AI Content Generator', sales: '543', revenue: '$54K', progress: 40 },
                            ].map((product, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: false }}
                                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                                    className="space-y-2"
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold">{product.name}</p>
                                        <p className="text-xs text-gradient-yellow">{product.revenue}</p>
                                    </div>
                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
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
        </section>
    );
}
