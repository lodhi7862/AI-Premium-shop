import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, User } from '@/types';

/**
 * Cart Store - Manages shopping cart state
 */
interface CartStore {
  items: CartItem[];
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        })),

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'cart-store',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);

/**
 * Auth Store - Manages user authentication and session
 */
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      initializeAuth: () => {
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('user');
          const accessToken = localStorage.getItem('accessToken');
          
          if (storedUser && accessToken) {
            try {
              const userData = JSON.parse(storedUser);
              set({
                user: userData,
                isAuthenticated: true,
                isLoading: false,
              });
            } catch (e) {
              console.error('Failed to parse stored user:', e);
              localStorage.removeItem('user');
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              set({ user: null, isAuthenticated: false, isLoading: false });
            }
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        }
      },
    }),
    {
      name: 'auth-store',
      storage: typeof window !== 'undefined' ? localStorage : undefined,
    }
  )
);

/**
 * UI Store - Manages global UI state
 */
interface UIStore {
  isDarkMode: boolean;
  isCartOpen: boolean;
  isMenuOpen: boolean;
  toggleDarkMode: () => void;
  toggleCart: () => void;
  toggleMenu: () => void;
  closeCart: () => void;
  closeMenu: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isDarkMode: false,
  isCartOpen: false,
  isMenuOpen: false,

  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  closeCart: () => set({ isCartOpen: false }),
  closeMenu: () => set({ isMenuOpen: false }),
}));
