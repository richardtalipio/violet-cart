import React, { useState } from 'react';

interface Product {
    name: string;
    image: string;
    seller: string;
    sold: number;
    revenue: string;
    reports: number;
    status: 'Active' | 'Banned';
    datePosted: string;
    description: string;
}

const PRODUCTS: Product[] = [
    {
        name: 'Handwoven Bayong Bag',
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=150&auto=format&fit=crop&q=80',
        seller: "Ana's Artisan Goods",
        sold: 142,
        revenue: '₱120,700',
        reports: 0,
        status: 'Active',
        datePosted: '2024-03-15',
        description: 'Eco-friendly handwoven bag made from natural dried pandan leaves. Highly durable, spacious, and crafted by local artisans in Laguna.',
    },
    {
        name: 'Carved Wooden Stool',
        image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=150&auto=format&fit=crop&q=80',
        seller: 'Ocampo Crafts',
        sold: 38,
        revenue: '₱76,000',
        reports: 1,
        status: 'Active',
        datePosted: '2024-04-22',
        description: 'Solid acacia wood stool with a sleek matte finish. Suitable as a side table, plant stand, or minimalist accent seating.',
    },
    {
        name: 'Retro Collectible Card Box',
        image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=150&auto=format&fit=crop&q=80',
        seller: 'CR Collectibles',
        sold: 5,
        revenue: '₱22,500',
        reports: 5,
        status: 'Banned',
        datePosted: '2024-05-10',
        description: 'Vintage card storage box from the early 2000s. Flagged following multiple customer complaints regarding item condition authenticity.',
    },
    {
        name: 'Minimalist Ceramic Vase',
        image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=150&auto=format&fit=crop&q=80',
        seller: 'Flores Home PH',
        sold: 89,
        revenue: '₱44,500',
        reports: 0,
        status: 'Active',
        datePosted: '2024-02-28',
        description: 'Matte-finish ceramic flower vase with a Scandinavian silhouette. Waterproof interior, ideal for fresh or dried florals.',
    },
    {
        name: 'Wireless Mechanical Keyboard',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=150&auto=format&fit=crop&q=80',
        seller: 'EduTech Gadgets',
        sold: 210,
        revenue: '₱525,000',
        reports: 0,
        status: 'Active',
        datePosted: '2024-01-18',
        description: 'Compact 75% hot-swappable mechanical keyboard featuring RGB backlighting and dual Bluetooth 5.0 / Type-C connectivity.',
    },
    {
        name: 'Organic Lip & Cheek Tint',
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=150&auto=format&fit=crop&q=80',
        seller: 'Jasmine Organics',
        sold: 340,
        revenue: '₱85,000',
        reports: 0,
        status: 'Active',
        datePosted: '2024-04-01',
        description: 'All-natural buildable stain infused with virgin coconut oil and aloe vera extract. Lightweight formula for everyday glow.',
    },
];

