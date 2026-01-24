import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Customer {
    id: string;
    name: string;
    email: string;
    status: 'active' | 'disabled';
    totalSpent: number;
    orderCount: number;
    lastOrderDate: string;
    createdAt: string;
}

interface CustomerStore {
    customers: Customer[];
    addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'status' | 'totalSpent' | 'orderCount' | 'lastOrderDate'>) => void;
    updateCustomer: (id: string, customer: Partial<Customer>) => void;
    toggleCustomerStatus: (id: string) => void;
    deleteCustomer: (id: string) => void;
}

const initialCustomers: Customer[] = [
    {
        id: 'CUST-001',
        name: 'Alex Chen',
        email: 'alex.chen@cyber.com',
        status: 'active',
        totalSpent: 1197,
        orderCount: 1,
        lastOrderDate: '2026-01-24',
        createdAt: '2025-12-01',
    },
    {
        id: 'CUST-002',
        name: 'Sarah Martinez',
        email: 'sarah.m@future.com',
        status: 'active',
        totalSpent: 599,
        orderCount: 1,
        lastOrderDate: '2026-01-24',
        createdAt: '2025-12-15',
    },
    {
        id: 'CUST-003',
        name: 'Marcus Johnson',
        email: 'marcus.j@holo.net',
        status: 'disabled',
        totalSpent: 678,
        orderCount: 1,
        lastOrderDate: '2026-01-23',
        createdAt: '2026-01-10',
    },
    {
        id: 'CUST-004',
        name: 'Emma Wilson',
        email: 'emma.w@cyber.fashion',
        status: 'active',
        totalSpent: 699,
        orderCount: 1,
        lastOrderDate: '2026-01-22',
        createdAt: '2026-01-05',
    },
    {
        id: 'CUST-005',
        name: 'David Kim',
        email: 'david.k@quantum.mail',
        status: 'active',
        totalSpent: 998,
        orderCount: 1,
        lastOrderDate: '2026-01-21',
        createdAt: '2026-01-15',
    },
];

export const useCustomerStore = create<CustomerStore>()(
    persist(
        (set) => ({
            customers: initialCustomers,
            addCustomer: (customer) => set((state) => ({
                customers: [
                    ...state.customers,
                    {
                        ...customer,
                        id: `CUST-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
                        status: 'active',
                        totalSpent: 0,
                        orderCount: 0,
                        lastOrderDate: 'N/A',
                        createdAt: new Date().toISOString().split('T')[0],
                    }
                ]
            })),
            updateCustomer: (id, updatedCustomer) => set((state) => ({
                customers: state.customers.map((c) => c.id === id ? { ...c, ...updatedCustomer } : c)
            })),
            toggleCustomerStatus: (id) => set((state) => ({
                customers: state.customers.map((c) =>
                    c.id === id ? { ...c, status: c.status === 'active' ? 'disabled' : 'active' } : c
                )
            })),
            deleteCustomer: (id) => set((state) => ({
                customers: state.customers.filter((c) => c.id !== id)
            })),
        }),
        {
            name: 'cyber-customers',
        }
    )
);
