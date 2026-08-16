import React from 'react';
import type {Product} from "@/components/common/types.ts";

interface ProductCardProps {
    product: Product;
    onSelect: (product: Product) => void;
    onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onAddToCart }) => {
    const isOutOfStock = product.stockQuantity <= 0;
    const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;

    return (
        <div
            onClick={() => onSelect(product)}
            className="rounded-2xl border flex flex-col overflow-hidden cursor-pointer group transition-all duration-200"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
            <div className="aspect-square w-full overflow-hidden bg-surface-2 relative">
                <img
                    src={product.imageUrl}
                    alt={product.productName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Rating & Review Count Badge */}
                <span
                    className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md flex items-center gap-1"
                    style={{ background: 'rgba(0,0,0,0.6)', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}
                >
                    ★ {product.rating.toFixed(1)}
                </span>
            </div>

            <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                <div>
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-medium" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
                            {product.seller}
                        </p>

                        {/* Stock Left Indicator */}
                        <span
                            className="text-[10px] font-semibold"
                            style={{
                                fontFamily: 'var(--font-mono)',
                                color: isOutOfStock
                                    ? 'var(--color-danger)'
                                    : isLowStock
                                        ? '#f59e0b'
                                        : 'var(--color-muted)',
                            }}
                        >
                            {isOutOfStock ? 'Out of stock' : `${product.stockQuantity} left`}
                        </span>
                    </div>

                    <h3 className="text-sm font-semibold mt-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                        {product.productName}
                    </h3>
                </div>

                <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <p className="text-sm font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }}>
                        ₱{product.price}
                    </p>
                    <button
                        disabled={isOutOfStock}
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(product);
                        }}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: 'var(--color-accent)', fontFamily: 'var(--font-display)' }}
                    >
                        {isOutOfStock ? 'Sold Out' : '+ Add'}
                    </button>
                </div>
            </div>
        </div>
    );
};