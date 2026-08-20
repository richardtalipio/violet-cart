import type {PaymentMethod} from "@/schemas/orderSchema.ts";
import type {ShippingAddress} from "@/components/common/types.ts";


export interface CheckoutResponse {
    orderId: string;
    orderStatus: string;
    paymentMethod: PaymentMethod;
    totalAmount: number;
    expiresAt: string | null;
    message: string;
}

export const OrderStatus = {
    PENDING_PAYMENT: 'PENDING_PAYMENT',
    PREPARING: 'PREPARING',
    READY_FOR_SHIPMENT: 'READY_FOR_SHIPMENT',
    IN_TRANSIT: 'IN_TRANSIT',
    OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
    EXPIRED: 'EXPIRED',
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export interface OrderItemDto {
    id: string;
    productId: number;
    productName: string;
    imageUrl: string;
    price: number;
    quantity: number;
}

export interface OrderResponse {
    id: string;
    userAccountId: number;
    customerName: string;
    orderDate: string; // ISO 8601 string from LocalDateTime (e.g. "2026-08-19T14:44:16")
    orderStatus: OrderStatus;
    paymentMethod: PaymentMethod;
    expiresAt: string | null;
    shippingAddress: ShippingAddress;
    subtotal: number;
    shippingFee: number;
    total: number;
    items: OrderItemDto[];
}