'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import FloatingCart from "@/components/FloatingCart";
import { LanguageProvider } from "@/contexts/LanguageContext";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAdminPage = pathname?.startsWith('/admin');

    return (
        <LanguageProvider>
            {!isAdminPage && <Navbar />}
            <div className="relative">
                {children}
            </div>
            <FloatingCart />
        </LanguageProvider>
    );
}
