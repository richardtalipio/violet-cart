import React from 'react';
import { type Product } from './types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
    products: Product[];
    categories: string[];
    selectedCategory: string;
    currentPage: number;
    pageSize: number;
    onSelectCategory: (category: string) => void;
    onPageChange: (page: number) => void;
    onSelectProduct: (product: Product) => void;
    onAddToCart: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
                                                            products,
                                                            categories,
                                                            selectedCategory,
                                                            currentPage,
                                                            pageSize,
                                                            onSelectCategory,
                                                            onPageChange,
                                                            onSelectProduct,
                                                            onAddToCart,
                                                        }) => {
    // 1. Calculate Pagination Range
    const totalPages = Math.ceil(products.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedProducts = products.slice(startIndex, startIndex + pageSize);

    return (
        <main className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full flex flex-col gap-6">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {categories.map((cat) => {
                    const isActive = selectedCategory === cat;
                    return (
                        <button
                            key={cat}
                            onClick={() => onSelectCategory(cat)}
                            className="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
                            style={{
                                background: isActive ? 'var(--color-accent)' : 'var(--color-surface-2)',
                                color: isActive ? 'white' : 'var(--color-muted)',
                                border: `1px solid ${isActive ? 'var(--color-accent)' : 'var(--color-border)'}`,
                            }}
                        >
                            {cat}
                        </button>
                    );
                })}
            </div>

            {/* Grid display for sliced items */}
            {paginatedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {paginatedProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onSelect={onSelectProduct}
                            onAddToCart={onAddToCart}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-xs" style={{ color: 'var(--color-muted)' }}>
                    No products found.
                </div>
            )}

            {/* 2. Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t pt-4 mt-4" style={{ borderColor: 'var(--color-border)' }}>
                    <p className="text-xs" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
                        Showing {startIndex + 1}–{Math.min(startIndex + pageSize, products.length)} of {products.length} products
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => onPageChange(currentPage - 1)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium border disabled:opacity-40 transition-all"
                            style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                        >
                            Previous
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                            const isCurrent = page === currentPage;
                            return (
                                <button
                                    key={page}
                                    onClick={() => onPageChange(page)}
                                    className="w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all"
                                    style={{
                                        background: isCurrent ? 'var(--color-accent)' : 'var(--color-surface-2)',
                                        color: isCurrent ? 'white' : 'var(--color-text)',
                                        border: `1px solid ${isCurrent ? 'var(--color-accent)' : 'var(--color-border)'}`,
                                        fontFamily: 'var(--font-mono)',
                                    }}
                                >
                                    {page}
                                </button>
                            );
                        })}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => onPageChange(currentPage + 1)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium border disabled:opacity-40 transition-all"
                            style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
};