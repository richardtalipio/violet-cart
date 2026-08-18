export interface AddToCartRequest {
    productId: number;
    quantity: number;
}

export interface CartItemResponse {
    id: string;
    productId: number;
    productName: string;
    imageUrl: string;
    price: number;
    quantity: number;
    subtotal: number;
}
