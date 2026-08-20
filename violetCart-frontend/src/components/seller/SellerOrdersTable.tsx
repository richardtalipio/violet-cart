import React, { useState } from 'react';
import { type Order, type OrderStatus } from '../common/types';
import { SellerOrderDetailModal } from './SellerOrderDetailModal';

interface SellerOrdersTableProps {
    orders: Order[];
    onRequestStatusChange: (order: Order, newStatus: OrderStatus) => void;
}

export const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
        case 'Pending Payment':
            return { background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.25)' };
        case 'Preparing':
            return { background: 'rgba(59, 130, 246, 0.12)', color: '#60a5fa', borderColor: 'rgba(59, 130, 246, 0.25)' };
        case 'Ready for Shipment':
            return { background: 'rgba(59, 130, 246, 0.12)', color: '#60a5fa', borderColor: 'rgba(59, 130, 246, 0.25)' };
        case 'In Transit':
            return { background: 'rgba(168, 85, 247, 0.12)', color: '#c084fc', borderColor: 'rgba(168, 85, 247, 0.25)' };
        case 'Out for Delivery':
            return { background: 'rgba(168, 85, 247, 0.12)', color: '#c084fc', borderColor: 'rgba(168, 85, 247, 0.25)' };
        case 'Delivered':
            return { background: 'rgba(34, 197, 94, 0.12)', color: '#4ade80', borderColor: 'rgba(34, 197, 94, 0.25)' };
        case 'Cancelled':
            return { background: 'rgba(239, 68, 68, 0.12)', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.25)' };
        case 'Expired':
            return { background: 'rgba(156, 163, 175, 0.12)', color: '#6b7280', borderColor: 'rgba(156, 163, 175, 0.25)' };
        default:
            return { background: 'var(--color-surface-2)', color: 'var(--color-text)', borderColor: 'var(--color-border)' };
    }
};

export const SellerOrdersTable: React.FC<SellerOrdersTableProps> = ({ orders, onRequestStatusChange }) => {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const sortedOrders = [...orders].sort(
        (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );

    return (
        <div className="flex flex-col gap-4">
            <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                <table className="w-full text-left text-xs border-collapse">
                    <thead>
                    <tr className="border-b" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-2)' }}>
                        <th className="p-4 font-semibold">Order ID</th>
                        <th className="p-4 font-semibold">Customer</th>
                        <th className="p-4 font-semibold">Items</th>
                        <th className="p-4 font-semibold">Total Amount</th>
                        <th className="p-4 font-semibold">Order Date</th>
                        <th className="p-4 font-semibold">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedOrders.map((order) => {
                        const badgeStyle = getStatusStyle(order.status);
                        const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

                        return (
                            <tr
                                key={order.id}
                                onClick={() => setSelectedOrder(order)}
                                className="border-b cursor-pointer transition-colors hover:bg-surface-2"
                                style={{ borderColor: 'var(--color-border)' }}
                            >
                                <td className="p-4 font-mono font-bold">{order.id}</td>
                                <td className="p-4 font-medium">{order.customerName}</td>
                                <td className="p-4">{itemCount} item{itemCount > 1 ? 's' : ''}</td>
                                <td className="p-4 font-mono font-bold">₱{order.breakdown.total.toLocaleString()}</td>
                                <td className="p-4" style={{ color: 'var(--color-muted)' }}>{order.orderDate}</td>
                                <td className="p-4">
                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold border" style={badgeStyle}>
                                            ● {order.status}
                                        </span>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            <SellerOrderDetailModal
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
                onRequestStatusChange={(ord, status) => {
                    onRequestStatusChange(ord, status);
                    setSelectedOrder(null);
                }}
            />
        </div>
    );
};