'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    return (
        <div className="min-h-screen bg-[var(--obsidian)] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-strong rounded-3xl p-12 max-w-lg w-full text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                    className="w-24 h-24 mx-auto mb-8 rounded-full gradient-cyber flex items-center justify-center neon-glow-blue"
                >
                    <span className="text-5xl text-white">✓</span>
                </motion.div>

                <h1 className="text-4xl font-bold text-gradient mb-4">Order Placed!</h1>
                <p className="text-gray-400 mb-8">
                    Thank you for your purchase. Your 2070s style upgrade is being prepared.
                </p>

                <div className="glass rounded-xl p-6 mb-8">
                    <p className="text-sm text-gray-400 mb-1">Order ID</p>
                    <p className="font-mono text-xl font-bold text-gradient-yellow">{orderId || 'ORD-SYNC-2070'}</p>
                </div>

                <div className="space-y-4">
                    <Link href="/">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full gradient-cyber px-8 py-4 rounded-full font-semibold neon-glow-blue hover:neon-glow-purple transition-all duration-300"
                        >
                            Back to Store
                        </motion.button>
                    </Link>
                    <p className="text-xs text-gray-500">
                        A confirmation email has been sent to your quantum-link.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[var(--obsidian)]"></div>}>
            <OrderSuccessContent />
        </Suspense>
    );
}
