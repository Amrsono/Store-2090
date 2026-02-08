'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: 'en', name: 'English EG', flag: '🇪🇬' },
        { code: 'ar', name: 'العربية EG', flag: '🇪🇬' },
    ];

    return (
        <div className="relative">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="glass px-3 py-2 rounded-lg flex items-center gap-2 hover:neon-glow-blue transition-all duration-300"
            >
                <span className="text-lg">🇪🇬</span>
                <span className="text-xs font-bold uppercase tracking-wider">
                    {language === 'en' ? 'en eg' : 'ar eg'}
                </span>
                <span className={cn("text-[10px] transition-transform duration-300", isOpen && "rotate-180")}>
                    ▼
                </span>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full right-0 mt-2 w-32 glass-strong rounded-xl p-2 z-50 border border-white/10"
                    >
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    setLanguage(lang.code as 'en' | 'ar');
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-300 mb-1 last:mb-0",
                                    language === lang.code
                                        ? "gradient-modern text-white font-black"
                                        : "hover:glass text-white/70 hover:text-white"
                                )}
                            >
                                <span>{lang.name}</span>
                                <span>{lang.flag}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
