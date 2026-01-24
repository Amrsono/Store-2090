'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface OrderItem {
    id: number;
    product: {
        title: string;
        imageUrl: string;
        price: number;
    };
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
}

export default function MyOrdersPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const query = `
                    query MyOrders($userId: Int!) {
                        myOrders(userId: $userId) {
                            id
                            totalAmount
                            status
                            paymentMethod
                            createdAt
                            items {
                                id
                                quantity
                                price
                                product {
                                    title
                                    imageUrl
                                    price
                                }
                            }
                        }
                    }
                `;

                const url = process.env.NEXT_PUBLIC_GRAPHQL_URL || '/api/graphql';
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query,
                        variables: { userId: parseInt(user.id) }
                    }),
                });

                const result = await response.json();

                if (result.errors) {
                    console.error("GraphQL Errors:", result.errors);
                    // Handle partial data if available
                }

                // Safety check: ensure myOrders exists and is an array
                const fetchedOrders = Array.isArray(result.data?.myOrders) ? result.data.myOrders : [];
                setOrders(fetchedOrders);
            } catch (err: any) {
                console.error("Order fetch error:", err);
                setError(err.message || 'Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, router]);

    if (loading) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center bg-[#0a0a0a]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-[var(--neon-blue)] border-t-transparent rounded-full animate-spin neon-glow-blue"></div>
                    <p className="text-[var(--neon-blue)] font-mono animate-pulse">LOADING ORDER HISTORY...</p>
                </div>
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]">
            {/* Animated Top Line Style */}
            <div className="fixed top-20 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--neon-blue)] to-transparent opacity-50 z-40">
                <motion.div
                    className="absolute top-0 left-0 h-full w-full bg-[var(--neon-blue)] blur-[2px]"
                    animate={{ x: [-1000, 1000] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                />
            </div>

            <div className="max-w-4xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#fff] to-[var(--neon-blue)] font-display"
                >
                    MY ORDERS
                </motion.h1>

                {error && (
                    <div className="p-4 rounded-xl glass-strong border border-red-500/30 text-red-400 mb-8">
                        {error}
                    </div>
                )}

                {!loading && orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 glass rounded-3xl border border-white/5"
                    >
                        <div className="text-6xl mb-6">🛍️</div>
                        <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
                        <p className="text-gray-400 mb-8">Looks like you haven't upgraded your style to 2070 yet.</p>
                        <Link href="/#products">
                            <button className="gradient-cyber px-8 py-3 rounded-full font-bold uppercase tracking-wider hover:neon-glow-blue transition-all">
                                Start Shopping
                            </button>
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-6"
                    >
                        {orders.map((order) => (
                            <motion.div
                                key={order.id}
                                variants={itemVariants}
                                className="glass rounded-2xl p-6 border border-white/5 hover:border-[var(--neon-blue)]/50 transition-all duration-300 relative overflow-hidden group"
                            >
                                {/* Hover Effect Background */}
                                <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon-blue)]/0 via-[var(--neon-blue)]/5 to-[var(--neon-blue)]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 pb-4 border-b border-white/10 relative z-10">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-xs font-mono text-gray-400">ORDER NO.</span>
                                            <span className="text-xl font-bold font-mono text-[var(--neon-blue)]">#{order.id.toString().padStart(6, '0')}</span>
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            Placing Date: {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="mt-4 md:mt-0 flex items-center gap-4">
                                        <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${order.status === 'delivered' ? 'border-green-500/30 bg-green-500/10 text-green-400' :
                                            order.status === 'processing' ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' :
                                                'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
                                            }`}>
                                            {order.status}
                                        </div>
                                        <div className="text-2xl font-bold text-white">
                                            ${order.totalAmount.toFixed(2)}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 relative z-10">
                                    {(order.items || []).map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 py-2">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                                                {item.product?.imageUrl ? (
                                                    <img src={item.product.imageUrl} alt={item.product.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">NO IMG</div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold truncate pr-4">{item.product?.title || 'Unknown Product'}</h3>
                                                <p className="text-sm text-gray-400">Qty: {item.quantity} x ${item.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Tracking Bar */}
                                <div className="mt-6 pt-4 relative z-10">
                                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: order.status === 'delivered' ? '100%' : order.status === 'shipped' ? '75%' : order.status === 'processing' ? '50%' : '25%' }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className={`h-full ${order.status === 'delivered' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' :
                                                'bg-[var(--neon-blue)] shadow-[0_0_10px_var(--neon-blue)]'
                                                }`}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest mt-2 text-gray-500">
                                        <span className={order.status !== 'pending' ? 'text-[var(--neon-blue)]' : ''}>Ordered</span>
                                        <span className={['processing', 'shipped', 'delivered'].includes(order.status) ? 'text-[var(--neon-blue)]' : ''}>Processing</span>
                                        <span className={['shipped', 'delivered'].includes(order.status) ? 'text-[var(--neon-blue)]' : ''}>Shipped</span>
                                        <span className={order.status === 'delivered' ? 'text-green-500' : ''}>Delivered</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
