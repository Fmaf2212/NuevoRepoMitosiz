import { create } from 'zustand';

interface CartStore {
  cartItemCount: number;
  addToCart: () => void;
  updateCartItemCount: (newCount: number) => void;
  isChangeStoresForShopping: boolean;
  isChangeTypePurchases: boolean;
  updateIsChangeStoresForShopping: (value: boolean) => void;
  updateIsChangeTypePurchases: (value: boolean) => void;
}

const carritoLengthString = localStorage.getItem('carritoLength');

// Convierte la cadena a un número
const carritoLengthNumber = carritoLengthString ? parseInt(carritoLengthString, 10) : 0;

export const useStore = create<CartStore>((set) => ({
  cartItemCount: carritoLengthNumber,
  addToCart: () => set((state) => ({ cartItemCount: state.cartItemCount + 1 })),
  updateCartItemCount: (newCount) => set({ cartItemCount: newCount }),
  isChangeStoresForShopping: localStorage.getItem('StoresForShopping') ? true : false,
  isChangeTypePurchases: localStorage.getItem('TypePurchase') ? true : false,
  updateIsChangeStoresForShopping: (value) => set({ isChangeStoresForShopping: value }),
  updateIsChangeTypePurchases: (value) => set({ isChangeTypePurchases: value }),
}));