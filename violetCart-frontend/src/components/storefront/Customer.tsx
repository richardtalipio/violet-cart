import React, { useState, useEffect } from 'react';
import { useProductManagement } from '@/hooks/useProductManagement';
import { useCartManagement } from '@/hooks/useCartManagement';
import { useOrderManagement } from '@/hooks/useOrderManagement';
import { ProductGrid } from './ProductGrid';
import { ProductDetailModal } from './ProductDetailModal';
import { CartDrawer } from './CartDrawer';
import { CheckoutModal } from './CheckoutModal';
import { StoreHeader } from './StoreHeader';
import { useAuthStore } from "@/store/useAuthStore.ts";
import { useNavigate } from "react-router-dom";
import type { Order, Product } from "@/components/common/types.ts";
import type {OrderResponse, OrderStatus as APIOrderStatus} from "@/types/orderTypes";

const PAGE_SIZE = 8;

export const Customer: React.FC = () => {
    const customerName = 'Maria Santos';

    // Extract Zustand store properties individually to maintain stable object references
    const logout = useAuthStore((state) => state.logout);
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();

    const {
        products,
        categories,
        totalPages,
        loading: productsLoading,
        searchForm,
        handleSearchSubmit,
    } = useProductManagement();

    // Integrated Cart Management Hook
    const {
        cartItems,
        isLoading: cartLoading,
        fetchCart,
        addItemToCart,
        updateItemQuantity,
        removeItem,
    } = useCartManagement();

    const { processCheckout, isLoading: isCheckoutLoading, getUserOrders, userOrders } = useOrderManagement();

    // Active View Tab State
    const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

    // Shopping & Modal State
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // Mock Customer Orders State
    const [localOrders, setLocalOrders] = useState<Order[]>([]);

    const mapOrder = (o: OrderResponse): Order => ({
        id: o.id,
        customerName: o.customerName,
        orderDate: o.orderDate.split('T')[0],
        status: mapOrderStatus(o.orderStatus),
        items: o.items.map(item => ({
            id: item.id,
            productName: item.productName,
            image: item.imageUrl,
            price: item.price,
            priceFormatted: `₱${item.price.toLocaleString()}`,
            quantity: item.quantity,
        })),
        shippingAddress: o.shippingAddress,
        breakdown: {
            subtotal: o.subtotal,
            shippingFee: o.shippingFee,
            discount: 0,
            total: o.total,
        },
    });

    const mapOrderStatus = (status: APIOrderStatus): Order['status'] => {
        switch (status) {
            case 'PENDING_PAYMENT': return 'Pending Payment';
            case 'PREPARING': return 'Preparing';
            case 'READY_FOR_SHIPMENT': return 'Ready for Shipment';
            case 'IN_TRANSIT': return 'In Transit';
            case 'OUT_FOR_DELIVERY': return 'Out for Delivery';
            case 'DELIVERED': return 'Delivered';
            case 'CANCELLED': return 'Cancelled';
            case 'EXPIRED': return 'Expired';
            default: return 'Pending Payment';
        }
    };

    useEffect(() => {
        if (userOrders) {
            setLocalOrders(userOrders.map(mapOrder));
        }
    }, [userOrders]);

    // Toast Notification State
    const [addedToast, setAddedToast] = useState<{ show: boolean; message: string }>({
        show: false,
        message: '',
    });

    // Run initial data fetching once on component mount
    useEffect(() => {
        handleSearchSubmit();
        fetchCart();
        getUserOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    // Handlers
    const handleCategoryChange = (category: string) => {
        searchForm.setValue('category', category);
        searchForm.setValue('page', 0);
        setCurrentPage(1);
        handleSearchSubmit();
    };

    const handleSearchChange = (query: string) => {
        searchForm.setValue('productName', query);
        searchForm.setValue('page', 0);
        setCurrentPage(1);
        handleSearchSubmit();
    };

    // Reset search query when switching tabs (Optional/Recommended)
    const handleTabChange = (tab: 'products' | 'orders') => {
        setActiveTab(tab);
        if (tab === 'orders') {
            searchForm.setValue('productName', '');
            handleSearchSubmit();
        }
    };

    // Cart Actions with Stock Validation
    const handleAddToCart = async (product: Product) => {
        const existingCartItem = cartItems.find(
            (item) => Number(item.productId) === Number(product.id)
        );
        const currentQuantityInCart = existingCartItem ? existingCartItem.quantity : 0;

        // Check if adding 1 more exceeds available stock
        if (currentQuantityInCart + 1 > product.stockQuantity) {
            setAddedToast({
                show: true,
                message: `Cannot add more. Only ${product.stockQuantity} item(s) left in stock!`,
            });
            setTimeout(() => setAddedToast({ show: false, message: '' }), 4000);
            return;
        }

        await addItemToCart({
            productId: Number(product.id),
            quantity: 1,
        });

        const name = product?.productName || 'Item';
        setAddedToast({ show: true, message: `Added "${name}" to cart!` });

        setTimeout(() => {
            setAddedToast({ show: false, message: '' });
        }, 4000);
    };

    const totalCartItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = cartItems.reduce((acc, item) => acc + (item.subtotal ?? item.price * item.quantity), 0);
    const cartQuantities = cartItems.reduce((acc, item) => {
        acc[item.productId] = item.quantity;
        return acc;
    }, {} as Record<string | number, number>);

    const handlePlaceOrder = async (data: { shippingAddress: string; paymentMethod: 'ONLINE' | 'COD' }) => {
        setIsCheckoutOpen(false);

        if (!user) {
            console.error("User not found");
            return;
        }

        const shippingFee = 100;
        const discount = 0;
        const orderTotal = subtotal + shippingFee - discount;

        const checkoutData: any = {
            customerName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || customerName,
            paymentMethod: data.paymentMethod,
            shippingAddress: {
                fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || customerName,
                phone: '+63 918 987 6543',
                street: data.shippingAddress,
                city: 'Quezon City',
                province: 'Metro Manila',
                postalCode: '1108',
            },
            shippingFee: shippingFee,
            items: cartItems.map((item) => ({
                productId: Number(item.productId),
                productName: item.productName,
                imageUrl: item.imageUrl || '',
                price: item.price,
                quantity: item.quantity,
            })),
        };

        const result = await processCheckout(checkoutData);

        if (result) {
            const newOrder: Order = {
                id: result.orderId,
                customerName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || customerName,
                orderDate: new Date().toISOString().split('T')[0],
                status: 'Pending Payment',
                items: cartItems.map((item, idx) => ({
                    id: `item-${Date.now()}-${idx}`,
                    productName: item.productName,
                    image: item.imageUrl || '',
                    price: item.price,
                    priceFormatted: `₱${item.price.toLocaleString()}`,
                    quantity: item.quantity,
                })),
                shippingAddress: {
                    fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || customerName,
                    phone: '+63 918 987 6543',
                    street: data.shippingAddress,
                    city: 'Quezon City',
                    province: 'Metro Manila',
                    postalCode: '1108',
                },
                breakdown: {
                    subtotal: subtotal,
                    shippingFee: shippingFee,
                    discount: discount,
                    total: orderTotal,
                },
            };
            setLocalOrders((prev) => [newOrder, ...prev]);

            setOrderSuccess(true);
            setTimeout(() => setOrderSuccess(false), 4000);

            cartItems.forEach((item) => removeItem(item.id));
        } else {
            console.error("Checkout failed");
        }
    };

    const getStatusBadgeStyle = (status: Order['status']) => {
        switch (status) {
            case 'Pending Payment':
                return { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', label: 'Pending Payment' };
            case 'Preparing':
                return { bg: 'rgba(59,130,246,0.12)', color: '#60a5fa', label: 'Preparing' };
            case 'Ready for Shipment':
                return { bg: 'rgba(59,130,246,0.12)', color: '#60a5fa', label: 'Ready for Shipment' };
            case 'In Transit':
                return { bg: 'rgba(168,85,247,0.12)', color: '#c084fc', label: 'In Transit' };
            case 'Out for Delivery':
                return { bg: 'rgba(168,85,247,0.12)', color: '#c084fc', label: 'Out for Delivery' };
            case 'Delivered':
                return { bg: 'rgba(16,185,129,0.12)', color: '#10b981', label: 'Delivered' };
            case 'Cancelled':
                return { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', label: 'Cancelled' };
            case 'Expired':
                return { bg: 'rgba(156,163,175,0.12)', color: '#6b7280', label: 'Expired' };
            default:
                return { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', label: status };
        }
    };

    const isGlobalLoading = productsLoading || cartLoading || isCheckoutLoading;

    const getLoadingMessage = () => {
        if (isCheckoutLoading) return 'Processing order...';
        if (cartLoading) return 'Updating cart...';
        return 'Loading products...';
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden relative" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
            {/* Unified Loading Overlay */}
            {isGlobalLoading && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
                    <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl">
                        <div className="w-8 h-8 border-3 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }} />
                        <span className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>
                            {getLoadingMessage()}
                        </span>
                    </div>
                </div>
            )}

            {/* Added to Cart Notification Toast */}
            {addedToast.show && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center justify-between gap-4 px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-400/30 text-white bg-gradient-to-r from-emerald-600 to-teal-600 animate-bounce duration-300">
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                            ✓
                        </div>
                        <span className="text-sm font-semibold tracking-wide">
                            {addedToast.message}
                        </span>
                    </div>

                    <button
                        onClick={() => {
                            setAddedToast({ show: false, message: '' });
                            setIsCartOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-emerald-800 hover:bg-emerald-50 transition-colors shadow-sm"
                    >
                        View Cart
                    </button>
                </div>
            )}

            {/* Frozen Fixed Header Section */}
            <div className="flex-none">
                <StoreHeader
                    searchQuery={activeTab === 'products' ? searchForm.watch('productName') || '' : ''}
                    onSearchChange={activeTab === 'products' ? handleSearchChange : undefined}
                    totalCartItems={totalCartItems}
                    customerName={customerName}
                    onOpenCart={() => setIsCartOpen(true)}
                    onLogout={onLogout}
                />

                {/* Frozen Navigation Bar */}
                <div className="bg-[var(--color-surface)] px-6 py-3 shadow-sm">
                    <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                        <div className="inline-flex items-center p-1 rounded-xl bg-[var(--color-bg)]/60">
                            <button
                                onClick={() => handleTabChange('products')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                                    activeTab === 'products'
                                        ? 'bg-[var(--color-surface)] shadow-sm font-bold'
                                        : 'hover:text-[var(--color-text)]'
                                }`}
                                style={{
                                    color: activeTab === 'products' ? 'var(--color-accent)' : 'var(--color-muted)',
                                }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                                <span>Products Catalog</span>
                            </button>

                            <button
                                onClick={() => handleTabChange('orders')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                                    activeTab === 'orders'
                                        ? 'bg-[var(--color-surface)] shadow-sm font-bold'
                                        : 'hover:text-[var(--color-text)]'
                                }`}
                                style={{
                                    color: activeTab === 'orders' ? 'var(--color-accent)' : 'var(--color-muted)',
                                }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <span>Manage Orders</span>
                                <span
                                    className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                                    style={{
                                        background: activeTab === 'orders' ? 'var(--color-accent)' : 'rgba(0, 0, 0, 0.08)',
                                        color: activeTab === 'orders' ? '#ffffff' : 'var(--color-muted)',
                                    }}
                                >
                                    {localOrders.length}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {orderSuccess && (
                    <div className="p-3 text-center text-xs font-semibold text-white bg-emerald-500 shadow-inner">
                        🎉 Order placed successfully! You can track its status under Manage Orders.
                    </div>
                )}
            </div>

            {/* Content Container */}
            <main className="flex-1 overflow-y-auto px-6 py-8 max-w-7xl mx-auto w-full">
                {activeTab === 'products' ? (
                    <ProductGrid
                        products={products}
                        categories={categories}
                        cartQuantities={cartQuantities}
                        selectedCategory={searchForm.watch('category') || 'All'}
                        currentPage={currentPage}
                        pageSize={PAGE_SIZE}
                        totalPages={totalPages}
                        onSelectCategory={handleCategoryChange}
                        onPageChange={(page) => {
                            setCurrentPage(page);
                            searchForm.setValue('page', page - 1);
                            handleSearchSubmit();
                        }}
                        onSelectProduct={setSelectedProduct}
                        onAddToCart={handleAddToCart}
                    />
                ) : (
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                                Order History & Status
                            </h2>
                        </div>

                        {localOrders.length === 0 ? (
                            <div
                                className="p-12 text-center rounded-2xl border flex flex-col items-center gap-3"
                                style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                            >
                                <span className="text-3xl">🛒</span>
                                <p className="text-sm font-semibold" style={{ color: 'var(--color-muted)' }}>
                                    You haven't placed any orders yet.
                                </p>
                                <button
                                    onClick={() => handleTabChange('products')}
                                    className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90 shadow-md"
                                    style={{ background: 'var(--color-accent)' }}
                                >
                                    Browse Products Catalog
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {localOrders.map((order) => {
                                    const badgeStyle = getStatusBadgeStyle(order.status);
                                    return (
                                        <div
                                            key={order.id}
                                            className="p-5 rounded-2xl border flex flex-col gap-4 shadow-sm"
                                            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                                        >
                                            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--color-border)' }}>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
                                                        {order.id}
                                                    </span>
                                                    <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
                                                        • {order.orderDate}
                                                    </span>
                                                </div>
                                                <span
                                                    className="text-xs font-bold px-3 py-1 rounded-full"
                                                    style={{ background: badgeStyle.bg, color: badgeStyle.color }}
                                                >
                                                    {badgeStyle.label}
                                                </span>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                {order.items.map((item) => (
                                                    <div key={item.id} className="flex justify-between items-center text-xs">
                                                        <div className="flex items-center gap-3">
                                                            {item.image && (
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.productName}
                                                                    className="w-10 h-10 object-cover rounded-lg border border-[var(--color-border)]"
                                                                />
                                                            )}
                                                            <span>
                                                                {item.quantity}x {item.productName}
                                                            </span>
                                                        </div>
                                                        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-muted)' }}>
                                                            {item.priceFormatted || `₱${item.price * item.quantity}`}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex justify-between items-center pt-3 border-t text-sm font-bold" style={{ borderColor: 'var(--color-border)' }}>
                                                <span>Total Amount</span>
                                                <span style={{ fontFamily: 'var(--font-mono)' }}>
                                                    ₱{order.breakdown?.total ?? order.items.reduce((sum, i) => sum + i.price * i.quantity, 0)}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </main>

            <ProductDetailModal
                product={selectedProduct}
                cartQuantity={selectedProduct ? (cartQuantities[selectedProduct.id] ?? 0) : 0}
                onClose={() => setSelectedProduct(null)}
                onAddToCart={handleAddToCart}
            />

            <CartDrawer
                isOpen={isCartOpen}
                cart={cartItems}
                products={products}
                totalCartItems={totalCartItems}
                subtotal={subtotal}
                onClose={() => setIsCartOpen(false)}
                onUpdateQuantity={(cartItemId, newQty) => updateItemQuantity(cartItemId, newQty)}
                onRemoveItem={(cartItemId) => removeItem(cartItemId)}
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