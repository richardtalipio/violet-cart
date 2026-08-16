export type OrderStatus = 'Paid' | 'To Ship' | 'To Receive' | 'Completed' | 'Cancelled';

export interface Seller {
    fullName: string;
    contactNumber: string;
    storeName: string;
    productCount: number;
    revenue: number;
    noOfreports: number;
    userStatus: string;
    dateJoined: string;
    email: string;
    storeDescription: string;
}
export interface Product {
    id: string;
    productName: string;
    imageUrl: string;
    seller: string;
    price: number;
    category: string;
    rating: number;
    stockQuantity: number;
    description: string;
}

export interface OrderItem {
    id: string;
    productName: string;
    image: string;
    price: number;
    priceFormatted: string;
    quantity: number;
}

export interface ShippingAddress {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    province: string;
    postalCode: string;
}

export interface ExpenseBreakdown {
    subtotal: number;
    shippingFee: number;
    discount: number;
    total: number;
}

export interface Order {
    id: string;
    customerName: string;
    orderDate: string;
    status: OrderStatus;
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    breakdown: ExpenseBreakdown;
}

export interface UpdateStatusRequest {
    status: 'ACTIVE' | 'PENDING APPROVAL' | 'BANNED' | 'REJECTED';
}

export interface CartItem {
    product: Product;
    quantity: number;
}