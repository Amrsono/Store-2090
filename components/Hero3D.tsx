'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

function AnimatedSphere({ position, color }: { position: [number, number, number]; color: string }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <Sphere
                ref={meshRef}
                args={[1, 64, 64]}
                position={position}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                scale={hovered ? 1.2 : 1}
            >
                <MeshDistortMaterial
                    color={color}
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                    emissive={color}
                    emissiveIntensity={hovered ? 0.8 : 0.3}
                />
            </Sphere>
        </Float>
    );
}

function CyberGrid() {
    return (
        <gridHelper args={[20, 20, '#00d4ff', '#b300ff']} position={[0, -2, 0]} />
    );
}

export default function Hero3D() {
    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Gradient Mesh Background */}
            <div className="absolute inset-0 gradient-mesh opacity-50" />

            {/* 3D Canvas */}
            <div className="absolute inset-0">
                <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} color="#00d4ff" />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} color="#b300ff" />
                    <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={1} color="#ff00ff" />

                    <AnimatedSphere position={[-2, 0, 0]} color="#00d4ff" />
                    <AnimatedSphere position={[2, 0, 0]} color="#b300ff" />
                    <AnimatedSphere position={[0, 2, -2]} color="#ff00ff" />

                    <CyberGrid />

                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        autoRotate
                        autoRotateSpeed={0.5}
                    />
                </Canvas>
            </div>

            {/* Hero Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="space-y-6"
                >
                    {/* Animated Sliding Text */}
                    <div className="overflow-hidden">
                        <motion.h1
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-6xl md:text-8xl font-bold text-gradient neon-text-blue mb-4"
                        >
                            CYBER FASHION
                        </motion.h1>
                    </div>

                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="overflow-hidden"
                    >
                        <h2 className="text-2xl md:text-4xl font-light text-gradient-yellow">
                            2070s Style • Clothes • Shoes • Bags
                        </h2>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.7 }}
                        className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
                    >
                        Discover cutting-edge fashion from the future. Premium streetwear,
                        holographic accessories, and quantum-tech footwear
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.9 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
                    >
                        <button className="glass-strong px-8 py-4 rounded-full font-semibold text-lg neon-glow-blue hover:neon-glow-purple transition-all duration-300 hover-lift">
                            Shop Collection
                        </button>
                        <button className="gradient-border px-8 py-4 rounded-full font-semibold text-lg hover-lift">
                            New Arrivals
                        </button>
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
