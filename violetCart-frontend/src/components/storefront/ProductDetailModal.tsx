import React, { useState } from 'react';
import type {Product} from "@/components/common/types.ts";

interface ProductDetailModalProps {
    product: Product | null;
    onClose: () => void;
    onAddToCart: (product: Product) => void;
    onSubmitRating?: (productId: string, rating: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
                                                                          product,
                                                                          onClose,
                                                                          onAddToCart,
                                                                          onSubmitRating,
                                                                      }) => {
    const [userRating, setUserRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

    if (!product) return null;

    const isOutOfStock = product.stockQuantity <= 0;
    const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;

    const handleRatingSubmit = (ratingValue: number) => {
        setUserRating(ratingValue);
        setHasSubmitted(true);
        if (onSubmitRating) {
            onSubmitRating(product.id, ratingValue);
        }
    };

    const handleCloseModal = () => {
        setUserRating(0);
        setHoverRating(0);
        setHasSubmitted(false);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={handleCloseModal}
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
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <h2 className="text-base font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                        Product Details
                    </h2>
                    <button
                        onClick={handleCloseModal}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-lg leading-none"
                        style={{ background: 'var(--color-surface-2)', color: 'var(--color-muted)' }}
                    >
                        ×
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto flex flex-col gap-5">
                    <img
                        src={product.imageUrl}
                        alt={product.productName}
                        className="w-full h-48 object-cover rounded-xl border"
                        style={{ borderColor: 'var(--color-border)' }}
                    />

                    <div>
                        <div className="flex items-center justify-between">
                            <span
                                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399' }}
                            >
                                {product.category}
                            </span>

                            {/* Stock Indicator */}
                            <span
                                className="text-xs font-semibold"
                                style={{
                                    fontFamily: 'var(--font-mono)',
                                    color: isOutOfStock
                                        ? 'var(--color-danger)'
                                        : isLowStock
                                            ? '#f59e0b'
                                            : 'var(--color-muted)',
                                }}
                            >
                                {isOutOfStock ? 'Out of Stock' : `${product.stockQuantity} left in stock`}
                            </span>
                        </div>

                        <h3 className="text-lg font-bold mt-2" style={{ fontFamily: 'var(--font-display)' }}>
                            {product.productName}
                        </h3>
                        <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
                            Sold by {product.seller}
                        </p>
                    </div>

                    <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text)' }}>
                        {product.description}
                    </p>

                    {/* Interactive User Rating Section */}
                    <div
                        className="p-4 rounded-xl border flex flex-col gap-2"
                        style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                                Rate this Product
                            </span>
                            <span className="text-[10px]" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
                                Overall: ★ {product.rating.toFixed(1)}
                            </span>
                        </div>

                        {hasSubmitted ? (
                            <p className="text-xs font-medium text-emerald-400">
                                Thank you! You rated this {userRating} ★
                            </p>
                        ) : (
                            <div className="flex items-center gap-1 mt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => handleRatingSubmit(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="text-lg transition-transform hover:scale-110 focus:outline-none"
                                        style={{
                                            color: star <= (hoverRating || userRating) ? '#fbbf24' : 'var(--color-border)',
                                        }}
                                    >
                                        ★
                                    </button>
                                ))}
                                <span className="text-xs ml-2" style={{ color: 'var(--color-muted)' }}>
                                    {hoverRating ? `${hoverRating} Stars` : 'Select stars to submit'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 border-t flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
                    <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-mono)' }}>
                        ₱{product.price}
                    </span>
                    <button
                        disabled={isOutOfStock}
                        onClick={() => {
                            onAddToCart(product);
                            handleCloseModal();
                        }}
                        className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: 'var(--color-accent)', fontFamily: 'var(--font-display)' }}
                    >
                        {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
};