'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { cn } from '@/lib/utils';

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getTotalPrice, clearCart } = useCartStore();
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Create order (mock for now)
        const order = {
            id: `ORD-${Date.now()}`,
            customerName: formData.fullName,
            customerEmail: formData.email,
            items: items.map(item => ({
                id: item.id,
                productId: item.id,
                title: item.title,
                price: item.price,
                quantity: item.quantity,
            })),
            totalAmount: getTotalPrice(),
            status: 'pending' as const,
            paymentMethod,
            shippingAddress: `${formData.address}, ${formData.city}, ${formData.postalCode}`,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        console.log('Order placed:', order);

        // Clear cart and redirect
        clearCart();
        router.push('/order-success?orderId=' + order.id);
    };

    if (items.length === 0) {
        router.push('/cart');
        return null;
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
                    <h1 className="text-5xl md:text-7xl font-bold text-gradient mb-4">Checkout</h1>
                    <p className="text-xl text-gray-400">Complete your order</p>
                </motion.div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Shipping Information */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="glass-strong rounded-2xl p-6"
                            >
                                <h2 className="text-2xl font-bold text-gradient mb-6">Shipping Information</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg glass focus:outline-none focus:ring-2 focus:ring-[var(--neon-blue)]"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg glass focus:outline-none focus:ring-2 focus:ring-[var(--neon-blue)]"
                                            placeholder="john@cyber.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Phone</label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg glass focus:outline-none focus:ring-2 focus:ring-[var(--neon-blue)]"
                                            placeholder="+1 234 567 8900"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium mb-2">Address</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg glass focus:outline-none focus:ring-2 focus:ring-[var(--neon-blue)]"
                                            placeholder="123 Cyber Street"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">City</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg glass focus:outline-none focus:ring-2 focus:ring-[var(--neon-blue)]"
                                            placeholder="Neo Tokyo"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Postal Code</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.postalCode}
                                            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg glass focus:outline-none focus:ring-2 focus:ring-[var(--neon-blue)]"
                                            placeholder="2070"
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Payment Method */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="glass-strong rounded-2xl p-6"
                            >
                                <h2 className="text-2xl font-bold text-gradient mb-6">Payment Method</h2>

                                <div className="space-y-3">
                                    {/* Cash on Delivery */}
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => setPaymentMethod('cash')}
                                        className={cn(
                                            'p-4 rounded-xl cursor-pointer transition-all duration-300',
                                            paymentMethod === 'cash'
                                                ? 'glass neon-glow-blue'
                                                : 'glass-strong hover:glass'
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                                                paymentMethod === 'cash' ? 'border-[var(--neon-blue)]' : 'border-gray-400'
                                            )}>
                                                {paymentMethod === 'cash' && (
                                                    <div className="w-3 h-3 rounded-full bg-[var(--neon-blue)]" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold">Cash on Delivery</p>
                                                <p className="text-sm text-gray-400">Pay when you receive your order</p>
                                            </div>
                                            <span className="text-2xl">💵</span>
                                        </div>
                                    </motion.div>

                                    {/* Card Payment (Coming Soon) */}
                                    <motion.div
                                        className="p-4 rounded-xl glass-strong opacity-50 cursor-not-allowed relative"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-6 h-6 rounded-full border-2 border-gray-600" />
                                            <div className="flex-1">
                                                <p className="font-bold">Card Payment</p>
                                                <p className="text-sm text-gray-400">Credit/Debit card</p>
                                            </div>
                                            <span className="text-2xl">💳</span>
                                        </div>
                                        <div className="absolute top-2 right-2">
                                            <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-semibold">
                                                Coming Soon
                                            </span>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Order Summary */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-1"
                        >
                            <div className="glass-strong rounded-2xl p-6 sticky top-24">
                                <h2 className="text-2xl font-bold text-gradient mb-6">Order Summary</h2>

                                {/* Items */}
                                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3 py-2 border-b border-white/5">
                                            <div className="w-12 h-12 rounded-lg gradient-cyber flex items-center justify-center flex-shrink-0">
                                                <span className="text-xl">👕</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{item.title}</p>
                                                <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-bold text-gradient-yellow">${item.price * item.quantity}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Subtotal</span>
                                        <span className="font-bold">${getTotalPrice()}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Shipping</span>
                                        <span className="font-bold text-green-400">FREE</span>
                                    </div>
                                    <div className="border-t border-white/10 pt-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xl font-bold">Total</span>
                                            <span className="text-3xl font-bold text-gradient-yellow">${getTotalPrice()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Place Order Button */}
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full gradient-cyber px-8 py-4 rounded-full font-semibold text-lg neon-glow-blue hover:neon-glow-purple transition-all duration-300"
                                >
                                    Place Order
                                </motion.button>

                                {/* Security Badge */}
                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <div className="flex items-center gap-3 text-sm text-gray-400">
                                        <span className="text-2xl">🔒</span>
                                        <span>Secure quantum-encrypted checkout</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </form>
            </div>
        </div>
    );
}
