import React from 'react';
import type { Product } from "@/components/common/types.ts";
import { SecureImage } from '@/components/common/SecureImage'; // Import SecureImage component

interface ProductCardProps {
    product: Product;
    isAddToCartDisabled?: boolean; // Prop to indicate if button should be disabled via cart count
    cartQuantity?: number; // Optional direct count of items in cart
    onSelect: (product: Product) => void;
    onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
                                                            product,
                                                            isAddToCartDisabled,
                                                            cartQuantity = 0,
                                                            onSelect,
                                                            onAddToCart
                                                        }) => {
    // Safely fallback to 0 if stockQuantity or rating is missing
    const stockQuantity = product?.stockQuantity ?? 0;
    const rating = product?.rating ?? 0;

    const remainingStock = stockQuantity - cartQuantity;
    const isOutOfStock = stockQuantity <= 0;
    const isMaxInCart = isAddToCartDisabled ?? (remainingStock <= 0);
    const isLowStock = remainingStock > 0 && remainingStock <= 5;

    return (
        <div
            onClick={() => onSelect(product)}
            className="rounded-2xl border flex flex-col overflow-hidden cursor-pointer group transition-all duration-200"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
            <div className="aspect-square w-full overflow-hidden bg-surface-2 relative">
                <SecureImage
                    src={product?.imageUrl || ''}
                    alt={product?.productName || 'Product'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <span
                    className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md flex items-center gap-1"
                    style={{ background: 'rgba(0,0,0,0.6)', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}
                >
                    ★ {rating.toFixed(1)}
                </span>
            </div>

            <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                <div>
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-medium" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
                            {product?.storeName || 'Unknown Seller'}
                        </p>

                        <span
                            className="text-[10px] font-semibold"
                            style={{
                                fontFamily: 'var(--font-mono)',
                                color: isOutOfStock || isMaxInCart
                                    ? 'var(--color-danger)'
                                    : isLowStock
                                        ? '#f59e0b'
                                        : 'var(--color-muted)',
                            }}
                        >
                            {isOutOfStock
                                ? 'Out of stock'
                                : isMaxInCart
                                    ? 'Max in cart'
                                    : `${remainingStock} left`}
                        </span>
                    </div>

                    <h3 className="text-sm font-semibold mt-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                        {product?.productName || 'Unnamed Product'}
                    </h3>
                </div>

                <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <p className="text-sm font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }}>
                        ₱{product?.price ?? 0}
                    </p>
                    <button
                        disabled={isMaxInCart}
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(product);
                        }}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: 'var(--color-accent)', fontFamily: 'var(--font-display)' }}
                    >
                        {isOutOfStock ? 'Sold Out' : isMaxInCart ? 'Max Limit' : '+ Add'}
                    </button>
                </div>
            </div>
        </div>
    );
};