import React, { useState } from 'react';
import type {Product} from "@/components/common/types.ts";

const PRODUCTS: Product[] = [
    {
        id: '1',
        productName: 'Handwoven Bayong Bag',
        imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=150&auto=format&fit=crop&q=80',
        storeName: "Ana's Artisan Goods",
        price: 850,
        category: 'Fashion',
        rating: 4.8,
        stockQuantity: 142,
        description: 'Eco-friendly handwoven bag made from natural dried pandan leaves. Highly durable, spacious, and crafted by local artisans in Laguna.',
    },
    {
        id: '2',
        productName: 'Carved Wooden Stool',
        imageUrl: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=150&auto=format&fit=crop&q=80',
        storeName: 'Ocampo Crafts',
        price: 2000,
        category: 'Home & Living',
        rating: 4.5,
        stockQuantity: 38,
        description: 'Solid acacia wood stool with a sleek matte finish. Suitable as a side table, plant stand, or minimalist accent seating.',
    },
    {
        id: '3',
        productName: 'Retro Collectible Card Box',
        imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=150&auto=format&fit=crop&q=80',
        storeName: 'CR Collectibles',
        price: 4500,
        category: 'Collectibles',
        rating: 2.3,
        stockQuantity: 5,
        description: 'Vintage card storage box from the early 2000s. Flagged following multiple customer complaints regarding item condition authenticity.',
    },
    {
        id: '4',
        productName: 'Minimalist Ceramic Vase',
        imageUrl: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=150&auto=format&fit=crop&q=80',
        storeName: 'Flores Home PH',
        price: 500,
        category: 'Home Decor',
        rating: 4.9,
        stockQuantity: 89,
        description: 'Matte-finish ceramic flower vase with a Scandinavian silhouette. Waterproof interior, ideal for fresh or dried florals.',
    },
    {
        id: '5',
        productName: 'Wireless Mechanical Keyboard',
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=150&auto=format&fit=crop&q=80',
        storeName: 'EduTech Gadgets',
        price: 2500,
        category: 'Electronics',
        rating: 4.2,
        stockQuantity: 210,
        description: 'Compact 75% hot-swappable mechanical keyboard featuring RGB backlighting and dual Bluetooth 5.0 / Type-C connectivity.',
    },
    {
        id: '6',
        productName: 'Organic Lip & Cheek Tint',
        imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=150&auto=format&fit=crop&q=80',
        storeName: 'Jasmine Organics',
        price: 250,
        category: 'Beauty',
        rating: 5.0,
        stockQuantity: 340,
        description: 'All-natural buildable stain infused with virgin coconut oil and aloe vera extract. Lightweight formula for everyday glow.',
    },
];

const renderStars = (rating: number) => {
    return (
        <div className="flex items-center gap-1">
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        style={{
                            color: star <= rating ? '#F59E0B' : star - 0.5 <= rating ? '#F59E0B' : '#D1D5DB',
                            fontSize: '12px',
                        }}
                    >
                        ★
                    </span>
                ))}
            </div>
            <span style={{ color: 'var(--color-text)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                ({rating.toFixed(1)})
            </span>
        </div>
    );
};

export const ProductTab: React.FC = () => {
    const [productSearch, setProductSearch] = useState('');
    const [productSort, setProductSort] = useState<{ col: keyof Product; dir: 'asc' | 'desc' }>({ col: 'productName', dir: 'asc' });
    const [products] = useState<Product[]>(PRODUCTS);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const filteredProducts = products
        .filter(
            (p) =>
                p.productName.toLowerCase().includes(productSearch.toLowerCase()) ||
                p.storeName.toLowerCase().includes(productSearch.toLowerCase()) ||
                p.category.toLowerCase().includes(productSearch.toLowerCase())
        )
        .sort((a, b) => {
            const mul = productSort.dir === 'asc' ? 1 : -1;
            const av = a[productSort.col];
            const bv = b[productSort.col];

            if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * mul;
            return String(av).localeCompare(String(bv)) * mul;
        });

    const handleProductSort = (col: keyof Product) => {
        setProductSort((prev) => ({ col, dir: prev.col === col && prev.dir === 'asc' ? 'desc' : 'asc' }));
    };

    return (
        <main>
            <div className="flex flex-col" style={{ flex: 1 }}>
                {/* Summary row */}
                <div className="grid gap-4 mb-5" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    {[
                        { label: 'Total Products', value: products.length },
                        { label: 'Avg Rating', value: (products.reduce((acc, p) => acc + p.rating, 0) / products.length).toFixed(1) },
                        { label: 'Total Stock', value: products.reduce((acc, p) => acc + p.stockQuantity, 0) },
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
                                    color: 'var(--color-text)',
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
                            placeholder="Search product, storeName, category…"
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            className="text-xs px-3 py-1.5 rounded-lg outline-none w-60"
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
                                    { key: 'productName', label: 'Product Name' },
                                    { key: 'category', label: 'Category' },
                                    { key: 'price', label: 'Price' },
                                    { key: 'stockQuantity', label: 'Stock' },
                                    { key: 'rating', label: 'Rating' },
                                ].map(({ key, label }) => (
                                    <th
                                        key={key}
                                        onClick={() => handleProductSort(key as keyof Product)}
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
                            {filteredProducts.map((p, i) => (
                                <tr
                                    key={p.id}
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
                                            {p.productName}
                                        </p>
                                        <p style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)', fontSize: 10 }}>
                                            {p.storeName}
                                        </p>
                                    </td>
                                    <td className="px-5 py-3.5" style={{ color: 'var(--color-text)' }}>
                                        {p.category}
                                    </td>
                                    <td className="px-5 py-3.5" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>
                                        ₱{p.price.toLocaleString()}
                                    </td>
                                    <td className="px-5 py-3.5" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>
                                        {p.stockQuantity}
                                    </td>
                                    <td className="px-5 py-3.5">{renderStars(p.rating)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

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

                        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
                            <div className="flex items-center gap-4">
                                <img
                                    src={selectedProduct.imageUrl}
                                    alt={selectedProduct.productName}
                                    className="w-16 h-16 rounded-xl object-cover shrink-0 border"
                                    style={{ borderColor: 'var(--color-border)' }}
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="text-base font-semibold truncate" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                                        {selectedProduct.productName}
                                    </p>
                                    <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--color-muted)' }}>
                                        By {selectedProduct.storeName}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: 'Price', val: `₱${selectedProduct.price.toLocaleString()}` },
                                    { label: 'Stock', val: selectedProduct.stockQuantity },
                                    { label: 'Category', val: selectedProduct.category },
                                ].map((item) => (
                                    <div key={item.label} className="rounded-xl p-3" style={{ background: 'var(--color-surface-2)' }}>
                                        <p className="text-xs font-semibold truncate" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>
                                            {item.val}
                                        </p>
                                        <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-muted)' }}>
                                            {item.label}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-muted)' }}>
                                    Rating
                                </p>
                                {renderStars(selectedProduct.rating)}
                            </div>

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
                    </div>
                </div>
            )}
        </main>
    );
};