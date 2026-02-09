'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export default function Hero3D() {
    const { t, language } = useLanguage();

    return (
        <div className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">

            {/* Hero Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="space-y-4 md:space-y-6"
                >
                    {/* Animated Sliding Text */}
                    <div className="overflow-hidden">
                        <motion.h1
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className={cn(
                                "font-bold text-gradient neon-text-blue mb-2 md:mb-4 leading-tight",
                                language === 'ar' ? "text-4xl md:text-7xl" : "text-5xl md:text-8xl"
                            )}
                        >
                            {t.hero.title}
                        </motion.h1>
                    </div>

                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="overflow-hidden"
                    >
                        <h2 className="text-xl md:text-4xl font-light text-gradient-yellow">
                            {t.hero.subtitle}
                        </h2>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.7 }}
                        className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto"
                    >
                        {t.hero.description}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.9 }}
                        className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mt-6 md:mt-8"
                    >
                        <a href="#products">
                            <button className="glass-strong px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-base md:text-lg neon-glow-blue hover:neon-glow-purple transition-all duration-300 hover-lift">
                                {t.hero.shopCollection}
                            </button>
                        </a>
                        <a href="#features">
                            <button className="gradient-border px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-base md:text-lg hover-lift">
                                {t.hero.newArrivals}
                            </button>
                        </a>
                    </motion.div>

                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.2, repeat: Infinity, repeatType: 'reverse' }}
                    className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
                >
                    <div className="w-6 h-10 border-2 border-[var(--neon-blue)] rounded-full flex items-start justify-center p-2">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-1.5 h-1.5 bg-[var(--neon-blue)] rounded-full"
                        />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
