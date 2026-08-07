import React, { useState, useEffect } from 'react';
import { type Product } from '../common/types';

interface SellerProductModalProps {
    isOpen: boolean;
    product: Product | null;
    onClose: () => void;
    onSave: (product: Partial<Product>) => void;
    onDelete?: (productId: string) => void;
}

export const SellerProductModal: React.FC<SellerProductModalProps> = ({
                                                                          isOpen,
                                                                          product,
                                                                          onClose,
                                                                          onSave,
                                                                          onDelete,
                                                                      }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState<number>(0);
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setCategory(product.category);
            setStock(product.stock);
            setImage(product.image);
            setDescription(product.description);
        } else {
            setName('');
            setPrice(0);
            setCategory('');
            setStock(1);
            setImage('');
            setDescription('');
        }
    }, [product, isOpen]);

    if (!isOpen) return null;

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: product ? product.id : undefined,
            name,
            price: Number(price),
            priceFormatted: `₱${Number(price).toLocaleString()}`,
            category: category.trim() || 'Uncategorized',
            stock: Number(stock),
            image: image || 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=300&auto=format&fit=crop&q=80',
            description,
        });
        onClose();
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
        >
            <div
                className="rounded-2xl border flex flex-col"
                style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', width: 480, maxHeight: '90vh' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <h2 className="text-base font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                        {product ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-lg leading-none" style={{ background: 'var(--color-surface-2)', color: 'var(--color-muted)' }}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex flex-col gap-4">
                    <div>
                        <label className="text-xs font-medium block mb-1" style={{ color: 'var(--color-muted)' }}>Product Image</label>

                        {image && (
                            <div className="mb-3 w-full h-40 rounded-xl overflow-hidden border relative" style={{ borderColor: 'var(--color-border)' }}>
                                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setImage('')}
                                    className="absolute top-2 right-2 px-2 py-1 text-[10px] rounded-md font-medium text-white"
                                    style={{ background: 'rgba(0,0,0,0.7)' }}
                                >
                                    Remove
                                </button>
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            <label
                                className="flex-1 text-center text-xs py-2.5 px-4 rounded-xl border cursor-pointer font-medium transition-colors hover:bg-surface-2"
                                style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                            >
                                📁 Upload Image File
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                        </div>

                        <p className="text-[10px] text-center my-2" style={{ color: 'var(--color-muted)' }}>— OR —</p>

                        <input
                            type="url"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            placeholder="Paste image URL (https://...)"
                            className="w-full text-xs p-3 rounded-xl border outline-none"
                            style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium block mb-1" style={{ color: 'var(--color-muted)' }}>Product Name</label>
                        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full text-xs p-3 rounded-xl border outline-none" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium block mb-1" style={{ color: 'var(--color-muted)' }}>Price (₱)</label>
                            <input type="number" required min="0" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full text-xs p-3 rounded-xl border outline-none" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }} />
                        </div>
                        <div>
                            <label className="text-xs font-medium block mb-1" style={{ color: 'var(--color-muted)' }}>Stock Left</label>
                            <input type="number" required min="0" value={stock} onChange={(e) => setStock(Number(e.target.value))} className="w-full text-xs p-3 rounded-xl border outline-none" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }} />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium block mb-1" style={{ color: 'var(--color-muted)' }}>Category</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Artisan, Electronics, Footwear"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full text-xs p-3 rounded-xl border outline-none"
                            style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium block mb-1" style={{ color: 'var(--color-muted)' }}>Description</label>
                        <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full text-xs p-3 rounded-xl border outline-none" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }} />
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t" style={{ borderColor: 'var(--color-border)' }}>
                        {product && onDelete ? (
                            <button
                                type="button"
                                onClick={() => {
                                    onDelete(product.id);
                                    onClose();
                                }}
                                className="px-4 py-2 rounded-xl text-xs font-medium border"
                                style={{ background: 'rgba(248,113,113,0.12)', color: 'var(--color-danger)', borderColor: 'rgba(248,113,113,0.2)' }}
                            >
                                Remove Product
                            </button>
                        ) : <div />}

                        <div className="flex gap-2">
                            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-medium border" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>Cancel</button>
                            <button type="submit" className="px-5 py-2 rounded-xl text-xs font-medium text-white" style={{ background: 'var(--color-accent)' }}>
                                {product ? 'Save Changes' : 'Add Product'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};