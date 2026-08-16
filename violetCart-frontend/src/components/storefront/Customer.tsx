import React, { useState } from 'react';
import { STORE_PRODUCTS, CATEGORIES } from '../common/mockData';
import { ProductGrid } from './ProductGrid';
import { ProductDetailModal } from './ProductDetailModal';
import { CartDrawer } from './CartDrawer';
import { CheckoutModal } from './CheckoutModal';
import { StoreHeader } from './StoreHeader';
import {useAuthStore} from "@/store/useAuthStore.ts";
import {useNavigate} from "react-router-dom";
import type {CartItem, Product} from "@/components/common/types.ts";



const PAGE_SIZE = 8; // Adjust grid items per page as needed

export const Customer: React.FC = () => {
    const customerName = 'Maria Santos';
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();
    const onLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };
    // 1. Filter & Pagination State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);

    // 2. Shopping & Modal State
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    // Filter Logic
    const filteredProducts = STORE_PRODUCTS.filter((p) => {
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesSearch =
            p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.seller.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Reset pagination to Page 1 when filters update
    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    // Cart Actions
    const addToCart = (product: Product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.product.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart((prev) =>
            prev
                .map((item) => {
                    if (item.product.id === productId) {
                        const newQty = item.quantity + delta;
                        return newQty > 0 ? { ...item, quantity: newQty } : null;
                    }
                    return item;
                })
                .filter(Boolean) as CartItem[]
        );
    };

    const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    const handlePlaceOrder = () => {
        setIsCheckoutOpen(false);
        setCart([]);
        setOrderSuccess(true);
        setTimeout(() => setOrderSuccess(false), 4000);
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
            <StoreHeader
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange} // Changed from onSearchChange
                totalCartItems={totalCartItems}
                customerName={customerName}
                onOpenCart={() => setIsCartOpen(true)}
                onLogout={onLogout}
            />

            {orderSuccess && (
                <div className="p-3 text-center text-xs font-semibold text-white bg-emerald-500">
                    🎉 Order placed successfully! Thank you for shopping with Violet Cart.
                </div>
            )}

            <ProductGrid
                products={filteredProducts}
                categories={CATEGORIES}
                selectedCategory={selectedCategory}
                currentPage={currentPage}
                pageSize={PAGE_SIZE}
                onSelectCategory={handleCategoryChange}
                onPageChange={setCurrentPage}
                onSelectProduct={setSelectedProduct}
                onAddToCart={addToCart}
            />

            <ProductDetailModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onAddToCart={addToCart}
            />

            <CartDrawer
                isOpen={isCartOpen}
                cart={cart}
                totalCartItems={totalCartItems}
                subtotal={subtotal}
                onClose={() => setIsCartOpen(false)}
                onUpdateQuantity={updateQuantity}
                onProceedToCheckout={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                }}
            />

            <CheckoutModal
                isOpen={isCheckoutOpen}
                customerName={customerName}
                subtotal={subtotal}
                onClose={() => setIsCheckoutOpen(false)}
                onConfirmOrder={handlePlaceOrder}
            />
        </div>
    );
};
