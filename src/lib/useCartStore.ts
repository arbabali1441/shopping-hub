import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  stock: number;
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (product: { id: string; title: string; price: number; stock: number }) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (product) => {
        const { cart } = get();
        const existing = cart.find((item) => item.id === product.id);

        if (existing) {
          if (existing.quantity >= product.stock) {
            alert('Out of Stock limit reached for this item!');
            return;
          }
          set({
            cart: cart.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ),
          });
        } else {
          if (product.stock < 1) {
            alert('Item is currently out of stock!');
            return;
          }
          set({ cart: [...cart, { ...product, quantity: 1 }] });
        }
      },
      removeFromCart: (id) =>
        set({ cart: get().cart.filter((item) => item.id !== id) }),
      clearCart: () => set({ cart: [] }),
    }),
    { name: 'cart-storage' }
  )
);
