import React, {useState} from "react";
import { LayoutGrid, Store, Box, User } from 'lucide-react';
import {DashboardTab} from "./dashboard/DashboardTab.tsx";
import {CustomerTab} from './customer/CustomerTab.tsx';
import {SellerTab} from './seller/SellerTab.tsx';
import {ProductTab} from "./product/ProductTab.tsx";
import styles from '../../css/admin.module.css'

export const Admin: React.FC = () => {
    const [activeNav, setActiveNav] = useState('Dashboard')

    const renderContent = () => {
        switch (activeNav) {
            case 'Dashboard':
                return <DashboardTab />
            case 'Seller':
                return <SellerTab />
            case 'Customer':
                return <CustomerTab />
            case 'Product':
                // Optional placeholder or fallback for Product tab
               return  <ProductTab/>
            default:
                return < DashboardTab/>
        }
    }

    return (

        <div
            className="fixed inset-0 flex w-screen h-screen overflow-hidden z-50"
            style={{
                background: 'var(--color-canvas)',
                fontFamily: 'var(--font-body)',
            }}
        >
            {/* Sidebar */}
            <aside
                className="flex flex-col shrink-0 border-r h-full"
                style={{ width: 220, background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
                {/* Logo */}
                <div className="flex items-center gap-2.5 px-5 py-5 border-b shrink-0" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-accent)' }}>
                        <svg width="15" height="14" viewBox="0 0 15 14" fill="none">
                            <path d="M1 1h2l1.5 7h7l1.5-5H4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="6.5" cy="12" r="1" fill="white" />
                            <circle cx="11" cy="12" r="1" fill="white" />
                        </svg>
                    </div>
                    <span className="font-semibold text-sm tracking-wide" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                        Violet Cart
                    </span>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
                    {NAV_ITEMS.map(({ icon: Icon, label }) => {
                        const isActive = activeNav === label
                        return (
                            <button
                                key={label}
                                onClick={() => setActiveNav(label)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 w-full text-left"
                                style={{
                                    background: isActive ? 'var(--color-accent-glow)' : 'transparent',
                                    color: isActive ? 'var(--color-accent)' : 'var(--color-muted)',
                                    fontWeight: isActive ? 500 : 400,
                                }}
                            >
                                <Icon size={15} />
                                {label}
                            </button>
                        )
                    })}
                </nav>

                {/* Admin user */}
                <div className="px-4 py-4 border-t flex items-center gap-3 shrink-0" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0" style={{ background: 'var(--color-accent)', color: 'white' }}>VC</div>
                    <div className="min-w-0">
                        <p className="text-xs font-medium truncate" style={{ color: 'var(--color-text)' }}>Admin</p>
                        <p className="text-xs truncate" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>violet cart</p>
                    </div>
                </div>
            </aside>

            <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
                <div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>Wednesday, August 5, 2026</p>
                </div>
                <main className="flex-1 overflow-y-auto">
                    {renderContent()}
                </main>

            </div>
        </div>
    )
}


const NAV_ITEMS = [
    { icon: LayoutGrid, label: 'Dashboard' },
    { icon: Store, label: 'Seller' },
    { icon: Box, label: 'Product' },
    { icon: User, label: 'Customer' },
]
