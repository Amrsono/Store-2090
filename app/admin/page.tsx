'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

type TimeRange = 'daily' | 'weekly' | 'monthly';

interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    pendingOrders: number;
    deliveredOrders: number;
    processingOrders: number;
    shippedOrders: number;
    cancelledOrders: number;
}

interface Order {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    user: {
        id: string;
        username: string;
        email: string;
    } | null;
}

export default function AdminDashboard() {
    const [timeRange, setTimeRange] = useState<TimeRange>('daily');
    const [stats, setStats] = useState<DashboardStats>({
        totalRevenue: 0,
        totalOrders: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        processingOrders: 0,
        shippedOrders: 0,
        cancelledOrders: 0
    });
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const query = `
                    query AdminData {
                        allOrders {
                            id
                            userId
                            totalAmount
                            status
                            createdAt
                        }
                        allUsers {
                            id
                            username
                            email
                        }
                    }
                `;

                const url = process.env.NEXT_PUBLIC_GRAPHQL_URL || '/api/graphql';
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query }),
                });

                const result = await response.json();
                if (result.errors) throw new Error(result.errors[0].message);

                const orders = result.data.allOrders;
                const users = result.data.allUsers;

                // Process Stats
                const newStats = orders.reduce((acc: DashboardStats, order: any) => {
                    acc.totalOrders++;
                    acc.totalRevenue += order.totalAmount;

                    const status = order.status.toLowerCase();
                    if (status === 'pending') acc.pendingOrders++;
                    else if (status === 'delivered') acc.deliveredOrders++;
                    else if (status === 'processing') acc.processingOrders++;
                    else if (status === 'shipped') acc.shippedOrders++;
                    else if (status === 'cancelled') acc.cancelledOrders++;

                    return acc;
                }, {
                    totalRevenue: 0,
                    totalOrders: 0,
                    pendingOrders: 0,
                    deliveredOrders: 0,
                    processingOrders: 0,
                    shippedOrders: 0,
                    cancelledOrders: 0,
                });

                setStats(newStats);

                // Process Recent Orders with User Info
                const ordersWithUsers = orders.slice(0, 10).map((order: any) => {
                    const user = users.find((u: any) => u.id === order.userId.toString()) || null;
                    return {
                        ...order,
                        user
                    };
                });
                setRecentOrders(ordersWithUsers);

            } catch (error) {
                console.error("Failed to fetch admin data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const statCards = [
        {
            title: 'Total Revenue',
            value: `$${stats.totalRevenue.toLocaleString()}`,
            change: '+12.5%',
            trend: 'up' as const,
            icon: '💰',
            gradient: 'from-[#00d4ff] to-[#00fff5]',
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders.toString(),
            change: '+8.2%',
            trend: 'up' as const,
            icon: '📦',
            gradient: 'from-[#b300ff] to-[#ff00ff]',
        },
        {
            title: 'Pending Orders',
            value: stats.pendingOrders.toString(),
            change: '+3',
            trend: 'up' as const,
            icon: '⏳',
            gradient: 'from-[#ffeb3b] to-[#00ff88]',
        },
        {
            title: 'Delivered',
            value: stats.deliveredOrders.toString(),
            change: '+15.3%',
            trend: 'up' as const,
            icon: '✅',
            gradient: 'from-[#00ff88] to-[#00d4ff]',
        },
    ];

    if (loading) {
        return <div className="p-10 text-center text-[var(--neon-blue)] font-mono animate-pulse">SYNCING WITH THE GRID...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Time Range Selector */}
            <div className="flex gap-2">
                {(['daily', 'weekly', 'monthly'] as TimeRange[]).map((range) => (
                    <motion.button
                        key={range}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setTimeRange(range)}
                        className={cn(
                            'px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-300',
                            timeRange === range
                                ? 'gradient-cyber neon-glow-blue'
                                : 'glass hover:neon-glow-purple'
                        )}
                    >
                        {range.charAt(0).toUpperCase() + range.slice(1)} Analytics
                    </motion.button>
                ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="glass-strong rounded-2xl p-6 hover-lift group cursor-pointer"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={cn(
                                'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center neon-glow-blue group-hover:neon-glow-purple transition-all duration-300',
                                stat.gradient
                            )}>
                                <span className="text-2xl">{stat.icon}</span>
                            </div>
                            <div className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                                <span>↑</span>
                                <span>{stat.change}</span>
                            </div>
                        </div>
                        <h3 className="text-gray-400 text-sm mb-2">{stat.title}</h3>
                        <p className="text-4xl font-bold text-gradient">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="glass-strong rounded-2xl p-6"
                >
                    <h3 className="text-xl font-bold text-gradient mb-4">Revenue Overview</h3>
                    <p className="text-gray-400 mb-6">
                        {timeRange === 'daily' && 'Last 7 days'}
                        {timeRange === 'weekly' && 'Last 4 weeks'}
                        {timeRange === 'monthly' && 'Last 6 months'}
                    </p>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {[120, 180, 150, 220, 280, 240, 300].map((height, i) => (
                            <motion.div
                                key={i}
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="flex-1 rounded-t-lg gradient-cyber origin-bottom relative group cursor-pointer"
                                style={{ height: `${height}px` }}
                            >
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="glass px-2 py-1 rounded text-xs whitespace-nowrap">
                                        ${height * 10}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Order Status Distribution */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="glass-strong rounded-2xl p-6"
                >
                    <h3 className="text-xl font-bold text-gradient mb-4">Order Status</h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Pending', value: stats.pendingOrders, color: 'from-[#ffeb3b] to-[#ff00ff]', percent: (stats.pendingOrders / stats.totalOrders) * 100 || 0 },
                            { label: 'Processing', value: stats.processingOrders, color: 'from-[#00d4ff] to-[#b300ff]', percent: (stats.processingOrders / stats.totalOrders) * 100 || 0 },
                            { label: 'Shipped', value: stats.shippedOrders, color: 'from-[#b300ff] to-[#ff00ff]', percent: (stats.shippedOrders / stats.totalOrders) * 100 || 0 },
                            { label: 'Delivered', value: stats.deliveredOrders, color: 'from-[#00ff88] to-[#00d4ff]', percent: (stats.deliveredOrders / stats.totalOrders) * 100 || 0 },
                            { label: 'Cancelled', value: stats.cancelledOrders, color: 'from-[#ff00ff] to-[#ff0000]', percent: (stats.cancelledOrders / stats.totalOrders) * 100 || 0 },
                        ].map((item, i) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">{item.label}</span>
                                    <span className="text-sm text-gray-400">{item.value} orders</span>
                                </div>
                                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.percent}%` }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                        className={cn('h-full bg-gradient-to-r', item.color)}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Recent Orders */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="glass-strong rounded-2xl p-6"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gradient">Recent Orders</h3>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push('/admin/orders')}
                        className="text-xs font-bold uppercase tracking-widest text-[var(--neon-blue)] hover:text-white transition-colors"
                    >
                        View All
                    </motion.button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Order ID</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Customer</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Amount</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order, i) => (
                                <motion.tr
                                    key={order.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="border-b border-white/5 hover:glass transition-all duration-300 cursor-pointer"
                                >
                                    <td className="py-4 px-4">
                                        <span className="font-mono text-sm text-gradient">{order.id}</span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div>
                                            <p className="font-medium">{order.user?.username || 'Unknown'}</p>
                                            <p className="text-xs text-gray-400">{order.user?.email || 'No Email'}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="font-bold text-gradient-yellow">${order.totalAmount}</span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={cn(
                                            'px-3 py-1 rounded-full text-xs font-semibold',
                                            order.status === 'pending' && 'bg-yellow-500/20 text-yellow-400',
                                            order.status === 'processing' && 'bg-blue-500/20 text-blue-400',
                                            order.status === 'shipped' && 'bg-purple-500/20 text-purple-400',
                                            order.status === 'delivered' && 'bg-green-500/20 text-green-400',
                                            order.status === 'cancelled' && 'bg-red-500/20 text-red-400'
                                        )}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-sm text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
