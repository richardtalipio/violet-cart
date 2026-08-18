import React from 'react';
import { ProductCard } from './ProductCard';
import type { Product } from "@/components/common/types.ts";

interface ProductGridProps {
    products: Product[];
    categories: string[];
    selectedCategory: string;
    currentPage: number;
    pageSize: number;
    totalPages: number;
    cartQuantities?: Record<string | number, number>; // Flexible for Long/number IDs
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
                                                            totalPages,
                                                            cartQuantities = {},
                                                            onSelectCategory,
                                                            onPageChange,
                                                            onSelectProduct,
                                                            onAddToCart,
                                                        }) => {
    // Backend pagination: products array holds current page items
    const paginatedProducts = products;
    const startIndex = (currentPage - 1) * pageSize;
    const currentItemsCount = paginatedProducts.length;

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

            {/* Grid display for products */}
            {paginatedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {paginatedProducts.map((product) => {
                        // Ensure key match works whether ID is number or string
                        const inCartCount = cartQuantities[product.id] ?? cartQuantities[String(product.id)] ?? 0;
                        const isMaxInCart = inCartCount >= product.stockQuantity;

                        return (
                            <ProductCard
                                key={product.id}
                                product={product}
                                isAddToCartDisabled={isMaxInCart}
                                onSelect={onSelectProduct}
                                onAddToCart={onAddToCart}
                            />
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-12 text-xs" style={{ color: 'var(--color-muted)' }}>
                    No products found.
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t pt-4 mt-4" style={{ borderColor: 'var(--color-border)' }}>
                    <p className="text-xs" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
                        Showing {startIndex + 1}–{startIndex + currentItemsCount} items (Page {currentPage} of {totalPages})
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => onPageChange(currentPage - 1)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium border disabled:opacity-40 transition-all cursor-pointer disabled:cursor-not-allowed"
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
                                    className="w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer"
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
                            className="px-3 py-1.5 rounded-lg text-xs font-medium border disabled:opacity-40 transition-all cursor-pointer disabled:cursor-not-allowed"
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