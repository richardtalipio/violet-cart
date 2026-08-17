import React, { useState, useEffect } from 'react';
import { type Product, type Order, type OrderStatus } from '../common/types';
import { ProductGrid } from './ProductGrid';
import { SellerProductModal } from './SellerProductModal';
import { SellerOrdersTable } from './SellerOrdersTable';
import { ConfirmModal } from './ConfirmModal';
import { useAuthStore } from "@/store/useAuthStore.ts";
import { useNavigate } from "react-router-dom";
import { useSellerDashboard } from '@/hooks/useSellerDashboard';

const PAGE_SIZE = 4;

const INITIAL_ORDERS: Order[] = [
    {
        id: 'ORD-101',
        customerName: 'Juan Dela Cruz',
        orderDate: '2026-05-18',
        status: 'Paid',
        items: [
            {
                id: 'p1',
                productName: 'Handwoven Bayong Bag',
                image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=300&auto=format&fit=crop&q=80',
                price: 850,
                priceFormatted: '₱850',
                quantity: 1,
            },
            {
                id: 'p8',
                productName: 'Woven Abaca Placemats (Set of 4)',
                image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=300&auto=format&fit=crop&q=80',
                price: 480,
                priceFormatted: '₱480',
                quantity: 2,
            },
        ],
        shippingAddress: {
            fullName: 'Juan Dela Cruz',
            phone: '+63 917 123 4567',
            street: '123 Rizal Street, Brgy. San Antonio',
            city: 'San Pablo City',
            province: 'Laguna',
            postalCode: '4000',
        },
        breakdown: { subtotal: 1810, shippingFee: 100, discount: 0, total: 1910 },
    },
];

