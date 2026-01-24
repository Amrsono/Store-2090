'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProductStore, Product } from '@/store/productStore';

function ProductCard({ product, index }: { product: Product; index: number }) {
    const { t } = useLanguage();
    const addItem = useCartStore((state) => state.addItem);
    const cardRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ['start end', 'end start'],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);
    const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -100]);

    const sizeClasses = {
        small: 'md:col-span-1 md:row-span-1',
        medium: 'md:col-span-1 md:row-span-2',
        large: 'md:col-span-2 md:row-span-1',
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        addItem({
            id: product.id,
            title: product.title,
            price: product.price,
            category: product.category,
            image: product.image,
        });
    };

    return (
        <motion.div
            ref={cardRef}
            style={{ opacity, scale, y }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-100px' }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={cn(
                'group relative overflow-hidden rounded-[3rem] glass shadow-2xl p-8 hover-lift cursor-pointer border border-white/5 min-h-[350px]',
                sizeClasses[product.size || 'medium']
            )}
        >
            {/* Image Background */}
            {product.image ? (
                <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500 overflow-hidden">
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" />
                </div>
            ) : (
                <div className={cn(
                    'absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity duration-500',
                    product.gradient
                )} />
            )}

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-xs font-semibold px-4 py-1 rounded-full glass text-gradient uppercase tracking-widest">
                            {product.category}
                        </span>
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                            className="w-10 h-10 rounded-2xl gradient-cyber flex items-center justify-center shadow-lg"
                        >
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </motion.div>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold mb-4 neon-text-blue group-hover:neon-text-purple transition-all duration-300">
                        {product.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                        {product.description}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <span className="text-3xl font-bold text-gradient-yellow">
                        {t.common.currency} {product.price}
                    </span>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddToCart}
                        className="gradient-cyber px-8 py-3 rounded-full text-sm font-bold shadow-lg hover:neon-glow-blue transition-all duration-300"
                    >
                        {t.products.addToCart}
                    </motion.button>
                </div>
            </div>

            {/* Hover Effect Border */}
            <div className="absolute inset-0 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className={cn(
                    'absolute inset-0 rounded-[3rem] bg-gradient-to-r p-[2px]',
                    product.gradient || 'from-[var(--neon-blue)] to-[var(--quantum-purple)]'
                )}>
                    <div className="w-full h-full rounded-[3rem] bg-[var(--obsidian)] opacity-90" />
                </div>
            </div>
        </motion.div>
    );
}

export default function ProductsSection() {
    const { t } = useLanguage();
    const { products } = useProductStore();

    return (
        <div id="products" className="relative">
            <div className="relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <motion.h2
                        className="text-4xl md:text-7xl font-bold text-gradient mb-6"
                    >
                        {t.products.title}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
                    >
                        {t.products.subtitle}
                    </motion.p>
                </motion.div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:auto-rows-[350px]">
                    {products.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}
