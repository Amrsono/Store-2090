'use client';

import { motion } from 'framer-motion';

const footerLinks = {
    Shop: ['Clothes', 'Shoes', 'Bags', 'Accessories'],
    Company: ['About', 'Blog', 'Careers', 'Press'],
    Support: ['Help Center', 'Shipping', 'Returns', 'Contact'],
    Legal: ['Privacy', 'Terms', 'Cookie Policy', 'Licenses'],
};

const socialLinks = [
    { name: 'Instagram', icon: '📸', href: '#' },
    { name: 'TikTok', icon: '🎵', href: '#' },
    { name: 'Twitter', icon: '𝕏', href: '#' },
    { name: 'Pinterest', icon: '📌', href: '#' },
];

import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
    const { t } = useLanguage();

    const footerLinks = {
        [t.footer.shop]: [t.products.categories.clothes, t.products.categories.shoes, t.products.categories.bags, t.products.categories.accessories],
        [t.footer.company]: ['About', 'Blog', 'Careers', 'Press'],
        [t.footer.support]: ['Help Center', 'Shipping', 'Returns', 'Contact'],
        [t.footer.legal]: ['Privacy', 'Terms', 'Cookie Policy', 'Licenses'],
    };

    const socialLinks = [
        { name: 'Instagram', icon: '📸', href: '#' },
        { name: 'TikTok', icon: '🎵', href: '#' },
        { name: 'Twitter', icon: '𝕏', href: '#' },
        { name: 'Pinterest', icon: '📌', href: '#' },
    ];

    return (
        <footer className="relative py-20 px-4 overflow-hidden border-t border-white/10">
            {/* Background */}
            <div className="absolute inset-0 gradient-mesh opacity-20" />

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-4"
                        >
                            <div className="flex items-center space-x-2">
                                <span className="text-2xl font-bold text-gradient">Modern Store Main</span>
                            </div>
                            <p className="text-gray-400 text-sm max-w-xs">
                                {t.footer.description}
                            </p>
                            <div className="flex gap-3">
                                {socialLinks.map((social, index) => (
                                    <motion.a
                                        key={social.name}
                                        href={social.href}
                                        initial={{ opacity: 0, scale: 0 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:neon-glow-blue transition-all duration-300"
                                    >
                                        <span className="text-lg">{social.icon}</span>
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: categoryIndex * 0.1 }}
                        >
                            <h3 className="text-sm font-semibold text-gradient mb-4 uppercase tracking-wider">{category}</h3>
                            <ul className="space-y-3">
                                {links.map((link, linkIndex) => (
                                    <motion.li
                                        key={link}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: categoryIndex * 0.1 + linkIndex * 0.05 }}
                                    >
                                        <a
                                            href="#"
                                            className="text-sm text-gray-400 hover:text-[var(--neon-blue)] transition-colors duration-300"
                                        >
                                            {link}
                                        </a>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Newsletter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass-strong rounded-2xl p-8 mb-12"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl font-bold text-gradient mb-2">{t.footer.stayInStyle}</h3>
                            <p className="text-gray-400">{t.footer.exclusiveDrops}</p>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <input
                                type="email"
                                placeholder={t.footer.emailPlaceholder}
                                className="flex-1 md:w-64 px-4 py-3 rounded-lg glass text-sm focus:outline-none focus:ring-2 focus:ring-[var(--neon-blue)]"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="gradient-modern px-6 py-3 rounded-lg font-semibold text-sm neon-glow-blue hover:neon-glow-purple transition-all duration-300 whitespace-nowrap"
                            >
                                {t.footer.subscribe}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Bottom Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4"
                >
                    <p className="text-sm text-gray-400">
                        {t.footer.copyright}
                    </p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-sm text-gray-400 hover:text-[var(--neon-blue)] transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-sm text-gray-400 hover:text-[var(--neon-blue)] transition-colors">
                            Terms of Service
                        </a>
                        <a href="#" className="text-sm text-gray-400 hover:text-[var(--neon-blue)] transition-colors">
                            Cookies
                        </a>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}
