'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { cn } from '@/lib/utils';

export default function CartPage() {
    const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[var(--obsidian)] flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full gradient-cyber flex items-center justify-center neon-glow-purple">
                        <span className="text-5xl">🛒</span>
                    </div>
                    <h1 className="text-4xl font-bold text-gradient mb-4">Your Cart is Empty</h1>
                    <p className="text-gray-400 mb-8">Add some futuristic fashion to your cart!</p>
                    <Link href="/">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="gradient-cyber px-8 py-4 rounded-full font-semibold neon-glow-blue hover:neon-glow-purple transition-all duration-300"
                        >
                            Continue Shopping
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--obsidian)] py-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-5xl md:text-7xl font-bold text-gradient mb-4">Shopping Cart</h1>
                    <p className="text-xl text-gray-400">{getTotalItems()} items in your cart</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-strong rounded-2xl p-6 hover-lift"
                            >
                                <div className="flex gap-6">
                                    {/* Product Image Placeholder */}
                                    <div className="w-24 h-24 rounded-xl gradient-cyber flex items-center justify-center neon-glow-blue flex-shrink-0">
                                        <span className="text-3xl">👕</span>
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-xl font-bold text-gradient mb-1">{item.title}</h3>
                                                <p className="text-sm text-gray-400">{item.category}</p>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:neon-glow-red transition-all duration-300"
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:neon-glow-blue transition-all duration-300"
                                                >
                                                    −
                                                </button>
                                                <span className="w-12 text-center font-bold">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:neon-glow-blue transition-all duration-300"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Price */}
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-gradient-yellow">${item.price * item.quantity}</p>
                                                <p className="text-sm text-gray-400">${item.price} each</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1"
                    >
                        <div className="glass-strong rounded-2xl p-6 sticky top-24">
                            <h2 className="text-2xl font-bold text-gradient mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Subtotal</span>
                                    <span className="font-bold">${getTotalPrice()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Shipping</span>
                                    <span className="font-bold text-green-400">FREE</span>
                                </div>
                                <div className="border-t border-white/10 pt-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-bold">Total</span>
                                        <span className="text-3xl font-bold text-gradient-yellow">${getTotalPrice()}</span>
                                    </div>
                                </div>
                            </div>

                            <Link href="/checkout">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full gradient-cyber px-8 py-4 rounded-full font-semibold text-lg neon-glow-blue hover:neon-glow-purple transition-all duration-300 mb-4"
                                >
                                    Proceed to Checkout
                                </motion.button>
                            </Link>

                            <Link href="/">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full glass px-8 py-4 rounded-full font-semibold hover:neon-glow-blue transition-all duration-300"
                                >
                                    Continue Shopping
                                </motion.button>
                            </Link>

                            {/* Trust Badges */}
                            <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <span className="text-xl">🔒</span>
                                    <span>Secure Quantum Encryption</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <span className="text-xl">🚀</span>
                                    <span>24-Hour Quantum Delivery</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <span className="text-xl">↩️</span>
                                    <span>30-Day Free Returns</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
