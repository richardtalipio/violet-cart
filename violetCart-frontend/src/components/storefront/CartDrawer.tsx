import React from 'react';
import type { CartItemResponse } from '@/components/storefront/types';
import type { Product } from '@/components/common/types';
import {SecureImage} from "@/components/common/SecureImage.tsx";

interface CartDrawerProps {
    isOpen: boolean;
    cart: CartItemResponse[];
    products: Product[]; // <--- Added prop definition
    totalCartItems: number;
    subtotal: number;
    onClose: () => void;
    onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
    onRemoveItem: (cartItemId: string) => void;
    onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
                                                          isOpen,
                                                          cart,
                                                          products, // <--- Destructured prop
                                                          totalCartItems,
                                                          subtotal,
                                                          onClose,
                                                          onUpdateQuantity,
                                                          onRemoveItem,
                                                          onProceedToCheckout,
                                                      }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex justify-end"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}
            onClick={onClose}
        >
            <div
                className="w-full max-w-md h-full flex flex-col border-l"
                style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <h2 className="text-base font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                        Your Cart ({totalCartItems})
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-lg leading-none hover:opacity-80 transition-opacity"
                        style={{ background: 'var(--color-surface-2)', color: 'var(--color-muted)' }}
                    >
                        ×
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                    {cart.length === 0 ? (
                        <p className="text-xs text-center py-10" style={{ color: 'var(--color-muted)' }}>
                            Your cart is empty.
                        </p>
                    ) : (
                        cart.map((item) => {
                            // Find matching product to evaluate current stock
                            const matchingProduct = products.find(
                                (p) => Number(p.id) === Number(item.productId)
                            );
                            const maxStock = matchingProduct?.stockQuantity ?? Infinity;
                            const isMaxStockReached = item.quantity >= maxStock;

                            return (
                                <div
                                    key={item.id}
                                    className="flex gap-4 p-3 rounded-xl border relative group"
                                    style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                                >
                                    <SecureImage
                                        src={item.imageUrl}
                                        alt={item.productName}
                                        className="w-14 h-14 rounded-lg object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <p className="text-xs font-semibold truncate pr-4">{item.productName}</p>
                                            <button
                                                onClick={() => onRemoveItem(item.id)}
                                                className="text-[10px] text-red-400 hover:text-red-500 font-medium"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <p className="text-[10px]" style={{ color: 'var(--color-muted)' }}>
                                            ₱{item.price.toLocaleString()}
                                        </p>

                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        if (item.quantity > 1) {
                                                            onUpdateQuantity(item.id, item.quantity - 1);
                                                        } else {
                                                            onRemoveItem(item.id);
                                                        }
                                                    }}
                                                    className="w-5 h-5 rounded border flex items-center justify-center text-xs hover:bg-[var(--color-surface)]"
                                                    style={{ borderColor: 'var(--color-border)' }}
                                                >
                                                    -
                                                </button>
                                                <span className="text-xs font-mono">{item.quantity}</span>
                                                <button
                                                    disabled={isMaxStockReached}
                                                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                                    className={`w-5 h-5 rounded border flex items-center justify-center text-xs transition-colors ${
                                                        isMaxStockReached
                                                            ? 'opacity-40 cursor-not-allowed bg-gray-200'
                                                            : 'hover:bg-[var(--color-surface)]'
                                                    }`}
                                                    style={{ borderColor: 'var(--color-border)' }}
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Optional Max Stock Indicator */}
                                            {isMaxStockReached && (
                                                <span className="text-[10px] text-amber-500 font-medium">
                                                    Max stock reached
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="p-6 border-t flex flex-col gap-4" style={{ borderColor: 'var(--color-border)' }}>
                        <div className="flex justify-between text-xs">
                            <span style={{ color: 'var(--color-muted)' }}>Subtotal</span>
                            <span className="font-bold" style={{ fontFamily: 'var(--font-mono)' }}>
                                ₱{subtotal.toLocaleString()}
                            </span>
                        </div>
                        <button
                            onClick={onProceedToCheckout}
                            className="w-full py-3 rounded-xl text-sm font-medium text-white text-center hover:opacity-90 transition-opacity"
                            style={{ background: 'var(--color-accent)', fontFamily: 'var(--font-display)' }}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};