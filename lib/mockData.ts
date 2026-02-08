import { Order } from '@/types/order';

export const mockOrders: Order[] = [
    {
        id: 'ORD-001',
        customerName: 'Alex Chen',
        customerEmail: 'alex.chen@modern.com',
        items: [
            {
                id: 1,
                productId: 1,
                title: 'Neon Streetwear Jacket',
                price: 499,
                quantity: 1,
            },
            {
                id: 2,
                productId: 2,
                title: 'Cyber Running Shoes',
                price: 349,
                quantity: 2,
            },
        ],
        totalAmount: 1197,
        status: 'pending',
        paymentMethod: 'cash',
        shippingAddress: '123 Cyber Street, Neo Tokyo, 2070',
        createdAt: new Date('2026-01-24T10:30:00'),
        updatedAt: new Date('2026-01-24T10:30:00'),
    },
    {
        id: 'ORD-002',
        customerName: 'Sarah Martinez',
        customerEmail: 'sarah.m@future.com',
        items: [
            {
                id: 3,
                productId: 3,
                title: 'Quantum Tech Backpack',
                price: 599,
                quantity: 1,
            },
        ],
        totalAmount: 599,
        status: 'processing',
        paymentMethod: 'cash',
        shippingAddress: '456 Quantum Ave, Digital City, 2070',
        createdAt: new Date('2026-01-24T09:15:00'),
        updatedAt: new Date('2026-01-24T11:00:00'),
    },
    {
        id: 'ORD-003',
        customerName: 'Marcus Johnson',
        customerEmail: 'marcus.j@holo.net',
        items: [
            {
                id: 4,
                productId: 4,
                title: 'Holographic Sneakers',
                price: 279,
                quantity: 1,
            },
            {
                id: 5,
                productId: 5,
                title: 'Plasma Shoulder Bag',
                price: 399,
                quantity: 1,
            },
        ],
        totalAmount: 678,
        status: 'shipped',
        paymentMethod: 'cash',
        shippingAddress: '789 Plasma Road, Neon District, 2070',
        createdAt: new Date('2026-01-23T14:20:00'),
        updatedAt: new Date('2026-01-24T08:00:00'),
    },
    {
        id: 'ORD-004',
        customerName: 'Emma Wilson',
        customerEmail: 'emma.w@modern.fashion',
        items: [
            {
                id: 6,
                productId: 6,
                title: 'Cyberpunk Hoodie Set',
                price: 699,
                quantity: 1,
            },
        ],
        totalAmount: 699,
        status: 'delivered',
        paymentMethod: 'cash',
        shippingAddress: '321 Future Lane, Tech Valley, 2070',
        createdAt: new Date('2026-01-22T16:45:00'),
        updatedAt: new Date('2026-01-23T18:30:00'),
    },
    {
        id: 'ORD-005',
        customerName: 'David Kim',
        customerEmail: 'david.k@quantum.mail',
        items: [
            {
                id: 7,
                productId: 1,
                title: 'Neon Streetwear Jacket',
                price: 499,
                quantity: 2,
            },
        ],
        totalAmount: 998,
        status: 'cancelled',
        paymentMethod: 'cash',
        shippingAddress: '555 Cyber Plaza, Holo City, 2070',
        createdAt: new Date('2026-01-21T11:00:00'),
        updatedAt: new Date('2026-01-21T15:30:00'),
    },
];

export const getOrderStats = (orders: Order[]) => {
    return {
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        processingOrders: orders.filter(o => o.status === 'processing').length,
        shippedOrders: orders.filter(o => o.status === 'shipped').length,
        deliveredOrders: orders.filter(o => o.status === 'delivered').length,
        cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
        totalRevenue: orders
            .filter(o => o.status !== 'cancelled')
            .reduce((sum, o) => sum + o.totalAmount, 0),
    };
};
