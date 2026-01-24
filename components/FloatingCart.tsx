'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';

export default function FloatingCart() {
    const { getTotalItems } = useCartStore();
    const totalItems = getTotalItems();

    return (
        <div className="fixed bottom-10 right-10 z-[100]">
            <Link href="/cart">
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative w-16 h-16 rounded-full glass-strong shadow-2xl flex items-center justify-center border border-white/20 hover:neon-glow-blue transition-all duration-300 floating-element"
                >
                    <span className="text-3xl">🛒</span>

                    <AnimatePresence>
                        {totalItems > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="absolute -top-1 -right-1 w-7 h-7 rounded-full gradient-cyber text-[12px] font-black flex items-center justify-center neon-glow-purple border-2 border-[var(--obsidian)] shadow-lg"
                            >
                                {totalItems}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>
            </Link>
        </div>
    );
}
