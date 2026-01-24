'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Hero3D from '@/components/Hero3D';
import FeaturesSection from '@/components/FeaturesSection';
import ProductsSection from '@/components/ProductsSection';
import DashboardSection from '@/components/DashboardSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="relative min-h-screen py-20 overflow-x-hidden">
      <Navbar />

      {/* Funky Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[-10%] w-[50vw] h-[50vw] bg-[var(--neon-blue)] rounded-full blur-[150px] opacity-10 animate-pulse" />
        <div className="absolute top-[40%] right-[-10%] w-[40vw] h-[40vw] bg-[var(--quantum-purple)] rounded-full blur-[130px] opacity-10 animate-float" style={{ animationDuration: '15s' }} />
        <div className="absolute bottom-[5%] left-[5%] w-[45vw] h-[45vw] bg-[var(--solar-yellow)] rounded-full blur-[160px] opacity-5" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 mb-52">
        <Hero3D />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--obsidian)] to-transparent pointer-events-none" />
      </section>

      {/* Floating Island 1: Features - Slightly Tilted */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 mb-52 lg:-rotate-1">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="glass-strong floating-island island-hover floating-element border border-white/5"
        >
          <FeaturesSection />
        </motion.div>
      </div>

      {/* Floating Island 2: Products - Wide and Staggered */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 mb-52 lg:translate-x-12 lg:rotate-1">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="glass floating-island island-hover border border-white/5"
        >
          <ProductsSection />
        </motion.div>
      </div>

      {/* Floating Island 3: Dashboard - Narrow and deep */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 mb-72 md:ml-20 lg:-rotate-1">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="glass-strong floating-island island-hover floating-element border border-white/5"
          style={{ animationDelay: '2s' }}
        >
          <DashboardSection />
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
