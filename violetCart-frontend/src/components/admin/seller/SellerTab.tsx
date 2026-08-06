import React, { useState } from "react";


const SELLERS = [
    { name: 'Ana Lim', shop: "Ana's Artisan Goods", products: 48, revenue: '₱184,520', reports: 0, status: 'Active', joined: '2024-03-12', email: 'ana.lim@email.com', description: 'Handcrafted artisan goods made from sustainably sourced local materials. Specializing in woven bags, accessories, and home décor that celebrate Filipino craftsmanship.' },
    { name: 'Benj Ocampo', shop: 'Ocampo Crafts', products: 23, revenue: '₱97,340', reports: 1, status: 'Active', joined: '2024-04-20', email: 'benj.ocampo@email.com', description: 'Traditional woodcraft and handmade furniture from Cebu. Each piece is carved by hand and treated with natural finishes.' },
    { name: 'Carlo Reyes', shop: 'CR Collectibles', products: 11, revenue: '₱43,210', reports: 4, status: 'Flagged', joined: '2024-05-03', email: 'carlo.reyes@email.com', description: 'Vintage collectibles and rare items sourced from auctions and estate sales. Authenticity of some items has been disputed by buyers.' },
    { name: 'Diana Flores', shop: 'Flores Home PH', products: 35, revenue: '₱128,900', reports: 0, status: 'Active', joined: '2024-02-18', email: 'diana.flores@email.com', description: 'Modern home living essentials designed for Filipino households. From minimalist décor to functional kitchen tools.' },
    { name: 'Eduardo Santos', shop: 'EduTech Gadgets', products: 62, revenue: '₱213,750', reports: 2, status: 'Active', joined: '2024-01-09', email: 'edu.santos@email.com', description: 'Affordable tech accessories and educational gadgets for students and professionals. Focused on value-for-money electronics.' },
    { name: 'Fatima Reyes', shop: 'Fatima Bakehouse', products: 18, revenue: '₱56,430', reports: 0, status: 'Active', joined: '2024-06-01', email: 'fatima.reyes@email.com', description: 'Home-baked pastries and breads made fresh daily. All products are baked to order with no preservatives.' },
    { name: 'Gilbert Cruz', shop: 'GC Outdoors', products: 29, revenue: '₱89,600', reports: 1, status: 'Active', joined: '2024-05-14', email: 'gilbert.cruz@email.com', description: 'Outdoor and camping gear for adventure enthusiasts. Curated selection of tents, packs, and survival tools.' },
    { name: 'Hannah Bautista', shop: 'HB Fashion', products: 74, revenue: '₱301,200', reports: 0, status: 'Active', joined: '2023-11-22', email: 'hannah.bautista@email.com', description: 'Trendy and affordable ready-to-wear clothing for women. New collections drop every two weeks inspired by global fashion.' },
    { name: 'Ivan Mendoza', shop: 'Mendoza Parts', products: 9, revenue: '₱21,800', reports: 3, status: 'Flagged', joined: '2024-07-05', email: 'ivan.mendoza@email.com', description: 'Automotive spare parts and accessories. Several buyers have reported receiving items that did not match the listed specifications.' },
    { name: 'Jasmine Tan', shop: 'Jasmine Organics', products: 41, revenue: '₱162,450', reports: 0, status: 'Active', joined: '2024-03-30', email: 'jasmine.tan@email.com', description: 'Certified organic skincare and wellness products made from Philippine botanicals. All formulations are dermatologist-tested.' },
    { name: 'Kevin Garcia', shop: 'KG Electronics', products: 55, revenue: '₱247,000', reports: 1, status: 'Active', joined: '2024-02-02', email: 'kevin.garcia@email.com', description: 'Consumer electronics and smart home devices at competitive prices. Authorized reseller for several regional brands.' },
    { name: 'Lorna Villanueva', shop: 'Lorna Textiles', products: 33, revenue: '₱110,680', reports: 0, status: 'Pending', joined: '2024-07-28', email: 'lorna.villanueva@email.com', description: 'Handwoven textiles and indigenous fabrics from the Cordillera region. Seller application currently under review for authenticity verification.' },
]

