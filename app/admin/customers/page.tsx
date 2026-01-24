'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface Customer {
    id: string;
    name: string;
    email: string;
    status: 'active' | 'disabled';
    orderCount: number;
    totalSpent: number;
    lastOrderDate: string;
}

interface Order {
    id: string;
    userId: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    paymentMethod: string;
    items: Array<{
        title: string;
        quantity: number;
        price: number;
    }>;
}

export default function AdminCustomers() {
    const { t } = useLanguage();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Customer>>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const query = `
                    query AdminCustomers {
                        allUsers {
                            id
                            username
                            fullName
                            email
                            isActive
                        }
                        allOrders {
                            id
                            userId
                            totalAmount
                            status
                            createdAt
                            items {
                                quantity
                                price
                                product {
                                    title
                                }
                            }
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
                    // Don't throw, try to use partial data
                }

                const users = result.data?.allUsers || [];
                const fetchedOrders = result.data?.allOrders || [];

                // Process customers
                const processedCustomers = users.map((user: any) => {
                    const userIdString = String(user.id);
                    const userOrders = fetchedOrders.filter((o: any) => String(o.userId) === userIdString);
                    const totalSpent = userOrders.reduce((sum: number, o: any) => sum + o.totalAmount, 0);
                    const lastOrder = userOrders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

                    return {
                        id: userIdString,
                        name: user.fullName || user.username,
                        email: user.email,
                        status: user.isActive ? 'active' : 'disabled',
                        orderCount: userOrders.length,
                        totalSpent,
                        lastOrderDate: lastOrder ? new Date(lastOrder.createdAt).toLocaleDateString() : 'Never',
                    };
                });

                // Process orders for details view
                const processedOrders = fetchedOrders.map((o: any) => ({
                    id: String(o.id),
                    userId: String(o.userId),
                    totalAmount: o.totalAmount,
                    status: (o.status || '').toLowerCase(),
                    createdAt: o.createdAt,
                    paymentMethod: 'Quantum Credit', // Mock
                    items: (o.items || []).map((i: any) => ({
                        title: i.product?.title || 'Unknown Item',
                        quantity: i.quantity,
                        price: i.price
                    }))
                }));

                setCustomers(processedCustomers);
                setOrders(processedOrders);

            } catch (err) {
                console.error("Failed to fetch customers:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const customerOrders = (customerId: string) => {
        return orders.filter(order => order.userId === customerId);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Optimistic update
        if (isEditing) {
            setCustomers(customers.map(c => c.id === isEditing ? { ...c, ...formData } : c));
            setIsEditing(null);
            setFormData({});
        }
        // TODO: Persist to backend via mutation
    };

    const startEdit = (customer: Customer) => {
        setIsEditing(customer.id);
        setFormData(customer);
    };

    const toggleCustomerStatus = (customerId: string) => {
        // Optimistic update
        setCustomers(customers.map(c => {
            if (c.id === customerId) {
                return { ...c, status: c.status === 'active' ? 'disabled' : 'active' };
            }
            return c;
        }));
        // TODO: Persist via mutation
    };

    if (loading) return <div className="p-10 text-center text-[var(--neon-blue)] font-mono animate-pulse">SCANNING BIOMETRICS...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold text-gradient uppercase tracking-tighter">Citizen Database</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-1">Manage grid residents and their transactions</p>
                </div>
                <div className="flex gap-4">
                    <div className="glass px-6 py-2 rounded-xl flex items-center gap-2">
                        <span className="text-green-400 font-bold">{customers.filter(c => c.status === 'active').length}</span>
                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Active</span>
                    </div>
                    <div className="glass px-6 py-2 rounded-xl flex items-center gap-2">
                        <span className="text-red-400 font-bold">{customers.filter(c => c.status === 'disabled').length}</span>
                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Disabled</span>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="glass-strong rounded-[3rem] p-10 max-w-lg w-full border border-white/10 shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold text-gradient uppercase mb-8">Edit Citizen Records</h2>
                            <form onSubmit={handleEditSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-4">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name || ''}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-6 py-4 rounded-2xl glass bg-white/5 border border-white/10 focus:border-[var(--neon-blue)] focus:outline-none font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-4">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email || ''}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-6 py-4 rounded-2xl glass bg-white/5 border border-white/10 focus:border-[var(--neon-blue)] focus:outline-none font-bold"
                                    />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(null)}
                                        className="flex-1 glass py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 gradient-cyber py-4 rounded-2xl font-black text-lg uppercase tracking-widest neon-glow-blue shadow-lg"
                                    >
                                        Sync
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Customers Table */}
            <div className="glass-strong rounded-[3rem] p-8 border border-white/5 shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left pb-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Citizen</th>
                                <th className="text-left pb-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Status</th>
                                <th className="text-left pb-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Grid Activity</th>
                                <th className="text-left pb-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Total Credit</th>
                                <th className="text-right pb-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {customers.map((customer) => (
                                <tr key={customer.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="py-6 px-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full gradient-cyber flex items-center justify-center text-xl shadow-lg ring-1 ring-white/10">
                                                {customer.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-white text-lg tracking-tight group-hover:text-[var(--neon-blue)] transition-colors">{customer.name}</p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{customer.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-4">
                                        <span className={cn(
                                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-inner",
                                            customer.status === 'active'
                                                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                                        )}>
                                            {customer.status}
                                        </span>
                                    </td>
                                    <td className="py-6 px-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-300">{customer.orderCount} Orders</span>
                                            <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Last: {customer.lastOrderDate}</span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-4">
                                        <span className="font-black text-gradient-yellow text-xl tracking-tighter">
                                            {t.common.currency} {customer.totalSpent.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="py-6 px-4 text-right">
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={() => setSelectedCustomer(selectedCustomer?.id === customer.id ? null : customer)}
                                                className={cn(
                                                    "w-10 h-10 rounded-xl glass flex items-center justify-center transition-all",
                                                    selectedCustomer?.id === customer.id ? "neon-glow-purple border-purple-500" : "hover:neon-glow-blue"
                                                )}
                                                title="View Orders"
                                            >
                                                👁️
                                            </button>
                                            <button
                                                onClick={() => startEdit(customer)}
                                                className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:neon-glow-blue transition-all"
                                                title="Edit Records"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => toggleCustomerStatus(customer.id)}
                                                className={cn(
                                                    "w-10 h-10 rounded-xl glass flex items-center justify-center transition-all",
                                                    customer.status === 'active' ? "hover:bg-red-500/20 hover:text-red-400" : "hover:bg-green-500/20 hover:text-green-400"
                                                )}
                                                title={customer.status === 'active' ? "Disable Access" : "Restore Access"}
                                            >
                                                {customer.status === 'active' ? '🚫' : '🛡️'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Panel */}
            <AnimatePresence mode="wait">
                {selectedCustomer && (
                    <motion.div
                        key={selectedCustomer.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass-strong rounded-[3rem] p-10 border border-white/10 shadow-2xl relative overflow-hidden"
                    >
                        {/* Background Glow */}
                        <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-[var(--neon-blue)] rounded-full blur-[120px] opacity-10" />

                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-2xl font-black text-gradient uppercase tracking-tighter">Transaction logs</h3>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">History for {selectedCustomer.name}</p>
                            </div>
                            <button
                                onClick={() => setSelectedCustomer(null)}
                                className="w-10 h-10 rounded-xl glass hover:bg-white/10 transition-all"
                            >✕</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {customerOrders(selectedCustomer.id).length > 0 ? (
                                customerOrders(selectedCustomer.id).map((order) => (
                                    <div key={order.id} className="glass p-6 rounded-[2rem] border border-white/5 hover:border-white/20 transition-all group overflow-hidden relative">
                                        <div className="absolute top-0 right-0 p-4">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                                                order.status === 'delivered' ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                                            )}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="mb-4">
                                            <p className="font-mono text-xs text-gradient mb-1">{order.id}</p>
                                            <p className="text-lg font-black">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                        <div className="space-y-3 mb-6">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center glass bg-white/5 p-3 rounded-xl border border-white/5">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-lg">👕</span>
                                                        <div>
                                                            <p className="text-xs font-bold">{item.title}</p>
                                                            <p className="text-[8px] text-gray-500 uppercase font-black">Quantity: {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm font-black text-gray-300">{t.common.currency} {item.price}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between items-end pt-4 border-t border-white/5">
                                            <div>
                                                <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest mb-1">Total Payload</p>
                                                <p className="text-2xl font-black text-gradient-yellow">{t.common.currency} {order.totalAmount.toLocaleString()}</p>
                                            </div>
                                            <p className="text-[8px] text-gray-500 font-bold italic">Authenticated via {order.paymentMethod.toUpperCase()}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 text-center py-20 italic opacity-20">
                                    No transaction records found in the grid for this citizen.
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
