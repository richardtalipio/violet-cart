import type {PaymentMethod} from "@/schemas/orderSchema.ts";


export interface CheckoutResponse {
    orderId: string;
    orderStatus: string;
    paymentMethod: PaymentMethod;
    totalAmount: number;
    expiresAt: string | null;
    message: string;
}