export interface Product {
    id: string;
    name: string;
    image: string;
    seller: string;
    price: number;
    priceFormatted: string;
    category: string;
    rating: number;
    reviewCount: number; // Added
    stock: number;       // Added
    description: string;
}
export interface CartItem {
    product: Product;
    quantity: number;
}