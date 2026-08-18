import React from 'react';

interface StoreHeaderProps {
    searchQuery?: string;
    totalCartItems: number;
    customerName: string;
    onOpenCart: () => void;
    onLogout?: () => void;
    onSearchChange?: (query: string) => void;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({
                                                            searchQuery = '',
                                                            onSearchChange,
                                                            totalCartItems,
                                                            customerName,
                                                            onOpenCart,
                                                            onLogout,
                                                        }) => {
    return (
        <header
            className="sticky top-0 z-40 border-b px-6 py-4 flex items-center justify-between backdrop-blur-md"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
            <div className="flex items-center gap-3">
                <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-lg shrink-0"
                    style={{ background: 'var(--color-accent)', fontFamily: 'var(--font-display)' }}
                >
                    V
                </div>
                <span className="text-lg font-bold tracking-tight hidden sm:inline" style={{ fontFamily: 'var(--font-display)' }}>
                    Violet Cart
                </span>
            </div>

            {/* Conditionally render Search Bar only if onSearchChange is provided */}
            {onSearchChange && (
                <div className="w-64 md:w-80">
                    <input
                        type="text"
                        placeholder="Search products or sellers…"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full text-xs px-4 py-2 rounded-xl outline-none"
                        style={{
                            background: 'var(--color-surface-2)',
                            color: 'var(--color-text)',
                            border: '1px solid var(--color-border)',
                            fontFamily: 'var(--font-body)',
                        }}
                    />
                </div>
            )}

            <div className="flex items-center gap-3">
                <button
                    onClick={onOpenCart}
                    className="relative px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-colors"
                    style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                >
                    <span>Cart</span>
                    {totalCartItems > 0 && (
                        <span
                            className="px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white"
                            style={{ background: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}
                        >
                            {totalCartItems}
                        </span>
                    )}
                </button>

                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl border" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
                    <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                        style={{ background: 'var(--color-accent)', fontFamily: 'var(--font-display)' }}
                    >
                        {customerName.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <span className="text-xs font-medium" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                        {customerName}
                    </span>
                </div>

                <button
                    onClick={onLogout}
                    className="px-3 py-2 rounded-xl text-xs font-medium border transition-all hover:opacity-80"
                    style={{
                        background: 'rgba(248,113,113,0.12)',
                        color: 'var(--color-danger)',
                        borderColor: 'rgba(248,113,113,0.2)',
                        fontFamily: 'var(--font-display)',
                    }}
                >
                    Logout
                </button>
            </div>
        </header>
    );
};