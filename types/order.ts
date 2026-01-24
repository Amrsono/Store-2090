export interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    paymentMethod: 'cash' | 'card';
    shippingAddress: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderItem {
    id: number;
    productId: number;
    title: string;
    price: number;
    quantity: number;
    image?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderStats {
    totalOrders: number;
    pendingOrders: number;
    processingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
}
