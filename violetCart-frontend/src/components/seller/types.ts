export type OrderStatus = 'Paid' | 'To Ship' | 'To Receive' | 'Completed' | 'Cancelled';

export interface Order {
    id: string;
    customerName: string;
    productName: string;
    quantity: number;
    totalAmountFormatted: string;
    orderDate: string;
    status: OrderStatus;
}