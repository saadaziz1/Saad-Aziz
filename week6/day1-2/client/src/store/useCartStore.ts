import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id?: string;
    productId: string;
    title: string;
    price: number;
    quantity: number;
    selectedColor?: string;
    selectedSize?: string;
    srcUrl?: string;
    payWithPoints?: boolean;
    discount?: {
        percentage: number;
        amount: number;
    };
}

export interface LocalCart {
    items: CartItem[];
    totalPrice: number;
    totalQuantities: number;
}

interface CartStore {
    localCart: LocalCart;
    addItem: (item: CartItem) => void;
    removeItem: (productId: string, color?: string, size?: string) => void;
    updateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            localCart: {
                items: [],
                totalPrice: 0,
                totalQuantities: 0,
            },
            addItem: (item) => set((state) => {
                const existingItemIndex = state.localCart.items.findIndex(
                    (i) => i.productId === item.productId && i.selectedColor === item.selectedColor && i.selectedSize === item.selectedSize
                );

                let newItems = [...state.localCart.items];
                if (existingItemIndex > -1) {
                    newItems[existingItemIndex].quantity += item.quantity;
                } else {
                    newItems.push(item);
                }

                const totals = newItems.reduce((acc, curr) => ({
                    totalPrice: acc.totalPrice + (curr.price * curr.quantity),
                    totalQuantities: acc.totalQuantities + curr.quantity
                }), { totalPrice: 0, totalQuantities: 0 });

                return {
                    localCart: {
                        items: newItems,
                        ...totals
                    }
                };
            }),
            removeItem: (productId, color, size) => set((state) => {
                const newItems = state.localCart.items.filter(
                    (i) => !(i.productId === productId && i.selectedColor === color && i.selectedSize === size)
                );

                const totals = newItems.reduce((acc, curr) => ({
                    totalPrice: acc.totalPrice + (curr.price * curr.quantity),
                    totalQuantities: acc.totalQuantities + curr.quantity
                }), { totalPrice: 0, totalQuantities: 0 });

                return {
                    localCart: {
                        items: newItems,
                        ...totals
                    }
                };
            }),
            updateQuantity: (productId, quantity, color, size) => set((state) => {
                const newItems = state.localCart.items.map((i) => {
                    if (i.productId === productId && i.selectedColor === color && i.selectedSize === size) {
                        return { ...i, quantity };
                    }
                    return i;
                });

                const totals = newItems.reduce((acc, curr) => ({
                    totalPrice: acc.totalPrice + (curr.price * curr.quantity),
                    totalQuantities: acc.totalQuantities + curr.quantity
                }), { totalPrice: 0, totalQuantities: 0 });

                return {
                    localCart: {
                        items: newItems,
                        ...totals
                    }
                };
            }),
            clearCart: () => set({
                localCart: {
                    items: [],
                    totalPrice: 0,
                    totalQuantities: 0
                }
            }),
        }),
        {
            name: 'local-cart-storage',
        }
    )
);
