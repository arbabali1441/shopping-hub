import { create } from 'zustand';
import { Product } from '@/data/products';

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  wishlist: number[];
  isCartOpen: boolean;
  toastMessage: string | null;
  toggleCart: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, delta: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: number) => void;
  showToast: (msg: string) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  wishlist: [],
  isCartOpen: false,
  toastMessage: null,
  
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  
  showToast: (msg) => {
    set({ toastMessage: msg });
    setTimeout(() => set({ toastMessage: null }), 3000);
  },

  addToCart: (product) => {
    set((state) => {
      const existing = state.cart.find((item) => item.id === product.id);
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return { cart: [...state.cart, { ...product, quantity: 1 }] };
    });
    get().showToast(`${product.name} added to cart!`);
  },

  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== productId),
    })),

  updateQuantity: (productId, delta) =>
    set((state) => ({
      cart: state.cart
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[],
    })),

  clearCart: () => set({ cart: [] }),

  toggleWishlist: (productId) => {
    set((state) => {
      const exists = state.wishlist.includes(productId);
      const updated = exists
        ? state.wishlist.filter((id) => id !== productId)
        : [...state.wishlist, productId];
      return { wishlist: updated };
    });
  },
}));