const SELLER_STATUS: Record<string, { color: string; bg: string }> = {
    Active: { color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
    Flagged: { color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
    Pending: { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
}


export const SellerTab: React.FC = () => {
    const [sellerSearch, setSellerSearch] = useState('')
    const [sellerSort, setSellerSort] = useState<{ col: string; dir: 'asc' | 'desc' }>({ col: 'name', dir: 'asc' })
    const [sellers, setSellers] = useState(SELLERS)
    const [selectedSeller, setSelectedSeller] = useState<typeof SELLERS[0] | null>(null)

    const handleApprove = (name: string) => {
        setSellers((prev) => prev.map((s) => s.name === name ? { ...s, status: 'Active' } : s))
        setSelectedSeller((prev) => prev && prev.name === name ? { ...prev, status: 'Active' } : prev)
    }

    const handleReject = (name: string) => {
        setSellers((prev) => prev.map((s) => s.name === name ? { ...s, status: 'Rejected' } : s))
        setSelectedSeller(null)
    }

    const filteredSellers = sellers.filter(
        (s) =>
            s.name.toLowerCase().includes(sellerSearch.toLowerCase()) ||
            s.shop.toLowerCase().includes(sellerSearch.toLowerCase()),
    ).sort((a, b) => {
        const mul = sellerSort.dir === 'asc' ? 1 : -1
        const av = (a as Record<string, string | number>)[sellerSort.col]
        const bv = (b as Record<string, string | number>)[sellerSort.col]
        if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * mul
        return String(av).localeCompare(String(bv)) * mul
    })

    const handleSellerSort = (col: string) => {
        setSellerSort((prev) => ({ col, dir: prev.col === col && prev.dir === 'asc' ? 'desc' : 'asc' }))
    }
    return (
        <main>
            <div className="flex flex-col" style={{ flex: 1 }}>
                {/* Summary row */}
                <div className="grid gap-4 mb-5" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    {[
                        { label: 'Total Sellers', value: SELLERS.length },
                        { label: 'Flagged Sellers', value: SELLERS.filter(s => s.status === 'Flagged').length, warn: true },
                        { label: 'Pending Approval', value: SELLERS.filter(s => s.status === 'Pending').length },
                    ].map((s) => (
                        <div key={s.label} className="rounded-xl p-5 border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                            <p className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>{s.label}</p>
                            <p className="mt-2 text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: s.warn ? 'var(--color-danger)' : 'var(--color-text)' }}>{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Table */}
                <div className="rounded-xl border flex flex-col overflow-hidden" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', flex: 1 }}>
                    <div className="flex items-center justify-between px-5 py-4 border-b shrink-0" style={{ borderColor: 'var(--color-border)' }}>
                        <h2 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>All Sellers</h2>
                        <input
                            type="text"
                            placeholder="Search name or shop…"
                            value={sellerSearch}
                            onChange={(e) => setSellerSearch(e.target.value)}
                            className="text-xs px-3 py-1.5 rounded-lg outline-none w-52"
                            style={{ background: 'var(--color-surface-2)', color: 'var(--color-text)', border: '1px solid var(--color-border)', fontFamily: 'var(--font-body)' }}
                        />
                    </div>
                    <div className="overflow-auto flex-1">
                        <table className="w-full text-xs border-collapse">
                            <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                {[
                                    { key: 'name', label: 'Name' },
                                    { key: 'products', label: 'No. of Products' },
                                    { key: 'revenue', label: 'Revenue' },
                                    { key: 'reports', label: 'No. of Reports' },
                                    { key: 'status', label: 'Status' },
                                ].map(({ key, label }) => (
                                    <th
                                        key={key}
                                        onClick={() => handleSellerSort(key)}
                                        className="text-left px-5 py-3 font-medium cursor-pointer select-none uppercase"
                                        style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.06em' }}
                                    >
                                        {label}{sellerSort.col === key ? (sellerSort.dir === 'asc' ? ' ↑' : ' ↓') : ''}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {filteredSellers.map((s, i) => {
                                const st = SELLER_STATUS[s.status]
                                return (
                                    <tr
                                        key={s.name}
                                        onClick={() => setSelectedSeller(s)}
                                        style={{ borderBottom: i < filteredSellers.length - 1 ? '1px solid var(--color-border)' : undefined, background: 'transparent', cursor: 'pointer' }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-2)')}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        <td className="px-5 py-3.5">
                                            <p className="font-medium" style={{ color: 'var(--color-text)' }}>{s.name}</p>
                                            <p style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)', fontSize: 10 }}>{s.shop}</p>
                                        </td>
                                        <td className="px-5 py-3.5" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>{s.products}</td>
                                        <td className="px-5 py-3.5" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>{s.revenue}</td>
                                        <td className="px-5 py-3.5">
                            <span
                                className="font-medium px-1.5 py-0.5 rounded"
                                style={{
                                    fontFamily: 'var(--font-mono)',
                                    color: s.reports > 2 ? 'var(--color-danger)' : s.reports > 0 ? 'var(--color-warning)' : 'var(--color-muted)',
                                    background: s.reports > 2 ? 'rgba(248,113,113,0.12)' : s.reports > 0 ? 'rgba(251,191,36,0.12)' : 'transparent',
                                }}
                            >
                              {s.reports}
                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                            <span
                                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                                style={{ color: st.color, background: st.bg }}
                            >
                              {s.status}
                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div>
                {/* Seller detail modal */}
                {selectedSeller && (
                    <div
                        className="fixed inset-0 flex items-center justify-center z-50"
                        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                        onClick={() => setSelectedSeller(null)}
                    >
                        <div
                            className="rounded-2xl border flex flex-col"
                            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', width: 480, maxHeight: '85vh', overflow: 'hidden' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
                                <h2 className="text-base font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>Seller Details</h2>
                                <button
                                    onClick={() => setSelectedSeller(null)}
                                    className="w-7 h-7 rounded-lg flex items-center justify-center text-lg leading-none"
                                    style={{ background: 'var(--color-surface-2)', color: 'var(--color-muted)' }}
                                >
                                    ×
                                </button>
                            </div>

                            {/* Modal body */}
                            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
                                {/* Avatar + name */}
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
                                        style={{ background: 'var(--color-accent)', color: 'white', fontFamily: 'var(--font-display)' }}
                                    >
                                        {selectedSeller.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                                    </div>
                                    <div>
                                        <p className="text-base font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>{selectedSeller.name}</p>
                                        <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>{selectedSeller.shop}</p>
                                        <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>{selectedSeller.email}</p>
                                    </div>
                                    <div className="ml-auto">
                                        {(() => {
                                            const st = SELLER_STATUS[selectedSeller.status] ?? SELLER_STATUS['Active']
                                            return (
                                                <span
                                                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                                                    style={{ color: st.color, background: st.bg }}
                                                >
                        {selectedSeller.status}
                      </span>
                                            )
                                        })()}
                                    </div>
                                </div>

                                {/* Stats grid */}
                                <div className="grid grid-cols-4 gap-3">
                                    {[
                                        { label: 'Products', val: selectedSeller.products },
                                        { label: 'Revenue', val: selectedSeller.revenue },
                                        { label: 'Reports', val: selectedSeller.reports },
                                        { label: 'Joined', val: selectedSeller.joined },
                                    ].map((item) => (
                                        <div key={item.label} className="rounded-xl p-3" style={{ background: 'var(--color-surface-2)' }}>
                                            <p className="text-xs font-semibold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>{item.val}</p>
                                            <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-muted)' }}>{item.label}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Store description */}
                                <div>
                                    <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-muted)' }}>Store Description</p>
                                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>{selectedSeller.description}</p>
                                </div>
                            </div>

                            {/* Modal footer — actions */}
                            <div className="flex gap-3 px-6 py-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                                <button
                                    onClick={() => handleReject(selectedSeller.name)}
                                    className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150"
                                    style={{ background: 'rgba(248,113,113,0.12)', color: 'var(--color-danger)', fontFamily: 'var(--font-display)', border: '1px solid rgba(248,113,113,0.2)' }}
                                >
                                    Reject
                                </button>
                                <button
                                    onClick={() => handleApprove(selectedSeller.name)}
                                    className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150"
                                    style={{ background: 'var(--color-accent)', color: 'white', fontFamily: 'var(--font-display)' }}
                                >
                                    Approve
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>


    );
}