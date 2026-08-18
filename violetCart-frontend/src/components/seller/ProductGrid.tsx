import React from 'react';
import { type Product } from '../common/types';
import {SecureImage} from "@/components/common/SecureImage.tsx";

interface ProductGridProps {
    products: Product[];
    categories: string[];
    selectedCategory: string;
    currentPage: number;
    pageSize: number;
    totalPages: number;
    loading?: boolean; // Added loading state prop
    onSelectCategory: (category: string) => void;
    onPageChange: (page: number) => void;
    onSelectProduct: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
                                                            products,
                                                            categories,
                                                            selectedCategory,
                                                            currentPage,
                                                            totalPages,
                                                            loading = false,
                                                            onSelectCategory,
                                                            onPageChange,
                                                            onSelectProduct,
                                                        }) => {
    // Generate page numbers with intelligent truncation (...) for page jumping
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            let start = Math.max(1, currentPage - 1);
            let end = Math.min(totalPages, currentPage + 1);

            if (currentPage <= 2) {
                end = 3;
            } else if (currentPage >= totalPages - 1) {
                start = totalPages - 2;
            }

            if (start > 1) {
                pages.push(1);
                if (start > 2) pages.push('...');
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (end < totalPages) {
                if (end < totalPages - 1) pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <div className="flex flex-col gap-6 relative min-h-[400px]">
            {/* Loading Overlay */}
            {loading && (
                <div
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl backdrop-blur-sm transition-all"
                    style={{ background: 'rgba(0, 0, 0, 0.2)' }}
                >
                    <div
                        className="w-8 h-8 border-3 border-t-transparent rounded-full animate-spin"
                        style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }}
                    />
                    <span className="text-xs font-semibold mt-3 text-white drop-shadow-md">
                        Loading products...
                    </span>
                </div>
            )}

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {categories.map((cat) => {
                    const isActive = selectedCategory === cat;
                    return (
                        <button
                            key={cat}
                            disabled={loading}
                            onClick={() => onSelectCategory(cat)}
                            className="px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border disabled:opacity-50"
                            style={{
                                background: isActive ? 'var(--color-accent)' : 'var(--color-surface)',
                                color: isActive ? '#ffffff' : 'var(--color-text)',
                                borderColor: isActive ? 'var(--color-accent)' : 'var(--color-border)',
                            }}
                        >
                            {cat}
                        </button>
                    );
                })}
            </div>

            {/* Products Grid */}
            {products.length === 0 && !loading ? (
                <div
                    className="p-12 text-center rounded-2xl border flex flex-col items-center justify-center"
                    style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                >
                    <p className="text-sm font-medium" style={{ color: 'var(--color-muted)' }}>
                        No products found in this category.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => onSelectProduct(product)}
                            className="rounded-2xl border overflow-hidden cursor-pointer transition-transform hover:-translate-y-1 flex flex-col"
                            style={{
                                background: 'var(--color-surface)',
                                borderColor: 'var(--color-border)',
                            }}
                        >
                            <div className="w-full h-40 bg-surface-2 overflow-hidden relative">
                                <SecureImage
                                    src={product.imageUrl}
                                    alt={product.productName}
                                    className="w-full h-full object-cover"
                                />
                                <span
                                    className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-semibold text-white"
                                    style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                                >
                                    {product.category}
                                </span>
                            </div>

                            <div className="p-4 flex flex-col flex-1 justify-between gap-2">
                                <div>
                                    <h3
                                        className="text-xs font-semibold line-clamp-1"
                                        style={{ fontFamily: 'var(--font-display)' }}
                                    >
                                        {product.productName}
                                    </h3>
                                    <p className="text-[11px] mt-0.5 line-clamp-2" style={{ color: 'var(--color-muted)' }}>
                                        {product.description}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
                                    <div>
                                        <span className="text-xs font-bold" style={{ fontFamily: 'var(--font-mono)' }}>
                                            ₱{product.price}
                                        </span>
                                        <div className="text-[10px]" style={{ color: 'var(--color-muted)' }}>
                                            Stock: {product.stockQuantity}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Jump-to Page Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t flex-wrap gap-3" style={{ borderColor: 'var(--color-border)' }}>
                    <span className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>
                        Page {currentPage} of {totalPages}
                    </span>

                    <div className="flex items-center gap-1.5 overflow-x-auto">
                        {/* Previous Button */}
                        <button
                            disabled={currentPage === 1 || loading}
                            onClick={() => onPageChange(currentPage - 1)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-medium border disabled:opacity-40 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                        >
                            Prev
                        </button>

                        {/* Direct Page Numbers */}
                        {getPageNumbers().map((item, idx) => {
                            if (typeof item === 'string') {
                                return (
                                    <span key={`ellipsis-${idx}`} className="px-1 text-xs" style={{ color: 'var(--color-muted)' }}>
                                        {item}
                                    </span>
                                );
                            }

                            const isCurrent = item === currentPage;
                            return (
                                <button
                                    key={item}
                                    disabled={loading}
                                    onClick={() => onPageChange(item)}
                                    className="w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all border disabled:opacity-50"
                                    style={{
                                        background: isCurrent ? 'var(--color-accent)' : 'var(--color-surface)',
                                        color: isCurrent ? '#ffffff' : 'var(--color-text)',
                                        borderColor: isCurrent ? 'var(--color-accent)' : 'var(--color-border)',
                                        fontFamily: 'var(--font-mono)',
                                    }}
                                >
                                    {item}
                                </button>
                            );
                        })}

                        {/* Next Button */}
                        <button
                            disabled={currentPage === totalPages || loading}
                            onClick={() => onPageChange(currentPage + 1)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-medium border disabled:opacity-40 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};