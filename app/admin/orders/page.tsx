'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Define types locally to ensure they match our GraphQL response
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
    id: string;
    product: {
        title: string;
        price: number;
    };
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    userId: string;
    totalAmount: number;
    status: OrderStatus;
    shippingAddress: string;
    createdAt: string;
    updatedAt: string;
    items: OrderItem[];
    // Enriched fields
    customerName: string;
    customerEmail: string;
    paymentMethod: string; // We might need to mock this if not in DB, assuming 'credit_card' or derived
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const query = `
                    query AdminOrders {
                        allOrders {
                            id
                            userId
                            totalAmount
                            status
                            shippingAddress
                            createdAt
                            items {
                                id
                                quantity
                                price
                                product {
                                    title
                                    price
                                }
                            }
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
                if (result.errors) {
                    console.error("GraphQL Errors:", result.errors);
                    // Don't throw immediately, try to use partial data if any
                }

                const rawOrders = result.data?.allOrders || [];
                const users = result.data?.allUsers || [];

                // Enrich orders with user data
                const enrichedOrders = rawOrders.map((order: any) => {
                    // Safe ID conversion
                    const userIdString = order.userId !== undefined && order.userId !== null ? String(order.userId) : '';
                    const user = users.find((u: any) => String(u.id) === userIdString);

                    return {
                        ...order,
                        updatedAt: order.createdAt, // Fallback
                        customerName: user?.username || 'Unknown Guest',
                        customerEmail: user?.email || 'No Email',
                        paymentMethod: 'Quantum Credit', // Mock for display
                        items: (order.items || []).map((item: any) => ({
                            ...item,
                            product: item.product || { title: 'Unknown Product', price: 0 }
                        }))
                    };
                });

                setOrders(enrichedOrders);
            } catch (err) {
                console.error("Failed to fetch orders:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
        // Optimistic update
        const updatedOrders = orders.map(order =>
            order.id === orderId
                ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
                : order
        );
        setOrders(updatedOrders);

        if (selectedOrder?.id === orderId) {
            setSelectedOrder({ ...selectedOrder, status: newStatus, updatedAt: new Date().toISOString() });
        }

        // TODO: Implement mutation to update status on backend
        // For now, it just updates locally to show UI works
    };

    const statusOptions: { value: OrderStatus | 'all'; label: string; color: string }[] = [
        { value: 'all', label: 'All Orders', color: 'from-[#00d4ff] to-[#b300ff]' },
        { value: 'pending', label: 'Pending', color: 'from-[#ffeb3b] to-[#ff00ff]' },
        { value: 'processing', label: 'Processing', color: 'from-[#00d4ff] to-[#b300ff]' },
        { value: 'shipped', label: 'Shipped', color: 'from-[#b300ff] to-[#ff00ff]' },
        { value: 'delivered', label: 'Delivered', color: 'from-[#00ff88] to-[#00d4ff]' },
        { value: 'cancelled', label: 'Cancelled', color: 'from-[#ff00ff] to-[#ff0000]' },
    ];

    if (loading) return <div className="p-10 text-center text-[var(--neon-blue)] font-mono animate-pulse">DECRYPTING ORDER DATA...</div>;

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search by Order ID, Customer Name, or Email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg glass text-sm focus:outline-none focus:ring-2 focus:ring-[var(--neon-blue)]"
                    />
                </div>

                {/* Status Filter */}
                <div className="flex gap-2 overflow-x-auto">
                    {statusOptions.map((status) => (
                        <motion.button
                            key={status.value}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFilterStatus(status.value)}
                            className={cn(
                                'px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-300',
                                filterStatus === status.value
                                    ? `bg-gradient-to-r ${status.color} neon-glow-blue`
                                    : 'glass hover:neon-glow-purple'
                            )}
                        >
                            {status.label}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            <div className="glass-strong rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Order ID</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Customer</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Items</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Amount</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Payment</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Status</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Date</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order, i) => (
                                <motion.tr
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="border-b border-white/5 hover:glass transition-all duration-300"
                                >
                                    <td className="py-4 px-6">
                                        <span className="font-mono text-sm text-gradient font-bold">{order.id}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div>
                                            <p className="font-medium">{order.customerName}</p>
                                            <p className="text-xs text-gray-400">{order.customerEmail}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-sm">{order.items.length} items</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="font-bold text-gradient-yellow">${order.totalAmount}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-sm capitalize">{order.paymentMethod}</span>
                                    </td>
                                    <td className="py-4 px-6">
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
                                    <td className="py-4 px-6">
                                        <span className="text-sm text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setSelectedOrder(order)}
                                            className="glass px-4 py-2 rounded-lg text-sm hover:neon-glow-blue transition-all duration-300"
                                        >
                                            View Details
                                        </motion.button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredOrders.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-400">No orders found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Order Details Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedOrder(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass-strong rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gradient">Order Details</h2>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:neon-glow-red transition-all duration-300"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Order Info */}
                            <div className="space-y-6">
                                {/* Order ID & Status */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-400">Order ID</p>
                                        <p className="font-mono text-xl font-bold text-gradient">{selectedOrder.id}</p>
                                    </div>
                                    <div>
                                        <select
                                            value={selectedOrder.status}
                                            onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value as OrderStatus)}
                                            className="glass px-4 py-2 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--neon-blue)]"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Customer Details */}
                                <div className="glass rounded-xl p-4">
                                    <h3 className="text-lg font-bold text-gradient mb-3">Customer Details</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-sm text-gray-400">Name</p>
                                            <p className="font-medium">{selectedOrder.customerName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Email</p>
                                            <p className="font-medium">{selectedOrder.customerEmail}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Shipping Address</p>
                                            <p className="font-medium">{selectedOrder.shippingAddress}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="glass rounded-xl p-4">
                                    <h3 className="text-lg font-bold text-gradient mb-3">Order Items</h3>
                                    <div className="space-y-3">
                                        {selectedOrder.items.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                                <div className="flex-1">
                                                    <p className="font-medium">{item.product?.title || 'Unknown Product'}</p>
                                                    <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                                                </div>
                                                <p className="font-bold text-gradient-yellow">${item.price * item.quantity}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Payment & Total */}
                                <div className="glass rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-gray-400">Payment Method</span>
                                        <span className="font-medium capitalize">{selectedOrder.paymentMethod}</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                                        <span className="text-lg font-bold">Total Amount</span>
                                        <span className="text-2xl font-bold text-gradient-yellow">${selectedOrder.totalAmount}</span>
                                    </div>
                                </div>

                                {/* Dates */}
                                <div className="flex gap-4 text-sm text-gray-400">
                                    <div>
                                        <span>Created: </span>
                                        <span>{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                                    </div>
                                    <div>
                                        <span>Updated: </span>
                                        <span>{new Date(selectedOrder.updatedAt).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
