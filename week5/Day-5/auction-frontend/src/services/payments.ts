import { api } from '@/lib/api';
import { Payment } from '@/types/api';

export interface CreatePaymentRequest {
  auctionId: string;
  buyerId: string;
  amountPaid: number;
  status?: 'pending' | 'inTransit' | 'delivered' | 'completed';
  paymentDate?: string;
  deliveryUpdates?: { status: string; updatedAt: string }[];
  transactionID?: string;
}

export const paymentsApi = {
  getAll: async (): Promise<Payment[]> => {
    const response = await api.get<Payment[]>('/payments');
    return response.data;
  },

  create: async (data: CreatePaymentRequest): Promise<Payment> => {
    const response = await api.post<Payment>('/payments', data);
    return response.data;
  },
};