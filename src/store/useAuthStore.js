import { create } from 'zustand';

const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,

    // Actions
    login: (userData, token) => set({
        user: userData,
        token: token,
        isAuthenticated: true
    }),

    logout: () => set({
        user: null,
        token: null,
        isAuthenticated: false
    }),

    setLoading: (loading) => set({ isLoading: loading }),
}));

export default useAuthStore;
