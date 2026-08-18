import React, { useState } from 'react';
import type { Product } from "@/components/common/types.ts";
import { SecureImage } from '@/components/common/SecureImage';

interface ProductDetailModalProps {
    product: Product | null;
    cartQuantity?: number;
    onClose: () => void;
    onAddToCart: (product: Product) => void;
    onSubmitRating?: (productId: string, rating: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
                                                                          product,
                                                                          cartQuantity = 0,
                                                                          onClose,
                                                                          onAddToCart,
                                                                          onSubmitRating,
                                                                      }) => {
    const [userRating, setUserRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
    const [isZoomed, setIsZoomed] = useState<boolean>(false);

    if (!product) return null;

    const remainingStock = product.stockQuantity - cartQuantity;
    const isOutOfStock = remainingStock <= 0;
    const isLowStock = remainingStock > 0 && remainingStock <= 5;

    // Format current rating metrics safely
    const currentRating = product.rating ? Number(product.rating).toFixed(1) : '0.0';
    const totalReviews = (product as unknown as { reviewCount?: number }).reviewCount ?? 0;

    const handleRatingSubmit = (ratingValue: number) => {
        setUserRating(ratingValue);
        setHasSubmitted(true);
        if (onSubmitRating) {
            onSubmitRating(String(product.id), ratingValue);
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
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-lg leading-none cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ background: 'var(--color-surface-2)', color: 'var(--color-muted)' }}
                    >
                        ×
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto flex flex-col gap-5">
                    <div className="w-full h-48 rounded-xl border overflow-hidden relative" style={{ borderColor: 'var(--color-border)' }}>
                        <SecureImage
                            src={product.imageUrl || ''}
                            alt={product.productName}
                            className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                            onClick={() => setIsZoomed(true)}
                        />
                    </div>

                    {/* Image Zoom Modal */}
                    {isZoomed && (
                        <div
                            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 cursor-pointer"
                            onClick={() => setIsZoomed(false)}
                        >
                            <button
                                className="absolute top-4 right-4 text-white text-3xl font-bold p-2 cursor-pointer"
                                onClick={() => setIsZoomed(false)}
                            >
                                ×
                            </button>
                            <SecureImage
                                src={product.imageUrl || ''}
                                alt={product.productName}
                                className="max-h-full max-w-full object-contain"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    )}

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
                                {isOutOfStock
                                    ? (product.stockQuantity === 0 ? 'Out of Stock' : 'Max stock added to cart')
                                    : `${remainingStock} left in stock`}
                            </span>
                        </div>

                        <div className="flex items-start justify-between gap-2 mt-2">
                            <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                                {product.productName}
                            </h3>

                            {/* Current Product Rating Badge */}
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border flex-shrink-0" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
                                <span className="text-amber-400 text-sm">★</span>
                                <span className="text-xs font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }}>
                                    {currentRating}
                                </span>
                                {totalReviews > 0 && (
                                    <span className="text-[10px]" style={{ color: 'var(--color-muted)' }}>
                                        ({totalReviews})
                                    </span>
                                )}
                            </div>
                        </div>

                        <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
                            Sold by {product.storeName}
                        </p>
                    </div>

                    <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text)' }}>
                        {product.description}
                    </p>

                    {/* Rating Section */}
                    <div
                        className="p-4 rounded-xl border flex flex-col gap-2"
                        style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                                Rate this Product
                            </span>
                            <span className="text-[10px] font-medium" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
                                Average: ★ {currentRating} / 5.0
                            </span>
                        </div>

                        {hasSubmitted ? (
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-semibold text-emerald-400">
                                    ✓ You rated this {userRating} ★
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between mt-1">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => handleRatingSubmit(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="text-lg transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                                            style={{
                                                color: star <= (hoverRating || userRating) ? '#fbbf24' : 'var(--color-border)',
                                            }}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                                <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
                                    {hoverRating ? `${hoverRating} Stars` : 'Tap to rate'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 border-t flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
                    <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-mono)' }}>
                        ₱{product.price.toLocaleString()}
                    </span>
                    <button
                        disabled={isOutOfStock}
                        onClick={() => {
                            onAddToCart(product);
                            handleCloseModal();
                        }}
                        className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        style={{ background: 'var(--color-accent)', fontFamily: 'var(--font-display)' }}
                    >
                        {isOutOfStock ? (product.stockQuantity === 0 ? 'Out of Stock' : 'Max Limit Reached') : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
};