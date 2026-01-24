'use client';

import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { mockOrders } from '@/lib/mockData';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MyOrdersPage() {
    const { t } = useLanguage();
    const { user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    if (!user) return null;

    const userOrders = mockOrders.filter(order => order.customerEmail === user.email);

    return (
        <div className="min-h-screen bg-[var(--obsidian)] py-32 px-6 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-[var(--neon-blue)] rounded-full blur-[180px]" />
                <div className="absolute bottom-[-5%] left-[-10%] w-[35vw] h-[35vw] bg-[var(--quantum-purple)] rounded-full blur-[160px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 text-center lg:text-left"
                >
                    <h1 className="text-6xl md:text-8xl font-black text-gradient mb-4 tracking-tighter uppercase">{t.nav.myOrders}</h1>
                    <p className="text-xl text-gray-400 font-bold uppercase tracking-[0.2em]">{user.email}</p>
                </motion.div>

                <div className="grid grid-cols-1 gap-8">
                    {userOrders.length > 0 ? (
                        userOrders.map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-strong rounded-[3rem] p-8 md:p-12 border border-white/5 shadow-2xl relative group overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-8">
                                    <span className={cn(
                                        "px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg",
                                        order.status === 'delivered' ? "bg-green-500/20 text-green-400 border border-green-500/30" :
                                            order.status === 'cancelled' ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                                                "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                    )}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="flex flex-col lg:flex-row gap-12">
                                    <div className="flex-1">
                                        <div className="mb-8">
                                            <p className="font-mono text-sm text-[var(--neon-blue)] mb-2 uppercase tracking-widest">{order.id}</p>
                                            <h2 className="text-3xl font-black text-white mb-2">
                                                {new Date(order.createdAt).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </h2>
                                            <p className="text-gray-500 font-bold text-xs uppercase tracking-[0.3em]">
                                                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between glass bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:bg-white/[0.08] transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl gradient-cyber flex items-center justify-center text-2xl shadow-lg ring-1 ring-white/10">
                                                            {item.title.includes('Shoes') ? '👟' :
                                                                item.title.includes('Bag') ? '🎒' : '👕'}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-white">{item.title}</p>
                                                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Qty: {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                    <span className="font-black text-gray-300">{t.common.currency} {item.price.toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="lg:w-80 flex flex-col justify-between pt-12 lg:pt-0 lg:border-l lg:border-white/5 lg:pl-12">
                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Shipping Terminal</p>
                                                <p className="text-sm font-bold text-gray-300 leading-relaxed italic opacity-80">{order.shippingAddress}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Payment Grid</p>
                                                <p className="text-sm font-black text-[var(--neon-blue)] uppercase tracking-widest">{order.paymentMethod}</p>
                                            </div>
                                        </div>

                                        <div className="mt-12 pt-8 border-t border-white/5">
                                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Total Payload</p>
                                            <p className="text-4xl font-black text-gradient-yellow tracking-tighter">
                                                {t.common.currency} {order.totalAmount.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-strong rounded-[4rem] p-20 text-center border border-white/10 shadow-2xl"
                        >
                            <div className="w-24 h-24 mx-auto mb-8 rounded-2xl gradient-cyber flex items-center justify-center neon-glow-purple shadow-lg">
                                <span className="text-5xl">📦</span>
                            </div>
                            <h2 className="text-4xl font-black text-gradient mb-4 uppercase">No history found</h2>
                            <p className="text-gray-400 mb-12 text-lg font-bold">Your transaction records haven't been synchronized with the grid yet.</p>
                            <button
                                onClick={() => router.push('/#products')}
                                className="gradient-cyber px-12 py-5 rounded-full font-black text-xl neon-glow-blue hover:neon-glow-purple transition-all duration-300 shadow-2xl uppercase tracking-tighter"
                            >
                                Start Shopping
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
