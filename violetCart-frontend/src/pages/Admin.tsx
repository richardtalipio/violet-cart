import React, { useState } from 'react'
import styles from '../css/admin.module.css'

interface IconProps {
    size?: number
    active?: boolean
}

const STATS = [
    { label: 'Total Revenue', value: '₱2,847,320', delta: '+12.4%', up: true, sub: 'vs last month' },
    { label: 'Active Customers', value: '8,412', delta: '+6.2%', up: true, sub: 'vs last month' },
    { label: 'Active Sellers', value: '1,093', delta: '+3.7%', up: true, sub: 'vs last month' },
    { label: 'Churn Rate', value: '2.3%', delta: '-0.4%', up: false, sub: 'vs last month' },
]

const PENDING = [
    { label: 'Pending Seller Evaluations', value: 24, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
    { label: 'Pending Report Evaluations', value: 11, color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
]

const TOP_SELLER = {
    name: 'Ana Lim',
    shop: "Ana's Artisan Goods",
    sales: '₱184,520',
    orders: 312,
    rating: 4.9,
    initials: 'AL',
    badge: 'Top Seller — July 2026',
}

const TOP_PRODUCT = {
    name: 'Handwoven Rattan Bag',
    seller: "Ana's Artisan Goods",
    revenue: '₱62,400',
    units: 208,
    category: 'Accessories',
}

const GATEWAYS = [
    { name: 'GCash', status: 'Operational', latency: '112ms', uptime: '99.98%' },
    { name: 'Maya', status: 'Operational', latency: '98ms', uptime: '99.95%' },
    { name: 'Credit / Debit', status: 'Degraded', latency: '430ms', uptime: '97.2%' },
    { name: 'COD', status: 'Operational', latency: '—', uptime: '100%' },
]

const ACTIVITY = [
    { user: 'Juan dela Cruz', action: 'submitted seller application', time: '3m ago', type: 'seller' },
    { user: 'Maria Santos', action: 'filed a report on Seller #4821', time: '15m ago', type: 'report' },
    { user: 'System', action: 'automated payout batch processed', time: '42m ago', type: 'system' },
    { user: 'Carlo Reyes', action: 'account flagged for review', time: '1h ago', type: 'flag' },
    { user: 'Ana Lim', action: 'seller evaluation approved', time: '2h ago', type: 'seller' },
    { user: 'System', action: 'daily backup completed', time: '3h ago', type: 'system' },
    { user: 'Benj Ocampo', action: 'submitted seller application', time: '5h ago', type: 'seller' },
    { user: 'Rosa Villanueva', action: 'filed a report on Order #9934', time: '7h ago', type: 'report' },
    { user: 'System', action: 'fraud detection scan passed', time: '9h ago', type: 'system' },
    { user: 'Diego Marcos', action: 'seller evaluation declined', time: '1d ago', type: 'flag' },
]

const ACTIVITY_COLORS: Record<string, string> = {
    seller: 'bg-[#6366f1]',
    report: 'bg-[#f87171]',
    system: 'bg-[#6b7280]',
    flag: 'bg-[#fbbf24]',
}

const GATEWAY_STATUS_STYLE: Record<string, { color: string; bg: string }> = {
    Operational: { color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
    Degraded: { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
    Down: { color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
}

const App: React.FC = () => {
    const [activeNav, setActiveNav] = useState('Dashboard')

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
                                <Icon size={15} active={isActive} />
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

            {/* Main column */}
            <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
                {/* Topbar */}
                <header
                    className="flex items-center justify-between px-8 h-24 border-b shrink-0 w-full"
                    style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                >
                    <div>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>Wednesday, August 5, 2026</p>
                    </div>
                </header>

                {/* Scrollable body */}
                <main
                    className="flex-1 overflow-y-auto flex flex-col gap-5 w-full"
                    style={{ padding: '24px 32px', minHeight: 0 }}
                >
                    {/* Stat cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                        {STATS.map((s) => (
                            <div
                                key={s.label}
                                className="rounded-xl p-5 border flex flex-col justify-between"
                                style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                            >
                                <p className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>{s.label}</p>
                                <p className="mt-2 text-2xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>{s.value}</p>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <span
                                        className="text-xs font-medium px-1.5 py-0.5 rounded"
                                        style={{
                                            fontFamily: 'var(--font-mono)',
                                            color: s.up ? 'var(--color-success)' : 'var(--color-danger)',
                                            background: s.up ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)',
                                        }}
                                    >
                                        {s.delta}
                                    </span>
                                    <span className="text-xs" style={{ color: 'var(--color-muted)' }}>{s.sub}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Middle row: pending + top seller + top product */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
                        {/* Pending evaluations */}
                        <div className="flex flex-col gap-4">
                            {PENDING.map((p) => (
                                <div
                                    key={p.label}
                                    className="rounded-xl p-5 border flex items-center justify-between flex-1"
                                    style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                                >
                                    <div>
                                        <p className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>{p.label}</p>
                                        <p className="mt-1.5 text-4xl font-bold" style={{ fontFamily: 'var(--font-display)', color: p.color }}>{p.value}</p>
                                        <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>awaiting review</p>
                                    </div>
                                    <div
                                        className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shrink-0"
                                        style={{ background: p.bg, color: p.color, fontFamily: 'var(--font-display)' }}
                                    >
                                        {p.value}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Top Seller of the Month */}
                        <div
                            className="rounded-xl border flex flex-col p-5"
                            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                        >
                            <p className="text-xs font-medium mb-4" style={{ color: 'var(--color-muted)' }}>Top Seller of the Month</p>
                            <div className="flex flex-col items-center text-center flex-1 justify-center gap-3">
                                <div
                                    className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold"
                                    style={{ background: 'var(--color-accent)', color: 'white', fontFamily: 'var(--font-display)' }}
                                >
                                    {TOP_SELLER.initials}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>{TOP_SELLER.name}</p>
                                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>{TOP_SELLER.shop}</p>
                                </div>
                                <span
                                    className="text-[10px] font-medium px-2.5 py-1 rounded-full"
                                    style={{ background: 'var(--color-accent-glow)', color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}
                                >
                                    {TOP_SELLER.badge}
                                </span>
                                <div className="w-full grid grid-cols-3 gap-2 mt-1">
                                    {[
                                        { label: 'Revenue', val: TOP_SELLER.sales },
                                        { label: 'Orders', val: TOP_SELLER.orders },
                                        { label: 'Rating', val: `★ ${TOP_SELLER.rating}` },
                                    ].map((item) => (
                                        <div key={item.label} className="rounded-lg p-2" style={{ background: 'var(--color-surface-2)' }}>
                                            <p className="text-xs font-semibold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>{item.val}</p>
                                            <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-muted)' }}>{item.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Top Product + Payment Gateway stacked */}
                        <div className="flex flex-col gap-4">
                            {/* Top Product */}
                            <div
                                className="rounded-xl border p-5"
                                style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                            >
                                <p className="text-xs font-medium mb-3" style={{ color: 'var(--color-muted)' }}>Top Product of the Month</p>
                                <div className="flex items-start gap-3">
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-base"
                                        style={{ background: 'var(--color-surface-2)' }}
                                    >
                                        🛍
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>{TOP_PRODUCT.name}</p>
                                        <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--color-muted)' }}>{TOP_PRODUCT.seller}</p>
                                        <span
                                            className="inline-block text-[10px] px-2 py-0.5 rounded-full mt-1"
                                            style={{ background: 'var(--color-surface-2)', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}
                                        >
                                            {TOP_PRODUCT.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-3">
                                    <div className="rounded-lg p-2.5" style={{ background: 'var(--color-surface-2)' }}>
                                        <p className="text-xs font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>{TOP_PRODUCT.revenue}</p>
                                        <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-muted)' }}>Revenue</p>
                                    </div>
                                    <div className="rounded-lg p-2.5" style={{ background: 'var(--color-surface-2)' }}>
                                        <p className="text-xs font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>{TOP_PRODUCT.units}</p>
                                        <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-muted)' }}>Units Sold</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Gateway Status */}
                            <div
                                className="rounded-xl border p-5 flex-1"
                                style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                            >
                                <p className="text-xs font-medium mb-3" style={{ color: 'var(--color-muted)' }}>Payment Gateway Status</p>
                                <div className="flex flex-col gap-2">
                                    {GATEWAYS.map((g) => {
                                        const st = GATEWAY_STATUS_STYLE[g.status]
                                        return (
                                            <div key={g.name} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: st.color }} />
                                                    <span className="text-xs font-medium" style={{ color: 'var(--color-text)' }}>{g.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px]" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>{g.latency}</span>
                                                    <span
                                                        className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                                                        style={{ color: st.color, background: st.bg, fontFamily: 'var(--font-mono)' }}
                                                    >
                                                        {g.status}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default App

// Icon components typed with React.FC
const GridIcon: React.FC<IconProps> = ({ size = 16, active = false }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" stroke={active ? 'var(--color-accent)' : 'currentColor'} strokeWidth="1.4" />
        <rect x="9" y="1" width="6" height="6" rx="1.5" stroke={active ? 'var(--color-accent)' : 'currentColor'} strokeWidth="1.4" />
        <rect x="1" y="9" width="6" height="6" rx="1.5" stroke={active ? 'var(--color-accent)' : 'currentColor'} strokeWidth="1.4" />
        <rect x="9" y="9" width="6" height="6" rx="1.5" stroke={active ? 'var(--color-accent)' : 'currentColor'} strokeWidth="1.4" />
    </svg>
)

const UsersIcon: React.FC<IconProps> = ({ size = 16, active = false }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <circle cx="6" cy="5" r="2.5" stroke={active ? 'var(--color-accent)' : 'currentColor'} strokeWidth="1.4" />
        <path d="M1 13c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke={active ? 'var(--color-accent)' : 'currentColor'} strokeWidth="1.4" strokeLinecap="round" />
        <path d="M11 7.5a2.5 2.5 0 000-5M15 13a4 4 0 00-4-4" stroke={active ? 'var(--color-accent)' : 'currentColor'} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
)

const StoreIcon: React.FC<IconProps> = ({ size = 16, active = false }) => {
    const c = active ? 'var(--color-accent)' : 'currentColor'
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
            <path d="M1.5 6.5V14h13V6.5" stroke={c} strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M1 3h14l-1.5 3.5a2 2 0 01-1.84 1.22 2 2 0 01-1.91-1.4l-.08-.27-.08.27A2 2 0 018.66 7.72a2 2 0 01-1.91-1.4l-.08-.27-.08.27A2 2 0 014.68 7.72 2 2 0 012.5 6.5L1 3z" stroke={c} strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
    )
}

const BoxIcon: React.FC<IconProps> = ({ size = 16, active = false }) => {
    const c = active ? 'var(--color-accent)' : 'currentColor'
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
            <path d="M8 1.5L14.5 5v6L8 14.5 1.5 11V5L8 1.5z" stroke={c} strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M8 1.5v13M1.5 5l6.5 3.5L14.5 5" stroke={c} strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
    )
}

const BellIcon: React.FC<IconProps> = ({ size = 16, active = false }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <path d="M8 1a5 5 0 00-5 5v3l-1.5 2h13L13 9V6a5 5 0 00-5-5z" stroke={active ? 'var(--color-accent)' : 'currentColor'} strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M6.5 13a1.5 1.5 0 003 0" stroke={active ? 'var(--color-accent)' : 'currentColor'} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
)

const NAV_ITEMS = [
    { icon: GridIcon, label: 'Dashboard' },
    { icon: StoreIcon, label: 'Seller' },
    { icon: BoxIcon, label: 'Product' },
    { icon: UsersIcon, label: 'Customer' },
]