import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    user: {
        email: string;
        isAdmin: boolean;
    } | null;
    login: (email: string, isAdmin: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            login: (email, isAdmin) => set({ user: { email, isAdmin } }),
            logout: () => set({ user: null }),
        }),
        {
            name: 'cyber-auth',
        }
    )
);
