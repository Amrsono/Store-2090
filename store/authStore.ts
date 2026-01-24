import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    user: {
        id: string; // Added user ID
        email: string;
        isAdmin: boolean;
    } | null;
    login: (id: string, email: string, isAdmin: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            login: (id, email, isAdmin) => set({ user: { id, email, isAdmin } }),
            logout: () => set({ user: null }),
        }),
        {
            name: 'cyber-auth',
            skipHydration: true,
        }
    )
);
