import React from 'react';
import { type Order, type OrderStatus } from '../common/types';
import { getStatusStyle } from './SellerOrdersTable';

interface SellerOrderDetailModalProps {
    order: Order | null;
    onClose: () => void;
    onRequestStatusChange: (order: Order, newStatus: OrderStatus) => void;
}

const STATUS_OPTIONS: OrderStatus[] = ['Paid', 'To Ship', 'To Receive', 'Completed', 'Cancelled'];

export const SellerOrderDetailModal: React.FC<SellerOrderDetailModalProps> = ({
                                                                                  order,
                                                                                  onClose,
                                                                                  onRequestStatusChange,
                                                                              }) => {
    if (!order) return null;

    const badgeStyle = getStatusStyle(order.status);

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
        >
            <div
                className="rounded-2xl border flex flex-col"
                style={{
                    background: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    width: 540,
                    maxHeight: '90vh',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base font-bold" style={{ fontFamily: 'var(--font-mono)' }}>
                                {order.id}
                            </h2>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border" style={badgeStyle}>
                                ● {order.status}
                            </span>
                        </div>
                        <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-muted)' }}>
                            Placed on {order.orderDate}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-lg leading-none"
                        style={{ background: 'var(--color-surface-2)', color: 'var(--color-muted)' }}
                    >
                        ×
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex flex-col gap-6 text-xs">
                    <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
                        <div>
                            <span className="text-[10px] uppercase tracking-wider font-semibold block mb-1" style={{ color: 'var(--color-muted)' }}>
                                Customer Info
                            </span>
                            <p className="font-semibold">{order.shippingAddress.fullName}</p>
                            <p style={{ color: 'var(--color-muted)' }}>{order.shippingAddress.phone}</p>
                        </div>
                        <div>
                            <span className="text-[10px] uppercase tracking-wider font-semibold block mb-1" style={{ color: 'var(--color-muted)' }}>
                                Shipping Address
                            </span>
                            <p>{order.shippingAddress.street}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}</p>
                        </div>
                    </div>

                    <div>
                        <span className="text-[10px] uppercase tracking-wider font-semibold block mb-2" style={{ color: 'var(--color-muted)' }}>
                            Items Ordered ({order.items.length})
                        </span>
                        <div className="flex flex-col gap-2">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between p-3 rounded-xl border"
                                    style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                                >
                                    <div className="flex items-center gap-3">
                                        <img src={item.image} alt={item.productName} className="w-10 h-10 object-cover rounded-lg border" style={{ borderColor: 'var(--color-border)' }} />
                                        <div>
                                            <p className="font-semibold">{item.productName}</p>
                                            <p className="text-[11px]" style={{ color: 'var(--color-muted)' }}>
                                                {item.priceFormatted} × {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="font-mono font-bold">
                                        ₱{(item.price * item.quantity).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 rounded-xl border flex flex-col gap-2" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
                        <span className="text-[10px] uppercase tracking-wider font-semibold block mb-1" style={{ color: 'var(--color-muted)' }}>
                            Payment Breakdown
                        </span>
                        <div className="flex justify-between">
                            <span style={{ color: 'var(--color-muted)' }}>Subtotal</span>
                            <span className="font-mono">₱{order.breakdown.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span style={{ color: 'var(--color-muted)' }}>Shipping Fee</span>
                            <span className="font-mono">₱{order.breakdown.shippingFee.toLocaleString()}</span>
                        </div>
                        {order.breakdown.discount > 0 && (
                            <div className="flex justify-between text-emerald-400">
                                <span>Discount</span>
                                <span className="font-mono">-₱{order.breakdown.discount.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between pt-2 border-t font-bold text-sm" style={{ borderColor: 'var(--color-border)' }}>
                            <span>Total Amount</span>
                            <span className="font-mono">₱{order.breakdown.total.toLocaleString()}</span>
                        </div>
                    </div>

                    <div>
                        <span className="text-[10px] uppercase tracking-wider font-semibold block mb-2" style={{ color: 'var(--color-muted)' }}>
                            Update Order Status
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                            {STATUS_OPTIONS.map((status) => {
                                const style = getStatusStyle(status);
                                const isCurrent = order.status === status;
                                return (
                                    <button
                                        key={status}
                                        onClick={() => onRequestStatusChange(order, status)}
                                        className="py-2 px-3 rounded-xl text-xs font-medium border transition-all flex items-center justify-center gap-1"
                                        style={{
                                            background: isCurrent ? style.background : 'var(--color-surface-2)',
                                            color: isCurrent ? style.color : 'var(--color-text)',
                                            borderColor: isCurrent ? style.borderColor : 'var(--color-border)',
                                        }}
                                    >
                                        <span>{status}</span>
                                        {isCurrent && <span>✓</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};