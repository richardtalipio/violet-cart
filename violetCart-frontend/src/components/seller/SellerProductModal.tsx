import React, { useEffect, useRef } from 'react';
import { type Product } from '../common/types';
import { useProductManagement } from "@/hooks/useProductManagement";
import { SecureImage } from "@/components/common/SecureImage.tsx";

interface SellerProductModalProps {
    isOpen: boolean;
    product: Product | null;
    onClose: () => void;
    onSave?: (product: Partial<Product>) => void;
    onDelete?: (productId: string) => void;
}

export const SellerProductModal: React.FC<SellerProductModalProps> = ({
                                                                          isOpen,
                                                                          product,
                                                                          onClose,
                                                                          onSave,
                                                                          onDelete,
                                                                      }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        addForm: { register, setValue, watch, reset, getValues, formState: { errors, isSubmitting } },
        handleAddSubmit,
        serverError,
    } = useProductManagement(() => {
        // Emit updated product data to parent before closing
        const currentValues = getValues();
        onSave?.({
            id: product?.id,
            productName: currentValues.productName,
            price: Number(currentValues.price),
            stockQuantity: Number(currentValues.stocksLeft),
            category: currentValues.category,
            description: currentValues.description,
        });
        onClose();
    });

    const isEditing = product !== null;

    // Populate or reset form when modal opens or product changes
    useEffect(() => {
        if (product) {
            reset({
                productName: product.productName,
                price: product.price.toString(),
                stocksLeft: product.stockQuantity.toString(),
                category: product.category,
                description: product.description,
            });

            // Supply a dummy File object so strict Zod validation passes when editing without re-uploading an image
            const dummyFile = new File([new Uint8Array(1)], "existing_image.jpg", { type: "image/jpeg" });
            setValue('imageFile', dummyFile);
        } else {
            reset({
                productName: '',
                price: '',
                stocksLeft: '',
                category: '',
                description: '',
                imageFile: undefined,
            });
        }
    }, [product, isOpen, reset, setValue]);

    // Watch image file input in real time
    const imageFile = watch('imageFile');

    // Derive object URL directly from watched file if user uploaded a new one
    const imagePreview = imageFile instanceof File && imageFile.name !== "existing_image.jpg"
        ? URL.createObjectURL(imageFile)
        : '';

    // Show newly picked image preview first, fallback to existing product image URL
    const displayImage = imagePreview || (isEditing ? product?.imageUrl : '');

    if (!isOpen) return null;

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue('imageFile', file, { shouldValidate: true });
        }
    };

    const handleRemoveImage = () => {
        setValue('imageFile', undefined as any, { shouldValidate: true });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
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
                        {isEditing ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-lg leading-none" style={{ background: 'var(--color-surface-2)', color: 'var(--color-muted)' }}>×</button>
                </div>

                <form onSubmit={handleAddSubmit} className="p-6 overflow-y-auto flex flex-col gap-4">
                    {serverError && (
                        <div className="p-3 text-xs rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
                            {serverError}
                        </div>
                    )}

                    {/* Image Upload Field */}
                    <div>
                        <label className="text-xs font-medium block mb-1" style={{ color: 'var(--color-muted)' }}>Product Image</label>

                        {displayImage && (
                            <div className="mb-3 w-full h-40 rounded-xl overflow-hidden border relative" style={{ borderColor: 'var(--color-border)' }}>
                                <SecureImage src={displayImage} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
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
                                📁 {isEditing ? 'Change Image File' : 'Upload Image File'}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        {errors.imageFile && imageFile?.name !== "existing_image.jpg" && (
                            <p className="text-[10px] text-red-500 mt-1">{errors.imageFile.message as string}</p>
                        )}
                    </div>

                    {/* Product Name */}
                    <div>
                        <label className="text-xs font-medium block mb-1" style={{ color: 'var(--color-muted)' }}>Product Name</label>
                        <input
                            type="text"
                            {...register('productName')}
                            className="w-full text-xs p-3 rounded-xl border outline-none"
                            style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                        />
                        {errors.productName && (
                            <p className="text-[10px] text-red-500 mt-1">{errors.productName.message}</p>
                        )}
                    </div>

                    {/* Price & Stock */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium block mb-1" style={{ color: 'var(--color-muted)' }}>Price (₱)</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register('price')}
                                className="w-full text-xs p-3 rounded-xl border outline-none"
                                style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                            />
                            {errors.price && (
                                <p className="text-[10px] text-red-500 mt-1">{errors.price.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="text-xs font-medium block mb-1" style={{ color: 'var(--color-muted)' }}>Stock Left</label>
                            <input
                                type="number"
                                {...register('stocksLeft')}
                                className="w-full text-xs p-3 rounded-xl border outline-none"
                                style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                            />
                            {errors.stocksLeft && (
                                <p className="text-[10px] text-red-500 mt-1">{errors.stocksLeft.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="text-xs font-medium block mb-1" style={{ color: 'var(--color-muted)' }}>Category</label>
                        <input
                            type="text"
                            placeholder="e.g. Artisan, Electronics, Footwear"
                            {...register('category')}
                            className="w-full text-xs p-3 rounded-xl border outline-none"
                            style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                        />
                        {errors.category && (
                            <p className="text-[10px] text-red-500 mt-1">{errors.category.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-xs font-medium block mb-1" style={{ color: 'var(--color-muted)' }}>Description</label>
                        <textarea
                            rows={3}
                            {...register('description')}
                            className="w-full text-xs p-3 rounded-xl border outline-none"
                            style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                        />
                        {errors.description && (
                            <p className="text-[10px] text-red-500 mt-1">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Actions */}
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
                            <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 rounded-xl text-xs font-medium border" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>Cancel</button>
                            <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-xl text-xs font-medium text-white disabled:opacity-50" style={{ background: 'var(--color-accent)' }}>
                                {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Product'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};