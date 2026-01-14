export interface User {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    role: string;
    loyaltyPoints?: number;
    totalOrders?: number;
    totalSpent?: number;
    avatar?: string;
    provider?: string;
    createdAt?: string;
}

export interface OrderItem {
    productId: {
        _id: string;
        name: string;
        image?: string;
    };
    quantity: number;
    price: number;
    paidWithPoints: boolean;
    selectedColor?: string;
    selectedSize?: string;
}

export interface Order {
    _id: string;
    totalAmount: number;
    pointsUsed: number;
    status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
    items: OrderItem[];
}

export interface UpdateProfileData {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
}