export const SellerDashboard: React.FC = () => {
    const storeInfo = {
        name: "Ana's Artisan Goods",
        description: 'Authentic handwoven Philippine crafts and sustainable accessories made directly by local weavers in Laguna.',
    };

    const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

    const {
        products,
        setProducts,
        categories,
        totalPages,
        loading,
        register,
        handleSubmit,
        setValue,
        watch
    } = useSellerDashboard();

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);

    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
    const [pendingStatusChange, setPendingStatusChange] = useState<{ order: Order; newStatus: OrderStatus } | null>(null);

    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const productNameValue = watch ? watch('productName') : '';

    // Trigger initial fetch on mount
    useEffect(() => {
        handleSubmit();
    }, [handleSubmit]);

    const onLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleSaveProduct = (pData: Partial<Product>) => {
        if (pData.id) {
            showToast('Changes saved successfully.');
        } else {
            showToast('Product created successfully.');
        }
    };

    const handleConfirmDelete = () => {
        if (pendingDeleteId) {
            setProducts((prev) => prev.filter((p) => p.id !== pendingDeleteId));
            showToast('Product removed from store.');
            setPendingDeleteId(null);
            setIsProductModalOpen(false);
        }
    };

    const handleConfirmStatusChange = () => {
        if (pendingStatusChange) {
            const { order, newStatus } = pendingStatusChange;
            setOrders((prev) =>
                prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o))
            );
            showToast(`Order ${order.id} status updated to "${newStatus}".`);
            setPendingStatusChange(null);
        }
    };

    const handleClearSearch = () => {
        setValue('productName', '');
        setValue('page', 0);
        setCurrentPage(1);
        handleSubmit();
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setValue('category', category);
        setValue('page', 0);
        setCurrentPage(1);
        handleSubmit();
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setValue('page', page - 1); // Convert 1-based UI index to 0-based Spring Boot index
        handleSubmit();
    };

    return (
        <div className="min-h-screen flex flex-col relative" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
            {toastMessage && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-xs font-semibold text-white shadow-2xl backdrop-blur-md border border-white/10 flex items-center gap-2 animate-bounce" style={{ background: 'rgba(20, 20, 25, 0.92)' }}>
                    <span>✓</span>
                    <span>{toastMessage}</span>
                </div>
            )}

            <header className="border-b px-6 py-6 sticky top-0 z-40 backdrop-blur-md" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399' }}>Approved Seller</span>
                            <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>{storeInfo.name}</h1>
                        </div>
                        <p className="text-xs mt-1 max-w-2xl" style={{ color: 'var(--color-muted)' }}>{storeInfo.description}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                setEditingProduct(null);
                                setIsProductModalOpen(true);
                            }}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm hover:opacity-95 transition-opacity"
                            style={{ background: 'var(--color-accent)', fontFamily: 'var(--font-display)' }}
                        >
                            + Add Product
                        </button>
                        <button onClick={onLogout} className="px-3 py-2 rounded-xl text-xs font-medium border transition-colors" style={{ background: 'rgba(248,113,113,0.12)', color: 'var(--color-danger)', borderColor: 'rgba(248,113,113,0.2)' }}>
                            Logout
                        </button>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto w-full flex gap-6 mt-6 border-t pt-3" style={{ borderColor: 'var(--color-border)' }}>
                    <button
                        onClick={() => setActiveTab('products')}
                        className="text-xs font-semibold pb-1 transition-all"
                        style={{
                            color: activeTab === 'products' ? 'var(--color-accent)' : 'var(--color-muted)',
                            borderBottom: activeTab === 'products' ? '2px solid var(--color-accent)' : 'none',
                        }}
                    >
                        Products Catalog
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className="text-xs font-semibold pb-1 transition-all"
                        style={{
                            color: activeTab === 'orders' ? 'var(--color-accent)' : 'var(--color-muted)',
                            borderBottom: activeTab === 'orders' ? '2px solid var(--color-accent)' : 'none',
                        }}
                    >
                        Manage Orders ({orders.length})
                    </button>
                </div>
            </header>

            <main className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full">
                {activeTab === 'products' && (
                    <form
                        onSubmit={(e) => {
                            setValue('page', 0);
                            setCurrentPage(1);
                            handleSubmit(e);
                        }}
                        className="mb-6 flex items-center gap-3"
                    >
                        <div
                            className="relative flex-1 max-w-md flex items-center rounded-xl border transition-all focus-within:ring-2 focus-within:ring-offset-1"
                            style={{
                                background: 'var(--color-surface)',
                                borderColor: 'var(--color-border)',
                            }}
                        >
                            <svg
                                className="w-4 h-4 ml-3.5 shrink-0"
                                style={{ color: 'var(--color-muted)' }}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>

                            <input
                                {...register('productName')}
                                placeholder="Search products by title or keyword..."
                                className="w-full bg-transparent px-3 py-2.5 text-xs outline-none placeholder:text-[var(--color-muted)]"
                                style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}
                            />

                            {productNameValue && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="mr-2 text-xs w-5 h-5 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                                    style={{ color: 'var(--color-muted)' }}
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="px-5 py-2.5 rounded-xl text-xs font-medium text-white transition-all shadow-sm hover:opacity-95"
                            style={{ background: 'var(--color-accent)', fontFamily: 'var(--font-display)' }}
                        >
                            Search
                        </button>
                    </form>
                )}

                {activeTab === 'products' ? (
                    <ProductGrid
                        products={products}
                        categories={categories}
                        selectedCategory={selectedCategory}
                        currentPage={currentPage}
                        pageSize={PAGE_SIZE}
                        totalPages={totalPages}
                        loading={loading} // Pass down to grid
                        onSelectCategory={handleCategoryChange}
                        onPageChange={handlePageChange}
                        onSelectProduct={(p) => {
                            setEditingProduct(p);
                            setIsProductModalOpen(true);
                        }}
                    />
                ) : (
                    <SellerOrdersTable
                        orders={orders}
                        onRequestStatusChange={(order, newStatus) =>
                            setPendingStatusChange({ order, newStatus })
                        }
                    />
                )}
            </main>

            <SellerProductModal
                isOpen={isProductModalOpen}
                product={editingProduct}
                onClose={() => setIsProductModalOpen(false)}
                onSave={handleSaveProduct}
                onDelete={(id) => setPendingDeleteId(id)}
            />

            <ConfirmModal
                isOpen={Boolean(pendingDeleteId)}
                title="Delete Product"
                message="Are you sure you want to delete this product? This action cannot be undone."
                confirmText="Delete"
                isDanger
                onConfirm={handleConfirmDelete}
                onCancel={() => setPendingDeleteId(null)}
            />

            <ConfirmModal
                isOpen={Boolean(pendingStatusChange)}
                title="Confirm Status Update"
                message={`Are you sure you want to change the status of Order ${pendingStatusChange?.order.id} to "${pendingStatusChange?.newStatus}"?`}
                confirmText="Update Status"
                onConfirm={handleConfirmStatusChange}
                onCancel={() => setPendingStatusChange(null)}
            />
        </div>
    );
};