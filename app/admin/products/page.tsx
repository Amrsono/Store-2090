'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductStore, Product } from '@/store/productStore';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdminProducts() {
    const { t } = useLanguage();
    const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState<Partial<Product>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            updateProduct(isEditing, formData);
            setIsEditing(null);
        } else if (isAdding) {
            addProduct({
                title: formData.title || '',
                description: formData.description || '',
                price: formData.price || 0,
                category: formData.category || 'Clothes',
                gradient: formData.gradient || 'from-[#00d4ff] to-[#b300ff]',
                size: formData.size || 'medium',
                stock: formData.stock || 0,
                image: formData.image,
            });
            setIsAdding(false);
        }
        setFormData({});
    };

    const startEdit = (product: Product) => {
        setIsEditing(product.id);
        setFormData(product);
        setIsAdding(false);
    };

    const startAdd = () => {
        setIsAdding(true);
        setIsEditing(null);
        setFormData({
            title: '',
            description: '',
            price: 0,
            category: 'Clothes',
            gradient: 'from-[#00d4ff] to-[#b300ff]',
            size: 'medium',
            stock: 0,
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold text-gradient uppercase tracking-tighter">Product Inventory</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-1">Manage your future styles</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startAdd}
                    className="gradient-cyber px-6 py-3 rounded-xl font-bold text-sm neon-glow-blue hover:neon-glow-purple transition-all duration-300"
                >
                    + Add New Product
                </motion.button>
            </div>

            {/* Editing/Adding Modal */}
            <AnimatePresence>
                {(isEditing || isAdding) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="glass-strong rounded-[3rem] p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold text-gradient uppercase">{isEditing ? 'Edit Product' : 'New Product'}</h2>
                                <button onClick={() => { setIsEditing(null); setIsAdding(false); }} className="w-10 h-10 rounded-xl glass hover:bg-white/10 transition-colors">✕</button>
                            </div>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4 md:col-span-2">
                                    <div className="aspect-video rounded-3xl glass-strong border-2 border-dashed border-white/10 flex flex-col items-center justify-center relative overflow-hidden group">
                                        {formData.image ? (
                                            <>
                                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="gradient-cyber px-4 py-2 rounded-lg text-xs font-bold">Change Image</button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-4xl mb-2 opacity-50">🖼️</span>
                                                <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sm font-bold text-[var(--neon-blue)] uppercase tracking-widest hover:underline italic">Upload Hardware Scan (Image)</button>
                                            </>
                                        )}
                                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-2">Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-6 py-4 rounded-2xl glass bg-white/5 border border-white/10 focus:border-[var(--neon-blue)] focus:outline-none font-bold"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-2">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-6 py-4 rounded-2xl glass bg-white/5 border border-white/10 focus:border-[var(--neon-blue)] focus:outline-none font-bold appearance-none bg-none"
                                    >
                                        <option value="Clothes">Clothes</option>
                                        <option value="Shoes">Shoes</option>
                                        <option value="Bags">Bags</option>
                                        <option value="Accessories">Accessories</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-2">Price (EGP)</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                        className="w-full px-6 py-4 rounded-2xl glass bg-white/5 border border-white/10 focus:border-[var(--neon-blue)] focus:outline-none font-bold"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-2">Stock Level</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                                        className="w-full px-6 py-4 rounded-2xl glass bg-white/5 border border-white/10 focus:border-[var(--neon-blue)] focus:outline-none font-bold text-gradient-yellow"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-2">Description</label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-6 py-4 rounded-2xl glass bg-white/5 border border-white/10 focus:border-[var(--neon-blue)] focus:outline-none font-medium text-sm text-gray-300"
                                    />
                                </div>

                                <div className="flex gap-4 md:col-span-2 pt-4">
                                    <button type="submit" className="flex-1 gradient-cyber py-4 rounded-2xl font-black text-lg uppercase tracking-widest neon-glow-purple transition-all duration-300 shadow-2xl">
                                        {isEditing ? 'Sync Changes' : 'Add Product'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Product Table */}
            <div className="glass-strong rounded-[3rem] p-8 border border-white/5 shadow-2xl overflow-hidden">
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left pb-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Visual</th>
                                <th className="text-left pb-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Identity</th>
                                <th className="text-left pb-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Category</th>
                                <th className="text-left pb-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Price</th>
                                <th className="text-left pb-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Stock</th>
                                <th className="text-right pb-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {products.map((product) => (
                                <tr key={product.id} className="group hover:bg-white/[0.02] transition-colors origin-left">
                                    <td className="py-6 px-4">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden gradient-cyber flex items-center justify-center neon-glow-blue ring-1 ring-white/10 group-hover:scale-110 transition-transform">
                                            {product.image ? (
                                                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-2xl opacity-50">👕</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-6 px-4">
                                        <p className="font-black text-white text-lg tracking-tight group-hover:text-[var(--neon-blue)] transition-colors">{product.title}</p>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 max-w-[200px] truncate">{product.description}</p>
                                    </td>
                                    <td className="py-6 px-4">
                                        <span className="px-3 py-1 rounded-full glass border border-white/5 text-[10px] font-black uppercase tracking-widest text-gradient">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="py-6 px-4">
                                        <span className="font-black text-gradient-yellow text-xl tracking-tighter">
                                            {t.common.currency} {product.price}
                                        </span>
                                    </td>
                                    <td className="py-6 px-4">
                                        <div className="flex flex-col">
                                            <span className={cn(
                                                "text-lg font-black tracking-tight",
                                                product.stock < 10 ? "text-red-500 animate-pulse" : "text-gray-300"
                                            )}>
                                                {product.stock}
                                            </span>
                                            <span className="text-[8px] font-black uppercase tracking-widest opacity-40">UNITS</span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-4 text-right">
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={() => startEdit(product)}
                                                className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:neon-glow-blue transition-all"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => deleteProduct(product.id)}
                                                className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-all"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {products.length === 0 && (
                        <div className="text-center py-20 opacity-30 italic">
                            No hardware found in the grid...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
