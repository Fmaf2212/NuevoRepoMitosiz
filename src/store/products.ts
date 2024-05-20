import { create } from 'zustand';

interface ProductState {
    products: Product[];
    searchTerm: string;
    setProducts: (products: Product[]) => void;
    setSearchTerm: (term: string) => void;
}

export interface Product {
    productId: number;
    productName: string;
    imageName: string;
    price: number;
    activationPoints: number;
    networkPoints: number;
    discount: number;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  searchTerm: '',
  setProducts: (products: any) => set({ products }),
  setSearchTerm: (term: any) => set({ searchTerm: term }),
}));

export default useProductStore;