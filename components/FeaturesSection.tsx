'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';

interface Feature {
    icon: string;
    title: string;
    description: string;
    color: string;
}

const features: Feature[] = [
    {
        icon: '✨',
        title: 'Premium Quality',
        description: 'Handcrafted with quantum-tech materials and holographic fabrics from 2070',
        color: 'from-[#00d4ff] to-[#00fff5]',
    },
    {
        icon: '🚀',
        title: 'Fast Delivery',
        description: 'Quantum teleportation shipping - receive your order in 24 hours worldwide',
        color: 'from-[#b300ff] to-[#ff00ff]',
    },
    {
        icon: '💎',
        title: 'Limited Editions',
        description: 'Exclusive drops and collaborations with top 2070s designers',
        color: 'from-[#ffeb3b] to-[#00ff88]',
    },
    {
        icon: '🌟',
        title: 'AR Try-On',
        description: 'Virtual fitting room with holographic projection technology',
        color: 'from-[#00fff5] to-[#b300ff]',
    },
    {
        icon: '🎁',
        title: 'Free Returns',
        description: '30-day return policy with instant refunds via quantum payment',
        color: 'from-[#00d4ff] to-[#b300ff]',
    },
    {
        icon: '🔒',
        title: 'Secure Checkout',
        description: 'Quantum-encrypted payments with biometric authentication',
        color: 'from-[#ff00ff] to-[#00d4ff]',
    },
];

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-100px' }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group relative"
        >
            <div className="glass-strong rounded-2xl p-8 hover-lift h-full">
                {/* Icon */}
                <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 neon-glow-blue group-hover:neon-glow-purple transition-all duration-300`}
                >
                    <span className="text-4xl">{feature.icon}</span>
                </motion.div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-3 text-gradient group-hover:neon-text-purple transition-all duration-300">
                    {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                </p>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} p-[2px]`}>
                        <div className="w-full h-full rounded-2xl bg-[var(--obsidian)]" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

import { useLanguage } from '@/contexts/LanguageContext';

export default function FeaturesSection() {
    const { t } = useLanguage();
    const sectionRef = useRef<HTMLElement>(null);

    const localizedFeatures: Feature[] = [
        {
            icon: '✨',
            title: t.features.premiumQuality,
            description: t.features.premiumDesc,
            color: 'from-[#00d4ff] to-[#00fff5]',
        },
        {
            icon: '🚀',
            title: t.features.fastDelivery,
            description: t.features.fastDeliveryDesc,
            color: 'from-[#b300ff] to-[#ff00ff]',
        },
        {
            icon: '💎',
            title: t.features.limitedEditions,
            description: t.features.limitedEditionsDesc,
            color: 'from-[#ffeb3b] to-[#00ff88]',
        },
        {
            icon: '🌟',
            title: t.features.arTryOn,
            description: t.features.arTryOnDesc,
            color: 'from-[#00fff5] to-[#b300ff]',
        },
        {
            icon: '🎁',
            title: t.features.freeReturns,
            description: t.features.freeReturnsDesc,
            color: 'from-[#00d4ff] to-[#b300ff]',
        },
        {
            icon: '🔒',
            title: t.features.secureCheckout,
            description: t.features.secureCheckoutDesc,
            color: 'from-[#ff00ff] to-[#00d4ff]',
        },
    ];

    return (
        <section ref={sectionRef} id="features" className="relative py-32 px-4 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--deep-space)] via-[var(--obsidian)] to-[var(--deep-space)]" />

            {/* Animated Background Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--neon-blue)] rounded-full blur-[150px] opacity-10 animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--quantum-purple)] rounded-full blur-[150px] opacity-10 animate-pulse-slow" style={{ animationDelay: '2s' }} />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.8 }}
                        className="inline-block mb-4"
                    >
                        <span className="px-6 py-2 rounded-full glass text-sm font-semibold text-gradient">
                            {t.features.badge}
                        </span>
                    </motion.div>

                    <h2 className="text-5xl md:text-7xl font-bold text-gradient mb-6">
                        {t.features.title}
                    </h2>

                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        {t.features.subtitle}
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {localizedFeatures.map((feature, index) => (
                        <FeatureCard key={feature.title} feature={feature} index={index} />
                    ))}
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mt-20 text-center"
                >
                    <div className="glass-strong rounded-3xl p-12 max-w-4xl mx-auto">
                        <h3 className="text-3xl md:text-5xl font-bold text-gradient mb-6">
                            {t.features.ctaTitle}
                        </h3>
                        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
                            {t.features.ctaSubtitle}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="#products">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="gradient-cyber px-10 py-4 rounded-full font-semibold text-lg neon-glow-blue hover:neon-glow-purple transition-all duration-300"
                                >
                                    {t.features.shopNow}
                                </motion.button>
                            </a>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="glass-strong px-10 py-4 rounded-full font-semibold text-lg hover-lift hover:neon-glow-blue transition-all duration-300"
                            >
                                {t.features.viewLookbook}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