const PRODUCT_STATUS: Record<string, { color: string; bg: string }> = {
    Active: { color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
    Banned: { color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
};

export const ProductTab: React.FC = () => {
    const [productSearch, setProductSearch] = useState('');
    const [productSort, setProductSort] = useState<{ col: string; dir: 'asc' | 'desc' }>({ col: 'name', dir: 'asc' });
    const [products, setProducts] = useState<Product[]>(PRODUCTS);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const handleToggleStatus = (name: string) => {
        setProducts((prev) =>
            prev.map((p) => {
                if (p.name === name) {
                    const nextStatus = p.status === 'Active' ? 'Banned' : 'Active';
                    return { ...p, status: nextStatus };
                }
                return p;
            })
        );

        setSelectedProduct((prev) => {
            if (prev && prev.name === name) {
                const nextStatus = prev.status === 'Active' ? 'Banned' : 'Active';
                return { ...prev, status: nextStatus };
            }
            return prev;
        });
    };

    const filteredProducts = products
        .filter(
            (p) =>
                p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                p.seller.toLowerCase().includes(productSearch.toLowerCase())
        )
        .sort((a, b) => {
            const mul = productSort.dir === 'asc' ? 1 : -1;
            const key = productSort.col as keyof Product;
            const av = a[key];
            const bv = b[key];

            if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * mul;
            return String(av).localeCompare(String(bv)) * mul;
        });

    const handleProductSort = (col: string) => {
        setProductSort((prev) => ({ col, dir: prev.col === col && prev.dir === 'asc' ? 'desc' : 'asc' }));
    };

    return (
        <main>
            <div className="flex flex-col" style={{ flex: 1 }}>
                {/* Summary row */}
                <div className="grid gap-4 mb-5" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    {[
                        { label: 'Total Products', value: products.length },
                        { label: 'Banned Items', value: products.filter((p) => p.status === 'Banned').length, warn: true },
                        { label: 'Active Products', value: products.filter((p) => p.status === 'Active').length },
                    ].map((p) => (
                        <div
                            key={p.label}
                            className="rounded-xl p-5 border"
                            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                        >
                            <p className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>
                                {p.label}
                            </p>
                            <p
                                className="mt-2 text-3xl font-bold"
                                style={{
                                    fontFamily: 'var(--font-display)',
                                    color: p.warn ? 'var(--color-danger)' : 'var(--color-text)',
                                }}
                            >
                                {p.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Table */}
                <div
                    className="rounded-xl border flex flex-col overflow-hidden"
                    style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', flex: 1 }}
                >
                    <div
                        className="flex items-center justify-between px-5 py-4 border-b shrink-0"
                        style={{ borderColor: 'var(--color-border)' }}
                    >
                        <h2 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                            All Products
                        </h2>
                        <input
                            type="text"
                            placeholder="Search product or seller…"
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            className="text-xs px-3 py-1.5 rounded-lg outline-none w-52"
                            style={{
                                background: 'var(--color-surface-2)',
                                color: 'var(--color-text)',
                                border: '1px solid var(--color-border)',
                                fontFamily: 'var(--font-body)',
                            }}
                        />
                    </div>
                    <div className="overflow-auto flex-1">
                        <table className="w-full text-xs border-collapse">
                            <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                {[
                                    { key: 'name', label: 'Product Name' },
                                    { key: 'sold', label: 'No. of Items Sold' },
                                    { key: 'revenue', label: 'Revenue Earned' },
                                    { key: 'reports', label: 'No. of Reports' },
                                    { key: 'status', label: 'Status' },
                                ].map(({ key, label }) => (
                                    <th
                                        key={key}
                                        onClick={() => handleProductSort(key)}
                                        className="text-left px-5 py-3 font-medium cursor-pointer select-none uppercase"
                                        style={{
                                            color: 'var(--color-muted)',
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '10px',
                                            letterSpacing: '0.06em',
                                        }}
                                    >
                                        {label}
                                        {productSort.col === key ? (productSort.dir === 'asc' ? ' ↑' : ' ↓') : ''}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {filteredProducts.map((p, i) => {
                                const st = PRODUCT_STATUS[p.status];
                                return (
                                    <tr
                                        key={p.name}
                                        onClick={() => setSelectedProduct(p)}
                                        style={{
                                            borderBottom: i < filteredProducts.length - 1 ? '1px solid var(--color-border)' : undefined,
                                            background: 'transparent',
                                            cursor: 'pointer',
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-2)')}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        <td className="px-5 py-3.5">
                                            <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                                                {p.name}
                                            </p>
                                            <p style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)', fontSize: 10 }}>
                                                {p.seller}
                                            </p>
                                        </td>
                                        <td className="px-5 py-3.5" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>
                                            {p.sold}
                                        </td>
                                        <td className="px-5 py-3.5" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>
                                            {p.revenue}
                                        </td>
                                        <td className="px-5 py-3.5">
                                                <span
                                                    className="font-medium px-1.5 py-0.5 rounded"
                                                    style={{
                                                        fontFamily: 'var(--font-mono)',
                                                        color:
                                                            p.reports > 2
                                                                ? 'var(--color-danger)'
                                                                : p.reports > 0
                                                                    ? 'var(--color-warning)'
                                                                    : 'var(--color-muted)',
                                                        background:
                                                            p.reports > 2
                                                                ? 'rgba(248,113,113,0.12)'
                                                                : p.reports > 0
                                                                    ? 'rgba(251,191,36,0.12)'
                                                                    : 'transparent',
                                                    }}
                                                >
                                                    {p.reports}
                                                </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                                <span
                                                    className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                                                    style={{ color: st.color, background: st.bg }}
                                                >
                                                    {p.status}
                                                </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div>
                {/* Product detail modal */}
                {selectedProduct && (
                    <div
                        className="fixed inset-0 flex items-center justify-center z-50"
                        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                        onClick={() => setSelectedProduct(null)}
                    >
                        <div
                            className="rounded-2xl border flex flex-col"
                            style={{
                                background: 'var(--color-surface)',
                                borderColor: 'var(--color-border)',
                                width: 480,
                                maxHeight: '85vh',
                                overflow: 'hidden',
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
                                <h2 className="text-base font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                                    Product Details
                                </h2>
                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    className="w-7 h-7 rounded-lg flex items-center justify-center text-lg leading-none"
                                    style={{ background: 'var(--color-surface-2)', color: 'var(--color-muted)' }}
                                >
                                    ×
                                </button>
                            </div>

                            {/* Modal body */}
                            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
                                {/* Image + product title & seller */}
                                <div className="flex items-center gap-4">
                                    <img
                                        src={selectedProduct.image}
                                        alt={selectedProduct.name}
                                        className="w-16 h-16 rounded-xl object-cover shrink-0 border"
                                        style={{ borderColor: 'var(--color-border)' }}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-base font-semibold truncate" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                                            {selectedProduct.name}
                                        </p>
                                        <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--color-muted)' }}>
                                            By {selectedProduct.seller}
                                        </p>
                                    </div>
                                    <div className="ml-auto shrink-0">
                                        {(() => {
                                            const st = PRODUCT_STATUS[selectedProduct.status];
                                            return (
                                                <span
                                                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                                                    style={{ color: st.color, background: st.bg }}
                                                >
                                                    {selectedProduct.status}
                                                </span>
                                            );
                                        })()}
                                    </div>
                                </div>

                                {/* Stats grid */}
                                <div className="grid grid-cols-4 gap-3">
                                    {[
                                        { label: 'Items Sold', val: selectedProduct.sold },
                                        { label: 'Revenue', val: selectedProduct.revenue },
                                        { label: 'Reports', val: selectedProduct.reports },
                                        { label: 'Posted', val: selectedProduct.datePosted },
                                    ].map((item) => (
                                        <div key={item.label} className="rounded-xl p-3" style={{ background: 'var(--color-surface-2)' }}>
                                            <p className="text-xs font-semibold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>
                                                {item.val}
                                            </p>
                                            <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-muted)' }}>
                                                {item.label}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Product description text area */}
                                <div>
                                    <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-muted)' }}>
                                        Product Description
                                    </p>
                                    <textarea
                                        readOnly
                                        rows={3}
                                        value={selectedProduct.description}
                                        className="w-full text-xs p-3 rounded-xl outline-none resize-none"
                                        style={{
                                            background: 'var(--color-surface-2)',
                                            color: 'var(--color-text)',
                                            border: '1px solid var(--color-border)',
                                            fontFamily: 'var(--font-body)',
                                            lineHeight: '1.5',
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Modal footer — action button */}
                            <div className="flex gap-3 px-6 py-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                                <button
                                    onClick={() => handleToggleStatus(selectedProduct.name)}
                                    className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150"
                                    style={{
                                        background:
                                            selectedProduct.status === 'Active'
                                                ? 'rgba(248,113,113,0.12)'
                                                : 'rgba(52,211,153,0.12)',
                                        color:
                                            selectedProduct.status === 'Active'
                                                ? 'var(--color-danger)'
                                                : '#34d399',
                                        fontFamily: 'var(--font-display)',
                                        border:
                                            selectedProduct.status === 'Active'
                                                ? '1px solid rgba(248,113,113,0.2)'
                                                : '1px solid rgba(52,211,153,0.2)',
                                    }}
                                >
                                    {selectedProduct.status === 'Active' ? 'Ban' : 'Restore'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};