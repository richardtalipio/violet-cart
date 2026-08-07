import React from 'react';
import { type CartItem } from './types';

interface CartDrawerProps {
    isOpen: boolean;
    cart: CartItem[];
    totalCartItems: number;
    subtotal: number;
    onClose: () => void;
    onUpdateQuantity: (productId: string, delta: number) => void;
    onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
                                                          isOpen,
                                                          cart,
                                                          totalCartItems,
                                                          subtotal,
                                                          onClose,
                                                          onUpdateQuantity,
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
                    <h2 className="text-base font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Your Cart ({totalCartItems})</h2>
                    <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-lg leading-none" style={{ background: 'var(--color-surface-2)', color: 'var(--color-muted)' }}>
                        ×
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                    {cart.length === 0 ? (
                        <p className="text-xs text-center py-10" style={{ color: 'var(--color-muted)' }}>Your cart is empty.</p>
                    ) : (
                        cart.map((item) => (
                            <div key={item.product.id} className="flex gap-4 p-3 rounded-xl border" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
                                <img src={item.product.image} alt={item.product.name} className="w-14 h-14 rounded-lg object-cover" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold truncate">{item.product.name}</p>
                                    <p className="text-[10px]" style={{ color: 'var(--color-muted)' }}>{item.product.priceFormatted}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <button onClick={() => onUpdateQuantity(item.product.id, -1)} className="w-5 h-5 rounded border flex items-center justify-center text-xs" style={{ borderColor: 'var(--color-border)' }}>-</button>
                                        <span className="text-xs font-mono">{item.quantity}</span>
                                        <button onClick={() => onUpdateQuantity(item.product.id, 1)} className="w-5 h-5 rounded border flex items-center justify-center text-xs" style={{ borderColor: 'var(--color-border)' }}>+</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="p-6 border-t flex flex-col gap-4" style={{ borderColor: 'var(--color-border)' }}>
                        <div className="flex justify-between text-xs">
                            <span style={{ color: 'var(--color-muted)' }}>Subtotal</span>
                            <span className="font-bold" style={{ fontFamily: 'var(--font-mono)' }}>₱{subtotal.toLocaleString()}</span>
                        </div>
                        <button
                            onClick={onProceedToCheckout}
                            className="w-full py-3 rounded-xl text-sm font-medium text-white text-center"
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