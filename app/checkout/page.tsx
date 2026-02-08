'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

import { useLanguage } from '@/contexts/LanguageContext';

// Force dynamic rendering to avoid SSR issues with stores
export const dynamic = 'force-dynamic';

export default function CheckoutPage() {
    const { t } = useLanguage();
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

    const { user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            router.push('/login?redirect=/checkout');
            return;
        }

        setIsLoading(true);

        try {
            const query = `
                mutation CreateOrder($userId: Int!, $items: [OrderItemInput!]!, $shippingAddress: String!, $paymentMethod: String) {
                    createOrder(userId: $userId, input: {
                        items: $items,
                        shippingAddress: $shippingAddress,
                        paymentMethod: $paymentMethod
                    }) {
                        id
                        totalAmount
                        status
                    }
                }
            `;

            const variables = {
                userId: parseInt(user.id),
                items: items.map(item => ({
                    productId: item.id,
                    quantity: item.quantity
                })),
                shippingAddress: `${formData.address}, ${formData.city}, ${formData.postalCode}`,
                paymentMethod: paymentMethod === 'cash' ? 'Cash' : 'Card'
            };

            const url = process.env.NEXT_PUBLIC_GRAPHQL_URL || '/api/graphql';
            console.log('Place Order Request to:', url);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}` // Add token if auth middleware requires it
                },
                body: JSON.stringify({ query, variables }),
            });

            console.log('Checkout Response Status:', response.status);

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await response.text();
                console.error("Non-JSON Checkout Response:", response.status, response.statusText, text);
                throw new Error(`Server returned ${response.status} ${response.statusText}`);
            }

            const result = await response.json();

            if (result.errors) {
                throw new Error(result.errors[0].message);
            }

            const { createOrder } = result.data;
            console.log('Order placed:', createOrder);

            // Clear cart and redirect
            clearCart();
            router.push('/order-success?orderId=' + createOrder.id);

        } catch (error) {
            console.error('Checkout error:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setIsLoading(false);
        }
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
                    className="mb-8 md:mb-12"
                >
                    <h1 className="text-5xl md:text-7xl font-bold text-gradient mb-4">{t.checkout.title}</h1>
                    <p className="text-xl text-gray-400">{t.checkout.completeOrder}</p>
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
                                <h2 className="text-2xl font-bold text-gradient mb-6">{t.checkout.shippingAddress}</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium mb-2">{t.auth.fullName}</label>
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
                                        <label className="block text-sm font-medium mb-2">{t.auth.email}</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg glass focus:outline-none focus:ring-2 focus:ring-[var(--neon-blue)]"
                                            placeholder="john@modern.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">{t.checkout.phone}</label>
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
                                        <label className="block text-sm font-medium mb-2">{t.checkout.address}</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg glass focus:outline-none focus:ring-2 focus:ring-[var(--neon-blue)]"
                                            placeholder="123 Modern Street"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">{t.checkout.city}</label>
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
                                        <label className="block text-sm font-medium mb-2">{t.checkout.postalCode}</label>
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
                                <h2 className="text-2xl font-bold text-gradient mb-6">{t.checkout.paymentMethod}</h2>

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
                                                <p className="font-bold">{t.checkout.cash}</p>
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
                                                <p className="font-bold">{t.checkout.card}</p>
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
                                <h2 className="text-2xl font-bold text-gradient mb-6">{t.checkout.orderSummary}</h2>

                                {/* Items */}
                                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3 py-2 border-b border-white/5">
                                            <div className="w-12 h-12 rounded-lg gradient-modern flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-xl">👕</span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{item.title}</p>
                                                <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-bold text-gradient-yellow">{t.common.currency} {item.price * item.quantity}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">{t.cart.subtotal}</span>
                                        <span className="font-bold">{t.common.currency} {getTotalPrice()}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">{t.cart.shipping}</span>
                                        <span className="font-bold text-green-400">{t.common.free}</span>
                                    </div>
                                    <div className="border-t border-white/10 pt-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xl font-bold">{t.cart.total}</span>
                                            <span className="text-3xl font-bold text-gradient-yellow">{t.common.currency} {getTotalPrice()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Place Order Button */}
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full gradient-modern px-8 py-4 rounded-full font-semibold text-lg neon-glow-blue hover:neon-glow-purple transition-all duration-300"
                                >
                                    {t.checkout.placeOrder}
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
