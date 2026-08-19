import React, { useState } from 'react';

interface CheckoutModalProps {
    isOpen: boolean;
    customerName: string;
    subtotal: number;
    onClose: () => void;
    onConfirmOrder: (data: { shippingAddress: string; paymentMethod: 'ONLINE' | 'COD' }) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
                                                                isOpen,
                                                                customerName,
                                                                subtotal,
                                                                onClose,
                                                                onConfirmOrder,
                                                            }) => {
    const [shippingAddress, setShippingAddress] = useState("123 Ayala Avenue, Makati City");
    const [paymentMethod, setPaymentMethod] = useState<'ONLINE' | 'COD'>('ONLINE');

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
        >
            <div
                className="rounded-2xl border flex flex-col"
                style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', width: 480, maxHeight: '85vh' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <h2 className="text-base font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Checkout</h2>
                    <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-lg leading-none" style={{ background: 'var(--color-surface-2)', color: 'var(--color-muted)' }}>
                        ×
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex flex-col gap-4">
                    <div>
                        <label className="text-xs font-medium block mb-1" style={{ color: 'var(--color-muted)' }}>Customer Name</label>
                        <input type="text" readOnly defaultValue={customerName} className="w-full text-xs p-3 rounded-xl border outline-none" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }} />
                    </div>

                    <div>
                        <label className="text-xs font-medium block mb-1" style={{ color: 'var(--color-muted)' }}>Shipping Address</label>
                        <input
                            type="text"
                            value={shippingAddress}
                            onChange={(e) => setShippingAddress(e.target.value)}
                            className="w-full text-xs p-3 rounded-xl border outline-none"
                            style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium block mb-1" style={{ color: 'var(--color-muted)' }}>Payment Method</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value as 'ONLINE' | 'COD')}
                            className="w-full text-xs p-3 rounded-xl border outline-none"
                            style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                        >
                            <option value="ONLINE">GCash</option>
                            <option value="ONLINE">Maya</option>
                            <option value="COD">Cash on Delivery (COD)</option>
                        </select>
                    </div>

                    <div className="p-4 rounded-xl border flex flex-col gap-2 mt-2" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
                        <span className="text-xs font-semibold" style={{ color: 'var(--color-muted)' }}>Order Summary</span>
                        <div className="flex justify-between text-xs">
                            <span>Total Amount</span>
                            <span className="font-bold" style={{ fontFamily: 'var(--font-mono)' }}>₱{subtotal.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <button
                        onClick={() => onConfirmOrder({ shippingAddress, paymentMethod })}
                        className="w-full py-3 rounded-xl text-sm font-medium text-white"
                        style={{ background: 'var(--color-accent)', fontFamily: 'var(--font-display)' }}
                    >
                        Confirm & Place Order
                    </button>
                </div>
            </div>
        </div>
    );
};