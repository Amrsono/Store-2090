'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CartPage() {
    const { t } = useLanguage();
    const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[var(--obsidian)] flex items-center justify-center px-4 relative overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[var(--neon-blue)] rounded-full blur-[150px] opacity-10" />
                <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[var(--quantum-purple)] rounded-full blur-[150px] opacity-10" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass shadow-2xl rounded-[4rem] p-16 text-center max-w-lg w-full floating-island border border-white/10"
                >
                    <div className="w-24 h-24 mx-auto mb-8 rounded-2xl gradient-cyber flex items-center justify-center neon-glow-purple shadow-lg">
                        <span className="text-5xl">🛒</span>
                    </div>
                    <h1 className="text-4xl font-bold text-gradient mb-4">{t.cart.empty}</h1>
                    <p className="text-gray-400 mb-10 text-lg">Your future style awaits. Add items to see them here.</p>
                    <Link href="/">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="gradient-cyber px-10 py-4 rounded-full font-bold text-lg neon-glow-blue hover:neon-glow-purple transition-all duration-300 shadow-xl"
                        >
                            {t.cart.continueShopping}
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--obsidian)] py-32 px-6 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-[var(--neon-blue)] rounded-full blur-[180px]" />
                <div className="absolute bottom-[-5%] left-[-10%] w-[35vw] h-[35vw] bg-[var(--quantum-purple)] rounded-full blur-[160px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 text-center lg:text-left"
                >
                    <h1 className="text-6xl md:text-8xl font-black text-gradient mb-4 tracking-tighter uppercase">{t.cart.title}</h1>
                    <div className="inline-flex items-center gap-3 glass px-6 py-2 rounded-full border border-white/10">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <p className="text-lg font-bold text-gray-300 uppercase tracking-widest">{getTotalItems()} {t.trending.itemsSold}</p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-white">
                    {/* Cart Items List */}
                    <div className="lg:col-span-8 space-y-8">
                        {items.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-strong rounded-[3rem] p-4 border border-white/5 shadow-2xl relative group overflow-hidden"
                            >
                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    {/* Product Image */}
                                    <div className="w-full md:w-48 h-48 rounded-[2rem] gradient-cyber flex items-center justify-center neon-glow-blue flex-shrink-0 shadow-lg relative overflow-hidden transition-transform duration-500 group-hover:scale-105">
                                        <span className="text-6xl">👕</span>
                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1 flex flex-col justify-between py-2 w-full">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <span className="text-xs font-bold text-gradient uppercase tracking-widest mb-2 block">{item.category}</span>
                                                <h3 className="text-2xl md:text-3xl font-bold mb-1 group-hover:text-[var(--neon-blue)] transition-colors tracking-tight">{item.title}</h3>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="w-12 h-12 rounded-2xl glass flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 shadow-lg border border-white/5"
                                            >
                                                <span className="text-xl font-light">✕</span>
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-white/5">
                                            {/* Quantity Selection */}
                                            <div className="flex items-center gap-4 glass bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center transition-colors text-2xl font-bold"
                                                >
                                                    −
                                                </button>
                                                <span className="text-xl font-black min-w-[30px] text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center transition-colors text-2xl font-bold"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Final Price for this item */}
                                            <div className="text-right">
                                                <p className="text-3xl font-black text-gradient-yellow tracking-tight">
                                                    {t.common.currency} {item.price * item.quantity}
                                                </p>
                                                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">
                                                    {t.common.currency} {item.price} PER UNIT
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-4 sticky top-32">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass shadow-2xl rounded-[3.5rem] p-10 border border-white/10 floating-island m-0 overflow-hidden relative"
                        >
                            {/* Inner Glow */}
                            <div className="absolute top-[-100px] left-[-100px] w-48 h-48 bg-[var(--neon-blue)] rounded-full blur-[80px] opacity-10" />

                            <h2 className="text-3xl font-black text-gradient mb-8 uppercase tracking-tighter">{t.checkout.orderSummary}</h2>

                            <div className="space-y-6 mb-10">
                                <div className="flex items-center justify-between text-lg">
                                    <span className="text-gray-400 font-medium uppercase tracking-wider">{t.cart.subtotal}</span>
                                    <span className="font-black">{t.common.currency} {getTotalPrice()}</span>
                                </div>
                                <div className="flex items-center justify-between text-lg">
                                    <span className="text-gray-400 font-medium uppercase tracking-wider">{t.cart.shipping}</span>
                                    <span className="font-black text-green-400 uppercase tracking-widest">{t.common.free}</span>
                                </div>
                                <div className="h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-8" />
                                <div className="flex items-center justify-between">
                                    <span className="text-xl font-bold uppercase tracking-tighter">Total Amount</span>
                                    <span className="text-4xl font-black text-gradient-yellow shadow-sm tracking-tight">{t.common.currency} {getTotalPrice()}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Link href="/checkout">
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="w-full gradient-cyber py-6 rounded-[2rem] font-black text-xl neon-glow-blue hover:neon-glow-purple transition-all duration-300 shadow-2xl uppercase tracking-tighter"
                                    >
                                        {t.cart.checkout}
                                    </motion.button>
                                </Link>

                                <Link href="/login">
                                    <p className="text-center text-xs text-gray-500 hover:text-[var(--neon-blue)] cursor-pointer transition-colors mt-4 font-bold uppercase tracking-widest">
                                        Have an account? {t.auth.signIn} for loyalty points
                                    </p>
                                </Link>
                            </div>

                            {/* Decorative Grid Line */}
                            <div className="mt-12 pt-8 border-t border-white/5 space-y-4">
                                <div className="flex items-center gap-4 text-xs font-bold text-gray-500 group cursor-default">
                                    <div className="w-8 h-8 rounded-lg glass flex items-center justify-center group-hover:neon-glow-blue">🔒</div>
                                    <span className="uppercase tracking-widest">Quantum-Encrypted Secure Checkout</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-bold text-gray-500 group cursor-default">
                                    <div className="w-8 h-8 rounded-lg glass flex items-center justify-center group-hover:neon-glow-blue">🌍</div>
                                    <span className="uppercase tracking-widest">Eco-Friendly Future Materials</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
