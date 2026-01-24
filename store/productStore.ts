import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    gradient: string;
    size: 'small' | 'medium' | 'large';
    stock: number;
    image?: string;
}

interface ProductStore {
    products: Product[];
    addProduct: (product: Omit<Product, 'id'>) => void;
    updateProduct: (id: number, product: Partial<Product>) => void;
    deleteProduct: (id: number) => void;
    setStock: (id: number, stock: number) => void;
}

const initialProducts: Product[] = [
    {
        id: 1,
        title: 'Neon Streetwear Jacket',
        description: 'Holographic tech-fabric with reactive LED strips and quantum insulation',
        price: 499,
        category: 'Clothes',
        gradient: 'from-[#00d4ff] to-[#b300ff]',
        size: 'large',
        stock: 15,
        image: '/images/neon-jacket.jpg',
    },
    {
        id: 2,
        title: 'Cyber Running Shoes',
        description: 'Anti-gravity soles with neural sync technology',
        price: 349,
        category: 'Shoes',
        gradient: 'from-[#ff00ff] to-[#00fff5]',
        size: 'medium',
        stock: 24,
        image: '/images/cyber-shoes.jpg',
    },
    {
        id: 3,
        title: 'Quantum Tech Backpack',
        description: 'Dimensional storage with biometric security',
        price: 599,
        category: 'Bags',
        gradient: 'from-[#00ff88] to-[#00d4ff]',
        size: 'medium',
        stock: 10,
        image: '/images/quantum-backpack.jpg',
    },
    {
        id: 4,
        title: 'Holographic Sneakers',
        description: 'Color-shifting nano-material with smart cushioning',
        price: 279,
        category: 'Shoes',
        gradient: 'from-[#ffeb3b] to-[#ff00ff]',
        size: 'small',
        stock: 42,
        image: '/images/holo-sneakers.jpg',
    },
    {
        id: 5,
        title: 'Plasma Shoulder Bag',
        description: 'Lightweight carbon-fiber with neon accent strips',
        price: 399,
        category: 'Bags',
        gradient: 'from-[#b300ff] to-[#00fff5]',
        size: 'small',
        stock: 18,
        image: '/images/plasma-bag.jpg',
    },
    {
        id: 6,
        title: 'Cyberpunk Hoodie Set',
        description: 'Temperature-adaptive fabric with integrated AR display',
        price: 699,
        category: 'Clothes',
        gradient: 'from-[#00d4ff] to-[#00ff88]',
        size: 'large',
        stock: 7,
        image: '/images/cyberpunk-hoodie.jpg',
    },
];

export const useProductStore = create<ProductStore>()(
    persist(
        (set) => ({
            products: initialProducts,
            addProduct: (product) => set((state) => ({
                products: [...state.products, { ...product, id: Date.now() }]
            })),
            updateProduct: (id, updatedProduct) => set((state) => ({
                products: state.products.map((p) => p.id === id ? { ...p, ...updatedProduct } : p)
            })),
            deleteProduct: (id) => set((state) => ({
                products: state.products.filter((p) => p.id !== id)
            })),
            setStock: (id, stock) => set((state) => ({
                products: state.products.map((p) => p.id === id ? { ...p, stock } : p)
            })),
        }),
        {
            name: 'cyber-products',
        }
    )
);
