import React from 'react';
import { type Product } from '../common/types';

interface ProductGridProps {
    products: Product[];
    categories: string[];
    selectedCategory: string;
    currentPage: number;
    pageSize: number;
    onSelectCategory: (category: string) => void;
    onPageChange: (page: number) => void;
    onSelectProduct: (product: Product) => void;
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
                                                        }) => {
    const totalPages = Math.ceil(products.length / pageSize) || 1;
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedProducts = products.slice(startIndex, startIndex + pageSize);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {categories.map((cat) => {
                    const isActive = selectedCategory === cat;
                    return (
                        <button
                            key={cat}
                            onClick={() => onSelectCategory(cat)}
                            className="px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border"
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

            {paginatedProducts.length === 0 ? (
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
                    {paginatedProducts.map((product) => (
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
                                <img
                                    src={product.image}
                                    alt={product.name}
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
                                        {product.name}
                                    </h3>
                                    <p className="text-[11px] mt-0.5 line-clamp-2" style={{ color: 'var(--color-muted)' }}>
                                        {product.description}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
                                    <div>
                                        <span className="text-xs font-bold" style={{ fontFamily: 'var(--font-mono)' }}>
                                            {product.priceFormatted}
                                        </span>
                                        <div className="text-[10px]" style={{ color: 'var(--color-muted)' }}>
                                            Stock: {product.stock}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => onPageChange(currentPage - 1)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border disabled:opacity-40"
                        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                    >
                        Prev
                    </button>
                    <span className="text-xs font-medium px-2" style={{ color: 'var(--color-muted)' }}>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => onPageChange(currentPage + 1)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border disabled:opacity-40"
                        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};