import { api } from '@/lib/api';
import { Car } from '@/types/api';

export interface Wishlist {
  _id: string;
  userId: string;
  carIds: Car[];
  createdAt: string;
  updatedAt: string;
}

export const wishlistApi = {
  getUserWishlist: async (): Promise<Wishlist | null> => {
    const response = await api.get<Wishlist>('/wishlist');
    return response.data;
  },

  addToWishlist: async (carId: string): Promise<Wishlist> => {
    const response = await api.post<Wishlist>(`/wishlist/${carId}`);
    return response.data;
  },

  removeFromWishlist: async (carId: string): Promise<Wishlist> => {
    const response = await api.delete<Wishlist>(`/wishlist/${carId}`);
    return response.data;
  },
};